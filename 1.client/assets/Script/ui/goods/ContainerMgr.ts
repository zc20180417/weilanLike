import BaseNetHandler from "../../net/socket/handler/BaseNetHandler";
import { CMD_ROOT, GS_PLAZA_MSGID, ECONTAINER, GOODS_ID, GOODS_TYPE } from "../../net/socket/handler/MessageEnum";
import { GS_PLAZA_CONTAINER_MSG, GS_ContainerInfo, GS_ContainerChange, GS_ContainerInfo_ContainerItem } from "../../net/proto/DMSG_Plaza_Sub_Container";
import { Handler } from "../../utils/Handler";
import Game from "../../Game";
import { EventEnum } from "../../common/EventEnum";
import { GS_RewardTips } from "../../net/proto/DMSG_Plaza_Sub_Tips";
import { GS_EmailPickReturn } from "../../net/proto/DMSG_Plaza_Sub_EMaill";
import { GS_GoodsInfoReturn_GoodsInfo } from "../../net/proto/DMSG_Plaza_Sub_Goods";
import { EResPath } from "../../common/EResPath";
import { UiManager } from "../../utils/UiMgr";
import { GameEvent } from "../../utils/GameEvent";


/**
 * 背包
 */
export class ContainerMgr extends BaseNetHandler {

    //GS_ContainerInfo dic
    static addStarCount = 0;
    private _containerInfos: any = {};
    constructor() {
        super(CMD_ROOT.CMDROOT_PLAZA_MSG, GS_PLAZA_MSGID.GS_PLAZA_MSGID_CONTAINER);
    }

    register() {
        this.registerAnaysis(GS_PLAZA_CONTAINER_MSG.PLAZA_CONTAINER_INFO, Handler.create(this.onContainerInfo, this), GS_ContainerInfo);
        this.registerAnaysis(GS_PLAZA_CONTAINER_MSG.PLAZA_CONTAINER_CHANGE, Handler.create(this.onContainerChange, this), GS_ContainerChange);

        GameEvent.on(EventEnum.ON_DIALOG_HIDE, this.onDialogHide, this);
        GameEvent.on(EventEnum.ON_SCENE_LOAD_COMPLETE, this.onSceneLoad, this);
    }

    public filterTipsRetCardBag(data: GS_RewardTips) {
        //过滤自选卡包
        if (data.goodslist) {
            let goodsInfo;
            for (let i = 0, len = data.goodslist.length; i < len; i++) {
                goodsInfo = Game.goodsMgr.getGoodsInfo(data.goodslist[i].sgoodsid);
                if (goodsInfo && goodsInfo.lgoodstype === GOODS_TYPE.GOODSTYPE_CARD_TROOPSCARDBAG) {
                    data.goodslist.splice(i, 1);
                    i--;
                    len--;
                }
            }
        }
    }

    public filterEmailRetCardBag(data: GS_EmailPickReturn) {
        //过滤自选卡包
        if (data.goodlist) {
            let goodsInfo;
            for (let i = 0, len = data.goodlist.length; i < len; i++) {
                goodsInfo = Game.goodsMgr.getGoodsInfo(data.goodlist[i].ngoodsid);
                if (goodsInfo && goodsInfo.lgoodstype === GOODS_TYPE.GOODSTYPE_CARD_TROOPSCARDBAG) {
                    //自选卡包
                    data.goodlist.splice(i, 1);
                    i--;
                    len--;
                }
            }
        }
    }

    needCardBag:boolean = true;
    public checkCardBag() {
        if (UiManager.getDialog(EResPath.CARD_BAG_VIEW) || !this.needCardBag) return;
        let container: GS_ContainerInfo = this._containerInfos[ECONTAINER.ENCONTAINER_PACKET];
        let items: GS_ContainerInfo_ContainerItem[] = container.packet;
        let goodsInfo: GS_GoodsInfoReturn_GoodsInfo;
        for (let v of items) {
            goodsInfo = Game.goodsMgr.getGoodsInfo(v.ngoodsid);
            if (goodsInfo && goodsInfo.lgoodstype === GOODS_TYPE.GOODSTYPE_CARD_TROOPSCARDBAG && v.nnums > 0) {
                UiManager.showDialog(EResPath.CARD_BAG_VIEW, v.ngoodsid);
                break;
            }
        }
    }

    onDialogHide(name: string) {
        let n = EResPath.CARD_BAG_VIEW.split("/").pop();
        if (n === name) {
            this.checkCardBag();
        }
    }

