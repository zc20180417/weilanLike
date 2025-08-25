import BaseNetHandler from "../socket/handler/BaseNetHandler";
import { CMD_ROOT, GOODS_ID, GS_PLAZA_MSGID, MONSTER_STATE } from "../socket/handler/MessageEnum";
import { GS_PLAZA_MONSTERMANUAL_MSG, GS_MonsterManualInfo, GS_MonsterManualInfo_MonsterItem, GS_MonsterManualBox, GS_MonsterManualBox_MonsterBoxItem, GS_MonsterManualGetDetails, GS_MonsterManualSetDetails, GS_MonsterManualListData, GS_MonsterManualUpDate, GS_MonsterMaunalGetReward, GS_MonsterManualListData_MonsterItem } from "../proto/DMSG_Plaza_Sub_MonsterManual";
import { Handler } from "../../utils/Handler";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { EVENT_REDPOINT } from "../../redPoint/RedPointSys";
import { GS_RewardTips_RewardGoods } from "../proto/DMSG_Plaza_Sub_Tips";
import { UiManager } from "../../utils/UiMgr";
import { EResPath } from "../../common/EResPath";
import { Encryption } from "../../utils/EncryptionValue";
import { GameEvent } from "../../utils/GameEvent";
import { MonsterConfig } from "../../common/ConfigInterface";

export class MonsterManualMgr extends BaseNetHandler {

    private _monsterDic: { [key: string]: GS_MonsterManualInfo_MonsterItem; } = {};
    private _monsterBoxDic: { [key: string]: GS_MonsterManualBox_MonsterBoxItem; } = {};

    private _monsterInfo: object = {};//所有进行图鉴的怪物信息
    private _monsterDetailInfo: Map<number, any> = new Map();//缓存请求的怪物详情信息

    private _monsterPrivateListData: GS_MonsterManualListData = null;
    private _mosnterPrivateDataMap: Map<number, GS_MonsterManualListData_MonsterItem> = new Map();

    //private _activeMonsterInfo: Map<number, boolean> = new Map();

    private _isMonsterInfoInit: boolean = false;//怪物配置是否下发
    private _isMonsterPirvateDataInit: boolean = false;//怪物个人数据是否下发

    private _bookCfg: any = null;
    private _clientMonsterCfgs:{[key:number] : MonsterConfig} = {};

    constructor() {
        super(CMD_ROOT.CMDROOT_PLAZA_MSG, GS_PLAZA_MSGID.GS_PLAZA_MSGID_MONSTERMANUAL);
        this._clientMonsterCfgs = Game.gameConfigMgr.getCfg(EResPath.MONSTER);
    }

    register() {
        this.registerAnaysis(GS_PLAZA_MONSTERMANUAL_MSG.PLAZA_MONSTERMANUAL_INFO, Handler.create(this.onMonsterInfo, this), GS_MonsterManualInfo);
        this.registerAnaysis(GS_PLAZA_MONSTERMANUAL_MSG.PLAZA_MONSTERMANUAL_LISTDATA, Handler.create(this.onMonsterListData, this), GS_MonsterManualListData);
        this.registerAnaysis(GS_PLAZA_MONSTERMANUAL_MSG.PLAZA_MONSTERMANUAL_UPDATE, Handler.create(this.onMonsterUpdate, this), GS_MonsterManualUpDate);
        this.registerAnaysis(GS_PLAZA_MONSTERMANUAL_MSG.PLAZA_MONSTERMANUAL_BOX, Handler.create(this.onMonsterBox, this), GS_MonsterManualBox);
        this.registerAnaysis(GS_PLAZA_MONSTERMANUAL_MSG.PLAZA_MONSTERMANUAL_SETDETAILS, Handler.create(this.onMonsterInfoRet, this), GS_MonsterManualSetDetails);

        GameEvent.on(EventEnum.NEW_MONSTER_CAN_GETREWARD, this.onNewMonsterCanGerReward, this);
        
    }

    exitGame() {
        this._isMonsterPirvateDataInit = false;//怪物个人数据是否下发
        this._monsterPrivateListData = null;
        this._mosnterPrivateDataMap.clear();
    }

