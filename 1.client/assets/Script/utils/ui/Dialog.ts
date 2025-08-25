
import SoundManager from "../SoundManaget";
import { GameEvent } from "../GameEvent";
import { DialogLayer, UiManager } from "../UiMgr";
import SysMgr from "../../common/SysMgr";
import { EventEnum } from "../../common/EventEnum";
import { StringUtils } from "../StringUtils";
import GlobalVal from "../../GlobalVal";


const { ccclass, property ,menu} = cc._decorator;

// export enum DialogLayer {
//     MID, //中间层
//     BOTTOM,//最下层
//     TOP //最上层
// }

/**
 * 对话框
 */
@ccclass
@menu("Game/ui/Dialog")
export default class Dialog extends cc.Component {

    @property({
        type: cc.Node,
        tooltip: '黑色透明背景，添加之后空白处无法点击该对话框层级以下的对象'
    })
    blackLayer: cc.Node = null;

    @property({
        tooltip: '空白处点击是否关闭'
    })
    blackClickHidden: boolean = false;

    @property({
        tooltip: '隐藏时是否销毁'
    })
    autoDestory: boolean = true;

    @property({
        type: cc.Node,
        tooltip: '对话框内容Node'
    })
    content: cc.Node = null;

    @property({
        type: cc.Button,
        tooltip: '关闭按钮'
    })
    closeButton: cc.Button = null;

    // @property({
    //     type: cc.Integer,
    //     max: 3,
    //     min: 1,
    //     step: 1,
    //     tooltip: '动画类型:1-缩放(scale)，2-透明度(opacity), 3-无(none)'
    // })
    // animationType: number = 1;

    @property({
        tooltip: '显示或隐藏的时候是否启动缩放动画效果'
    })
    scaleAnimate: boolean = true;

    @property({
        tooltip: '显示或隐藏的时候是否启动淡入淡出动画效果'
    })
    fadeAnimate: boolean = true;

    @property({
        tooltip: '显示或隐藏的时候是否启动坐标动画效果'
    })
    posAnimate: boolean = false;

    @property({
        type: cc.Float,
        min: 0,
        tooltip: '动画时长'
    })
    animationTime: number = 0.25;

    @property({
        min: 0,
        tooltip: '动画效果类型\n(easeBackIn、easeBounceIn等，详见cc.easexxx)'
    })
    easing: string = "backOut";

    @property({
        tooltip: '是否播放音效'
    })
    bPlaySound: boolean = true;

    @property({
        tooltip: '是否监听退出按钮'
    })
    bOnEsc: boolean = true;

    @property({
        tooltip: "显示时是否隐藏底层dialog"
    })
    isHideBottomDialog: boolean = false;

    @property({
        tooltip: "打开时是否暂停游戏"
    })
    pauseGame: boolean = false;

    @property
    scale: number = 0.6;

    baseData: any = null;

    /**面板path */
    path: string = '';
    private isRemoving: boolean = false;
    //动坐标动画效果时的坐标
    startPos: cc.Vec2 = null;
    endPos: cc.Vec2 = cc.Vec2.ZERO;
    isShowAniEnd:boolean = false;
    private layerType: DialogLayer = null;//弹窗层类型
    private preSize: cc.Size = cc.Size.ZERO;

    public setLayerType(layerType: DialogLayer) {
        this.layerType = layerType;
    }

    public getLayerType(): DialogLayer {
        return this.layerType;
    }

    protected dialogName: string = "dialog";//面板名称

    public setDialogName(name: string) {
        if (StringUtils.isNilOrEmpty(name)) return;
        this.dialogName = name;
    }

    public getDialogName(): string {
        return this.dialogName;
    }
    //暂时先把按esc键盘关闭界面的功能去掉
    //private escHandler: Handler = new Handler(() => { this.hide(); return true }, this);

    onLoad() {

    }

    start() {

    }

    // initShow() {
    //     this.node.setContentSize(cc.winSize);
    //     this.baseBeforeShow();
    //     this.beforeShow();
    //     this.show();
    //     this.isRemoving = false;

    //     if (this.pauseGame) {
    //         SysMgr.instance.pauseGame(this, true);
    //     }
    // }

