import Creature from "../../logic/sceneObjs/Creature";
import { Handler } from "../Handler";


/**动画 */
export class BaseAnimation extends cc.Component {
    
    protected _playEndHandler:Handler;
    protected _loopCompleteHandler:Handler;
    protected _isLoop:boolean = true;
    protected _timeScale:number = 1;

    owner:Creature;
    init() {};
    
    playAction(name:string , isLoop:boolean = true , scale:number = 1) {};
    reset() {};

    play() {};

    pause() {};

    resume() {};

    gotoAndStop(index:number) {};

    setAngle(value:number) {};

    set playEndHandler(value:Handler) {
        this._playEndHandler = value;
    }
    set loopCompleteHandler(value:Handler) {
        this._loopCompleteHandler = value;
    }

    setTimeScale(value:number) {
        this._timeScale = value;
    }

    getAttackPos(index:number = 0) : cc.Vec2 {
        return cc.Vec2.ZERO_R;
    }

    getAttackPosNode(index:number = 0):cc.Node {
        return null;
    }

    isFrameEffect():boolean {
        return false;
    }

    setLevel(level:number){};


}