    /**怪物图鉴配置 */
    private onMonsterInfo(data: GS_MonsterManualInfo) {
        cc.log("怪物图鉴配置", data);
        if (data.btclientclear == 1) {
            this._monsterInfo = {};
        }
        data.monsterlist.forEach(element => {
            this._monsterDic[element.nmonsterid] = element;
            Encryption.wrapIntProp(element, ["udropgold"]);
            //过滤掉不需要图鉴的怪物
            if (element.btbookstagid !== 0) {
                this._monsterInfo[element.btbookstagid] = this._monsterInfo[element.btbookstagid] || [];
                this._monsterInfo[element.btbookstagid].push(element);
            }
        });


        for (let key in this._monsterInfo) {
            //排序
            this._monsterInfo[key].sort((a, b) => {
                return a.btbookssortid - b.btbookssortid;
            });
        }


        this._isMonsterInfoInit = true;
        this.refreshRedPoint();
        GameEvent.emit(EventEnum.MODULE_INIT, GS_PLAZA_MSGID.GS_PLAZA_MSGID_MONSTERMANUAL);
        
    }


    /**怪物图签激活的个人数据 */
    private onMonsterListData(data: GS_MonsterManualListData) {
        cc.log("怪物图签激活的个人数据", data);
        this._monsterPrivateListData = data;
        if (data.monsterlist) {
            data.monsterlist.forEach((v) => {
                this._mosnterPrivateDataMap.set(v.nmonsterid, v);
            });
        }

        this._isMonsterPirvateDataInit = true;
        this.refreshRedPoint();
    }

    /**
     * 刷新红点数据
     */
    private refreshRedPoint() {
        return;
        if (!this._isMonsterInfoInit || !this._isMonsterPirvateDataInit) return;
        for (let key in this._monsterInfo) {
            //排序
            this._monsterInfo[key].forEach(element => {
                let redNode = Game.redPointSys.findRedPointNode(EVENT_REDPOINT.TUJIAN_GUAIWU + "-" + element.nmonsterid);
                if (redNode) {
                    if (this.isMonsterUnlock(element.nmonsterid) && !this.isMonsterGetedRewrad(element.nmonsterid)) {
                        redNode.setRedPointNum(1);
                    }
                }
            });
        }
    }

    /**
     * 新怪物图鉴可以领取奖励
     * @param monsterId 
     */
    private onNewMonsterCanGerReward(monsterId: number) {
        GameEvent.emit(EVENT_REDPOINT.TUJIAN_GUAIWU + "-" + monsterId, 1);
    }

    /**
     * 更新怪物信息
     * @param data GS_MonsterManualUpDate
     */
    private onMonsterUpdate(data: GS_MonsterManualUpDate) {
        cc.log("更新怪物信息", data);
        if (!data) return;
        let monsterData = this._mosnterPrivateDataMap.get(data.nmonsterid);
        if (!monsterData) {
            monsterData = new GS_MonsterManualListData_MonsterItem();
            monsterData.nmonsterid = data.nmonsterid;
            monsterData.nkillcount = this.getMonsterKillNum(data.nmonsterid);
            this._mosnterPrivateDataMap.set(data.nmonsterid, monsterData);
        }
        monsterData.btstate = data.btstate;
        if (data.btstate !== MONSTER_STATE.UNGETED) {
            GameEvent.emit(EVENT_REDPOINT.TUJIAN_GUAIWU + "-" + data.nmonsterid, -1);
            //展示获得的奖励
            let list = [];
            if (data.nrewardfaceid > 0) {
                let item = new GS_RewardTips_RewardGoods();
                item.sgoodsnum = 1;
                item.sgoodsid = data.nrewardfaceid;
                list.push(item);
            }
            let item = new GS_RewardTips_RewardGoods();
            item.sgoodsnum = data.ndiamonds;
            item.sgoodsid = GOODS_ID.DIAMOND;
            list.push(item);
            UiManager.showTopDialog(EResPath.NEW_GOODS_VIEW, { list: list, isTujianReward: true });
        }
        GameEvent.emit(EventEnum.ON_MONSTER_UPDATE, monsterData);
    }


    /**刷怪盒子数据 */
    private onMonsterBox(data: GS_MonsterManualBox) {
        /*
        __SLONG		(nMonsterBoxID);		//怪物盒ID
        __SLONGS	(nMonsterID,8);			//怪物ID	
        __SLONGS	(nBronSpaceTimes,8);	//刷新间隔(毫秒）
        __SLONG		(nRandCount);			//循环次数	
        __UCHAR		(btRandMode);			//循环模式（0:首尾循环(12-12-12) 1：尾循环(12-22) 2：反序循环（12-21-12）
        */
        if (data.btstate == 0) {
            this._monsterBoxDic = {};
        }
        if (data.uitemcount == 0) return;

        data.monsterboxlist.forEach(element => {
            this._monsterBoxDic[element.nmonsterboxid] = element;
        });
    }

