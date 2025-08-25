import { BuryingPointMgr, EBuryingPoint } from "../../buryingPoint/BuryingPointMgr";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { BI_TYPE, MISSION_LEVEL, MISSION_NAME, MISSION_TYPE } from "../../sdk/CKSdkEventListener";
import { EncryptionValue } from "../../utils/EncryptionValue";
import { GameEvent } from "../../utils/GameEvent";
import { Handler } from "../../utils/Handler";
import { GS_FashionActive, GS_FashionBuy, GS_FashionCancel, GS_FashionInfo, GS_FashionInfo_FashionItem, GS_FashionOrder, GS_FashionPrivate, GS_FashionPrivate_FashionData, GS_FashionRetCancel, GS_FashionRetUse, GS_FashionUse, GS_PLAZA_FASHION_MSG } from "../proto/DMSG_Plaza_Sub_Fashion";
import BaseNetHandler from "../socket/handler/BaseNetHandler";
import { CMD_ROOT, GS_PLAZA_MSGID } from "../socket/handler/MessageEnum";

export default class FashionMgr extends BaseNetHandler {

    private _fashionInfo: { [key: string]: GS_FashionInfo_FashionItem } = {};
    private _fashionPrivate: { [key: string]: GS_FashionPrivate_FashionData } = {};
    private _towerFashionInfo: { [key: string]: GS_FashionInfo_FashionItem[] } = {};
    private _towerUseFashion: { [key: string]: GS_FashionInfo_FashionItem } = {};
    private _towerActiveFashion: { [key: string]: number[] } = {};
    // private _towerFashionAddHurtPer: { [key: string]: number } = {};
    private _towerFashionAddHurtPerTotal: { [key: string]: number } = {};

    constructor() {
        super(CMD_ROOT.CMDROOT_PLAZA_MSG, GS_PLAZA_MSGID.GS_PLAZA_MSGID_FASHION);
    }


    register() {
        this.registerAnaysis(GS_PLAZA_FASHION_MSG.PLAZA_FASHION_INFO, Handler.create(this.onFashionInfo, this), GS_FashionInfo);
        this.registerAnaysis(GS_PLAZA_FASHION_MSG.PLAZA_FASHION_PRIVATE, Handler.create(this.onFashionPrivate, this), GS_FashionPrivate);
        this.registerAnaysis(GS_PLAZA_FASHION_MSG.PLAZA_FASHION_ORDER, Handler.create(this.onFashionOrder, this), GS_FashionOrder);
        this.registerAnaysis(GS_PLAZA_FASHION_MSG.PLAZA_FASHION_ACTIVE, Handler.create(this.onFashionActive, this), GS_FashionActive);
        this.registerAnaysis(GS_PLAZA_FASHION_MSG.PLAZA_FASHION_RETUSE, Handler.create(this.onFashionRetUse, this), GS_FashionRetUse);
        this.registerAnaysis(GS_PLAZA_FASHION_MSG.PLAZA_FASHION_RETCANCEL, Handler.create(this.onFashionRetCancel, this), GS_FashionRetCancel);
    }

    protected onSocketError() {
        this.exitGame();
    }

    /**退出游戏 */
    protected exitGame() {
        this._fashionPrivate = {};
        this._towerUseFashion = {};
        this._towerActiveFashion = {};
        // this._towerFashionAddHurtPer = {};
    }

    getUnActiveFashionInfo():GS_FashionInfo_FashionItem {
        if (this._fashionInfo) {
            let list = Object.values(this._fashionInfo);
            let len = list.length;
            for (let i = len - 1 ; i >= 0 ; i--) {
                let item = list[i];
                if (!this.getFashionData(item.nid) && Game.towerMgr.isTowerUnlock(item.ntroopsid)) {
                    return item;
                }
            }
        }
        return null;
    }

    /**获取一个皮肤数据 */
    getFashionInfo(nid: number): GS_FashionInfo_FashionItem {
        return this._fashionInfo[nid];
    }

    /**获取猫咪的皮肤配置 */
    getTowerFashionInfos(towerid: number): GS_FashionInfo_FashionItem[] {
        return this._towerFashionInfo[towerid];
    }

    /**获取一个皮肤的私有数据 */
    getFashionData(nid: number): GS_FashionPrivate_FashionData {
        return this._fashionPrivate[nid];
    }

    getFashionDic(): { [key: string]: GS_FashionPrivate_FashionData } {
        return this._fashionPrivate;
    }

    /**获取猫咪在使用的皮肤数据 */
    getTowerUseFashionInfo(towerid: number): GS_FashionInfo_FashionItem {
        return this._towerUseFashion[towerid];
    }

    /**获取猫咪皮肤加的伤害加深 */
    getTowerFashionAddHurtPer(towerid: number): number {

        let num = 0;
        let list = this._towerActiveFashion[towerid];
        if (list) {
            list.forEach(element => {
                let fashionInfo = this.getFashionInfo(element);
                num += fashionInfo ? fashionInfo.nhurtper : 0;
            });
        }

        return num;
    }

    /**获取猫咪皮肤总共可以加多少伤害加深 */
    getTowerFashionAddHurtPerTotal(towerid: number): number {
        return this._towerFashionAddHurtPerTotal[towerid];
    }

