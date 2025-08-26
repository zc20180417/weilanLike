// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { TASK_TYPE } from "../../net/socket/handler/MessageEnum";
import { EVENT_REDPOINT } from "../../redPoint/RedPointSys";
import { GameEvent } from "../../utils/GameEvent";
import { GoodsBox } from "../../utils/ui/GoodsBox";
import ImageLoader from "../../utils/ui/ImageLoader";
import List from "../../utils/ui/List";
import { NodeUtils } from "../../utils/ui/NodeUtils";
import Utils from "../../utils/Utils";
import TapPageItem from "../dayInfoView/TapPageItem";
import { GoodsItemData } from "../newhand_book/GoodsItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TaskTapPage extends TapPageItem {
    @property(List)
    list: List = null;

    @property(ImageLoader)
    imgLoader:ImageLoader = null;

    @property(cc.Label)
    curValueLabel:cc.Label = null;

    @property(cc.Sprite)
    progressBar:cc.Sprite = null;

    @property([cc.Node])
    boxList:cc.Node[] = [];

    @property([cc.Label])
    labelList:cc.Label[] = [];

    @property(GoodsBox)
    rewardBox:GoodsBox = null;

    @property(cc.Node)
    rewardBoxNode:cc.Node = null;

    @property(cc.Node)
    rewardMaskBg:cc.Node = null;

    @property(cc.Node)
    rewardBg:cc.Node = null;

    @property(cc.Node)
    effectNode:cc.Node = null;

    @property(cc.SpriteFrame)
    boxCloseSf:cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    boxOpenSf:cc.SpriteFrame = null;


    private effectDic:{[key:number] : cc.Node} = {};
    private taskDatas: Array<any> = null;
    private effectList:cc.Node[] = [];
    start() {
        super.start();
        this.effectList[0] = this.effectNode;
    }

    onEnable() {
        GameEvent.on(EventEnum.TASK_SCORE_REWARD_CHANGE , this.refreshScore , this);
        const len = this.boxList.length;
        for (let i = 0 ; i < len ; i++) {
            Game.redPointSys.registerRedPointSub(EVENT_REDPOINT.TASK_DAILY_BOX , i.toString() , this.boxList[i]);
        }
    }

    onDisable() {
        GameEvent.off(EventEnum.TASK_SCORE_REWARD_CHANGE , this.refreshScore , this);
        const len = this.boxList.length;
        for (let i = 0 ; i < len ; i++) {
            Game.redPointSys.unregisterRedPointSub(EVENT_REDPOINT.TASK_DAILY_BOX , i.toString() , this.boxList[i]);
        }
    }

    refresh() {
        if (0 == this.index) {
            this.taskDatas = Game.taskMgr.getAllUnfinishedTask(TASK_TYPE.TASK_TYPE_DAY)
        } else if (1 == this.index) {
            this.taskDatas = Game.taskMgr.getAllUnfinishedTask(TASK_TYPE.TASK_TYPE_ACHIEVEMENT);
        }
        if (!this.taskDatas) return;
        this.list.array = this.taskDatas;

        if (this.index == 1) return;

        let goodsid = Game.taskMgr.getTaskRewardGoodsId();
        let goodsInfo = Game.goodsMgr.getGoodsInfo(goodsid);
        if (goodsInfo) {
            this.imgLoader.setPicId(goodsInfo.npacketpicid);
        }

        this.refreshScore();
    }

    private refreshScore() {
        if (this.index == 1) return;
        let curValue = Game.taskMgr.taskView.nscore;
        this.curValueLabel.string = curValue.toString();
        let rewards = Game.taskMgr.getTaskScoreRewards();
        if (!rewards || rewards.length == 0) return;
        const maxScore = rewards[4].nneedscore;
        this.progressBar.fillRange = curValue / maxScore;
        let scorerewardflag = Game.taskMgr.taskView.nscorerewardflag;

        Object.values(this.effectDic).forEach(element => {
            if (this.effectList.indexOf(element) == -1) {
                element.active = false;
                this.effectList.push(element);
            }
        });

        const len = Math.min(rewards.length , this.boxList.length);
        let box:cc.Node;
        for (let i = 0 ; i < len ; i++) {
            let flag = Utils.checkBitFlag(scorerewardflag , i);
            box = this.boxList[i];
            // .active = this.labelList[i].node.active = !flag;

            let sprite = box.getComponent(cc.Sprite);
            let btn = box.getComponent(cc.Button);
            NodeUtils.enabledGray(btn , !flag);
            sprite.spriteFrame = !flag ? this.boxCloseSf : this.boxOpenSf;

            this.labelList[i].string = rewards[i].nneedscore.toString();

            if (rewards[i].nneedscore <= curValue && !flag) {
                let effect = this.getEffect();
                effect.active = true;
                effect.x = box.x;
                this.effectDic[i] = effect;
            }

        }

    }



    onBoxClick(e:any , index:number) {
        cc.log(e , index);
        let rewards = Game.taskMgr.getTaskScoreRewards();
        if (!rewards || !rewards[index] || !Game.taskMgr.taskView) return;
        let item = rewards[index];
        let scorerewardflag = Game.taskMgr.taskView.nscorerewardflag;
        if (!Utils.checkBitFlag(scorerewardflag , index) && item.nneedscore <= Game.taskMgr.taskView.nscore) {
            Game.taskMgr.reqGetScoreReward(index);
        }  else {
            this.rewardBoxNode.active = true;
            this.rewardBoxNode.x = this.boxList[index].x;
            this.rewardMaskBg.active = true;

            let goodsItemDataList:GoodsItemData[] = [];
            let len = item.ngoodsids.length;
            for (let i = 0 ; i < len ; i++) {
                let goodsid = item.ngoodsids[i];
                if (goodsid > 0) {
                    goodsItemDataList.push({
                        goodsId:goodsid,
                        nums:item.ngoodsnums[i],
                        prefix:'x',
                    })
                }
            }

            this.rewardBox.array = goodsItemDataList;
            this.rewardBg.width = goodsItemDataList.length == 2 ? 158 : 220;
        }
    }

    onRewardbgClick() {
        this.rewardMaskBg.active = false;
        this.rewardBoxNode.active = false;
    }

    private getEffect():cc.Node {
        if (this.effectList.length > 0) {
            return this.effectList.pop();
        }

        let newNode = cc.instantiate(this.effectNode);
        this.effectNode.parent.addChild(newNode);
        return newNode;
    }

}
