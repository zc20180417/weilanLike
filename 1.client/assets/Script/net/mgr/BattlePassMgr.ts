import { EventEnum } from "../../common/EventEnum";
import SysMgr from "../../common/SysMgr";
import Game from "../../Game";
import GlobalVal from "../../GlobalVal";
import { EVENT_REDPOINT } from "../../redPoint/RedPointSys";
import { GameEvent } from "../../utils/GameEvent";
import { Handler } from "../../utils/Handler";
import Utils from "../../utils/Utils";
import { GS_PLAZA_BATTLEPASS_MSG, GS_SceneBattlePass2Config, GS_SceneBattlePass2Config_BaseItem, GS_SceneBattlePass2Config_PassItem, GS_SceneBattlePass2FreeVideo, GS_SceneBattlePass2GetOrder, GS_SceneBattlePass2GetReward, GS_SceneBattlePass2Private, GS_SceneBattlePass2Private_Item, GS_SceneBattlePass2SetOrder, GS_SceneBattlePass3Config, GS_SceneBattlePass3Config_BaseItem, GS_SceneBattlePass3Config_PassItem, GS_SceneBattlePass3FreeVideo, GS_SceneBattlePass3GetOrder, GS_SceneBattlePass3GetReward, GS_SceneBattlePass3Private, GS_SceneBattlePass3SetOrder, GS_SceneBattlePass4Config, GS_SceneBattlePass4Config_BaseItem, GS_SceneBattlePass4Config_PassItem, GS_SceneBattlePass4FreeVideo, GS_SceneBattlePass4GetAllReward, GS_SceneBattlePass4GetOrder, GS_SceneBattlePass4GetReward, GS_SceneBattlePass4GetSignFV, GS_SceneBattlePass4Private, GS_SceneBattlePass4Private_Item, GS_SceneBattlePass4SetOrder, GS_SceneBattlePass4SetSignFV, GS_SceneBattlePassConfig, GS_SceneBattlePassConfig_BaseItem, GS_SceneBattlePassConfig_PassItem, GS_SceneBattlePassGetOrder, GS_SceneBattlePassGetReward, GS_SceneBattlePassPrivate, GS_SceneBattlePassPrivate_Item, GS_SceneBattlePassSetOrder } from "../proto/DMSG_Plaza_Sub_BattlePass";
import BaseNetHandler from "../socket/handler/BaseNetHandler";
import { CMD_ROOT, GS_PLAZA_MSGID } from "../socket/handler/MessageEnum";


export type BattlePassConfig = { baseItem: GS_SceneBattlePassConfig_BaseItem, passItems: GS_SceneBattlePassConfig_PassItem[] };
export type BattlePassConfig3 = { baseItem: GS_SceneBattlePass3Config_BaseItem, passItems: GS_SceneBattlePass3Config_PassItem[] };
export type BattlePassConfig4 = { baseItem: GS_SceneBattlePass4Config_BaseItem, passItems: GS_SceneBattlePass4Config_PassItem[] };

export default class BattlePassMgr extends BaseNetHandler {


    private _battlePassConfig: BattlePassConfig[] = [];
    private _battlePassPrivateData: Map<number, GS_SceneBattlePassPrivate_Item> = new Map();
    

    private _battlePass2Config:GS_SceneBattlePass2Config = null;
    private _battlePass2PrivateData:GS_SceneBattlePass2Private = null;
    private _battlePass2ConfigPassItemDic:Map<number , GS_SceneBattlePass2Config_PassItem[]> = new Map();

    private _battlePassConfig3: BattlePassConfig3[] = [];
    private _battlePass3PrivateData:GS_SceneBattlePass3Private = null;
    private _battlePassConfig4: BattlePassConfig4[] = [];
    private _battlePass4PrivateData:GS_SceneBattlePass4Private = null;
    
    constructor() {
        super(CMD_ROOT.CMDROOT_PLAZA_MSG, GS_PLAZA_MSGID.GS_PLAZA_MSGID_BATTLEPASS);

    }

