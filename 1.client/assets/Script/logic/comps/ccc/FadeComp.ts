

const {ccclass, property , menu} = cc._decorator;
@ccclass
@menu("Game/comp/FadeComp")
export class FadeComp extends cc.Component {


    start() {
        let tween = cc.tween(this.node);
        tween.to(1, {opacity:100 });
        tween.to(1 , {opacity:255 });
        cc.tween(this.node).repeatForever(tween).start();
    }

}