
import Game from "../../Game";
import { StringUtils } from "../../utils/StringUtils";



const {ccclass, property , menu} = cc._decorator;

@ccclass
@menu("Game/utls/UiSkeletonEffect")
export class UiSkeletonEffect extends cc.Component {

    @property(sp.Skeleton)
    skeleton:sp.Skeleton = null;

    @property
    animationName:string = "";
    private _playTimes:number = 1;
    private _path:string = '';
    onLoad() {
        this.skeleton.paused = true;
        this.play();
    }

    setPath(path:string) {
        this._path = path;
    }

    private play(playTimes:number = 1 , animationName?:string) {
        this._playTimes = playTimes;
        this.node.stopAllActions();
        this.node.active = true;
        let self = this;
        this.skeleton.paused = false;
        this.skeleton.setCompleteListener(()=> {
            self.onComplete();
        });

        this.skeleton.animation = animationName || this.animationName;
    }

    private hide() {
        this.node.stopAllActions();
        this.skeleton.animation = "";
        this.node.removeFromParent();
        if (!StringUtils.isNilOrEmpty(this._path)) {
            Game.resMgr.decRef(this._path);
        }
    }

    private onComplete() {
        this._playTimes --;
        if (this._playTimes <= 0) {
            this.hide();
        }
    }


}