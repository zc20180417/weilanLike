// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseItem from "../utils/ui/BaseItem";
import TopUI from "../logic/playUI/TopUI";
import { CpTask } from "../logic/cpTask/CpTask";
import { GS_SceneOpenWar_WarTaskData, GS_SceneWarFinish } from "../net/proto/DMSG_Plaza_Sub_Scene";
import Game from "../Game";
import { MatUtils } from "../utils/ui/MatUtils";
import { StringUtils } from "../utils/StringUtils";
import { DiaAndRedPacketTipsViewData } from "./tips/DiaAndRedPacketTipsView";
import { UiManager } from "../utils/UiMgr";
import { EResPath } from "../common/EResPath";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SuccFailTaskItem extends BaseItem {

    // LIFE-CYCLE CALLBACKS:
    @property(cc.Node)
    taskStateNode: cc.Node = null;
    // onLoad () {}

    @property(cc.Label)
    taskDesTxt: cc.Label = null;

    @property(cc.Label)
    diamondTxt: cc.Label = null;

    @property(cc.Sprite)
    diamondSprite: cc.Sprite = null;

    @property(cc.Animation)
    starAni: cc.Animation = null;

    _sceneWarFinishData: GS_SceneWarFinish = null;

    _aniDelay: number = 0;

    setData(data: any, index?: number) {
        super.setData(data, index);
        //任务描述
        if (!data) return;

        let cpTask: CpTask = data as CpTask;
        let cpCfg: GS_SceneOpenWar_WarTaskData = cpTask.cfg;

        this.taskDesTxt.string = cpCfg.szdes;

        let enableAni: boolean = this.enabledPlayStarAni(index);
        //钻石
        this.diamondTxt.string = "+ " + cpCfg.nrewardgoodsnums;
        data.isSuccess();
        if (data.isSuccess()) {
            MatUtils.setSpriteNormal(this.diamondSprite);
            // this.diamondSprite.spriteFrame = this.diamondSucc;
            if (!enableAni) {
                this.taskStateNode.active = true;
            } else {
                this.taskStateNode.active = false;
            }
            // this.diamondTxt.node.color = cc.color("#ffffff");
            // this.taskDesTxt.node.color = cc.color("#ffffff")
        } else {
            MatUtils.setSpriteGray(this.diamondSprite);
            // this.diamondSprite.spriteFrame = this.diamondFail;
            this.taskStateNode.active = false;
            this.diamondTxt.node.color = cc.color("#bbbbbb");
            this.taskDesTxt.node.color = cc.color("#bbbbbb");
        }

        if (enableAni) {
            this.scheduleOnce(this.playStarAni, this._aniDelay);
        }

    }

    setSceneWarFinishData(data: GS_SceneWarFinish) {
        this._sceneWarFinishData = data;
    }

    public enabledPlayStarAni(index: number): boolean {
        //星星动画  
        let oldStar = Game.sceneNetMgr.checkTaskComplete(this._sceneWarFinishData.uoldscoreflag, index + 1);
        let newStar = Game.sceneNetMgr.checkTaskComplete(this._sceneWarFinishData.uscoreflag, index + 1);
        return newStar && !oldStar;
    }

    public setAniDelay(delay: number) {
        this._aniDelay = delay;
    }

    private playStarAni() {
        this.taskStateNode.active = true;
        //星星动画  
        this.starAni.play();
    }

    public clickDiamond(event?: any) {
        if (!event) {
            event = { target: this.diamondSprite.node };
        }
        let str = "";
        let tempStr;
        str += StringUtils.richTextSizeFormat(StringUtils.richTextColorFormat("钻石：", "#995124"), 24);
        tempStr = "\n       完成每一个关卡任务都将获得一定数量的钻石，钻石可以用于";
        str += StringUtils.richTextSizeFormat(StringUtils.richTextColorFormat(tempStr, "#a75f49"), 20);
        tempStr = "商城中购买技能、宝箱等游戏道具，是获取猫咪的主要资源";
        str += StringUtils.richTextSizeFormat(StringUtils.richTextColorFormat(tempStr, "#fd4801"), 20);
        let data: DiaAndRedPacketTipsViewData = {
            node: event.target,
            tips: str
        };
        UiManager.showDialog(EResPath.DIAANDREDPACKET_TIPS_VIEW, data);
    }
}
