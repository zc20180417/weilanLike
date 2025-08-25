// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Game from "../../Game";
import { Handler } from "../../utils/Handler";
import { MathUtils } from "../../utils/MathUtils";
import BaseItem from "../../utils/ui/BaseItem";
import JingCaiRewardIcon, { RewardIconType } from "./JingCaiRewardIcon";
import JingCaiTaskIcon, { TaskIconType } from "./JingCaiTaskIcon";

const { ccclass, property } = cc._decorator;

@ccclass
export default class JingCaiListItem extends BaseItem {
    @property(JingCaiRewardIcon)
    rewardIcons: JingCaiRewardIcon[] = [];

    @property(JingCaiTaskIcon)
    taskIcon: JingCaiTaskIcon = null;

    @property(cc.Node)
    btnNode: cc.Node = null;

    @property(cc.Node)
    selectedBg: cc.Node = null;

    @property(cc.SpriteFrame)
    bgs: cc.SpriteFrame[] = [];

    @property(cc.Sprite)
    bg: cc.Sprite = null;

    @property(cc.SpriteFrame)
    txts: cc.SpriteFrame[] = [];

    @property(cc.Sprite)
    txt: cc.Sprite = null;

    @property(cc.Node)
    mask: cc.Node = null;

    public setData(data, index) {
        super.setData(data, index);

        this.refresh();
    }

    public refresh() {
        // if (!this.data) return;
        // let data = this.data as GS_BountyData_BountyWarItem;
        // //背景
        // let index = MathUtils.clamp(data.btdlfflv - 1, 0, this.bgs.length - 1);
        // this.bg.spriteFrame = this.bgs[index];
        // this.txt.spriteFrame = this.txts[index];

        // let playType = TaskIconType.NORMAL;
        // if (data.btisopenmap == 1) {
        //     playType = TaskIconType.FREE;
        // } else {
        //     playType = data.btplaytype - 1;
        // }

        // //任务图标
        // this.taskIcon.setIconType(playType);

        //奖励图标
        // let lvCfg = Game.bountyMgr.getLevelCfg(data.btdlfflv);
        // if (lvCfg) {
        //     this.rewardIcons.forEach(el => el.node.active = false);
        //     let index = 0;
        //     for (let i = 0, len = lvCfg.btclientshowdropper.length; i < len; i++) {
        //         if (lvCfg.btclientshowdropper[i] && index < this.rewardIcons.length) {
        //             this.rewardIcons[index].node.active = true;
        //             this.rewardIcons[index].setData(i, lvCfg.btclientshowdropper[i]);
        //             index++;
        //         }
        //     }
        // }

        // this.btnNode.active = !!data.btfinish;
    }

    public onSelect() {
        this.selectedBg.active = true;
        this.mask.active = false;
        this.selectedBg.opacity = 50;
        cc.tween(this.selectedBg)
            .by(1, { opacity: 205 })
            .by(1, { opacity: -205 })
            .union()
            .repeatForever()
            .start();
    }

    public unSelect() {
        this.selectedBg.active = false;
        this.mask.active = true;
        cc.Tween.stopAllByTarget(this.selectedBg);
    }

    private getReward() {
        if (!this.data) return;
        Game.bountyMgr.getReward(this.data.nwarid);
    }
}