    onEnable() {
        /*
        if (this.bOnEsc) {
            Game.inputMgr.onEsc(this.escHandler, 0);
        }
        */
    }

    onDisable() {
        /*
        if (this.bOnEsc) {
            Game.inputMgr.offEsc(this.escHandler);
        }
        */
    }

    // private baseBeforeShow() {
    //     if (this.closeButton) {
    //         this.closeButton.node.on("click", this.hide, this);
    //     }

    //     if (this.blackLayer) {
    //         this.blackLayer.setContentSize(cc.winSize);
    //         if (this.blackClickHidden) {
    //             this.blackLayer.on("click", this.hide, this);
    //         }
    //     }
    //     this.addEvent();
    // }

    // private baseBeforeHide() {
    //     if (this.pauseGame) {
    //         SysMgr.instance.pauseGame(this, false);
    //     }

    //     GameEvent.targetOff(this);
    //     this.doHide();
    //     GameEvent.emit(EventEnum.CP_GUIDE_HIDE_VIEW, this.node.name);
    // }

    /**
     * 添加事件
     */
    protected addEvent() {

    }

    // /**执行完缩放淡入动画后 */
    // protected doShow() {

    // }

    // protected doHide() {

    // }

    public setData(data: any) {
        // 子类复写
    }

    public onCloseBtnClick() {
        this.hide();
    }

    // /**
    //  * 移除对话框
    //  * @param ani 是否使用动画效果
    //  */
    // public removeDialog(ani) {
    //     let self: Dialog = this;
    //     if (ani && this.animationTime > 0) {
    //         if (this.isRemoving) return;

    //         this.content.stopAllActions();
    //         let tweenProps: any;
    //         if (this.scaleAnimate) {
    //             tweenProps = this.setTweenProp(tweenProps, "scale", 0);
    //         }

    //         if (this.fadeAnimate) {
    //             tweenProps = this.setTweenProp(tweenProps, "opacity", 0);
    //         }

    //         if (this.posAnimate && this.startPos) {
    //             tweenProps = this.setTweenProp(tweenProps, "x", this.startPos.x);
    //             tweenProps = this.setTweenProp(tweenProps, "y", this.startPos.y);
    //         }

    //         if (tweenProps) {
    //             cc.tween(this.content).to(this.animationTime, tweenProps).call(() => {
    //                 this.removeDialog(false);
    //             }).start();
    //         } else {
    //             self.removeDialog(false);
    //         }
    //         this.isRemoving = true;
    //     } else {


    //     }
    // }

    /**
     * 隐藏面板
     */
    public hide(ani: boolean = true) {
        if (this.isRemoving) return;
        this.isRemoving = true;
        if (this.bPlaySound) SoundManager.instance.playSound("sound/closeDialog");
        // UiManager.hideDialog(this);
        UiManager.onDialogBeforeHide(this);
        this.beforeHide();
        // this.removeDialog(this.scaleAnimate || this.fadeAnimate || this.posAnimate);
        if (ani) {
            this.playHideAni();
        } else {
            this.onHideAniEnd();
        }
    }

    /**
     * 显示面板
     */
    public show() {
        this.isShowAniEnd = false;
        this.preSize.width = cc.winSize.width;
        this.preSize.height = cc.winSize.height;
        this.node.setContentSize(cc.winSize);

        if (this.closeButton) {
            this.closeButton.node.on("click", this.onCloseBtnClick, this);
        }

        if (this.blackLayer) {
            this.blackLayer.color = cc.Color.BLACK;
            this.blackLayer.opacity = 150;
            this.blackLayer.setContentSize(cc.winSize);
            if (this.blackClickHidden) {
                this.blackLayer.on("click", this.hide, this);
            }
        }

        this.addEvent();

        if (this.pauseGame && GlobalVal.checkDialogPauseGame) {
            SysMgr.instance.pauseGame(this.dialogName, true);
        }

        if (this.bPlaySound) SoundManager.instance.playSound("sound/openDialog");
        this.isRemoving = false;

        GameEvent.emit(EventEnum.SHOW_VIEW, this.dialogName);
        this.beforeShow();
        this.playShowAni();
    }

    /**
     * 显示动画播放前执行
     */
    protected beforeShow() {

    }

