// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Game from "../../Game";
import TapNavItem from "../dayInfoView/TapNavItem";

const { ccclass, property } = cc._decorator;

const COLOR = {
    SELECTED_COLOR: "#FFFFFF",
    UNSELECTED_COLOR: "#B25A40",
    LOCK_COLOR: "#757575"
}

@ccclass
export default class NewhandNavItem extends TapNavItem {
    @property(cc.Node)
    duigou: cc.Node = null;

    @property(cc.SpriteFrame)
    selectedBg: cc.SpriteFrame = null;

    @property(cc.Sprite)
    bgSp: cc.Sprite = null;

    @property(cc.Label)
    title: cc.Label = null;

    @property(cc.Node)
    lock: cc.Node = null;

    public refresh() {
        this.title.string = "第" + (this.index + 1) + "天";
        this.bgSp.spriteFrame = null;
        this.refreshState();
    }

    public onSelect() {
        this.bgSp.spriteFrame = this.selectedBg;
        this.title.node.color = cc.color().fromHEX(COLOR.SELECTED_COLOR);
    }

    public unSelect() {
        if (this.lock.active) return;
        this.bgSp.spriteFrame = null;
        this.title.node.color = cc.color().fromHEX(COLOR.UNSELECTED_COLOR);
    }

    public refreshState() {
        this.duigou.active = Game.noviceTask.isDayTaskAllFinished(this.index);

        let day = Game.noviceTask.getCurrDay();
        if (this.index >= day) {
            //lock
            this.lock.active = true;
            this.title.node.color = cc.color().fromHEX(COLOR.LOCK_COLOR);
            // this.title.node.active=false;
        } else if (this.lock.active) {
            //unlock
            this.lock.active = false;
            this.title.node.color = cc.color().fromHEX(COLOR.UNSELECTED_COLOR);
        }
    }

    public onClick() {
        let day = Game.noviceTask.getCurrDay();
        if (this.index >= day) {
            return;
        }
        super.onClick();
    }
}
