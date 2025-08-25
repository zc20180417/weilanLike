// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import { EResPath } from "../../common/EResPath";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { ActiveInfo } from "../../net/mgr/SysActivityMgr";
import { GS_SysActivityNew_SysActivityNewTaskItem } from "../../net/proto/DMSG_Plaza_Sub_SysActivity";
import { GOODS_TYPE } from "../../net/socket/handler/MessageEnum";
import { GameEvent } from "../../utils/GameEvent";
import BaseItem from "../../utils/ui/BaseItem";
import { GoodsBox } from "../../utils/ui/GoodsBox";
import ImageLoader from "../../utils/ui/ImageLoader";
import { NodeUtils } from "../../utils/ui/NodeUtils";
import GoodsItem, { GoodsItemData } from "../newhand_book/GoodsItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DailyActiveTapPageItem extends BaseItem {
    @property(cc.Label)
    title: cc.Label = null;

    @property(GoodsBox)
    goodsBox: GoodsBox = null;

    @property(cc.Label)
    rmb: cc.Label = null;

    @property(cc.Node)
    rmbPrefix:cc.Node = null;

    @property(cc.Node)
    btnGroup: cc.Node = null;

    @property(ImageLoader)
    towerImg:ImageLoader = null;

    @property(cc.Sprite)
    bg:cc.Sprite = null;

    @property([cc.SpriteFrame])
    bgSfs:cc.SpriteFrame[] = [];

    private _registerEvent: boolean = false;

    private taskItem: GS_SysActivityNew_SysActivityNewTaskItem = null;

    registerEvent() {
        if (this._registerEvent) return;
        this._registerEvent = true;
        GameEvent.on(EventEnum.ACTIVE_CLOSE, this.activeClose, this);
        GameEvent.on(EventEnum.UPDATE_ACTIVE_DATA, this.updateActive, this);
    }

    onDestroy() {
        GameEvent.targetOff(this);
    }

    setData(data:any , index:number) {
        super.setData(data , index);
        if (!data) return;
        this.refresh();
    }


    refresh() {
        let activeInfo: ActiveInfo = this.data;
        if (!activeInfo ||
            !activeInfo.item ||
            !activeInfo.taskList ||
            activeInfo.taskList.length <= 0 ||
            !Game.sysActivityMgr.getPrivateData(activeInfo.item.nid)) {
            return;
        }
        this.registerEvent();

        let isFinished: boolean = Game.sysActivityMgr.isSubTaskFinished(activeInfo.item.nid, activeInfo.taskList[0].btindex);

        NodeUtils.setNodeGray(this.node , isFinished);

        //取下一个未完成任务
        // let index = isFinished ? 0 : Game.sysActivityMgr.getNextUnfinishedIndex(activeInfo.item.nid);
        this.taskItem = activeInfo.taskList[0];

        //快充配置
        let chargeCfg = Game.actorMgr.getChargeConifg(this.taskItem.nparam1);

        this.rmbPrefix.active = !isFinished;
        this.btnGroup.active = !isFinished;
        // this.state.active = isFinished;

        //title
        this.title.string = activeInfo.item.sztitle;

        if (chargeCfg) {
            //卡片

            let goodsDataList:GoodsItemData[] = [];

            let itemData: GoodsItemData = {
                goodsId: chargeCfg.ngoodsid,
                nums: chargeCfg.ngoodsnum,
                notShowEffect:isFinished,
                prefix:" x"
            }

            goodsDataList.push(itemData);
            let goodsInfo = Game.goodsMgr.getGoodsInfo(chargeCfg.ngoodsid);
            if (goodsInfo) {
                let towerInfo;
                if (goodsInfo.lgoodstype == GOODS_TYPE.GOODSTYPE_RES_UPGRADESTAR) {
                    towerInfo = Game.towerMgr.getTroopBaseInfo(goodsInfo.lparam[0]);
                    if (towerInfo) {
                        this.towerImg.url = EResPath.TOWER_IMG + towerInfo.sz3dpicres;
                    }
                } else if (goodsInfo.lgoodstype == GOODS_TYPE.GOODSTYPE_RES_SKIN) {
                    let fashion = Game.fashionMgr.getFashionInfo(goodsInfo.lparam[1]);
                    if (fashion) {
                        this.towerImg.url = EResPath.TOWER_IMG + fashion.sz3dpicres;
                    }
                }
                this.bg.spriteFrame = this.bgSfs[goodsInfo.btquality - 2] || this.bgSfs[0];
            }

            for (let i = 0, len = chargeCfg.ngivegoodsid.length; i < len; i++) {
                if (chargeCfg.ngivegoodsid[i] > 0) {
                    let itemData: GoodsItemData = {
                        goodsId: chargeCfg.ngivegoodsid[i],
                        nums: chargeCfg.ngivegoodsnums[i],
                        notShowEffect:isFinished,
                        prefix:" x"
                    }
                    goodsDataList.push(itemData);
                }
            }
            this.goodsBox.array = goodsDataList;
            this.rmb.string = isFinished ? '已购买' : chargeCfg.nneedrmb.toString();
        } else {
            this.rmb.string = "";
        }
    }

    public onClick() {
        let activeInfo: ActiveInfo = this.data;
        if (!activeInfo ||
            !activeInfo.item ||
            !this.taskItem) return;
        Game.sysActivityMgr.joinSysActivity(activeInfo.item.nid, this.taskItem.btindex);
    }

    private activeClose(nid: number) {
        let activeInfo: ActiveInfo = this.data;
        if (!activeInfo ||
            !activeInfo.item ||
            activeInfo.item.nid !== nid) return;
        this.btnGroup.active = false;
        // this.state.active = true;
    }

    private updateActive(nid: number) {
        let activeInfo: ActiveInfo = this.data;
        if (!activeInfo ||
            !activeInfo.item ||
            activeInfo.item.nid !== nid) return;

        if (Game.sysActivityMgr.isSubTaskFinished(nid, this.taskItem.btindex)) {
            this.btnGroup.active = false;
            // this.state.active = true;
        } else {
            this.refresh();
        }
    }
}
