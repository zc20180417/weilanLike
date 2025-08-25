const {ccclass, property,menu} = cc._decorator;

/**
 * 对话框
 */
@ccclass
@menu("effect/FrameEffectAuto")
export default class FrameEffectAuto extends cc.Component {

    @property(cc.SpriteAtlas)
    spriteAtlas:cc.SpriteAtlas = null;

    @property(cc.Sprite)
    sprite:cc.Sprite = null;

    @property
    frameInterval:number = 10;

    @property
    frameName:string = "";

    @property(cc.Boolean)
    isPlayingOnLoad:boolean = true;

    private curFrameIndex:number = -1;
    private m_dt:number = 0;
    private maxFrameIndex:number = 0;
    private isPlaying:boolean = true;

    onLoad() {
        if (this.isPlayingOnLoad) {
            this.play();
        } else {
            this.gotoAndStop(0);
        }
    }

    play() {
        this.node.active = true;
        this.curFrameIndex = 0;
        this.isPlaying = true;
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

    private getSprite(frameIndex:number):cc.SpriteFrame {
        return this.spriteAtlas.getSpriteFrame(this.frameName + (frameIndex + 1));
    }

}