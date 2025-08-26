// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EResPath } from "../common/EResPath";
import NewMonsterTowerManager from "../NewMonsterTowerManager";
import { HeadComp, HeadInfo } from "../ui/headPortrait/HeadComp";
import BaseItem from "../utils/ui/BaseItem";
import { UiManager } from "../utils/UiMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewMonsterCatTips extends BaseItem {
    // @property(cc.Node)
    // catTxt: cc.Node = null;

    // @property(cc.Node)
    // monsterTxt: cc.Node = null;

    @property(HeadComp)
    headIcon: HeadComp = null;

    setData(data: any) {
        super.setData(data);

        this.headIcon.isSelf = false;
        this.headIcon.isTujianReward = true;
        //头像		
        let headInfo: HeadInfo = {
            nfaceframeid: 0,
            nfaceid: data.targetId,
            szmd5facefile: ""
        };
        this.headIcon.headInfo = headInfo;

        // this.monsterTxt.active = this.data.tipsType === 0;
        // this.catTxt.active = !this.monsterTxt.active;
    }

    show() {
        cc.tween(this.node).set({ scale: 0 }).to(0.3, { scale: 1 }, { easing: "backOut" }).call(() => {
            NewMonsterTowerManager.getInstance().onTipsShow(this);
        }).start();
    }

    hide() {
        cc.Tween.stopAllByTarget(this);
        cc.tween(this.node).to(0.3, { scale: 0 }, { easing: "backIn" }).call(() => {
            NewMonsterTowerManager.getInstance().onTipsHide(this);
        }).start();
    }

    public onClick() {
        UiManager.showDialog(EResPath.NEW_MOSNTER_TOWER_TIPS_VIEW, this.data);
        this.hide();
    }
}
