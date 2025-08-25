import { EventEnum } from "../common/EventEnum";
import { SkeletonEffect } from "../utils/effect/SkeletonEffect";
import { GameEvent } from "../utils/GameEvent";
import { Handler } from "../utils/Handler";


const {ccclass, property , menu} = cc._decorator;

@ccclass
@menu("Game/Hall/BookEft")
export class BookEft extends cc.Component {

    @property(SkeletonEffect)
    eft:SkeletonEffect = null;

    @property(cc.Button)
    btn:cc.Button = null;

    @property(cc.Node)
    btnNode:cc.Node = null;

    private status:number = 0;
    onLoad() {
        this.status = 0;
        this.eft.setCompleleCallBack(new Handler(this.onComplete , this));
    }

    start() {
        //if (Game.sceneNetMgr.getCurWarID() > 1) {
            this.play();
        //}
    }

    onCkick() {
        if (this.status == 0) {
            this.play();
        }
    }

    play() {
        this.btn.enabled = false;
        this.eft.playToEnd();
    }

    private onComplete() {
        this.status = 1;
        GameEvent.emit(EventEnum.BOOK_EFFECT_PLAY_END);
    }
}