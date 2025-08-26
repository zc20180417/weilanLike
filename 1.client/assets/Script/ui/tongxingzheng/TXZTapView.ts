// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


import { EResPath } from "../../common/EResPath";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import GlobalVal from "../../GlobalVal";
import { BattlePassConfig } from "../../net/mgr/BattlePassMgr";
import { GS_SceneBattlePassConfig_PassItem, GS_SceneBattlePassPrivate_Item } from "../../net/proto/DMSG_Plaza_Sub_BattlePass";
import { GameEvent } from "../../utils/GameEvent";
import { StringUtils } from "../../utils/StringUtils";
import List from "../../utils/ui/List";
import { UiManager } from "../../utils/UiMgr";
import TapPageItem from "../dayInfoView/TapPageItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TXZTapView extends TapPageItem {
    @property(List)
    list: List = null;

    @property(cc.Node)
    btnNode: cc.Node = null;

    @property(cc.Label)
    timeLabel:cc.Label = null;

    @property([cc.Node])
    lineNodes:cc.Node[] = [];

    @property([cc.Node])
    labelNodes:cc.Node[] = [];

    @property(cc.Node)
    barNode:cc.Node = null;

    @property(cc.Color)
    normalColor:cc.Color = null;

    @property(cc.Color)
    progressColor:cc.Color = null;


    private _listDatas: { nid: number, data: GS_SceneBattlePassConfig_PassItem , perfectFinishNormalWarCount:number , showProgress:boolean }[] = null;

    public setData(data: any, index?: number): void {
        super.setData(data, index);
        if (!this.data) return;
        let config = data as BattlePassConfig;

        let passPrivatItem:GS_SceneBattlePassPrivate_Item = Game.battlePassMgr.getBattlePassPrivateData(config.baseItem.nid);
        if (passPrivatItem.nopentimes > 0) {
            this.timeLabel.string = StringUtils.formatTimeToDHM(passPrivatItem.nopentimes + config.baseItem.nvalidtimes -  GlobalVal.getServerTime() * 0.001);
        }

        this._listDatas = [];
        let len = config.passItems.length;
        let temp:GS_SceneBattlePassConfig_PassItem;
        let showProgress:boolean = false;
        let perfectFinishNormalWarCount = Game.sceneNetMgr.getPerfectFinishNormalWarCount(config.baseItem.nworldid);
        for (let i = 0 ; i < len ; i++) {
            temp = config.passItems[i];
            let itemShowProgress:boolean = false;
            if (!showProgress) {
                showProgress = itemShowProgress = perfectFinishNormalWarCount < temp.nfullhpwarcount;
            }
            this._listDatas.push({ nid: config.baseItem.nid, 
                data: temp , 
                perfectFinishNormalWarCount:perfectFinishNormalWarCount,
                showProgress:itemShowProgress,
            });
        }
    

    }

    onLoad(): void {
        GameEvent.on(EventEnum.ON_BATTLE_PASS_PRIVATE_DATA, this.onBattlePassPrivateData, this);
    }

    protected onDestroy(): void {
        GameEvent.targetOff(this);

    }

    refresh(): void {
        this.list.array = this._listDatas;
        // this.coast.string = (this.data as BattlePassConfig).baseItem.nrmb.toString();
        let index = Game.battlePassMgr.getFirstUnreciveIndex(this.data.baseItem.nid);
        this.list.setStartIndex(index - 2 < 0 ? 0 : index - 2);
        const perfectCount = Game.sceneNetMgr.getPerfectFinishNormalWarCount(this.data.baseItem.nworldid);
        this.barNode.active = perfectCount > 0;
        this.barNode.width = 787.5 * (perfectCount / 40);
        const len = this.labelNodes.length;

        for (let i = 0 ; i < len ; i++) {
            let flag = i == 0 ? 5 * i < perfectCount : 5 * i <= perfectCount;
            this.labelNodes[i].color = this.lineNodes[i].color = flag ? this.progressColor : this.normalColor;        
        }

    }

    private onBattlePassPrivateData(data: GS_SceneBattlePassPrivate_Item) {
        if (this.data.baseItem.nid === data.nid) {
            this.list.refresh();

            if (data.nopentimes > 0) {
                this.timeLabel.string = StringUtils.formatTimeToDHM(data.nopentimes + this.data.baseItem.nvalidtimes -  GlobalVal.getServerTime() * 0.001);
            }
        }
    }


    onClick() {
        UiManager.showDialog(EResPath.CHAPTER_CUPS_VIEW, { mapId: this.data.baseItem.nworldid , isNight: false });
    }

}
