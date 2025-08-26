import { CreatureState, EDir, PropertyId } from "../../common/AllEnum";
import Game from "../../Game";
import GlobalVal from "../../GlobalVal";
import { EFrameCompPriority } from "../../logic/comps/AllComp";
import { FrameComponent } from "../../logic/comps/FrameComponent";
import { ERecyclableType } from "../../logic/Recyclable/ERecyclableType";
import { Monster } from "../../logic/sceneObjs/Monster";
import { SoType } from "../../logic/sceneObjs/SoType";
import { Handler } from "../../utils/Handler";
import { MathUtils } from "../../utils/MathUtils";
import { Pos } from "../Pos";




export default class LDWalkComp extends FrameComponent {

    private _isMoveing:boolean = false;
    private _index:number = 0;
    private _onCompleteHandler:Handler;
    private _curPos:cc.Vec2 = cc.Vec2.ZERO;
    private _curNextPos:cc.Vec2 = cc.Vec2.ZERO;
    private _curPosLen:number = 0;
    private _curDis:number;

    private _tempPos:cc.Vec2;
    private _path:Pos[];
    private _self:Monster;
    private _isStop:boolean = false;
    private _disList:number[] = [];

    dir:EDir;

    constructor() {
        super();
        this.frameRate = 1;
        this.priority = EFrameCompPriority.WALK;
        this.key = ERecyclableType.LD_WALK;
    }

    added() {
        super.added();
        this._self = (this.owner as Monster);
    }

    removed() {
        this._self = null;
        super.removed();
    }

    resetData() {
        this.clearData();
        this._disList = [];
    }

    
    setHandler(onCompleteHandler:Handler) {
        this._onCompleteHandler = onCompleteHandler;
    }

    moveTo(path:Pos[]) {
        this._disList = [];
        this._path = path;
        this.initDisList();
        this._index = 0;
        if (this._isMoveing && this._onCompleteHandler != null) {
            this._onCompleteHandler.executeWith(false);
        }
        this._curPosLen = this._path.length;
        this.changeIndex();
        this._isStop = false;
        this._isMoveing = true;
    }

    

    update() {
        if (!this._isMoveing || this._self.inState(CreatureState.DONT_MOVE)) return;

        

        let dis:number = GlobalVal.war_MDelta * this._self.prop.getPropertyValue(PropertyId.SPEED) * 0.001;
        GlobalVal.tempVec2.x = this._self.x ;
        GlobalVal.tempVec2.y = this._self.y ;
        if (dis >= this._curDis) {
            dis = dis - this._curDis;
            this.changeIndex();
            GlobalVal.tempVec2.x = this._curPos.x;
            GlobalVal.tempVec2.y = this._curPos.y;
            if (!this._isMoveing) return;
        } 

        if (dis > 0) {
            GlobalVal.tempVec2.x += this._tempPos.x * dis;
            GlobalVal.tempVec2.y += this._tempPos.y * dis;
            this._curDis -= dis;
            this._self.setPosNow(GlobalVal.tempVec2.x, GlobalVal.tempVec2.y); 
        }

        // if (CC_DEBUG) {
        //     this.drawMoveLine();
        // }
    }

    private drawMoveLine() {
        if (!Game.ldSkillMgr.graphMoveLine || SoType.isMonster(this._self)) return;
        Game.ldSkillMgr.graphMoveLine.moveTo(this._self.x , this._self.y);
        for (let i = this._index;  i < this._curPosLen ; i++) {
            const pos = this._path[i];
            Game.ldSkillMgr.graphMoveLine.lineTo(pos.x , pos.y);
        }
        Game.ldSkillMgr.graphMoveLine.stroke();

    }

    stopMove() {
        this._isStop = true;
        this.clearData();
        if (this._onCompleteHandler ) {
            this._onCompleteHandler.executeWith(false);
        }
    }

    /**
     * 改变移动节点
     * @returns 
     */
    private changeIndex() {
        if (!this._path || this._path.length <= this._index - 1) {
            cc.log('walk comp error ,changeIndex:' , this._index);
            return;
        }
        this._index ++;
        if (this._index >= this._curPosLen) {
            this.walkComplete();
            return;
        }

        let pos = this._path[this._index - 1];
        if (!pos ) {
            cc.log('walk comp error ,not pos:' , this._index , this._path.length);
            return;
        }
        this._curPos.x = pos.x;
        this._curPos.y = pos.y;
        this.calcData();   
        this.faceToPos();
    }

    private calcData() {
        //this._curPos = this._path[this._index - 1];
        let nextPos = this._path[this._index];
        this._curNextPos.x = nextPos.x; 
        this._curNextPos.y = nextPos.y;

        const angle = MathUtils.getAngle(this._curPos.x, this._curPos.y , this._curNextPos.x , this._curNextPos.y);

        if (angle > 45 && angle < 135) {
            this.dir = EDir.TOP;
        } else if (angle >= 135 && angle < 225) {
            this.dir = EDir.LEFT;
        } else if (angle >= 225 && angle < 315) {
            this.dir = EDir.BOTTOM;
        } else {
            this.dir = EDir.RIGHT;
        }



        // if (this._curNextPos.x == this._curPos.x) {
        //     this.dir = this._curNextPos.y > this._curPos.y ? EDir.TOP : EDir.BOTTOM;
        // } else {
        //     this.dir = this._curNextPos.x > this._curPos.x ? EDir.RIGHT : EDir.LEFT;
        // }

        this._self.setDir(this.dir);

        this._tempPos = this._curNextPos.sub(this._curPos);
        this._tempPos.normalizeSelf();
        
        this._curDis = MathUtils.getDistance(this._curPos.x , this._curPos.y, this._curNextPos.x , this._curNextPos.y);
    }

    /**移动结束 */
    private walkComplete() {
        this.clearData();
        if (this._onCompleteHandler ) {
            this._onCompleteHandler.executeWith(true);
        }
    }

    private faceToPos() {
        // if (!SoType.isMonster(this._self)) return;
        if (this._curNextPos.x == this._curPos.x) {
            return;
        }

        this._self.scaleX = this._curNextPos.x < this._curPos.x ? -1 : 1;
    }

    private clearData() {
        this._path = [];
        this._index = 0;
        this._isMoveing = false;
    }

    giveUp() {
        this._curPos = null;
        this._curNextPos = null;
        this._onCompleteHandler = null;
        this._tempPos = null;
        this._path = null;
        this._self = null;
        super.giveUp();
    }

    getPath():Pos[] {
        return this._path;
    }

    private initDisList() {
        if (this._disList.length == 0) {
            this._disList = MathUtils.calcPathDisList(this._path);
        }
    }
}