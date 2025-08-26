import { Handler } from "../Handler";

const {ccclass, property , menu} = cc._decorator;

@ccclass
@menu("effect/SkeletonEffect")
export class SkeletonEffect extends cc.Component {

    @property(sp.Skeleton)
    skeleton:sp.Skeleton = null;

    @property
    animationName:string = "";

    private _completeCallBack:Handler;
    private _dontHide:boolean = false;
    onLoad() {
        this.skeleton.paused = true;
    }

    play() {
        this.node.stopAllActions();
        this.node.active = true;
        let self = this;
        this.skeleton.paused = false;
        this._dontHide = false;
        this.skeleton.setCompleteListener(()=> {
            self.onComplete();
        });
        this.skeleton.animation = this.animationName;
    }

    playToEnd() {
        this.play();
        this._dontHide = true;
    }

    hide() {
        this.node.stopAllActions();
        this.skeleton.animation = "";
        this.node.active = false;
    }

    setCompleleCallBack(handler:Handler) {
        this._completeCallBack = handler;
    }

    private onComplete() {
        if (!this._dontHide) {
            this.hide();
        }
        if (this._completeCallBack) {
            this._completeCallBack.execute();
        }
    }


}