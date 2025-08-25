import { Component } from "../Component";
import SceneObject from "../../sceneObjs/SceneObject";
import { EventEnum } from "../../../common/EventEnum";
import { Handler } from "../../../utils/Handler";
import Game from "../../../Game";
import { BaseEffect } from "../../../utils/effect/BaseEffect";

export default class EftAutoRemoveComp extends Component {

    private _frameEftComp:BaseEffect;
    private _playEndHandler:Handler;

    constructor() {
        super();
        this._playEndHandler = new Handler(this.playEnd , this);
    }   

    added() {
        let so:SceneObject = this.owner as SceneObject;
        if (so.mainBody) {
            this.init();
        } else {
            so.on(EventEnum.MAIN_BODY_ATTACHED , this.onMainAttached , this);
        }
    }

    removed() {
        let so:SceneObject = this.owner as SceneObject;
        if (this._frameEftComp) {
            if (this._frameEftComp.playEndHandler == this._playEndHandler) {
                this._frameEftComp.playEndHandler = null;
            }
            this._frameEftComp = null;
        }
        if (so) 
            so.off(EventEnum.MAIN_BODY_ATTACHED , this.onMainAttached , this);
    }

    private _isLoop:boolean = false;
    play(isLoop:boolean = false) {
        this._isLoop = isLoop;
    }

    giveUp() {
        this._frameEftComp = null;
        this._playEndHandler = null;
    }

    private onMainAttached() {
        this.init();
    }

    private init() {
        let so:SceneObject = this.owner as SceneObject;
        this._frameEftComp = so.mainBody.getComponent(BaseEffect);
        if (this._frameEftComp) {
            this._frameEftComp.playEndHandler = this._playEndHandler;
            this._frameEftComp.play();
        }
    }

    private playEnd() {
        //cc.log("------playEnd");
        if (! this._isLoop) {
            if (this._frameEftComp) {
                this._frameEftComp.stop();
            }
            Game.soMgr.removeEffect(this.owner as SceneObject);
        }
    }
}