    //////////////////////////////////////////////////////////////request
    /** */
    /**
     * 请求购买
     * @param nid 皮肤id
     * @param buyMode 购买方式（0：钻石 1：RMB 2：物品）
     */
    reqBuy(nid: number, buyMode: number) {
        let data: GS_FashionBuy = new GS_FashionBuy();
        data.nid = nid;
        data.btbuymode = buyMode;
        this.send(GS_PLAZA_FASHION_MSG.PLAZA_FASHION_BUY, data);
    }

    /**请求使用 */
    reqUse(nid: number) {
        let data: GS_FashionUse = new GS_FashionUse();
        data.nid = nid;
        this.send(GS_PLAZA_FASHION_MSG.PLAZA_FASHION_USE, data);
    }

    /**请求取消 */
    reqCancel(nid: number) {
        let data: GS_FashionCancel = new GS_FashionCancel();
        data.nid = nid;
        this.send(GS_PLAZA_FASHION_MSG.PLAZA_FASHION_CANCEL, data);
    }

    //////////////////////////////////////////////////////////////
    /**配置信息 */
    private onFashionInfo(data: GS_FashionInfo) {
        cc.log('onFashionInfo:' , data);
        this._fashionInfo = {};
        this._towerFashionInfo = {};
        this._towerFashionAddHurtPerTotal = {};

        if (data.fashions && data.fashions.length > 0) {
            data.fashions.forEach(element => {
                this._fashionInfo[element.nid] = element;

                let list: GS_FashionInfo_FashionItem[] = this._towerFashionInfo[element.ntroopsid] || [];
                list.push(element);
                this._towerFashionInfo[element.ntroopsid] = list;

                let num: number = this._towerFashionAddHurtPerTotal[element.ntroopsid] || 0;
                num += element.nhurtper;
                this._towerFashionAddHurtPerTotal[element.ntroopsid] = num;
            });
        }
    }

    /**私有信息 */
    private onFashionPrivate(data: GS_FashionPrivate) {
        this._fashionPrivate = {}
        if (data.fashions && data.fashions.length > 0) {
            data.fashions.forEach(element => {
                this.insertPrivateData(element);
            });
        }
    }

    /**RMB购买订单 */
    private onFashionOrder(data: GS_FashionOrder) {
        BuryingPointMgr.post(EBuryingPoint.PAY_FASHION, JSON.stringify({ order: data.szorder }));
        Game.mallProto.payOrder(data.szorder);
    }

    /**购买激活返回 */
    private onFashionActive(data: GS_FashionActive) {
        let fashionData: GS_FashionPrivate_FashionData = new GS_FashionPrivate_FashionData();
        fashionData.nid = data.nid;
        fashionData.btuse = 0;
        this.insertPrivateData(fashionData);

        GameEvent.emit(EventEnum.FASHION_ACTIVE, data.nid);
        this.reqUse(data.nid);

        let fashionItem = this.getFashionInfo(data.nid);
        if (fashionItem) {
            GameEvent.emit(EventEnum.CK_BI_REPORT_EVENT , MISSION_TYPE.ACTIVE_SKIN ,MISSION_LEVEL.NORMAL ,MISSION_NAME.ACTIVE_SKIN ,fashionItem.szname);
        }

    }

    /**使用返回 */
    private onFashionRetUse(data: GS_FashionRetUse) {
        let fashionData: GS_FashionPrivate_FashionData = this.getFashionData(data.nid);
        if (fashionData) {
            fashionData.btuse = 1;
            let itemInfo = this.getFashionInfo(data.nid);
            if (itemInfo) {
                this._towerUseFashion[itemInfo.ntroopsid] = itemInfo;
            }
        }
        GameEvent.emit(EventEnum.FASHION_USE, data.nid);
    }

    private onFashionRetCancel(data: GS_FashionRetCancel) {
        let fashionData: GS_FashionPrivate_FashionData = this.getFashionData(data.nid);
        if (fashionData) {
            fashionData.btuse = 0;
            let itemInfo = this.getFashionInfo(data.nid);
            if (itemInfo) {
                this._towerUseFashion[itemInfo.ntroopsid] = null;
            }
        }
        GameEvent.emit(EventEnum.FASHION_CANCEL, data.nid);
    }

    private insertPrivateData(element: GS_FashionPrivate_FashionData) {
        this._fashionPrivate[element.nid] = element;

        let itemInfo = this.getFashionInfo(element.nid);
        if (itemInfo) {
            if (element.btuse == 1) {
                this._towerUseFashion[itemInfo.ntroopsid] = itemInfo;
            } else {
                this.reqUse(element.nid);
            }
            let list: number[] = this._towerActiveFashion[itemInfo.ntroopsid] || [];
            list.push(element.nid);
            this._towerActiveFashion[itemInfo.ntroopsid] = list;

            // let num = this.getTowerFashionAddHurtPer(itemInfo.ntroopsid);
            // num += itemInfo.nhurtper;

            
            // this._towerFashionAddHurtPer[itemInfo.ntroopsid] = EncryptionValue;
        }
    }

    /**
     * 能否购买皮肤
     * @param towerId 
     * @returns 
     */
    public getFirstCanBuyFastionTowerId(towerIds: number[]): number {
        for (let id of towerIds) {
            let fastionItems = this.getTowerFashionInfos(id);
            if (fastionItems) {
                for (let item of fastionItems) {
                    if (!this.getFashionData(item.nid)) {
                        return id;
                    }
                }
            }
        }
        return -1;
    }
}