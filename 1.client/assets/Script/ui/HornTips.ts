import { GameEvent } from "../utils/GameEvent";
import { EventEnum } from "../common/EventEnum";


const {ccclass, property,menu} = cc._decorator;

@ccclass
@menu("Game/HornTips")
export default class HornTips extends cc.Component {

    @property(cc.Node)
    bg:cc.Node = null;

    @property(cc.RichText)
    infoLabel:cc.RichText = null;

    private labelWid:number = 0;
    private startX:number = 220;
    private curShowInfo:string = '';
    private startMove:boolean = false;
    public show(info:string) {
        this.curShowInfo = info;
        if (this.node.opacity == 0) {
            this.node.opacity = 255;
            this.bg.width = 180;
            this.infoLabel.string = "";
            let self = this;
            cc.tween(this.bg).to(0.6 , {width:800} , {easing:"backOut"}).call(function() {
                self.moveLabel();
            }).start();
        } 
        else {
            this.node.stopAllActions();
            this.node.opacity = 255;
            this.moveLabel();
        }
    }

    private moveLabel() {
        this.infoLabel.string = this.curShowInfo;
        this.infoLabel.node.x = this.startX;
        this.startMove = true;
    }

    private showEnd() {
        GameEvent.dispatchEvent(new GameEvent(EventEnum.HORN_TIPS_SHOW_END));
    }

    public hide() {
        let self = this;
        cc.tween(this.node).to(0.5 , {opacity:0}).start();
    }

    update(dt:number) {
        if (this.startMove) {
            let moveDis:number = 650 + this.infoLabel.node.width;
            let toX:number = this.startX - moveDis;
            let time:number = moveDis / 120;
            let self = this;
            cc.tween(this.infoLabel.node).to(time , {x:toX}).call(function() {
                self.showEnd();
            }).start();
            this.startMove = false;
        } 
    }
}