import { EventEnum } from "../../../common/EventEnum";
import Game from "../../../Game";
import GlobalVal from "../../../GlobalVal";
import { STATUS_TYPE } from "../../../net/socket/handler/MessageEnum";
import { MathUtils } from "../../../utils/MathUtils";
import { ERecyclableType } from "../../Recyclable/ERecyclableType";
import { Monster } from "../../sceneObjs/Monster";
import { EComponentType, EFrameCompPriority } from "../AllComp";
import { FrameComponent } from "../FrameComponent";
import RunAwayComp from "./RunAwayComp";

export default class MonsterFlyComp extends FrameComponent {

    private _self:Monster = null;
    private _isMoveing:boolean = false;
    private _startTime:number = 0;

    private _startPos:cc.Vec2;
    private _dirPos:cc.Vec2;
    private _totalDis:number = 0;
    private _maxHeight:number = 0;

    private _totalMoveTime:number = 1900;
    private _commonSpeed:number = 0.3;
    private _totalTime:number = 0;
    private _halfDis:number = 0;
    private _totalAngle:number = 0;


    constructor() {
        super();
        this.frameRate = 1;
        this.priority = EFrameCompPriority.WALK;
        this.key = ERecyclableType.MONSTER_FLY;
    }

    added() {
        super.added();
        this._self = (this.owner as Monster);
        this._self.setSistanceStatus(STATUS_TYPE.STATUS_FLOATING , true);
    }

    removed() {
        if (this._self) {
            this._self.setSistanceStatus(STATUS_TYPE.STATUS_FLOATING , false);
        }
        this._self = null;
        super.removed();
    }

    resetData() {

    }

    private _toPos:cc.Vec2;
    private _scale:number = 1;
    flyTo(startPos:cc.Vec2 , toPos:cc.Vec2 , hei:number = -1 , flyTime:number = -1) {
        this._toPos = toPos;
        this._startTime = GlobalVal.now;
        this._startPos = startPos;
        this._scale = this._self.cfg.uscale > 0 ? this._self.cfg.uscale / 1000 : 1;
        this._totalDis = MathUtils.getDistance(startPos.x , startPos.y , toPos.x , toPos.y);
        let time:number = flyTime == -1 ? this._totalDis / this._commonSpeed : flyTime;
        
        if (time > this._totalMoveTime) {
            this._totalTime = this._totalMoveTime;
            //this._speed = this._totalDis / this._totalMoveTime;
        } else {
            //this._speed = this._commonSpeed;
            this._totalTime = time;
        }

        this._halfDis = this._totalDis * 0.5;
        this._maxHeight = hei == -1 ? MathUtils.clamp(this._halfDis , 60 , 200) : hei;
        this._dirPos = toPos.sub(startPos);
        this._dirPos.normalizeSelf();
        this._isMoveing = true;
        this._totalAngle = Math.ceil(this._totalDis / 150) * 360;

        this._self.emit(EventEnum.MONSTER_FLY , true);
    }



    update() {
        if (!this._isMoveing) return;

        const now = GlobalVal.now;
        const time:number = now - this._startTime;
        let rate = time / this._totalTime;

        if (rate >= 1) {
            this.monsterMoveEnd();
            return;
        }

        /*
        let moveDis = 0;
        if (rate <= 0.5) {
            moveDis = Math.sin(this._halfPI * rate / 0.5) * this._halfDis;
        } else {
            moveDis = (1-Math.sin(this._halfPI + this._halfPI * (rate - 0.5) / 0.5)) * this._halfDis + this._halfDis;
        }
        */

        let moveDis = rate * this._totalDis;
        let x = this._startPos.x + this._dirPos.x * moveDis;
        let sin = Math.sin(Math.PI * rate);
        let addY:number = sin * this._maxHeight;
        this._self.scale = this._scale + sin * 0.2;
        let y = this._startPos.y + (this._dirPos.y * moveDis) + addY;
        this._self.setPosNow(x , y);
        this._self.animationComp.setRealAngle(-this._totalAngle * rate);
    }

    private monsterMoveEnd() {
        this._self.x = this._toPos.x;
        this._self.y = this._toPos.y;
        let runAwayComp: RunAwayComp = this._self.getAddComponent(EComponentType.RUNAWAY) as RunAwayComp;
        if (Game.curGameCtrl.curMissonData.btisopenmap == 1) {
            runAwayComp.goonByPath(null);
        } else {
            runAwayComp.goon();
        }
        if (!this._self) return;
        this._self.scale = this._scale;
        this._self.animationComp.setRealAngle(0);
        this._isMoveing = false;
        this._self.emit(EventEnum.MONSTER_FLY , false);
        this._self.removeComponent(this);
    }
}