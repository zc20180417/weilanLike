// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { QUALITY_COLOR } from "../common/AllEnum";
import { SCENE_NAME } from "../common/SceneMgr";
import Game from "../Game";
import Dialog from "../utils/ui/Dialog";

const { ccclass, property } = cc._decorator;

const TIPS_POSY = {
    DEFAULT_Y: 273.94,
    HALL_Y: 273.94,
    GAMESCENE_Y: 269,
    MAP_Y: 321
}

const TIPS_COLOR = {
    DEFAULT: "#FFFFFF",
    USER: "#6AD456",
    OTHER: "#FB9B3F"
}

@ccclass
export default class RollTips extends Dialog {
    @property
    repeats: number = 1;

    @property(cc.RichText)
    text: cc.RichText = null;

    @property(cc.Node)
    mask: cc.Node = null;

    @property
    rollSpeed: number = 5;

    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Node)
    laba: cc.Node = null;

    @property(cc.Node)
    tipsNode: cc.Node = null;

    private _aniTime: number = 1;

    beforeShow() {
        this.tipsNode.y = this.getTipsPosy();
        this.laba.opacity = 0;
        this.bg.scaleX = 0;
        this.playStartAni();
    }

    playStartAni() {
        cc.tween(this.bg).to(this._aniTime, { scaleX: 1 }, { easing: "quartOut" }).call(this.onStartAniEnd, this).start();
    }

    onStartAniEnd() {
        cc.tween(this.laba).to(0.15, { opacity: 255 }).start();
        this.showTips();
    }

    playEndAni() {
        cc.tween(this.laba).to(0.15, { opacity: 0 }).start();
        cc.tween(this.bg).to(this._aniTime, { scaleX: 0 }, { easing: "quartIn" }).call(this.onEndAniEnd, this).start();
    }

    onEndAniEnd() {
        this.hide();
    }

    showTips() {
        let queue = Game.chatMgr.getSystemQueue();
        if (queue.length == 0) {
            this.playEndAni();
            return;
        }
        this.text.string = this.formatStr(queue.shift());
        let width = this.text.node.width + this.mask.width;
        let t = width / this.rollSpeed;
        this.text.node.x = this.mask.width * 0.5;
        let tween = new cc.Tween()
            .by(t, { x: -width })
            .call(() => {
                this.text.node.x = this.mask.width * 0.5;
            });
        cc.tween(this.text.node).repeat(this.repeats, tween).call(() => {
            this.showTips();
        }).start();
    }

    private getTipsPosy(): number {
        let y = TIPS_POSY.DEFAULT_Y;
        let scene = cc.director.getScene();
        let sceneName = (scene && scene.name) || "";
        switch (sceneName) {
            case "MainScene":
            case "PvPScene":
                y = TIPS_POSY.GAMESCENE_Y;
                break;
            case SCENE_NAME.Hall:
                y = TIPS_POSY.HALL_Y;
                break;
            case "Map":
                y = TIPS_POSY.MAP_Y
                break;
        }
        return y;
    }

    private formatStr(str: string): string {
        let i = 1, index = str.indexOf("<b1>");
        while (index != -1) {
            str = str.replace("<b" + i + ">", "<color=" + this.getColor(i) + ">");
            str = str.replace("</b>", "</color>");
            i++;
            index = str.indexOf("<b" + i + ">");
        }

        index = str.indexOf("<q");
        let quality = -1;
        
        while(index != -1) {
            quality = Number(str.charAt(index + 2)); 
            str = str.replace("<q" + quality + ">" , "<color=" + QUALITY_COLOR[quality + 1] + ">");
            str = str.replace("</q>" , "</color>");
            index = str.indexOf("<q");
        }


        return str;
    }

    private getColor(index: number): string {
        if (index == 1) return TIPS_COLOR.USER;
        else return TIPS_COLOR.OTHER;
    }
}
