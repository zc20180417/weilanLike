import BaseNetHandler from "../../net/socket/handler/BaseNetHandler";
import { CMD_ROOT, GOODS_TYPE, GS_PLAZA_MSGID } from "../../net/socket/handler/MessageEnum";
import { GS_PLAZA_GOODS_MSG, GS_GoodsInfoReturn_GoodsInfo, GS_GoodsInfoReturn, GS_GoodIDList, GS_GoodsDropBoxInfo, GS_GoodsDropBoxInfo_DropBoxItem, GS_GoodsDropBoxInfo_DropBoxGoodsItem, GS_GetGoodsInfo, GS_GoodsUseBox, GS_GoodsDropBoxData, GS_GoodsUpDropBox, GS_GoodsDropBoxData_DropBoxItem, GS_GoodsUseCardBag } from "../../net/proto/DMSG_Plaza_Sub_Goods";
import { Handler } from "../../utils/Handler";
import { EventEnum } from "../../common/EventEnum";
import Debug from "../../debug";
import { GameEvent } from "../../utils/GameEvent";

const TAG_GOODS = "物品";

export class GoodsMgr extends BaseNetHandler {

    static STAR_GOODS_ID: number = 9;

    private _goodsconfigs: GS_GoodsInfoReturn_GoodsInfo[];
    private _goodsid: number[];
    private _dropBoxItem: GS_GoodsDropBoxInfo_DropBoxItem[];
    private _dropBoxGoodsItem: GS_GoodsDropBoxInfo_DropBoxGoodsItem[];
    private _goodsInfoDic: { [key: string]: GS_GoodsInfoReturn_GoodsInfo; } = {};

    private _dropBoxData: GS_GoodsDropBoxData;
    private _dropBoxDataMap: Map<number, GS_GoodsDropBoxData_DropBoxItem> = new Map();
    private _dropBoxInfoMap: Map<number, GS_GoodsDropBoxInfo_DropBoxItem> = new Map();

    constructor() {
        super(CMD_ROOT.CMDROOT_PLAZA_MSG, GS_PLAZA_MSGID.GS_PLAZA_MSGID_GOODS)
    }

    register() {
        this.registerAnaysis(GS_PLAZA_GOODS_MSG.PLAZA_GOODS_INFORETURN, Handler.create(this.onGoodsInfo, this), GS_GoodsInfoReturn);
        this.registerAnaysis(GS_PLAZA_GOODS_MSG.PLAZA_GOODS_GOODIDLIST, Handler.create(this.onGoodIDList, this), GS_GoodIDList);
        this.registerAnaysis(GS_PLAZA_GOODS_MSG.PLAZA_GOODS_DROPBOXINFO, Handler.create(this.onGoodsDropBox, this), GS_GoodsDropBoxInfo);

        this.registerAnaysis(GS_PLAZA_GOODS_MSG.PLAZA_GOODS_DROPBOXDATA, Handler.create(this.onDropBoxData, this), GS_GoodsDropBoxData);
        this.registerAnaysis(GS_PLAZA_GOODS_MSG.PLAZA_GOODS_UPDROPBOX, Handler.create(this.upDropBox, this), GS_GoodsUpDropBox);
    }

    protected exitGame() {
        this._dropBoxData = null;
        this._dropBoxDataMap.clear();
    }

    /**
     * 掉落宝箱的私有数据
     * @param data GS_GoodsDropBoxData
     */
    private onDropBoxData(data: GS_GoodsDropBoxData) {
        cc.log(TAG_GOODS, "掉落宝箱的私有数据", data);
        this._dropBoxData = data;
        if (data.items) {
            data.items.forEach(el => {
                this._dropBoxDataMap.set(el.nid, el);
            });
        }
    }

    /**
     * 获取掉落盒私有数据
     * @param nid 
     * @returns GS_GoodsDropBoxData_DropBoxItem
     */
    public getDropBoxData(nid: number): GS_GoodsDropBoxData_DropBoxItem {
        return this._dropBoxDataMap.get(nid);
    }