    register() {
        this.registerAnaysis(GS_PLAZA_BATTLEPASS_MSG.PLAZA_BATTLEPASS_BATTLEPASSCONFIG, Handler.create(this.battlePassConfig, this), GS_SceneBattlePassConfig);
        this.registerAnaysis(GS_PLAZA_BATTLEPASS_MSG.PLAZA_BATTLEPASS_BATTLEPASSPRIVATE, Handler.create(this.battlePassPrivate, this), GS_SceneBattlePassPrivate);
        this.registerAnaysis(GS_PLAZA_BATTLEPASS_MSG.PLAZA_BATTLEPASS_BATTLEPASSSETORDER, Handler.create(this.battlePassOrder, this), GS_SceneBattlePassSetOrder);

        this.registerAnaysis(GS_PLAZA_BATTLEPASS_MSG.PLAZA_BATTLEPASS_BATTLEPASS2CONFIG, Handler.create(this.onBattlePass2Config, this), GS_SceneBattlePass2Config);
        this.registerAnaysis(GS_PLAZA_BATTLEPASS_MSG.PLAZA_BATTLEPASS_BATTLEPASS2PRIVATE, Handler.create(this.onBattlePass2Private, this), GS_SceneBattlePass2Private);
        this.registerAnaysis(GS_PLAZA_BATTLEPASS_MSG.PLAZA_BATTLEPASS_BATTLEPASS2SETORDER, Handler.create(this.onBattlePass2SetOrder, this), GS_SceneBattlePass2SetOrder);
        this.registerAnaysis(GS_PLAZA_BATTLEPASS_MSG.PLAZA_BATTLEPASS_BATTLEPASS2FREEVIDEO, Handler.create(this.onBattlePass2FreeVideo, this), GS_SceneBattlePass2FreeVideo);

        this.registerAnaysis(GS_PLAZA_BATTLEPASS_MSG.PLAZA_BATTLEPASS_BATTLEPASS3CONFIG, Handler.create(this.onBattlePass3Config, this), GS_SceneBattlePass3Config);
        this.registerAnaysis(GS_PLAZA_BATTLEPASS_MSG.PLAZA_BATTLEPASS_BATTLEPASS3PRIVATE, Handler.create(this.onBattlePass3Private, this), GS_SceneBattlePass3Private);
        this.registerAnaysis(GS_PLAZA_BATTLEPASS_MSG.PLAZA_BATTLEPASS_BATTLEPASS3SETORDER, Handler.create(this.onBattlePass3SetOrder, this), GS_SceneBattlePass3SetOrder);
        this.registerAnaysis(GS_PLAZA_BATTLEPASS_MSG.PLAZA_BATTLEPASS_BATTLEPASS3FREEVIDEO, Handler.create(this.onBattlePass3FreeVideo, this), GS_SceneBattlePass3FreeVideo);

        this.registerAnaysis(GS_PLAZA_BATTLEPASS_MSG.PLAZA_BATTLEPASS_BATTLEPASS4CONFIG, Handler.create(this.onBattlePass4Config, this), GS_SceneBattlePass4Config);
        this.registerAnaysis(GS_PLAZA_BATTLEPASS_MSG.PLAZA_BATTLEPASS_BATTLEPASS4PRIVATE, Handler.create(this.onBattlePass4Private, this), GS_SceneBattlePass4Private);
        this.registerAnaysis(GS_PLAZA_BATTLEPASS_MSG.PLAZA_BATTLEPASS_BATTLEPASS4SETORDER, Handler.create(this.onBattlePass4SetOrder, this), GS_SceneBattlePass4SetOrder);
        this.registerAnaysis(GS_PLAZA_BATTLEPASS_MSG.PLAZA_BATTLEPASS_BATTLEPASS4FREEVIDEO, Handler.create(this.onBattlePass4FreeVideo, this), GS_SceneBattlePass4FreeVideo);
        this.registerAnaysis(GS_PLAZA_BATTLEPASS_MSG.PLAZA_BATTLEPASS_BATTLEPASS4SETSIGNFV, Handler.create(this.onBattlePass4SetSignFv, this), GS_SceneBattlePass4SetSignFV);


        GameEvent.on(EventEnum.ACROSS_DAY , this.onAcrossDay , this);
        GameEvent.on(EventEnum.LAST_WAR_ID_CHANGE2, this.onLastWarChange , this);
    }

    private onAcrossDay() {
        GameEvent.emit(EventEnum.REFRESH_BATTLE_PASS2);
        GameEvent.emit(EventEnum.REFRESH_BATTLE_PASS4);
    }

