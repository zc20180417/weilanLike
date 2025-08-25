

import Creature from "../../sceneObjs/Creature";
import { Handler } from "../../../utils/Handler";
import { Monster } from "../../sceneObjs/Monster";
import { MathUtils } from "../../../utils/MathUtils";
import { EventEnum } from "../../../common/EventEnum";
import BindSoComp from "./BindSoComp";
import GlobalVal from "../../../GlobalVal";


const {ccclass, property , menu} = cc._decorator;

@ccclass
@menu("Game/comp/LightningComp")

export default class LightningComp extends BindSoComp {

    @property(cc.Sprite)
    sprite:cc.Sprite = null;

    private _maxWid:number = 158;
    private _curWid:number = 0;
    //private _fadeDValue:number = 5;
    private _endCreate:Creature = null;
    private _handler:Handler;
    private _endPos:cc.Vec2 = cc.Vec2.ZERO;
    private _getEndPosHandler:Handler;

    private _update:boolean = false;
    private _moveTime:number = 0;
    private _state:number = 0;
    private _startTime:number = 0;

    getEndPosHandler():Handler {
        if (this._getEndPosHandler == null) {
            this._getEndPosHandler = new Handler(this.getEndPos , this);
        }
        return this._getEndPosHandler;
    }

    onLoad() {
        
    }

    onAdd() {
        //this.node.opacity = 255;
    }

    onRemove() {
        if (this._endCreate) {
            this._endCreate.off(EventEnum.ON_SELF_REMOVE , this.onSoRemove , this);
            this._endCreate = null;
        }
        this._handler = null;
        this._update = false;
    }

    update() {
        if (!this._update) {
            return;
        }
        this.refreshNode();
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

        this.sprite.node.width = 0;
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
        if (this._handler) {
            let startPos = this._handler.execute();
            this.node.x = startPos.x;
            this.node.y = startPos.y;
        }

        if (this._endCreate) {
            let center:cc.Vec2 = this._endCreate.centerPos;
            this._endPos.x = center.x;
            this._endPos.y = center.y;
        }

        let dis = MathUtils.getDistance(this.node.x , this.node.y , this._endPos.x , this._endPos.y);
        this.node.angle = MathUtils.getAngle(this.node.x , this.node.y , this._endPos.x , this._endPos.y);
        if (dis > this._maxWid) {
            this._curWid = this._maxWid;
            this.sprite.node.scaleX = dis / this._maxWid;
        } else {
            this.sprite.node.scaleX = 1;
            this._curWid = dis;

            if (this._state == 1) {
                this.sprite.node.width = this._curWid;
            }
        }
        
        if (this._state == 0) {
            let rate = Math.min((GlobalVal.now - this._startTime) / this._moveTime , 1);
            this.sprite.node.width = rate * this._curWid;

            if (rate == 1) {
                this._state = 1;
            }
        }
    
    }

    onDestroy() {
        if (this._endCreate) {
            this._endCreate.off(EventEnum.ON_SELF_REMOVE , this.onSoRemove , this);
        }
        this._endCreate = null;
        this._handler = null;
    }

    private onSoRemove() {
        this._endCreate = null;
    }
}