    /**
     * 更新单个掉落宝箱的数据
     * @param data GS_GoodsUpDropBox
     */
    private upDropBox(data: GS_GoodsUpDropBox) {
        cc.log(TAG_GOODS, "更新单个掉落宝箱的数据", data);
        let privateData = this._dropBoxDataMap.get(data.nid);
        if (!privateData) {
            privateData = new GS_GoodsDropBoxData_DropBoxItem();
            privateData.nid = data.nid;
            this._dropBoxDataMap.set(data.nid, privateData);
        }
        privateData.ncount = data.ncount;

        GameEvent.emit(EventEnum.UP_DROPBOX_DATA, data);
    }

    getGoodsInfo(id: number): GS_GoodsInfoReturn_GoodsInfo {
        return this._goodsInfoDic[id];
    }

    isCard(id:number , info?:GS_GoodsInfoReturn_GoodsInfo):boolean {
        let goodsCfg = info || this.getGoodsInfo(id);
        return (goodsCfg && (goodsCfg.lgoodstype == GOODS_TYPE.GOODSTYPE_RES_UPGRADESTAR ||
            goodsCfg.lgoodstype == GOODS_TYPE.GOODSTYPE_RES_SKIN ||
            goodsCfg.lgoodstype == GOODS_TYPE.GOODSTYPE_CARD_TROOPSEQUIP));
    }
    /////////////////////////////////////////////////////////////
    reqGoodsInfo() {
        let data: GS_GetGoodsInfo = new GS_GetGoodsInfo();
        //__USHORT			(btCount);				//请求的数量
        //__DYNAMICSLONGS		(lGoodsIDList);			//物品ID
        this.send(GS_PLAZA_GOODS_MSG.PLAZA_GOODS_GETINFO, data);
    }

    private onGoodsInfo(data: GS_GoodsInfoReturn) {
        Debug.log(TAG_GOODS, "物品配置信息返回", data);
        this._goodsconfigs = data.goodsconfigs;

        data.goodsconfigs.forEach(element => {
            this._goodsInfoDic[element.lgoodsid] = element;
        });

        GameEvent.emit(EventEnum.MODULE_INIT, GS_PLAZA_MSGID.GS_PLAZA_MSGID_GOODS);
    }

    private onGoodIDList(data: GS_GoodIDList) {
        cc.log("物品：", "物品ID列表信息:", data);
        this._goodsid = data.goodsid;
    }

    private onGoodsDropBox(data: GS_GoodsDropBoxInfo) {
        cc.log("物品：", "掉落盒配置下发:", data);
        // this._dropBoxItem = data.data1;
        if (data.data1) {
            data.data1.forEach(el => {
                this._dropBoxInfoMap.set(el.ndropboxid, el);
            });
        }
        this._dropBoxGoodsItem = data.data2;
    }

    /**
     * 获取掉落盒配置
     * @param dropBoxId 
     * @returns {GS_GoodsDropBoxInfo_DropBoxItem}
     */
    public getDropBoxInfo(dropBoxId: number) {
        return this._dropBoxInfoMap.get(dropBoxId);
    }

    private getItemIndex(goodsid: number): number {
        for (let i = 0, len = this._goodsid.length; i < len; i++) {
            if (goodsid == this._goodsid[i]) {
                return i;
            }
        }
        return -1;
    }

    /**
     * 使用宝箱
     * @param goodsId 
     */
    public useBox(goodsId: number) {
        let data = new GS_GoodsUseBox();
        data.ngoodsid = goodsId;
        this.send(GS_PLAZA_GOODS_MSG.PLAZA_GOODS_USEBOX, data);
    }

    /**
     * 使用自选卡包
     * @param goodsId 
     * @param index 自选下标(0-7)
     */
    public useCardBag(goodsId: number, index: number) {
        let data = new GS_GoodsUseCardBag();
        data.nusegoodsid = goodsId;
        data.btselindex = index;
        this.send(GS_PLAZA_GOODS_MSG.PLAZA_GOODS_USECARDBAG, data);
    }
}