    private onLastWarChange(warid:number) {
        this.checkOpenBattlePass(warid);
        this.checkBattlePass3RedPoint();
    }

    protected exitGame(): void {
        this._battlePassConfig.length = 0;
        this._battlePassPrivateData.clear();
        this._preGetSignData = null;
    }

    public getBattlePassConfigs(): BattlePassConfig[] {
        return this._battlePassConfig;
    }

    public getBattlePassConfig(nid: number): BattlePassConfig {
        for (const config of this._battlePassConfig) {
            if (config.baseItem.nid === nid) return config;
        }
        return null;
    }

    public getBpConfigByWorldId(nid: number): BattlePassConfig {
        for (const config of this._battlePassConfig) {
            if (config.baseItem.nworldid === nid) return config;
        }
        return null;
    }

    public getBattlePassPrivateData(nid: number): GS_SceneBattlePassPrivate_Item {
        return this._battlePassPrivateData.get(nid);
    }

    isRmbItemRecived(nid: number, index: number): boolean {
        let privateData = this._battlePassPrivateData.get(nid);
        if (!privateData) return false;
        return Utils.checkBitFlag(privateData.nflag2, index);
    }

    isNormalItemRecived(nid: number, index: number): boolean {
        let privateData = this._battlePassPrivateData.get(nid);
        if (!privateData) return false;
        return Utils.checkBitFlag(privateData.nflag1, index);
    }

    private isBattlePassFinished(nid: number): boolean {
        let config = this.getBattlePassConfig(nid);
        let privateData = this.getBattlePassPrivateData(nid);
        return !config || !privateData || this.checkGetAllNormalAward(privateData , config);
    }

    public isBattlePassOpenByWorldId(worldid:number):boolean {
        let config = this.getBpConfigByWorldId(worldid);
        return this.checkBattlePassItemOpen(config);
    }

    public isAllBattlePassFinished(): boolean {
        if (this._battlePassConfig) {
            for (const config of this._battlePassConfig) {
                if (this.checkBattlePassItemOpen(config)) {
                    return false;
                }
            }
        }
        return true;
    }

