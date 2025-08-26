
import { ECamp } from "../../../common/AllEnum";
import { EventEnum } from "../../../common/EventEnum";
import Game from "../../../Game";
import GlobalVal from "../../../GlobalVal";
import { EFrameCompPriority } from "../../../logic/comps/AllComp";
import { FrameComponent } from "../../../logic/comps/FrameComponent";
import { ERecyclableType } from "../../../logic/Recyclable/ERecyclableType";
import Creature from "../../../logic/sceneObjs/Creature";
import { Monster } from "../../../logic/sceneObjs/Monster";
import SceneObject from "../../../logic/sceneObjs/SceneObject";
import { Handler } from "../../../utils/Handler";
import { MathUtils } from "../../../utils/MathUtils";



export default class LdLightningComp extends FrameComponent {

   

    private _self:SceneObject;
    private _sprite:cc.Sprite;

    constructor() {
        super();
        this.frameRate = 1;
        this.priority = EFrameCompPriority.PARABOLIC;
        this.key = ERecyclableType.LD_LIGHRNING;
    }

    giveUp() {
        if (this._endCreate) {
            this._endCreate.off(EventEnum.ON_SELF_REMOVE , this.onSoRemove , this);
        }
        this._endCreate = null;
        this._handler = null;
        this._endPos = null;
        super.giveUp();
    }

    resetData() {

        super.resetData();
    }

    
    added() {
        super.added();
        this._self = this.owner as SceneObject;
        if (this._self.mainBody) {
            this.initSprite();
        } else {
            this._self.once(EventEnum.MAIN_BODY_ATTACHED , this.initSprite , this);
        }
    }

    private initSprite() {
        this._sprite = this._self.mainBody.getComponentsInChildren(cc.Sprite)[0];
        this._sprite.node.width = 0;
    }

    removed() {
        if (this._endCreate) {
            this._endCreate.off(EventEnum.ON_SELF_REMOVE , this.onSoRemove , this);
            this._endCreate = null;
        }

        if (this._self) {
            this._self.off(EventEnum.MAIN_BODY_ATTACHED , this.initSprite , this);
        }

        this._sprite = null;
        this._self = null;
        this._handler = null;
        this._update = false;
        super.removed();
    }

    update() {
        if (!this._update) {
            return;
        }
        this.refreshNode();

        if (GlobalVal.now - this._startTime > this.removeEftTime) {
            // this._self.removeComponent(this);
            Game.soMgr.removeEffect(this._self);
        }

    }

    private _maxWid:number = 158;
    private _curWid:number = 0;
    private _endCreate:Creature = null;
    private _handler:Handler;
    private _endPos:cc.Vec2 = cc.Vec2.ZERO;
    private _getEndPosHandler:Handler;

    private _update:boolean = false;
    private _moveTime:number = 0;
    private _state:number = 0;
    private _startTime:number = 0;

    private removeEftTime:number = 500;
    private _campId:ECamp;

    setCamp(camp:ECamp) {
        this._campId = camp;
    }

    getEndPosHandler():Handler {
        if (this._getEndPosHandler == null) {
            this._getEndPosHandler = new Handler(this.getEndPos , this);
        }
        return this._getEndPosHandler;
    }

    setTarget(endCreate:Creature , refreshPosHandler:Handler , moveTime:number , endPos:cc.Vec2) {
        this._update = true;
        this._endCreate = endCreate;
        this._handler = refreshPosHandler;
        this._endPos.x = endPos.x;
        this._endPos.y = endPos.y;

        this._moveTime = moveTime;
        if (this._endCreate) {
            this._endCreate.once(EventEnum.ON_SELF_REMOVE , this.onSoRemove , this);
        }

        this._state = 0;
        this._startTime = GlobalVal.now;
        this.refreshNode();
    }

    setGetPosHandler(handler:Handler) {
        this._handler = handler;
    }

    getEndPos():cc.Vec2 {
        return this._endPos;
    }

    getTarget():Monster {
        return this._endCreate as Monster;
    }

    private refreshNode() {
        if (!this._sprite) return;
        if (this._handler) {
            let startPos = this._handler.execute();
            if (startPos) {
                this._self.x = startPos.x;
                this._self.y = startPos.y;
            }
        }

        if (this._endCreate) {
            let center:cc.Vec2 = this._endCreate.centerPos;
            this._endPos.x = center.x;
            this._endPos.y = center.y;
        }


        // if (this._campId == ECamp.RED && (this._endPos.y <= 900 || this._self.y <= 900) ) {
        //     cc.log('!!');
        // } else if (this._campId == ECamp.BLUE && (this._endPos.y >= 1000 || this._self.y >= 1000)) {
        //     cc.log('!!');
        // }

        let dis = MathUtils.getDistance(this._self.x , this._self.y , this._endPos.x , this._endPos.y);
        this._self.rotation = MathUtils.getAngle(this._self.x , this._self.y , this._endPos.x , this._endPos.y);
        if (dis > this._maxWid) {
            this._curWid = this._maxWid;
            this._sprite.node.scaleX = dis / this._maxWid;
        } else {
            this._sprite.node.scaleX = 1;
            this._curWid = dis;

            if (this._state == 1) {
                this._sprite.node.width = this._curWid;
            }
        }
        
        if (this._state == 0) {
            let rate = Math.min((GlobalVal.now - this._startTime) / this._moveTime , 1);
            this._sprite.node.width = rate * this._curWid;

            if (rate == 1) {
                this._state = 1;
            }
        }
    
    }

    private onSoRemove() {
        this._endCreate = null;
    }

    
}