    /**
     * 显示动画播放完成后执行
     */
    protected afterShow() {

    }

    /**
     * 隐藏动画播放前执行
     */
    protected beforeHide() {

    }

    /**
     * 隐藏动画播放完成后执行
     */
    protected afterHide() {

    }

    /**准备t */
    protected readyDestroy() {
        this.node.destroy();

        GameEvent.emit(EventEnum.DESTROY_DIALOG, this.path);
    }

    /**
     * 播放显示动画
     */
    protected playShowAni() {
        if (this.animationTime > 0) {
            this.content.stopAllActions();

            let tweenProps: any;

            if (this.scaleAnimate) {
                this.content.scale = 0.0;
                tweenProps = this.setTweenProp(tweenProps, "scale", this.scale);
            }
            if (this.fadeAnimate) {
                this.content.opacity = 0.0;
                tweenProps = this.setTweenProp(tweenProps, "opacity", 255);
            }

            if (this.posAnimate && this.startPos) {
                this.content.x = this.startPos.x;
                this.content.y = this.startPos.y;
                tweenProps = this.setTweenProp(tweenProps, "x", this.endPos.x);
                tweenProps = this.setTweenProp(tweenProps, "y", this.endPos.y);
            }

            if (tweenProps) {
                cc.tween(this.content).to(this.animationTime, tweenProps, { easing: this.easing }).call(() => {
                    this.onShowAniEnd();
                }).start();
            } else {
                // this.content.scale = 1;
                // this.content.opacity = 255;
                this.onShowAniEnd();
            }

        } else {
            this.onShowAniEnd();
        }
    }

    /**
     * 显示动画播放结束
     */
    protected onShowAniEnd() {
        this.isShowAniEnd = true;
        GameEvent.emit(EventEnum.AFTER_SHOW_DIALOG, this.dialogName);
        this.afterShow();
    }

    /**
     * 播放隐藏动画
     */
     protected playHideAni() {
        if (this.animationTime > 0) {
            // if (this.isRemoving) return;
            this.content.stopAllActions();
            let tweenProps: any;
            if (this.scaleAnimate) {
                tweenProps = this.setTweenProp(tweenProps, "scale", 0);
            }

            if (this.fadeAnimate) {
                tweenProps = this.setTweenProp(tweenProps, "opacity", 0);
            }

            if (this.posAnimate && this.startPos) {
                tweenProps = this.setTweenProp(tweenProps, "x", this.startPos.x);
                tweenProps = this.setTweenProp(tweenProps, "y", this.startPos.y);
            }

            if (tweenProps) {
                cc.tween(this.content).to(this.animationTime, tweenProps).call(() => {
                    this.onHideAniEnd();
                }).start();
            } else {
                this.onHideAniEnd();
            }
            // this.isRemoving = true;
        } else {
            this.onHideAniEnd();
        }
    }

    /**
     * 隐藏动画播放结束
     */
    protected onHideAniEnd() {
        UiManager.onDialogRemove(this);
        if (this.pauseGame && GlobalVal.checkDialogPauseGame) {
            SysMgr.instance.pauseGame(this.dialogName, false);
        }
        GameEvent.targetOff(this);
        this.afterHide();
        GameEvent.emit(EventEnum.CP_GUIDE_HIDE_VIEW, this.dialogName);
        this.isRemoving = false;
        this.node.removeFromParent(this.autoDestory);
        if (this.autoDestory) {
            this.readyDestroy();
        }
        GameEvent.emit(EventEnum.HIDE_DIALOG, this.path);
    }

    private setTweenProp(props: any, propKey: string, value: any): any {
        if (!props) {
            props = {};
        }
        props[propKey] = value;
        return props;
    }

    onDestroy() {
        
    }

    onCanvasResize() {
        if (this.preSize.width != cc.winSize.width || this.preSize.height != cc.winSize.height) {
            this.preSize.width = cc.winSize.width;
            this.preSize.height = cc.winSize.height;
            this.node.setContentSize(cc.winSize);


            if (this.blackLayer) {
                this.blackLayer.setContentSize(cc.winSize);
            }

            this.node.x = cc.winSize.width / 2;
            this.node.y = cc.winSize.height / 2;
        }
    }
}