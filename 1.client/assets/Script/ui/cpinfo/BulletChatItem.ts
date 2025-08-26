import { Handler } from "../../utils/Handler";
import { MathUtils } from "../../utils/MathUtils";
import { NodeUtils } from "../../utils/ui/NodeUtils";

const { ccclass, property ,menu} = cc._decorator;

@ccclass
@menu("Game/ui/cpinfo/BulletChatItem")
export class BulletChatItem extends cc.Component {

    @property(cc.Label)
    label:cc.Label = null;

    @property(cc.Color)
    selfColor:cc.Color = null;

    @property(cc.Color)
    otherColor:cc.Color = null;


    endCallBack:Handler = null;

    doShow(str:string , isMe:boolean ,y:number ) {
        this.label.string = str;
        this.node.color = isMe ? this.selfColor : this.otherColor;
        const winWidth = cc.winSize.width;
        this.node.x = winWidth;
        this.node.y = y;
        this.label['_forceUpdateRenderData']();
        const nodeWid = this.node.width * 0.5;
        const moveWid = winWidth + nodeWid;
        const time = moveWid / MathUtils.randomInt(190 , 220);
        NodeUtils.to(this.node , time , {x:-nodeWid} , null , this.moveEnd , null , this);
    }

    private moveEnd() {
        if (this.endCallBack) {
            this.endCallBack.executeWith(this.node);
        }
    }
}