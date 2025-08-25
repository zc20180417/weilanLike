
import BindSoComp from "./BindSoComp";
import Game from "../../../Game";
import FrameEffect from "../../../utils/effect/FrameEffect";
import SysMgr from "../../../common/SysMgr";
import { Handler } from "../../../utils/Handler";
import { MathUtils } from "../../../utils/MathUtils";


const {ccclass, property , menu} = cc._decorator;

@ccclass
@menu("Game/comp/ChongjiboComp")

export default class ChongjiboComp extends BindSoComp {

    @property([FrameEffect])
    bodyStarts:FrameEffect[] = [];
    @property([FrameEffect])
    bodyLoops:FrameEffect[] = [];
    @property([FrameEffect])
    bodyEnds:FrameEffect[] = [];

    @property(cc.Node)
    moveNode:cc.Node = null;

    private _playStartEnd:Handler;
    private _playEndEnd:Handler;
    private _timerEnd:Handler;
    private _blueMaxX:number = 1020;
    private _redMinX:number = 1070;
    private _initX:number = 110;
    private _itemWid:number = 150;
    private _totalWid:number = 1030;
    private _space:number = 50;
    private _maxIndex:number = 0;
    private _callLater:Handler = null;
    
    onLoad() {
        this._playStartEnd = new Handler(this.onPlayStartEnd , this);
        this._playEndEnd = new Handler(this.onPlayEndEnd , this);
        this._timerEnd = new Handler(this.onTimerEnd , this);
        this._callLater = new Handler(this.callLater , this);
        this.bodyStarts[0].playEndHandler = this._playStartEnd;
        this.bodyEnds[0].playEndHandler = this._playEndEnd;
    }

    onAdd() {
 
        this.hideEfts(this.bodyLoops);
        this.hideEfts(this.bodyEnds);
        this.hideEfts(this.bodyStarts);
        SysMgr.instance.callLater(this._callLater);
    }

    private callLater() {
        this.calcWid();  
        this.playStart();
        this.onTweenEnd();
    }

    onRemove() {
        SysMgr.instance.clearTimer(this._timerEnd);
        SysMgr.instance.clearCallLater(this._callLater);
    }

    private calcWid() {
        let wid = 1200;
        this._maxIndex = this.bodyStarts.length - 1;
        if (Game.curNetGameHandler) {

            let dx:number = 0;
            let angle:number = 0;
            
            if (this.node.x < this._blueMaxX && this.node.scaleX == 1) {
                angle = angle > 270 ? 360 - 270 : Math.abs(this.node.angle);
                dx = this._blueMaxX - this.node.x;
                wid = dx / Math.cos(MathUtils.angle2Radian(angle));

            } else if (this.node.x > this._redMinX && this.node.scaleX == -1) {
                angle = Math.abs(this.node.angle);
                dx = this.node.x - this._redMinX;
                wid = Math.abs(dx) / Math.cos(MathUtils.angle2Radian(angle));
            }

            if (wid < this._totalWid) {
                let len = this.bodyStarts.length;
                let curWid = this._initX;
    
                for (let i = 0 ; i < len ; i++) {
                    if (wid < curWid + this._space) {
                        this._maxIndex = i;
                        break;
                    }
                    curWid += this._itemWid;
                }
            }  
        } 
    }

    protected onDestroy(): void {
        SysMgr.instance.clearTimer(this._timerEnd);
        this._playStartEnd = null;
        this._playEndEnd = null;
        this._timerEnd = null;
    }
    
    private playStart() {
        this.playEft(this.bodyStarts);
    }

    private onTimerEnd() {
        this.hideEfts(this.bodyLoops);
        this.playEft(this.bodyEnds);
    }

    private onPlayStartEnd() {
        this.hideEfts(this.bodyStarts);
        this.playEft(this.bodyLoops);
    }

    private onPlayEndEnd() {
        Game.soMgr.removeEffect(this.owner);
    }

    private onTweenEnd() {
        SysMgr.instance.doOnce(this._timerEnd ,4500);
    }

    private playEft(eftList:FrameEffect[]) {
        let eft:FrameEffect;
        for (let i = 0 ; i <= this._maxIndex ; i++) {
            eft = eftList[i];
            eft.node.active = true;
            eft.play();
        }
    }

    private hideEfts(eftList:FrameEffect[]) {
        eftList.forEach(element => {
            element.node.active = false;
        });
    }


}