    onSceneLoad(sceneName: string) {
        if (sceneName === "Hall") {
            this.checkCardBag();
        }
    }

    /**
     * 初始化背包信息
     * @param data 
     */
    private onContainerInfo(data: GS_ContainerInfo) {
        cc.log("onContainerInfo:");
        cc.log(data);
        if (data.nactordbid != Game.actorMgr.nactordbid) return;
        this._containerInfos[data.btcontainerid] = data;
    }

    /**
     * @param data 背包物品改变
     */
    private onContainerChange(data: GS_ContainerChange) {
        cc.log("onContainerChange:");
        cc.log(data);

        /*
        __SINT64			(nActorDBID);		//玩家DBID
        __UCHAR				(btContainerID);	//容器ID
        __SLONG				(uContainerData);	//物品ID
        __SLONG				(nNums);			//物品数量(如果为0表示物品被销毁了)
        */
        if (data.nactordbid != Game.actorMgr.nactordbid) return;
        let container: GS_ContainerInfo = this._containerInfos[data.btcontainerid];
        let items: GS_ContainerInfo_ContainerItem[] = container.packet;
        let len = items.length;
        let item: GS_ContainerInfo_ContainerItem;
        let index = -1;
        let oldCount = 0;
        for (let i = 0; i < len; i++) {
            item = items[i];
            if (item.ngoodsid == data.ucontainerdata) {
                index = i;
                if (data.nnums == 0) {
                    items.splice(i, 1);
                } else {
                    oldCount = item.nnums;
                    item.nnums = data.nnums;
                }
                break;
            }
        }

        if (index == -1) {
            item = new GS_ContainerInfo_ContainerItem();
            item.ngoodsid = data.ucontainerdata;
            item.nnums = data.nnums;
            items.push(item);
        }

        //自选卡包
        let itemCfg = Game.goodsMgr.getGoodsInfo(data.ucontainerdata);
        if (itemCfg && itemCfg.lgoodstype === GOODS_TYPE.GOODSTYPE_CARD_TROOPSCARDBAG) {
            this.checkCardBag();
        }

        GameEvent.emit(EventEnum.ITEM_COUNT_CHANGE, data.ucontainerdata, data.nnums, oldCount);
    }

    /**是否足够 */
    isEnough(id: number, count: number, showTips: boolean = false): boolean {
        let flag = this.getItemCount(id) >= count;
        if (!flag && showTips) {
            /*
            let cfg = this.getItemCfg(id);
            SystemTipsMgr.instance.notice((cfg ? cfg.name:"") + "不足");
            */
        }
        return flag;
    }

    itemIsEnough(item: any, showTips: boolean = false): boolean {
        let flag = this.getItemCount(item.id) >= item.count;
        /*
        if (!flag && showTips) {
            SystemTipsMgr.instance.notice((item.cfg ? item.cfg.name:"") + "不足");
        }
        */
        return flag;
    }

    itemListIsEnough(itemList: any[], showTips: boolean = false): boolean {
        let len = itemList.length;
        let item: any;
        let i = 0;
        for (i = 0; i < len; i++) {
            item = itemList[i];
            if (!this.itemIsEnough(item, showTips)) {
                return false;
            }
        }
        return true;
    }

    /**获取物品数量 */
    getItemCount(id: number): number {
        let item = this.getItem(id);
        if (item) {
            return item.nnums;
        }
        return 0;
    }

    /**从容器中获取一个物品 */
    getItem(goodsID: number, containerID: number = ECONTAINER.ENCONTAINER_PACKET): GS_ContainerInfo_ContainerItem {
        let container: GS_ContainerInfo = this._containerInfos[containerID];
        let items: GS_ContainerInfo_ContainerItem[] = container.packet;
        let len = items.length;
        for (let i = 0; i < len; i++) {
            if (items[i].ngoodsid == goodsID) {
                return items[i];
            }
        }
        return null;
    }

    checkItemByType(type:GOODS_TYPE , containerID: number = ECONTAINER.ENCONTAINER_PACKET):boolean {
        let container: GS_ContainerInfo = this._containerInfos[containerID];
        let items: GS_ContainerInfo_ContainerItem[] = container.packet;
        let len = items.length;
        let goodsInfo:GS_GoodsInfoReturn_GoodsInfo = null;
        for (let i = 0; i < len; i++) {
            goodsInfo = Game.goodsMgr.getGoodsInfo(items[i].ngoodsid);
            if (goodsInfo && goodsInfo.lgoodstype == type) {
                return true;
            }
        }
        return false;
    }

}