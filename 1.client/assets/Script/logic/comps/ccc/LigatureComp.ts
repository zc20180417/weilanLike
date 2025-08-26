

import Creature from "../../sceneObjs/Creature";
import { MathUtils } from "../../../utils/MathUtils";
import { Handler } from "../../../utils/Handler";
import LdHeroAutoAttackComp from "../../../ld/tower/LdHeroAutoAttackComp";


const {ccclass, property , menu} = cc._decorator;

@ccclass
@menu("Game/comp/LigatureComp")

export default class LigatureComp extends cc.Component {

    @property(cc.Sprite)
    sprite:cc.Sprite = null;

    @property(cc.Integer)
    commonWid:number = 0;

    @property(cc.Node)
    pointNode:cc.Node = null;

    @property(cc.Integer)
    imgRealWid:number = 360;


    private _curType:cc.Sprite.Type = cc.Sprite.Type.SIMPLE;
    private _target:Creature = null;
    private _autoAtkComp:LdHeroAutoAttackComp;
    private _handler:Handler;
    private _realRate:number = 0;

    onLoad() {
        this._realRate = this.commonWid / this.imgRealWid;
    }

    update() {
        // let autoTarget = this._autoAtkComp ? this._autoAtkComp.getTarget() : null;
        // cc.log('-----update:' , this._target ? this._target.name : '' , autoTarget ? autoTarget.name : '')
        if (!this._target || (this._autoAtkComp && !this._autoAtkComp.getTarget())) {
            this.node.active = false;
            return;
        }

        this.refreshNode();

        /*
        if (this._scaleAdd) {
            this._scale = this._scale + this.scaleDValue;
            if (this._scale >= 1) {
                this._scale = 1;
                this._scaleAdd = false;
            }
        } else {
            this._scale = this._scale - this.scaleDValue;
            if (this._scale <= this.scaleMin) {
                this._scale = this.scaleMin;
                this._scaleAdd = true;
            }
        }

        this.sprite.node.scaleY = this._scale;
        this.pointNode.scale = this._scale;
        */
    }

    setOwnerAutoAtkComp(comp:LdHeroAutoAttackComp) {
        this._autoAtkComp = comp;
    }

    setTarget(target:Creature) {
        // cc.log("----------setTarget-------targrt id" , target ? target.id : 0 , target ? target.name : '');
        
        this._target = target;
        if (!target) {
            this.node.active = false;
        } else {
            this.refreshNode();
            this.node.active = true;
        }
    }

    setGetPosHandler(handler:Handler) {
        this._handler = handler;
    }

    private refreshNode() {

        //cc.log("----------refreshNode-------targrt id" , this._target.id);
        if (!this._handler)  {
            cc.log("-----!this._handler");
            return;
        }
        let p = this._handler.execute();

        this.node.x = p.x;
        this.node.y = p.y;
        let center:cc.Vec2 = this._target.centerPos;
        let dis = MathUtils.getDistance(this.node.x , this.node.y , center.x , center.y);
        this.node.width = dis;
        this.node.angle = MathUtils.getAngle(this.node.x , this.node.y , center.x , center.y);
        
        /*
        let type:cc.Sprite.Type;
        if (dis < this.commonWid)　{
            type = cc.Sprite.Type.TILED;
        } else {
            type = cc.Sprite.Type.SIMPLE;
        }
        
        if (this._curType != type) {
            this._curType = type;
            this.sprite.type = type;
        }
        */
        this.sprite.node.width = dis * this._realRate;
        //this.pointNode.x = dis;
    }

    onDestroy() {
        this._target = null;
        this._autoAtkComp = null;
    }
}