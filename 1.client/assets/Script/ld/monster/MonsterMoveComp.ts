import { CreatureState, GAME_TYPE } from "../../common/AllEnum";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { EActType } from "../../logic/actMach/ActMach";
import { Component } from "../../logic/comps/Component";
import { ERecyclableType } from "../../logic/Recyclable/ERecyclableType";
import Creature from "../../logic/sceneObjs/Creature";
import SceneObject from "../../logic/sceneObjs/SceneObject";
import { Handler } from "../../utils/Handler";
import { Pos } from "../Pos";
import { HeroTable } from "../tower/HeroTable";


/**控制怪物移动的组件 */
export default class MonsterMoveComp extends Component {

    private _path:Pos[] = [];
    private _self:Creature;
    private _isStop:boolean = false;
    private _endGx:number = 0;
    private _endTarget:SceneObject = null;

    constructor() {
        super();
        this.key = ERecyclableType.LD_MONSTER_MOVE;
    }

    resetData() {
        this._isStop = false;
    }

    added() {
        super.added();
        this._self = this.owner as Creature;
        this._self.on(EventEnum.CREATURE_STATE_CHANGE , this.onStateChange , this);

    }
    
    removed() {
        this.tryCachePos();
        this._path = null;
        this._self.off(EventEnum.CREATURE_STATE_CHANGE , this.onStateChange , this);
        super.removed();
    }

    setMovePath(path:Pos[]) {
        this.tryCachePos();
        this._path = path;

        const lastPos = this._path[this._path.length - 1];
        this._endGx = Game.curLdGameCtrl.getGridX(lastPos.x);
        if (Game.curLdGameCtrl.getGameType() == GAME_TYPE.COOPERATE) {
            this._endTarget = Game.ldCooperateCtrl.getEndTarget();

        } else {
            this._endTarget = Game.curLdGameCtrl.getHeroTable(this._endGx , 0 , this._self.camp);
        }
        this.start();
    }

    private onStateChange() {
        if (this._self.inState(CreatureState.DONT_MOVE)) {

        }
    }



    stop() {
        // if (this._self.isInAct(EActType.MOVE)) {
        //     this._tempPath = (this._self.getComponent(EComponentType.LD_WALK) as LDWalkComp).getLeftPath();
        //     this._self.changeTo(EActType.IDLE);
        // }
        this._isStop = true;
    }

    isStop():boolean {
        return this._isStop;
    }

    goon(reCheckPath:boolean = false) {
        //不在移动状态就重新寻路
        if (!this._self.isInAct(EActType.MOVE) || reCheckPath) {
            const path:Pos[] = Game.curLdGameCtrl.findMovePath(this._self.x , this._self.y , this._self.halfSize.width, this._self.camp);
            this.setMovePath(path);
        }
    }

    moveToTargetPos(tx:number , ty:number) {
        const path:Pos[] = [Pos.getPos(this._self.x , this._self.y) , Pos.getPos(tx , ty)];
        this.setMovePath(path);
    }


    private start() {
        this._isStop = false;
        
        let path = this._path;
        if (!path || path.length == 0) {
            return;
        }
        this._self.changeTo(EActType.MOVE,{path:path, endHandler:Handler.create(this.moveEnd , this)});
    }

    private moveEnd(isSuccess:boolean) {
        // cc.log('monster move end');
    }

    private onCreateHeroTable(gx:number , gy:number) {

        const nowGx = Game.curLdGameCtrl.getGridX(this._self.x);
        const min = Math.min(this._endGx , nowGx);
        const max = Math.min(this._endGx , nowGx);
        if (gx >= min && gx <= max) {
            const path:Pos[] = Game.curLdGameCtrl.findMovePath(this._self.x , this._self.y , this._self.halfSize.width, this._self.camp);
            this.setMovePath(path);
        }
    }

    private tryCachePos() {
        if (this._path && this._path.length > 0) {
            for (let i = 0; i < this._path.length; i++) {
                Pos.returnPos(this._path[i]);
            }
            this._path.length = 0;
        }
    }

    getEndGx() {
        return this._endGx;
    }


    getPath():Pos[] {
        return this._path;
    }

    getEndTarget():SceneObject {
        return this._endTarget;
    }
}