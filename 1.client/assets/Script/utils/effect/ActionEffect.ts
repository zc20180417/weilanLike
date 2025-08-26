import GlobalVal from "../../GlobalVal";
import { Handler } from "../Handler";
import { MathUtils } from "../MathUtils";
import { BaseAnimation } from "./BaseAnimation";

const {ccclass, property,menu} = cc._decorator;

/**
 * 对话框
 */
@ccclass
@menu("effect/ActionEffect")
export default class ActionEffect extends BaseAnimation {

    @property([cc.SpriteFrame])
    spriteFrames0:cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    spriteFrames1:cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    spriteFrames2:cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    spriteFrames3:cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    spriteFrames4:cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    spriteFrames5:cc.SpriteFrame[] = [];

    @property([cc.String])
    actionNames:string[] = [];

    @property(cc.Sprite)
    sprite:cc.Sprite = null;

    @property
    frameInterval:number = 10;

    @property
    defaultAction:number = -1;



    protected spriteFrames:cc.SpriteFrame[] = [];
    protected curFrameIndex:number = -1;
    protected m_dt:number = 0;
    protected maxFrameIndex:number = 0;
    protected isPlaying:boolean = true;
    
    protected  _actionTimeScale:number = 1;

    protected _curIndex:number = -1;
    onLoad() {
        if (this.defaultAction != -1 && this._curIndex == -1)
            this.playActionIndex(this.defaultAction);
    }

    playAction(name:string , isLoop:boolean = true,scale:number = 1) {
        this._isLoop = isLoop;
        this._actionTimeScale = scale;
        let index = this.actionNames.indexOf(name);
        if (index != -1) {
            this.playActionIndex(index);
        } else {
            this._curIndex = index;
        }
    }

    protected playActionIndex(index:number) {
        if (this._curIndex == index) {
            return;
        }
        this._curIndex = index;
        
        this.spriteFrames = this['spriteFrames' + index];
        this.maxFrameIndex = this.spriteFrames.length;
        let startIndex = 0;
        if (this._isLoop && this.maxFrameIndex > 1) {
            //如果是循环动作并且总帧数大于1，则随机起始帧
            startIndex = MathUtils.randomInt(0 , this.maxFrameIndex - 1);
        }

        this.curFrameIndex = startIndex;
        this.m_dt = 0;
        this.setSpriteFrame(startIndex);
        if (this.maxFrameIndex == 1 && this._isLoop) {
            this.isPlaying = false;
        } else {
            this.isPlaying = true;
        }
    }

    reset() {
        this._curIndex = -1;
    }

    play() {
        this.node.active = true;
        this.curFrameIndex = 0;
        this.isPlaying = true;
    }

    pause() {
        //this.node.active = false;
        this.isPlaying = false;
    }

    resume() {
        this.isPlaying = this.maxFrameIndex > 1;
    }

    gotoAndStop(index:number) {
        this.setSpriteFrame(index);
        this.isPlaying = false;
    }

    update(dt:number) {
        if (this.isPlaying) {
            this.m_dt += GlobalVal.war_MDelta;
            if (this.m_dt >= (this.frameInterval / this._actionTimeScale)) {
                this.setSpriteFrame(this.curFrameIndex + 1);
                this.m_dt = 0;
            }
        }
    }

    setAngle(value:number) {
        value -= 90;
        this.sprite.node.angle = value;
    }

    isFrameEffect():boolean {
        return true;
    }

    set playEndHandler(value:Handler) {
        this._playEndHandler = value;
    }

    protected setSpriteFrame(frameIndex:number) {
        if (this.maxFrameIndex != 0 && frameIndex >= this.maxFrameIndex) {
            frameIndex = 0;

            if (!this._isLoop) {
                this.isPlaying = false;
                this._curIndex = -1;
                if (this._playEndHandler != null) {
                    this._playEndHandler.execute();
                }
                return;
            }
        }

        let spriteFrame = this.getSprite(frameIndex);
        if (!spriteFrame) {
            this.maxFrameIndex = frameIndex;
            frameIndex = 0;
            spriteFrame = this.getSprite(0);
        }

        this.curFrameIndex = frameIndex;
        this.sprite.spriteFrame = spriteFrame;
    }

    protected getSprite(frameIndex:number):cc.SpriteFrame {
        return this.spriteFrames[frameIndex];
    }

}