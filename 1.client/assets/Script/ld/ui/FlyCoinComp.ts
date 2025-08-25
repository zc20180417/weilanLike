import { Handler } from "../../utils/Handler";
import { NodeUtils } from "../../utils/ui/NodeUtils";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/LD/ui/FlyCoinComp")
export class FlyCoinComp extends cc.Component {


    @property(cc.Node)
    shadowNode:cc.Node = null;

    @property(cc.Node)
    coinNode:cc.Node = null;

    coinValue:number = 0;
    private _toPos:cc.Vec2 = cc.Vec2.ZERO;
    private _curPos:cc.Vec2 = cc.Vec2.ZERO;
    private _midPos:cc.Vec2 = cc.Vec2.ZERO;
    private _endCallBack:Handler = null;

    setData(toPos:cc.Vec2 , vaue:number , endCallBack:Handler) {
        this.coinValue = vaue;
        this._curPos.x = this.node.x; this._curPos.y = this.node.y;
        this._toPos.x = toPos.x;this._toPos.y = toPos.y;
        this._midPos.x = this.node.x + (toPos.x - this.node.x) * 0.33;
        this._midPos.y = this.node.y + (toPos.y - this.node.y) * 0.33 + Math.abs(toPos.y - this.node.y) * 0.33;
        this._endCallBack = endCallBack;
        this.doFly();
    }

    private doFly() {
        let node = this.node;
        let self = this;
        node.scale = 0.7;
        node.stopAllActions();

        this.shadowNode.active = true;
        this.coinNode.y = 60;
        let coinTween = cc.tween(this.coinNode);
        cc.tween(this.coinNode).to(0.07 , {scaleX:0.5}).to(0.07 , {scaleX:1}).start();
        coinTween.to(0.15 , {y:3} , { easing: 'sineIn' }).call(()=>{
            this.shadowNode.active = false;
            let tween = cc.tween(node);
            tween.delay(0.3).to(0.15 , {y:this._curPos.y + 40 , scale:0.8} , { easing: 'sineIn' }).
            to(0.35 , {x:this._toPos.x , y:this._toPos.y} , { easing: 'sineIn' }).call(()=>{
                if(this._endCallBack) {
                    this._endCallBack.executeWith(self);
                }
            }).start();
        }).start();

    }

}