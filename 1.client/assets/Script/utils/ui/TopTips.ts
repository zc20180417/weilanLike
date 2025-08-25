import { GameEvent } from "../GameEvent";
import { EventEnum } from "../../common/EventEnum";

const {ccclass, property, menu} = cc._decorator;
@ccclass
@menu('Game/TopTips')
export default class TopTips extends cc.Component {

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.RichText)
    contentText: cc.RichText = null;
    
    show(data:string){
        this.contentText.string = data;
        cc.tween(this.node).by(0.3, {y:-50})
        .delay(2).by(0.3, {y:50})
        .call(()=>{
            GameEvent.emit(EventEnum.TOP_TIPS_END);
        })
        .start();
    }
}