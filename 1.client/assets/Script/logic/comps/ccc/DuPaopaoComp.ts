

const {ccclass, property , menu} = cc._decorator;

@ccclass
@menu("Game/comp/DuPaopaoComp")
export class DuPaopaoComp extends cc.Component {


    @property(sp.Skeleton)
    skeleton:sp.Skeleton = null;


    onLoad() {
        this.onComplete();
        let self = this;
        this.skeleton.setCompleteListener(()=> {
            self.onComplete();
        });
    }

    private onComplete() {
        this.skeleton.timeScale = Math.random() * 0.5 + 0.2;
        this.node.scale = Math.random() * 1.0 + 0.5;
    }


}