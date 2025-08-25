import SysMgr from "../../common/SysMgr";
import { BaseEffect } from "./BaseEffect";

const {ccclass, property,menu} = cc._decorator;

/**
 * 对话框
 */
@ccclass
@menu("effect/FrameEffect")
export default class FrameEffect extends BaseEffect {

    @property([cc.SpriteFrame])
    spriteFrames:cc.SpriteFrame[] = [];

    @property(cc.Sprite)
    sprite:cc.Sprite = null;

    @property
    get frameName():string {
        return this._frameName;
    }

    set frameName(v:string) {
        this._frameName = v;
        this.calcSpriteFrames();
    }

    @property(cc.SpriteAtlas)
    get spriteAtlas():cc.SpriteAtlas {
        return this._spriteAtlas;
    }

    set spriteAtlas(v:cc.SpriteAtlas){
        if(this._spriteAtlas==v)
            return;
        this._spriteAtlas = v;
        this.calcSpriteFrames();
    }

    @property
    frameInterval:number = 10;

    @property(cc.Boolean)
    isPlayingOnLoad:boolean = true;

    private _frameName:string = "";
    private _spriteAtlas:cc.SpriteAtlas = null;
    private curFrameIndex:number = -1;
    private m_dt:number = 0;
    private maxFrameIndex:number = 0;
    private isPlaying:boolean = true;
    private isLoop:boolean = false;

    private _random:number = 0;
    onLoad() {
        if (this.sprite == null) {
            this.sprite = this.node.getComponent(cc.Sprite);
        }
        this._random = Math.random();
        this.maxFrameIndex = this.spriteFrames.length;
        if (this.isPlayingOnLoad || this.maxFrameIndex == 1) {
            this.play();
        } else {
            this.gotoAndStop(0);
        }
    }

    play() {
        this.m_dt = 0;
        this.node.active = true;
        this.curFrameIndex = 0;

        if (this.needPause && SysMgr.instance.pause) {
            this.isPlaying = false;
        } else {
            this.isPlaying = true;
        }

        this.setSpriteFrame(this.curFrameIndex);

    }

    stop() {
        this.node.active = false;
        this.isPlaying = false;
    }

    gotoAndStop(index:number) {
        this.setSpriteFrame(index);
        this.isPlaying = false;
    }

    update(dt:number) {
        if (this.isPlaying) {
            this.m_dt += (dt * 1000);
            if (this.m_dt >= this.frameInterval) {
                this.setSpriteFrame(this.curFrameIndex + 1);
                this.m_dt = 0;
            }
        }
    }

    private setSpriteFrame(frameIndex:number) {
        if (this.maxFrameIndex != 0 && frameIndex >= this.maxFrameIndex) {
            frameIndex = 0;

            if (this._playEndHandler != null) {
                this._playEndHandler.execute();

                //结束时有可能被移除了
                if (!this.isPlaying) {
                    return;
                }
            }
        }

        let spriteFrame = this.getSprite(frameIndex);

        this.curFrameIndex = frameIndex;
        if (spriteFrame && spriteFrame.isValid && this.sprite && this.sprite.isValid) {
            this.sprite.spriteFrame = spriteFrame;
        } else {
            cc.log('setSpriteFrame error');
        }
    }

    private getSprite(frameIndex:number):cc.SpriteFrame {
        return this.spriteFrames[frameIndex];
    }

    private calcSpriteFrames() {
        if (this._spriteAtlas == null) return;
        if (this._frameName == null) {
            this.spriteFrames = this._spriteAtlas.getSpriteFrames();
        } else {
            let spriteFrames:cc.SpriteFrame[] = this._spriteAtlas.getSpriteFrames();
            let tempList:cc.SpriteFrame[] = [];
            spriteFrames.forEach(element => {
                if (element.name.indexOf(this._frameName) != -1) {
                    tempList.push(element);
                }
            });
            this.spriteFrames = tempList;
        }

        let sp:cc.Sprite = this.node.getComponent(cc.Sprite);
        sp.spriteFrame = this.spriteFrames[0];
    }

    protected doGamePause(boo:Boolean) {
        this.isPlaying = !boo;
    }
}