    /**
     * 请求怪物信息
     * @param monsterId 
     */
    public reqMonserInfo(monsterId: number) {
        let data: GS_MonsterManualGetDetails = new GS_MonsterManualGetDetails();
        data.nmonsterid = monsterId;
        this.send(GS_PLAZA_MONSTERMANUAL_MSG.PLAZA_MONSTERMANUAL_GETDETAILS, data);
    }

    /**
     * 领取奖励
     * @param monsterId 怪物id
     */
    public getReward(monsterId: number) {
        if (monsterId === null && monsterId === undefined) return;
        let data: GS_MonsterMaunalGetReward = new GS_MonsterMaunalGetReward();
        data.nmonsterid = monsterId;
        this.send(GS_PLAZA_MONSTERMANUAL_MSG.PLAZA_MONSTERMANUAL_GETREWARD, data);
    }

    /**
     * 怪物信息返回
     * @param data 
     */
    public onMonsterInfoRet(data: GS_MonsterManualSetDetails) {
        cc.log("怪物信息返回：", data);
        // this._monsterInfo[data.nmonsterid] = data;
        this._monsterDetailInfo.set(data.nmonsterid, data);
        GameEvent.emit(EventEnum.SHOW_MONSTER_INFO, data);
    }

    /**
     * 获取怪物图鉴信息
     * @param monsterId 
     */
    getMonsterInfo(monsterId: number): GS_MonsterManualSetDetails {
        // if (this._monsterInfo && this._monsterInfo[monsterId]) {
        //     return this._monsterInfo[monsterId];
        // } else {
        //     this.reqMonserInfo(monsterId);
        // }
        if (this._monsterDetailInfo.has(monsterId)) {
            return this._monsterDetailInfo.get(monsterId);
        } else {
            this.reqMonserInfo(monsterId);
        }
        return null;
    }

    getMonsterCfg(id: number): MonsterConfig {
        return this._clientMonsterCfgs[id];
    }

    getMonsterBoxData(id: number): GS_MonsterManualBox_MonsterBoxItem {
        return this._monsterBoxDic[id];
    }

    /**
     * 获取所有怪物图鉴信息
     */
    public getAllkMonsterInfo(): object {
        return this._monsterInfo;
    }

    /**
     * 怪物是否解锁
     * @param monsterId 
     */
    public isMonsterUnlock(monsterId: number): boolean {
        let monsterCfg = this.getMonsterCfg(monsterId);
        let canUnlock = false;
        canUnlock = Game.sceneNetMgr.getLastWarID() >= monsterCfg.nopenwarid
            && this.getMonsterKillNum(monsterId) >= monsterCfg.nopenkillcount
        return canUnlock;
    }

    /**
     * 怪物是否领取奖励
     * @param monsterId 
     */
    public isMonsterGetedRewrad(monsterId: number) {
        let monsterPrivateData = this._mosnterPrivateDataMap.get(monsterId);
        //老数据的状态有0,1,2三态，为了适配老的数据，判断已领取的条件为!= 0
        return monsterPrivateData && monsterPrivateData.btstate !== MONSTER_STATE.UNGETED;
    }

    /**
     * 获取怪物的私有数据
     * @param monsterId number
     */
    public getMonsterPrivateData(monsterId: number): GS_MonsterManualListData_MonsterItem {
        return this._mosnterPrivateDataMap.get(monsterId);
    }

    /**
     * 获取怪物击杀数
     * @param monsterId 
     */
    public getMonsterKillNum(monsterId: number): number {
        let monsterPrivateData = this.getMonsterPrivateData(monsterId);
        let killNum = Game.sceneNetMgr.getMonsterKillNum(monsterId);
        return killNum > 0 ? killNum : (monsterPrivateData ? monsterPrivateData.nkillcount : 0);
    }


    readData() {
        this._bookCfg = Game.gameConfigMgr.getCfg(EResPath.BOOK_UNLOCK_CFG);
    }

    getBookUnlockCfg(monsterId: number): any {
        return this._bookCfg && this._bookCfg[monsterId];
    }
}