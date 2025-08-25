// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Game from "../../Game";
import { Handler } from "../../utils/Handler";
import { DragonBonesComp } from "../../logic/comps/animation/DragonBonesComp";
import SysMgr from "../../common/SysMgr";
import DragonShader from "./dragonShader";
import TowerStarPageItem from "./towerStarPageItem";

const { ccclass, property , menu} = cc._decorator;

@ccclass
@menu("Game/tower/CatDragonBoneUi")
export default class CatDragonBoneUi extends cc.Component {

    @property
    timeSpace: number = 0;

    @property
    dragonUrl: string = "";

    @property(cc.Material)
    dragonMaskMat: cc.Material = null;

    @property(cc.Material)
    dragonMat: cc.Material = null;


    _isUnlock: boolean = false;

    _enablePlayAni: boolean = true;

    _animationState: dragonBones.AnimationState = null;

    _dragonBoneNode: cc.Node = null;

    _dragonBonesCom: DragonBonesComp = null;

    _color: cc.Color = null;

    _enableBtn: boolean = true;

    unlockProgress: number = 0;//解锁进度
    @property
    maskColor: string = '';//未解锁时遮罩颜色

    private _showLock: boolean = true;

    private _ctrl: TowerStarPageItem;
    private _level: number = 1;
    public setLevel(level: number) {
        this._level = level;
    }

    setPageCtrl(ctrl: TowerStarPageItem) {
        this._ctrl = ctrl;
    }

    setDragonUrl(url: string, showLock: boolean = true) {
        if (url == this.dragonUrl) return;
        if (this._dragonBoneNode) {//回收骨骼动画
            if (this._ctrl) {
                this._ctrl.putPool(this.dragonUrl, this._dragonBoneNode);
            } else {
                this._dragonBoneNode.removeFromParent();
                this._dragonBoneNode.destroy();
            }
            this._dragonBoneNode = null;
        }
        this.dragonUrl = url;
        this._showLock = showLock;
        this.load(url);
    }

    getDargonUrl(): string {
        return this.dragonUrl;
    }

    load(url: string) {
        if (url === "") return;
        let node = this._ctrl && this._ctrl.getTowerNode(url);
        if (node) {
            this._dragonBoneNode = node;
            this.refresh();
        } else {
            Game.resMgr.loadRes(url, cc.Prefab, Handler.create(this.onLoadComplete, this));
        }
    }
    /**
     * 资源加载结束
     */
    onLoadComplete(data: cc.Prefab, path: string) {
        Game.resMgr.addRef(path);
        if (!data || path !== this.dragonUrl) return;

        this._dragonBoneNode = cc.instantiate(data);
        //this.node.removeAllChildren();
        this.refresh();
    }

    private refresh() {
        this.node.addChild(this._dragonBoneNode);
        this._dragonBonesCom = this._dragonBoneNode.getComponent(DragonBonesComp);
        this._dragonBonesCom.aniCompletedHandler = Handler.create(this.playEndHandler, this);
        this._dragonBonesCom.catDragonBoneUiHandler = Handler.create(this.catDragonBonesUiHandler, this);
        this._dragonBonesCom.setCurrLevel(this._level);
        this._dragonBonesCom.setOriginAngle(0);
        this._dragonBoneNode.setPosition(this._dragonBonesCom.offset);
        // this.setColor(this._color);
        this.enableBtn(this._enableBtn);

        let dragonShader = this._dragonBoneNode.getComponent(DragonShader);
        if (!this._isUnlock && this._showLock) {//显示进度遮罩
            if (!dragonShader) {
                dragonShader = this._dragonBoneNode.addComponent(DragonShader);
            }
            // if (this.lockColor) {
            //     dragonShader.setMaskColor(this.lockColor.toHEX());
            // }
            dragonShader.setDragonMaskMat(this.dragonMaskMat);
            dragonShader.setDragonMat(this.dragonMat);
            dragonShader.setMaskColor(this.maskColor);
            dragonShader.setUnlockProgress(this.unlockProgress);
            dragonShader.showMask(this._dragonBonesCom.dragon.premultipliedAlpha);
        } else {
            dragonShader && dragonShader.hideMask();
        }
    }

    private playEndHandler(event) {
        let state = event.animationState;
        let idle2Name = this._dragonBonesCom.getAnimationName("idle2");
        if (state.name == idle2Name) {
            this.playAction("idle");
            this.resetSchedule();
        }
    }

    private catDragonBonesUiHandler() {
        this._dragonBonesCom.setLevel(this._level);
        this.playAction("idle");
        this.resetSchedule();
        if (!this._enablePlayAni) {
            let armature = this._dragonBonesCom.getArmature();
            armature.animation.reset();
        }
    }

    onDestroy() {
        SysMgr.instance.clearTimer(Handler.create(this.scheduleCallback, this), true);
        Game.resMgr.removeLoad(this.dragonUrl, Handler.create(this.onLoadComplete, this));
        Handler.dispose(this);
    }

    scheduleCallback() {
        this.playAction("idle2", false);
    }

    resetSchedule() {
        SysMgr.instance.doOnce(Handler.create(this.scheduleCallback, this), 5000, true);
    }

    playAction(name: string, loop: boolean = true) {
        if (!this._enablePlayAni) return;
        this._dragonBonesCom.playAction(name, loop);
    }

    enableBtn(enableBtn: boolean) {
        this._enableBtn = enableBtn;
        if (this._dragonBonesCom) {
            this._dragonBonesCom.enableBtn(enableBtn);
        }
    }

    public enablePlayAni(enable: boolean) {
        this._enablePlayAni = enable;
    }

    public lock() {
        // this.setColor(cc.color(0x000000));
        this.enablePlayAni(false);
        this.enableBtn(false);
        this._isUnlock = false;
    }

    public unlock() {
        // this.setColor(cc.color(0xffffff));
        this.enablePlayAni(true);
        this.enableBtn(false);
        this._isUnlock = true;
    }

    public unlockWithoutAni() {
        // this.setColor(cc.color(0xffffff));
        this.enablePlayAni(false);
        this.enableBtn(false);
        this._isUnlock = true;
    }

    /**
     * 设置解锁进度
     * @param progress 
     */
    public setUnlockPercent(progress: number) {
        this.unlockProgress = progress;
    }

    /**
     * 设置未解锁mask颜色
     * @param color 
     */
    public setMaskColor(color: string) {
        this.maskColor = color;
    }

    public hideMask() {
        if (!this._dragonBoneNode) return;
        let dragonShader = this._dragonBoneNode.getComponent(DragonShader);
        dragonShader && dragonShader.hideMask();
    }
}
