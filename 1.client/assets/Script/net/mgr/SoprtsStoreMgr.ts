import { StoreType } from "../../common/AllEnum";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GameEvent } from "../../utils/GameEvent";
import { Handler } from "../../utils/Handler";
import { GS_PLAZA_STORE_MSG, GS_StoreBuy, GS_StoreBuyRet, GS_StoreFreeRef, GS_StoreFreeVideoRef, GS_StoreFreeVideoRet, GS_StoreInfo, GS_StoreInfo_ConfigItem, GS_StorePrivate, GS_StorePrivate_GoodsData, GS_StorePrivate_StoreData, GS_StoreTimeRef, GS_StoreUpPrivate } from "../proto/DMSG_Plaza_Sub_Store";

import BaseNetHandler from "../socket/handler/BaseNetHandler";
import { CMD_ROOT, GS_PLAZA_MSGID } from "../socket/handler/MessageEnum";

export class SoprtsStoreMgr extends BaseNetHandler {

    private _storeInfo:GS_StoreInfo;
    private _storePrivate:GS_StorePrivate;

    private _storeInfoDic:{[key:string]:GS_StoreInfo_ConfigItem} = {};
    private _storeGoodsDataDic:{[key:string]:GS_StorePrivate_GoodsData[]} = {};
    private _storeDataDic:{[key:string]:GS_StorePrivate_StoreData} = {};
    constructor() {
        super(CMD_ROOT.CMDROOT_PLAZA_MSG , GS_PLAZA_MSGID.GS_PLAZA_MSGID_STORE);
    }

    register() {        
        this.registerAnaysis(GS_PLAZA_STORE_MSG.PLAZA_STORE_INFO , Handler.create(this.onStoreInfo , this) , GS_StoreInfo);
        this.registerAnaysis(GS_PLAZA_STORE_MSG.PLAZA_STORE_PRIVATE , Handler.create(this.onStorePrivate , this) , GS_StorePrivate);
        this.registerAnaysis( GS_PLAZA_STORE_MSG.PLAZA_STORE_FREEVIDEOORDER, Handler.create(this.onStoreVideoRet , this) , GS_StoreFreeVideoRet);
        this.registerAnaysis(GS_PLAZA_STORE_MSG.PLAZA_STORE_BUYRET , Handler.create(this.onStoreBuyRet , this) , GS_StoreBuyRet);
        this.registerAnaysis(GS_PLAZA_STORE_MSG.PLAZA_STORE_TIMEREF , Handler.create(this.onStoreTimeRef , this) , GS_StoreTimeRef);
        this.registerAnaysis(GS_PLAZA_STORE_MSG.PLAZA_STORE_UPPRIVATE , Handler.create(this.onStoreUpPrivate , this) , GS_StoreUpPrivate);
    }

    /**
     * 获取商店配置
     * @param type 类型（0.合作 1.竞技 2.挑战）
     * @returns 
     */
    getStoreInfo(type:StoreType):GS_StoreInfo_ConfigItem {
        return this._storeInfoDic[type];
    }

    getStorePrivate(type:StoreType):GS_StorePrivate_StoreData {
        return this._storeDataDic[type];
    }

    getStoreGoodsData(type:StoreType):GS_StorePrivate_GoodsData[] {
        return this._storeGoodsDataDic[type];
    }

    /**免费刷新 */
    reqFreeRef(type:StoreType) {
        let data:GS_StoreFreeRef = new GS_StoreFreeRef();
        data.bttype = type;
        this.send(GS_PLAZA_STORE_MSG.PLAZA_STORE_FREEREF , data);
    }

    /**视频刷新 */
    reqFreeVideoRef(type:StoreType) {
        let data:GS_StoreFreeVideoRef = new GS_StoreFreeVideoRef();
        data.bttype = type;
        this.send(GS_PLAZA_STORE_MSG.PLAZA_STORE_FREEVIDEOREF , data);
    }

    reqBuy(type:StoreType , index:number) {
        let data:GS_StoreBuy = new GS_StoreBuy();
        data.bttype = type;
        data.btindex = index;
        this.send(GS_PLAZA_STORE_MSG.PLAZA_STORE_BUY , data);
    }

    /**时间刷新 */
    reqTimeRef(type:number) {
        this.reqFreeRef(type);
    }


    /**配置 */
    private onStoreInfo(data:GS_StoreInfo) {
        this._storeInfo = data;
        this._storeInfoDic = {};
        if (data.uitemcount > 0) {
            data.goodsdatalist.forEach(element => {
                this._storeInfoDic[element.bttype] = element;
            });
        }
    }

    /**私有数据 */
    private onStorePrivate(data:GS_StorePrivate) {
        this._storePrivate = data;
        this._storeDataDic = {};
        this._storeGoodsDataDic = {};

        if (data.utagcount > 0) {
            data.data1.forEach(element => {
                this._storeDataDic[element.bttype] = element;
            });
        }

        if (data.ugoodscount > 0) {
            for (let i = 0; i < data.ugoodscount; i++) {
                const element = data.data2[i];
                if (!this._storeGoodsDataDic[element.bttype]) {
                    this._storeGoodsDataDic[element.bttype] = [];
                }
                this._storeGoodsDataDic[element.bttype].push(element);
            }

        }
        GameEvent.emit(EventEnum.PVP_SHOP_REFRESH);
    }

    /**视频刷新返回 */
    private onStoreVideoRet(data:GS_StoreFreeVideoRet) {
        Game.nativeApi.showRewardAd(Game.actorMgr.nactordbid.toString(), data.szorder , data.szsdkkey);
    }

    /**购买返回 */
    private onStoreBuyRet(data:GS_StoreBuyRet) {
        let privateData = this._storeDataDic[data.bttype];
        let goodsDatas = this._storeGoodsDataDic[data.bttype];
        if (!privateData || !goodsDatas || goodsDatas.length == 0) return;

        const len = goodsDatas.length;
        for (let i = 0; i < len; i++) {
            let element = goodsDatas[i];
            if (element.btindex == data.btindex) {
                element.btstate = 1;
            }
        }

        GameEvent.emit(EventEnum.PVP_SHOP_BUY_RET ,data.bttype , data.btindex);
    }

    private onStoreTimeRef(data:GS_StoreTimeRef) {

    }


    private onStoreUpPrivate(data:GS_StoreUpPrivate) {
        let privateData = this._storeDataDic[data.bttype];
        if (!privateData) return;
        privateData.nlastreftime = data.nlastreftime;
        privateData.nfreerefcount = data.nfreerefcount;
        privateData.nfreevideorefcont = data.nfreevideorefcont;

        this._storeGoodsDataDic[data.bttype] = [];
    
        if (data.ugoodscount > 0) {
            for (let i = 0; i < data.ugoodscount; i++) {
                const element = data.goodsdatalist[i];
                this._storeGoodsDataDic[data.bttype].push(element);
            }
        }

        GameEvent.emit(EventEnum.PVP_SHOP_REFRESH , data.bttype);
    }
}