    isAllBattlePass2Finished(): boolean {
        const config = this.getCurBattlePass2ConfigItem();
        if (config) {
            const privateData = this.getCurBattlePass2Private(config);
            if (privateData) {
                let passItems = this.getBattlePass2ConfigPassItem(privateData.nid);
                for (let i = 0 ; i < passItems.length ; i++) {

                    if (!Utils.checkBitFlag(privateData.nflag1 , i) 
                        || !Utils.checkBitFlag(privateData.nflag2 , i) 
                        || !Utils.checkBitFlag(privateData.nflag3 , i)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    /**
     * 战场同行证开通付费模式
     */
     public battlePassGetOrder(nid: number) {
        let data = new GS_SceneBattlePassGetOrder();
        data.nid = nid;
        this.send(GS_PLAZA_BATTLEPASS_MSG.PLAZA_BATTLEPASS_BATTLEPASSGETORDER, data);
    }

    /**
     * 战场同行证22222开通付费模式
     */
    battlePass2GetOrder(nid: number) {
        let data = new GS_SceneBattlePass2GetOrder();
        data.nid = nid;
        this.send(GS_PLAZA_BATTLEPASS_MSG.PLAZA_BATTLEPASS_BATTLEPASS2GETORDER, data);
    }

    /**
     * 领取奖励
     * @param index 
     * @param mode 
     */
    public battlePassGetReward(nid: number, index: number, mode: number) {
        let data = new GS_SceneBattlePassGetReward();
        data.nid = nid;
        data.btindex = index;
        data.btmode = mode;
        this.send(GS_PLAZA_BATTLEPASS_MSG.PLAZA_BATTLEPASS_BATTLEPASSGETREWARD, data);
    }

    battlePass2GetReward(nid: number, index: number, mode: number) {
        let data = new GS_SceneBattlePass2GetReward();
        data.nid = nid;
        data.btindex = index;
        // data.btmode = mode;
        this.send(GS_PLAZA_BATTLEPASS_MSG.PLAZA_BATTLEPASS_BATTLEPASS2GETREWARD, data);
    }

    getBattlePassConfog3():BattlePassConfig3[] {
        return this._battlePassConfig3;
    }

    getBattlePassPrivate3():GS_SceneBattlePass3Private {
        return this._battlePass3PrivateData;
    }

    getBattlePassConfog4():BattlePassConfig4 {

        if (this._battlePassConfig4 && this._battlePassConfig4.length > 0) {

            const len = this._battlePassConfig4.length;
            const day = Game.actorMgr.getChannelOpenDays() + 1;
            let item:BattlePassConfig4;
            for (let i = 0 ; i < len ; i++) {
                item = this._battlePassConfig4[i];
                if (day >= item.baseItem.nstartday && day <= (item.baseItem.nstartday + item.baseItem.nvalidday)) {
                    return item;
                }
            }
        }

        return null;
    }

    getBattlePassPrivate4():GS_SceneBattlePass4Private {
        return this._battlePass4PrivateData;
    }

    getBattlePassPrivate4Item(nid:number):GS_SceneBattlePass4Private_Item {
        if (this._battlePass4PrivateData && this._battlePass4PrivateData.uitemcount > 0) {
            let item:GS_SceneBattlePass4Private_Item;
            for (let i = 0 ; i < this._battlePass4PrivateData.uitemcount ; i++) {
                item = this._battlePass4PrivateData.items[i];
                if (item.nid == nid) {
                    return item;
                }
            }
        }
        return null;
    }

    public getBattlePassMode(nid: number): number {
        let privateData = this._battlePassPrivateData.get(nid);
        return privateData ? privateData.btstate : 0;
    }

    isBPHasUnreciveAwardByWorldId(worldid:number):boolean {
        let config = this.getBpConfigByWorldId(worldid);
        return this.isBattlePassHasUnreciveAward(config.baseItem.nid);
    }

    private checkOpenBattlePass(warid:number) {
        let len = this._battlePassConfig.length;
        let item:BattlePassConfig;
        for (let i = 0 ; i < len ; i++) {
            item = this._battlePassConfig[i];
            if (warid == item.baseItem.nopenwarid) {
                let privateData = this.getBattlePassPrivateData(item.baseItem.nid);
                if (privateData) {
                    privateData.nopentimes = GlobalVal.getServerTime() * 0.001;
                }
            }
        }
    }

    

    public getFirstUnreciveIndex(nid: number): number {
        let config = this.getBattlePassConfig(nid);
        let privateData = this.getBattlePassPrivateData(nid);
        if (!config || !privateData || !config.baseItem) return 0;
        let index = 0;
        for (let i = 0, len = config.passItems.length; i < len; i++) {
            if ((!Utils.checkBitFlag(privateData.nflag1, i))) {
                index = i;
                break;
            }
        }
        return index;
    }

    getBattlePass2Private():GS_SceneBattlePass2Private {
        return this._battlePass2PrivateData;
    }

    getBattlePass2Config():GS_SceneBattlePass2Config {
        return this._battlePass2Config;
    }

    getBattlePass2ConfigPassItem(id:number):GS_SceneBattlePass2Config_PassItem[] {
        return this._battlePass2ConfigPassItemDic[id];
    }

    getCurBattlePass2ConfigItem():GS_SceneBattlePass2Config_BaseItem {
        if (!this._battlePass2Config || this._battlePass2Config.ubaseitemcount == 0) return null;
        let curTime = GlobalVal.getServerTime() * 0.001;
        let item:GS_SceneBattlePass2Config_BaseItem;
        for (let i = 0 ; i < this._battlePass2Config.ubaseitemcount ; i++) {
            item = this._battlePass2Config.data1[i];
            if (item.nstarttime <= curTime && curTime <= item.nendtime) {
                return item;
            }
        }
        return null;
    }

    getCurBattlePass2Private(item:GS_SceneBattlePass2Config_BaseItem):GS_SceneBattlePass2Private_Item {
        if (!item || !this._battlePass2PrivateData || this._battlePass2PrivateData.uitemcount == 0) return null;
        let curItem:GS_SceneBattlePass2Private_Item;
        for (let i = 0 ; i < this._battlePass2PrivateData.uitemcount ; i++) {
            curItem = this._battlePass2PrivateData.items[i];
            if (curItem.nid == item.nid) {
                return curItem;
            }
        }
        return null;
    }

    reqBattlePass3GetOrder(nid:number) {
        let data:GS_SceneBattlePass3GetOrder = new GS_SceneBattlePass3GetOrder();
        data.nid = nid;
        this.send(GS_PLAZA_BATTLEPASS_MSG.PLAZA_BATTLEPASS_BATTLEPASS3GETORDER , data);
    }

    reqBattlePass3GetReward(nid:number , index:number) {
        let data:GS_SceneBattlePass3GetReward = new GS_SceneBattlePass3GetReward();
        data.nid = nid;
        data.btindex = index;
        this.send(GS_PLAZA_BATTLEPASS_MSG.PLAZA_BATTLEPASS_BATTLEPASS3GETREWARD , data);
    }

    /**购买指定阶(1:付费1  2：付费2   3：全部）*/
    reqBattlePass4GetOrder(nid:number , type:number) {
        let data:GS_SceneBattlePass4GetOrder = new GS_SceneBattlePass4GetOrder();
        data.nid = nid;
        data.bttype = type;
        this.send(GS_PLAZA_BATTLEPASS_MSG.PLAZA_BATTLEPASS_BATTLEPASS4GETORDER , data);
    }

    reqBattlePass4GetReward(nid:number , index:number) {
        let data:GS_SceneBattlePass4GetReward = new GS_SceneBattlePass4GetReward();
        data.nid = nid;
        data.btindex = index;
        this.send(GS_PLAZA_BATTLEPASS_MSG.PLAZA_BATTLEPASS_BATTLEPASS4GETREWARD , data);
    }

    private _preGetSignData:GS_SceneBattlePass4GetSignFV;
    reqBattlePass4GetSignFv(nid:number , index:number) {
        let data:GS_SceneBattlePass4GetSignFV = new GS_SceneBattlePass4GetSignFV();
        data.nid = nid;
        data.btindex = index;
        this._preGetSignData = data;
        this.send(GS_PLAZA_BATTLEPASS_MSG.PLAZA_BATTLEPASS_BATTLEPASS4GETSIGNFV , data);
    }

    /**一键领取 */
    reqBattlePass4GetAllReward(id:number) { 
        let data:GS_SceneBattlePass4GetAllReward = new GS_SceneBattlePass4GetAllReward();
        data.nid = id;
        this.send(GS_PLAZA_BATTLEPASS_MSG.PLAZA_BATTLEPASS_BATTLEPASS4GETALLREWARD , data);
    }

    ////////////////////////////
    
     /**
     * 战场通行证配置
     * @param data GS_SceneBattlePassConfig
     */
      private battlePassConfig(data: GS_SceneBattlePassConfig) {
        cc.log("战场通行证配置", data);
        if (data.data1 && data.data2) {
            let startIndex = 0, item: BattlePassConfig;
            for (const baseitem of data.data1) {
                item = { baseItem: baseitem, passItems: data.data2.slice(startIndex, startIndex + baseitem.btpassitemcount) };
                this._battlePassConfig.push(item);
                startIndex += baseitem.btpassitemcount;
            }
        }
        this.refreshBattlePassRedPoint();
    }

    

    /**
     * 战场通行证个人数据
     * @param data 
     */
    private battlePassPrivate(data: GS_SceneBattlePassPrivate) {
        cc.log("战场通行证个人数据", data);
        if (data.items) {
            for (const item of data.items) {
                this._battlePassPrivateData.set(item.nid, item);
                GameEvent.emit(EventEnum.ON_BATTLE_PASS_PRIVATE_DATA, item);
            }

            this.refreshBattlePassRedPoint();
        }
    }

    /**
     * 战场通行证付费订单下发
     * @param data 
     */
    private battlePassOrder(data: GS_SceneBattlePassSetOrder) {
        cc.log("战场通行证付费订单下发", data);
        Game.mallProto.payOrder(data.szorder);
    }


    private refreshBattlePassRedPoint() {
        if (!this._battlePassConfig || !this._battlePassPrivateData) return;
        let hasUnreciveAward = false;
        for (let i = 0; i < this._battlePassConfig.length; i++) {
            if (this.isBattlePassHasUnreciveAward(this._battlePassConfig[i].baseItem.nid)) {
                hasUnreciveAward = true;
                break;
            }
        }
        let node = Game.redPointSys.findRedPointNode(EVENT_REDPOINT.BATTLE_PASS);
        if (node) {
            node.setRedPointNum(hasUnreciveAward ? 1 : 0);
        }
    }

    private isBattlePassHasUnreciveAward(nid: number) {
        let config = this.getBattlePassConfig(nid);
        let privateData = this.getBattlePassPrivateData(nid);
        if (!config || !config.baseItem || !config.passItems || !privateData || this.isBattlePassFinished(nid)) return false;
    
        let count = Game.sceneNetMgr.getPerfectFinishNormalWarCount(config.baseItem.nworldid);
        let len = config.passItems.length;
        let passItem;
        for (let i = 0 ; i < len ; i++) {
            passItem = config.passItems[i];
            if (count >= passItem.nperfectwarcount && !Utils.checkBitFlag(privateData.nflag1 , i)) {
                return true;
            }
        }

        return false;
    }

    private checkGetAllNormalAward(privateData:GS_SceneBattlePassPrivate_Item , config:BattlePassConfig):boolean {
        if (!privateData || !config || !config.passItems) return true;
        for (let i = 0 ; i < config.passItems.length ; i++) {
            if (!Utils.checkBitFlag(privateData.nflag1 , i)) {
                return false;
            }
        }
        return true;
    }

    checkBattlePassItemOpen(config:BattlePassConfig):boolean {
        if (!config || !config.baseItem) return false;
        let privateItemData = this.getBattlePassPrivateData(config.baseItem.nid);

        let tempTime =  (config.baseItem.nvalidtimes +  privateItemData.nopentimes - (GlobalVal.getServerTime() * 0.001));
        cc.log('id:' , config.baseItem.nid , 'nvalidtimes:' , config.baseItem.nvalidtimes , 'nopentimes:' , privateItemData.nopentimes , "now:" , (GlobalVal.getServerTime() * 0.001) , "剩余时间：" , tempTime);

        return !this.isBattlePassFinished(config.baseItem.nid) &&
                config.baseItem.nopenwarid <= Game.sceneNetMgr.getCurWarID() &&
                (config.baseItem.nvalidtimes +  privateItemData.nopentimes - (GlobalVal.getServerTime() * 0.001) > 0);
    }

    //////////////////////////////////////////
    /**通行证2 配置 */
    private onBattlePass2Config(data:GS_SceneBattlePass2Config) {
        cc.log("战场通行证2", data);
        this._battlePass2Config = data;
        this._battlePass2ConfigPassItemDic.clear();

        let itemData:GS_SceneBattlePass2Config_BaseItem;
        let index = 0;
        for (let i = 0 ; i < this._battlePass2Config.ubaseitemcount ; i++) {
            itemData = this._battlePass2Config.data1[i];
            this._battlePass2ConfigPassItemDic[itemData.nid] = data.data2.slice(index , index + itemData.btpassitemcount);
            index += itemData.btpassitemcount;
        }

        GameEvent.emit(EventEnum.REFRESH_BATTLE_PASS2);

        const config = this.getCurBattlePass2ConfigItem();
        if (config) {
            SysMgr.instance.clearTimer(Handler.create(this.onCheckBattlePass2Timer , this));
            SysMgr.instance.doOnce(Handler.create(this.onCheckBattlePass2Timer , this) , (config.nendtime * 1000 - GlobalVal.getServerTime() + 1000) , true);
        }
    }


    private onCheckBattlePass2Timer() {
        GameEvent.emit(EventEnum.REFRESH_BATTLE_PASS2);
    }

    /**通行证2 个人数据 */
    private onBattlePass2Private(data:GS_SceneBattlePass2Private) {
        this._battlePass2PrivateData = data;
        this.refreshBattlePass2RedPoint();
        GameEvent.emit(EventEnum.REFRESH_BATTLE_PASS2);
    }

    /**通行证2 订单 */
    private onBattlePass2SetOrder(data:GS_SceneBattlePass2SetOrder) {
        Game.mallProto.payOrder(data.szorder);
    }

    /**通行证2 视频订单 */
    private onBattlePass2FreeVideo(data:GS_SceneBattlePass2FreeVideo) {
        Game.nativeApi.showRewardAd(Game.actorMgr.nactordbid.toString(), data.szorder , data.szsdkkey);
    }

    private refreshBattlePass2RedPoint() {
        if (!this._battlePass2Config || !this._battlePass2PrivateData) return;
        const config = this.getCurBattlePass2ConfigItem();
        if (!config) return;
        const passItems = this.getBattlePass2ConfigPassItem(config.nid);
        const privateData = this.getCurBattlePass2Private(config);
        if (!privateData || !passItems) return;
        let progressValue = Utils.getDiffDay(config.nstarttime * 1000 , Math.floor(GlobalVal.getServerTime()));
        let geted,geted2,geted3,flag;

        for (let i = 0; i < passItems.length; i++) {
            if (progressValue >= passItems[i].nday) {
                geted = Utils.checkBitFlag(privateData.nflag1 , i);
                geted2 = Utils.checkBitFlag(privateData.nflag2 , i);
                geted3 = Utils.checkBitFlag(privateData.nflag3 , i);
                let state = 0;
                switch (privateData.btmode) {
                    case 2:
                        if (geted && geted2 && geted3) {
                            state = 1;
                        } else if (geted || geted2 || geted3) {
                            state = 2;
                        }
                        break;
                    case 1:
                        if (geted && geted2) {
                            state = 1;
                        } else if (geted || geted2) {
                            state = 2;
                        }
                        break;
                    case 0:
                        if (geted) {
                            state = 1;
                        }
                        break;
                
                    default:
                        break;
                }

                if (state != 1) {
                    flag = true;
                    break;
                }
            }
        }

        let node = Game.redPointSys.findRedPointNode(EVENT_REDPOINT.LOGIN_FUND);
        if (node) {
            node.setRedPointNum(flag ? 1 : 0);
        }
    }

    ////////////////////////////////////////
    private onBattlePass3Config(data:GS_SceneBattlePass3Config) {
        cc.log("战场通行证配置3", data);
        this._battlePassConfig3 = [];
        if (data.data1 && data.data2) {
            let startIndex = 0, item: BattlePassConfig3;
            for (const baseitem of data.data1) {
                item = { baseItem: baseitem, passItems: data.data2.slice(startIndex, startIndex + baseitem.btpassitemcount) };
                this._battlePassConfig3.push(item);
                startIndex += baseitem.btpassitemcount;
            }
        }

        GameEvent.emit(EventEnum.REFRESH_BATTLE_PASS3);
        // this.refreshBattlePassRedPoint();
    }

    private onBattlePass3Private(data:GS_SceneBattlePass3Private) {
        this._battlePass3PrivateData = data;
        this.checkBattlePass3RedPoint();
        GameEvent.emit(EventEnum.REFRESH_BATTLE_PASS3);
    }

    private onBattlePass3SetOrder(data:GS_SceneBattlePass3SetOrder) {
        Game.mallProto.payOrder(data.szorder)
    }

    private onBattlePass3FreeVideo(data:GS_SceneBattlePass3FreeVideo) {
        Game.nativeApi.showRewardAd(Game.actorMgr.nactordbid.toString() , data.szorder , data.szsdkkey);
    }

    isAllBattlePass3Finished(): boolean {
        const configs = this.getBattlePassConfog3();
        if (configs && configs.length > 0) {
            let config = configs[0];
            const privateDatas = this._battlePass3PrivateData;
            if (privateDatas && privateDatas.uitemcount > 0) {
                const passItems = config.passItems;
                const privateData = privateDatas.items[0];
                for (let i = 0 ; i < passItems.length ; i++) {

                    if (!Utils.checkBitFlag(privateData.nflag1 , i) 
                        || !Utils.checkBitFlag(privateData.nflag2 , i) 
                        || !Utils.checkBitFlag(privateData.nflag3 , i)) {
                        return false;
                    }
                }
            }
        }
  
        return true;
    }

    isAllBattlePass4Finished(): boolean {
        const config = this.getBattlePassConfog4();
        if (config) {
            const privateData = this.getBattlePassPrivate4Item(config.baseItem.nid);
            if (privateData) {
                const passItems = config.passItems;
                for (let i = 0 ; i < passItems.length ; i++) {
                    if (!Utils.checkBitFlag(privateData.nflag1 , i) 
                        || !Utils.checkBitFlag(privateData.nflag2 , i) 
                        || !Utils.checkBitFlag(privateData.nflag3 , i)) {
                        return false;
                    }
                }
            }    
        }       
        return true;
    }

    private checkBattlePass3RedPoint() {
        if (!this._battlePassConfig3 || this._battlePassConfig3.length == 0 || !this._battlePass3PrivateData || this._battlePass3PrivateData.uitemcount == 0) return;
        const config = this._battlePassConfig3[0];
        const privateItem = this._battlePass3PrivateData.items[0];
        if (!config || !privateItem) return;
        const len = config.passItems.length;
        const warid = Game.sceneNetMgr.getLastWarID();
        let flag = false;
        for (let i = 0 ; i < len ; i++) {

            if (warid >= config.passItems[i].nwarid) {
                if (!Utils.checkBitFlag(privateItem.nflag1 , i)) {
                    flag = true;
                    break;
                }

                if (!Utils.checkBitFlag(privateItem.nflag2 , i) && privateItem.btmode > 0) {
                    flag = true;
                    break;
                }

                if (!Utils.checkBitFlag(privateItem.nflag3 , i) && privateItem.btmode == 2) {
                    flag = true;
                    break;
                }

            }
        }

        let node = Game.redPointSys.findRedPointNode(EVENT_REDPOINT.BATTLE_PASS3);
        if (node) {
            node.setRedPointNum(flag ? 1 : 0);
        }

    }

    /////////////////////////////////////////////
    private onBattlePass4Config(data:GS_SceneBattlePass4Config) {
        cc.log("战场通行证配置4", data);
        this._battlePassConfig3 = [];
        if (data.data1 && data.data2) {
            let startIndex = 0, item: BattlePassConfig4;
            for (const baseitem of data.data1) {
                item = { baseItem: baseitem, passItems: data.data2.slice(startIndex, startIndex + baseitem.btpassitemcount) };
                this._battlePassConfig4.push(item);
                startIndex += baseitem.btpassitemcount;
            }
        }

        GameEvent.emit(EventEnum.REFRESH_BATTLE_PASS4);
    }

    private onBattlePass4Private(data:GS_SceneBattlePass4Private) {
        this._battlePass4PrivateData = data;

        if (this._preGetSignData) {

            let privateItem = this.getBattlePassPrivate4Item(this._preGetSignData.nid);
            if (privateItem && Utils.checkBitFlag(privateItem.nsignflag , this._preGetSignData.btindex)) {
                this.reqBattlePass4GetReward(this._preGetSignData.nid , this._preGetSignData.btindex);
                this._preGetSignData = null;
                return;
            }
            this._preGetSignData = null;
        }

        this.checkBattlePass4RedPoint();
        GameEvent.emit(EventEnum.REFRESH_BATTLE_PASS4);
    }

    private onBattlePass4SetOrder(data:GS_SceneBattlePass4SetOrder) {
        Game.mallProto.payOrder(data.szorder)
    }

    private onBattlePass4FreeVideo(data:GS_SceneBattlePass4FreeVideo) {
        Game.nativeApi.showRewardAd(Game.actorMgr.nactordbid.toString() , data.szorder , data.szsdkkey);
    }

    private onBattlePass4SetSignFv(data:GS_SceneBattlePass4SetSignFV) {
        Game.nativeApi.showRewardAd(Game.actorMgr.nactordbid.toString() , data.szorder , data.szsdkkey);
    }

    private checkBattlePass4RedPoint() {
        const config = this.getBattlePassConfog4();
        let flag = false;
        if (config) {
            const privateItem = this.getBattlePassPrivate4Item(config.baseItem.nid);
            if (privateItem) {
                const len = config.passItems.length;
                const curday = Game.actorMgr.getChannelOpenDays();
                for (let i = 0 ; i < len ; i++) {
        
                    if (curday >= (config.passItems[i].nday + config.baseItem.nstartday)) {
                        if (!Utils.checkBitFlag(privateItem.nflag1 , i)) {
                            flag = true;
                            break;
                        }
        
                        if (!Utils.checkBitFlag(privateItem.nflag2 , i) && (privateItem.btmodeflag & 0x1) != 0) {
                            flag = true;
                            break;
                        }
        
                        if (!Utils.checkBitFlag(privateItem.nflag3 , i) && (privateItem.btmodeflag & 0x2) != 0) {
                            flag = true;
                            break;
                        }
        
                    }
                }
            }
        }

        let node = Game.redPointSys.findRedPointNode(EVENT_REDPOINT.BATTLE_PASS4);
        if (node) {
            node.setRedPointNum(flag ? 1 : 0);
        }
    }
}