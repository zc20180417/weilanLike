import { BuryingPointMgr, EBuryingPoint } from "../../buryingPoint/BuryingPointMgr";
import { MonsterConfig } from "../../common/ConfigInterface";
import { EResPath } from "../../common/EResPath";
import { EventEnum } from "../../common/EventEnum";
import SysMgr from "../../common/SysMgr";
import Game from "../../Game";
import GlobalVal from "../../GlobalVal";
import { Encryption } from "../../utils/EncryptionValue";
import { GameEvent } from "../../utils/GameEvent";
import { Handler } from "../../utils/Handler";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import { UiManager } from "../../utils/UiMgr";
import Utils from "../../utils/Utils";
import { GS_GoodsInfoReturn_GoodsInfo } from "../proto/DMSG_Plaza_Sub_Goods";
import { GS_MonsterManualInfo_MonsterItem } from "../proto/DMSG_Plaza_Sub_MonsterManual";
import { GS_SceneThingInfo_ThingItem, GS_SceneWorldInfo, GS_SceneWorldData, GS_SceneBattleData, GS_SceneSetTeachingInfo, GS_PLAZA_SCENE_MSG, GS_SceneThingInfo, GS_SceneSetWorldWarList, GS_SceneSetWarDetails, GS_SceneWarFinish, GS_SceneOpenWar, GS_SceneWarFail, GS_SceneWarFreeVideo, GS_SceneSetPerfectReward, GS_SceneSetAddFreeVideo, GS_SceneFullHP, GS_SceneSetFullHPFreeVideo, GS_SceneSetTeachingFV, GS_MonsterDieDrop, GS_SceneSetExperienceWar, GS_SceneSetLostFV, GS_SceneFinishLostFV, GS_SceneSetWarTroopsOrder, GS_SceneGetFullHPFreeVideo, GS_SceneFullHPDiamonds, GS_SceneWorldInfo_WorldItem, GS_SceneWorldInfo_HardWorldItem, GS_SceneSetWorldWarList_WorldWarItem, GS_SceneWorldData_WolrdData, GS_SceneGetWarDetails, GS_SceneGetWorldWarList, GS_SceneRequestWar, GS_SceneRequestWarFinish, GS_SceneRequestWarFail, GS_SceneWarUseSkill, GS_SceneKillMonster, GS_SceneRequestExperienceWar, GS_SceneGetWarTroopsOrder, GS_SceneGetLostFV, GS_SceneGetPerfectReward, GS_SceneGetAddFreeVideo, GS_SceneUseLostAddAttackPer, GS_SceneGetTeachingFV, GS_SceneWorldData_Base, GS_SceneHead } from "../proto/DMSG_Plaza_Sub_Scene";
import BaseNetHandler from "../socket/handler/BaseNetHandler";
import { ServerDefine, CMD_ROOT, GS_PLAZA_MSGID, SCOREFLAG, GOODS_TYPE } from "../socket/handler/MessageEnum";




export class SceneNetMgr extends BaseNetHandler {

    private _sceneThingDic: { [key: string]: GS_SceneThingInfo_ThingItem; } = {};
    private _chapterReqData: any = {};
    private _allCpScoreData: any = {};
    //困难模式
    private _allHardCpScoreData: any = {};

    private _worldInfo: GS_SceneWorldInfo = null;
    private _worldData: GS_SceneWorldData = null;
    private _battleData: GS_SceneBattleData = null;
    private _warDetails: any = {};
    private _reqWarDetailsTime: any = {};

    //当前章节id
    private _curWorldID: number = 1;
    //当前困难关卡章节id
    private _curHardWorldId: number = 1;

    //当前应该挑战的关卡
    private _curWarID: number = 1;
    //当前应该挑战的困难关卡id
    private _curHardWarId: number = ServerDefine.WARHARD_STARID;
    private _curHardWarIds: any = {};

    private _curPlayWarID: number = 0;
    private _curPlayWorldID: number = 0;
    private _curTipsWarID: number = -1;

    private _chapterInfoDic: any = {};


    private _teachingInfo: GS_SceneSetTeachingInfo;
    private _monsterKillMap: Map<number, number> = new Map();//怪物击杀统计
    private _tallServerSkillSceneItem: any = {};
    private _inMap: boolean = false;

    jiangBeiInfo: any[] = [
        { name: "铜质奖杯", info: "通关时招财猫血量少于7点或青铜时间内通关限时关卡可获得铜质奖杯" },
        { name: "银质奖杯", info: "通关时招财猫血量不少于7点或白银时间内通关限时关卡可获得银质奖杯" },
        { name: "金质奖杯", info: "通关时招财猫满血状态或黄金时间内通关限时关卡可获得金质奖杯" },
    ];

    clearSceneInfo = { name: "场景全清奖杯", info: "通关时清空了关卡中所有景物即可获得场景全清奖杯" };
    threeStarInfo = { name: "三星任务奖杯", info: "完成了本关三个关卡任务（可以非一次性完成）即可获得三星任务奖杯" };

    

    constructor() {
        super(CMD_ROOT.CMDROOT_PLAZA_MSG, GS_PLAZA_MSGID.GS_PLAZA_MSGID_SCENE);
    }

    register() {
        this.registerAnaysis(GS_PLAZA_SCENE_MSG.PLAZA_SCENE_THINGINFO, Handler.create(this.oSceneThingInfo, this), GS_SceneThingInfo);
        this.registerAnaysis(GS_PLAZA_SCENE_MSG.PLAZA_SCENE_SETWORLDWARLIST, Handler.create(this.onSetWorldWarList, this), GS_SceneSetWorldWarList);
        this.registerAnaysis(GS_PLAZA_SCENE_MSG.PLAZA_SCENE_SETWARDETATLS, Handler.create(this.onSetWarDetails, this), GS_SceneSetWarDetails);
        this.registerAnaysis(GS_PLAZA_SCENE_MSG.PLAZA_SCENE_WORLDINFO, Handler.create(this.onSceneWorldInfo, this), GS_SceneWorldInfo);
        this.registerAnaysis(GS_PLAZA_SCENE_MSG.PLAZA_SCENE_WORLDDATA, Handler.create(this.onSceneWorldData, this), GS_SceneWorldData);
        this.registerAnaysis(GS_PLAZA_SCENE_MSG.PLAZA_SCENE_WARFINISH, Handler.create(this.onSceneWarFinish, this), GS_SceneWarFinish);
        this.registerAnaysis(GS_PLAZA_SCENE_MSG.PLAZA_SCENE_OPENWAR, Handler.create(this.onSceneOpenWar, this), GS_SceneOpenWar);
        this.registerAnaysis(GS_PLAZA_SCENE_MSG.PLAZA_SCENE_WARFAIL, Handler.create(this.onSceneWarFail, this), GS_SceneWarFail);
        this.registerAnaysis(GS_PLAZA_SCENE_MSG.PLAZA_SCENE_WARFREEVIDEO, Handler.create(this.onWarFreeVideo, this), GS_SceneWarFreeVideo);
        this.registerAnaysis(GS_PLAZA_SCENE_MSG.PLAZA_SCENE_SETPERFECTREWARD, Handler.create(this.onGetPerfectReward, this), GS_SceneSetPerfectReward);
        this.registerAnaysis(GS_PLAZA_SCENE_MSG.PLAZA_SCENE_SETWARFINISHFREEVIDEO, Handler.create(this.onGetFreeVideo, this), GS_SceneSetAddFreeVideo);
        this.registerAnaysis(GS_PLAZA_SCENE_MSG.PLAZA_SCENE_FULLHP, Handler.create(this.onFullUp, this), GS_SceneFullHP);
        this.registerAnaysis(GS_PLAZA_SCENE_MSG.PLAZA_SCENE_SETFULLHPFREEVIDEO, Handler.create(this.onFullUpFreeVideo, this), GS_SceneSetFullHPFreeVideo);
        this.registerAnaysis(GS_PLAZA_SCENE_MSG.PLAZA_SCENE_BATTLEDATA, Handler.create(this.onBattleData, this), GS_SceneBattleData);
        this.registerAnaysis(GS_PLAZA_SCENE_MSG.PLAZA_SCENE_SETTEACHINGFV, Handler.create(this.onSetTeachingFv, this), GS_SceneSetTeachingFV);
        this.registerAnaysis(GS_PLAZA_SCENE_MSG.PLAZA_SCENE_SETTEACHINGINFO, Handler.create(this.onSetTeachingInfo, this), GS_SceneSetTeachingInfo);
        this.registerAnaysis(GS_PLAZA_SCENE_MSG.PLAZA_SCENE_MONSTERDIEDROP, Handler.create(this.onMonsterDieDrop, this), GS_MonsterDieDrop);
        this.registerAnaysis(GS_PLAZA_SCENE_MSG.PLAZA_SCENE_SETEXPERIENCEWAR, Handler.create(this.onSetExperienceWar, this), GS_SceneSetExperienceWar);
        this.registerAnaysis(GS_PLAZA_SCENE_MSG.PLAZA_SCENE_SETLOSTFV, Handler.create(this.onSetLostFv, this), GS_SceneSetLostFV);
        this.registerAnaysis(GS_PLAZA_SCENE_MSG.PLAZA_SCENE_FINISHLOSTFV, Handler.create(this.onFinishLostFV, this), GS_SceneFinishLostFV);

        this.registerAnaysis(GS_PLAZA_SCENE_MSG.PLAZA_SCENE_SETWARTROOPSORDER, Handler.create(this.onSetWarTroopsOrder, this), GS_SceneSetWarTroopsOrder);
        
        GameEvent.on(EventEnum.CREATURE_DIED, this.onCreatureDied, this);
    }

    protected exitGame() {
        //this._worldInfo = null;
        this._chapterReqData = {};
        this._allCpScoreData = {};
        this._allHardCpScoreData = {};

        this._worldData = null;
        this._warDetails = {};
        this._reqWarDetailsTime = {};

        //当前章节id
        this._curWorldID = 1;
        this._curHardWorldId = 1;
        //当前应该挑战的关卡
        this._curWarID = 1;
        this._curHardWarId = ServerDefine.WARHARD_STARID;
        this._curHardWarIds = {};
        this._curPlayWarID = 0;
        this._curPlayWorldID = 0;
        this._curTipsWarID = -1;
        //this._chapterInfoDic = {};
        this._monsterKillMap.clear();
        this._curReqWarid = -1;
        
        this._inMap = false;
    }

    /**
     * 请求满血复活视频
     * @param warId 
     */
    public reqFullUpByFreeVideo(warId: number) {
        cc.log("请求满血复活视频", warId);
        let data = new GS_SceneGetFullHPFreeVideo();
        data.nwarid = warId;
        this.send(GS_PLAZA_SCENE_MSG.PLAZA_SCENE_GETFULLHPFREEVIDEO, data);
    }

    /**
     * 使用钻石满血复活
     * @param warId 
     */
    public reqFullUpByDia(warId: number) {
        cc.log("使用钻石满血复活", warId);
        let data = new GS_SceneFullHPDiamonds();
        data.nwarid = warId;
        this.send(GS_PLAZA_SCENE_MSG.PLAZA_SCENE_GETFULLHPDIAMONDS, data);
    }

    private reqKillDoor() {
        let data:GS_SceneHead = new GS_SceneHead();
        this.send(GS_PLAZA_SCENE_MSG.PLAZA_SCENE_KILLDOOR, data);
    }

    /**获取战斗数据 */
    getBattleData(): GS_SceneBattleData {
        return this._battleData;
    }

    /**获取场景物件数据 */
    getSceneThingData(id: number): GS_SceneThingInfo_ThingItem {
        return this._sceneThingDic[id];
    }

    /**
     * 获取所有章节配置
     * @param bttype 关卡类型
     */
    getAllChapter(bttype: number = 0): GS_SceneWorldInfo_WorldItem[] {
        return this._chapterInfoDic[bttype];
    }

    getAllHardChapter(): GS_SceneWorldInfo_HardWorldItem[] {
        return this._worldInfo ? this._worldInfo.data2 : null;
    }

    /**
     * 获取章节配置
     * @param chapter 
     * @param btType 
     */
    getChapterInfo(chapter: number, btType: number = 0): GS_SceneWorldInfo_WorldItem {
        return this.getAllChapter(btType)[chapter - 1];
    }

    /**困难章节 */
    getHardChapterInfo(chapter: number): GS_SceneWorldInfo_HardWorldItem {
        let items: GS_SceneWorldInfo_HardWorldItem[] = this.getAllHardChapter();
        return items ? items[chapter - 1] : null;
    }

    /**
     * 获取章节是否有关卡数据
     * @param chapter 章节id
     * @param btType  关卡类型（0.普通 1.挑战)	
     * @param mode  （0,普通1,困难）
     */
    getChapterHavePointData(chapter: number, btType: number = 0, mode: number = 0): boolean {
        if (this._chapterReqData[btType] && this._chapterReqData[btType][chapter])
            return this._chapterReqData[btType][chapter][mode];
        return false;
    }

    /**
     * 获取关卡通关数据
     * @param pid 
     * @param mode (0:普通 ， 1:困难) 
     */
    getChapterPointData(pid: number, mode: number = 0): GS_SceneSetWorldWarList_WorldWarItem {
        let dic = mode == 0 ? this._allCpScoreData : this._allHardCpScoreData;
        let item: GS_SceneSetWorldWarList_WorldWarItem = dic[pid];

        if (!item) {
            item = new GS_SceneSetWorldWarList_WorldWarItem();
            item.nwarid = pid;
            item.uscoreflag = 0;
            dic[pid] = item;
        }
        return item;
    }

    /**
     * 获取章节数据
     * @param id 
     * @param btType 
     */
    getChapterData(id: number, btType: number): GS_SceneWorldData_WolrdData {
        let worldData: GS_SceneWorldData_WolrdData;
        if (this._worldData) {
            for (let i = 0; i < this._worldData.uitemcount; i++) {
                worldData = this._worldData.data2[i];
                if (worldData && worldData.bttype == btType && worldData.nworldid == id) {
                    return worldData;
                }
            }
        } else {
            this.initWorldData();
        }

        if (!worldData) {
            worldData = new GS_SceneWorldData_WolrdData();
            worldData.bttype = btType;
            worldData.nstr = 0;
            worldData.nworldid = id;
            worldData.btperfect = 0;
            worldData.uperfectcount = 0;
            worldData.nfullhpwarcount = 0;
            worldData.nfulltaskwarcount = 0;
            worldData.nclearthingwarcount = 0;
            this._worldData.uitemcount ++;
            this._worldData.data2.push(worldData);
        }

        return worldData;
    }

    /**
     * 章节是否已解锁
     * @param id 
     * @param btType 
     */
    isChapterUnlock(id: number, btType: number): boolean {
        let chapter: GS_SceneWorldInfo_WorldItem = this.getChapterInfo(id, btType);
        if (!chapter) return false;


        let len = chapter.nconditionid.length;
        if (len > 0 && chapter.ntotalstar > 0) {
            if (this._worldData && this._worldData.data1[0].nlastwarid < chapter.nstartwarid - 1) {
                return false;
            }

            let chapterData = this.getChapterData(id, btType);
            return chapterData.nstr >= chapter.ntotalstar;
        }

        return true;
    }

    /**困难章节是否已解锁 */
    isHardChapterUnlock(id: number): boolean {
        let chapter: GS_SceneWorldInfo_HardWorldItem = this.getHardChapterInfo(id);
        if (!chapter) return false;

        return this.isPerfectFinishWorld(id);
    }

    isAllWorldWarFinish(worldid: number): boolean {
        let worldInfo = this.getChapterInfo(worldid, 0);
        return this.getCurWarID() >= worldInfo.nendwarid;
    }

    /**
     * 关卡是否解锁
     * @param id 关卡id
     * @param worldid 章节id
     * @param btType 关卡类型
     * @param mode 关卡模式(0:普通 1困难)
     * @returns 
     */
    isCheckPointUnlock(id: number, worldid: number, btType: number = 0, mode: number = 0): boolean {
        if (mode == ServerDefine.WAR_MODEL_NORMAL) {
            let curWarid = this._curWarID;
            if (id > 1) {
                if (this._worldData) {
                    if (curWarid > id) {
                        return true;
                    }

                    return id == curWarid;
                }
                return false;
            }
            return true;
        } else {

            let len = this._worldInfo.data2 ? this._worldInfo.data2.length : 0;
            for (let i = 0; i < len; i++) {
                if (this._worldInfo.data2[i].nstartwarid == id) {
                    return this.isHardChapterUnlock(this._worldInfo.data2[i].nworldid);
                }
            }

            return this.getChapterPointData(id - 1, ServerDefine.WAR_MODEL_HARD).uscoreflag > 0;
        }
    }

    /**当前关卡上限id */
    getCurWarID(): number {
        return this._curWarID;
    }

    /**当前困难关卡上限id */
    getCurHardWarID(worldID: number): number {
        return this._curHardWarIds[worldID] || ServerDefine.WARHARD_STARID;
    }

    getTipsWarID(): number {
        return this._curTipsWarID;
    }

    /**当前章节 */
    getCurWorldID(): number {
        return this._curWorldID;
    }

    /**通关的最大关卡id */
    getLastWarID(): number {
        return this._worldData && this._worldData.data1 ? this._worldData.data1[0].nlastwarid : 1;
    }

    /**通关的最大关卡的通关时间 */
    getLastWarFinishTime(): number {
        return this._worldData && this._worldData.data1 ? this._worldData.data1[0].nlastwarfinishtime : 1;
    }

    public getHardWarOpenId() {
        return this._worldData && this._worldData.data1 ? this._worldData.data1[0].nopenhardmodewarid : 1;
    }

    getWorldData(): GS_SceneWorldData {
        if (!this._worldData) {
            this.initWorldData();
        }
        return this._worldData;
    }

    /**当前挑战的id */
    getPlayWarID(): number {
        return this._curPlayWarID;
    }

    /**当前挑战的章节id */
    getPlayWorldID(): number {
        return this._curPlayWorldID;
    }

    /**重置当前挑战的关卡id */
    resetPlayWarID() {
        this._curPlayWarID = 0;
        this._curPlayWorldID = 0;
    }

    /**获取评分等级 */
    getWarGrade(flag: number): number {
        if ((flag & SCOREFLAG.SCOREFLAG_GRADE3) != 0) {
            return 3;
        }

        if ((flag & SCOREFLAG.SCOREFLAG_GRADE2) != 0) {
            return 2;
        }

        if ((flag & SCOREFLAG.SCOREFLAG_GRADE1) != 0) {
            return 1;
        }
        return 0;
    }

    /**
     * 通关关卡评分获取星星数量
     * @param flag 
     */
    calcStarCount(flag: number): number {
        let count = 0;

        for (let i = 1; i <= 3; i++) {
            if (this.checkTaskComplete(flag, i)) {
                count++;
            }
        }
        return count;
    }

    /**
     * 检测任务是否完成
     * @param flag 评分
     * @param index 任务index
     */
    checkTaskComplete(flag: number, index: number): boolean {
        return (flag & SCOREFLAG['SCOREFLAG_TASK' + index]) != 0;
    }

    /**
     * 检测关卡任务是否全部完成
     * @param flag 关卡评分
     */
    checkAllTaslComplete(flag: number): boolean {
        for (let i = 1; i <= 3; i++) {
            if (!this.checkTaskComplete(flag, i)) {
                return false;
            }
        }

        return true;
    }

    /**
     * 通过关卡id获取章节数据
     * @param warid 
     */
    getMapResObj(warid: number): any {
        if (this.isHideWar(warid) || this.isExperienceWar(warid)) {
            return this._worldInfo.hidewarshare;
        }

        let worldInfo: GS_SceneWorldInfo_WorldItem = this.getChapterByWarID(warid, 0);
        if (worldInfo) {
            return worldInfo;
        }

        return null;
    }

    /**是否是隐藏关卡 */
    isHideWar(id: number): boolean {
        return id > ServerDefine.WARMAX_COUNT && id < ServerDefine.WARHARD_STARID;
    }

    /**是否是试玩地图 */
    isExperienceWar(id: number): boolean {
        return id > ServerDefine.EXPERIENCE_STARTID;
    }

    isHardWar(id: number): boolean {
        return id >= ServerDefine.WARHARD_STARID && id < ServerDefine.WARHARD_MAXID;
    }
    /**
     * 是否能领完美通关奖励
     * @param flag 
     */
    checkCanGetPerfectAward(flag: number): boolean {
        return this.isPerfectPassWar(flag) && !this.checkGetPerfectAwarded(flag);
    }

    /**
     * 获取猫咪战斗力档位
     * @param battleNum 
     * @param minNum 
     */
    calcTowerBattleLevel(battleNum: number, minNum: number): number {
        let rate: number = battleNum / minNum;
        let battleLevel = 0;
        if (rate >= 1.30) {
            battleLevel = 6;
        } else if (rate >= 1.15) {
            battleLevel = 5;
        } else if (rate >= 1.05) {
            battleLevel = 4;
        } else if (rate <= 0.70) {
            battleLevel = 1;
        } else if (rate <= 0.85) {
            battleLevel = 2;
        } else if (rate <= 0.99) {
            battleLevel = 3;
        }
        return battleLevel;
    }

    showBatlleLevel(lvNodes: cc.Node[], battleLevel: number) {
        lvNodes.forEach(element => {
            element.active = false;
        });

        if (battleLevel != 0) {
            if (battleLevel <= 3) {
                for (let i = 0; i < 3; i++) {
                    if ((i + 1 - battleLevel) >= 0) {
                        lvNodes[i].active = (i + 1 - battleLevel) >= 0;
                    }
                }
            } /* else {
                for (let i = 3 ; i < 6 ; i++) {
                    if (i + 1 <= battleLevel) {
                        lvNodes[i].active = true;
                    }
                } 
            }*/
        }
    }

    getTeachingInfo(): GS_SceneSetTeachingInfo {
        return this._teachingInfo;
    }

    /**是否完美通关了某一章节 */
    isPerfectFinishWorld(world: number): boolean {
        let worlddata = this.getChapterData(world, 0);
        if (worlddata.btperfect == 0) {
            let worldData: GS_SceneWorldInfo_WorldItem = this.getChapterInfo(world);
            if (this._curWarID < worldData.nendwarid) {
                return false;
            }
            for (let i = worldData.nstartwarid; i <= worldData.nendwarid; i++) {
                let score: number = this.getChapterPointData(i).uscoreflag;

                if (!this.isPerfectPassWar(score)) {
                    return false;
                }
            }
        }
        return true;
    }

    /**通关隐藏关卡数量 */
    getFinishHideWarCount(): number {
        return this._worldData && this._worldData.data1 ? this._worldData.data1[0].nfinishhidwarcount : 0;
    }

    /**完美通关隐藏关卡的数量 */
    getPerfectFinishHidWarCount(): number {
        return this._worldData && this._worldData.data1 ? this._worldData.data1[0].nperfectfinishhidwarcount : 0;
    }

    /**完美通关普通关卡的数量 */
    getPerfectFinishNormalWarCount(wroldid:number): number {
        let chapterData = this.getChapterData(wroldid , 0);
        return chapterData  ? chapterData.uperfectcount : 0;
    }

    /**是否通关某一章节 */
    isFinishChapter(chapterid: number): boolean {
        if (this._curWorldID > chapterid) return true;
        if (this._curWorldID == chapterid) {
            let worldInfo = this.getChapterInfo(chapterid);
            let data = this.getChapterPointData(this._curWarID);
            if (this._curWarID == worldInfo.nendwarid && data.uscoreflag > 0) {
                return true;
            }
        }
        return false;
    }

    getWarDetails(warid: number): GS_SceneSetWarDetails {
        return this._warDetails[warid];
    }

    ////////////////////////////////////////////////////////////////////////////////// req
    //////////////////////////////////////////////////////////////////////////////////
    /**
     * 请求关卡信息
     * @param id 关卡id
     */
    reqWarDetails(id: number) {
        if (this._reqWarDetailsTime[id] && GlobalVal.now < this._reqWarDetailsTime[id]) {
            if (this._warDetails[id]) {
                GameEvent.emit(EventEnum.ON_WORLD_WAR_DETAILS, this._warDetails[id]);
            }
            return;
        }
        let data: GS_SceneGetWarDetails = new GS_SceneGetWarDetails();
        data.nwarid = id;
        this.send(GS_PLAZA_SCENE_MSG.PLAZA_SCENE_GETWARDETAILS, data);
        this._reqWarDetailsTime[id] = GlobalVal.now + 60000;
    }

    /**
     * 请求章节下的关卡数据
     * @param btType 关卡类型（0.普通 1.挑战)
     * @param nWorldID 世界章节ID
     * @param mode 模式（0:普通 ， 1:困难）
     */
    reqWorldWarList(btType: number, nWorldID: number, mode: number = 0) {
        let data: GS_SceneGetWorldWarList = new GS_SceneGetWorldWarList();
        data.bttype = btType;
        data.nworldid = nWorldID;
        data.btmode = mode;
        this.send(GS_PLAZA_SCENE_MSG.PLAZA_SCENE_GETWORLDWARLIST, data);
    }

    private _curReqWarid: number = 0;
    /**
     * 请求进入战场
     * @param id 
     */
    reqEnterWar(id: number) {
        if (this._inMap || this._curReqWarid > 0) return;
        this._curPlayWarID = id;
        this._curReqWarid = id;
        this._curPlayWorldID = this.getChapterByWarID(id).nworldid;
        this._teachingInfo = null;
        BuryingPointMgr.post(EBuryingPoint.STAR_WAR, JSON.stringify({ warid: id + '' }));
        let data: GS_SceneRequestWar = new GS_SceneRequestWar();
        data.nwarid = id;
        this.send(GS_PLAZA_SCENE_MSG.PLAZA_SCENE_REQUESTWAR, data);
        SysMgr.instance.doOnce(Handler.create(this.resetEnterWarId, this), 2000, true);
    }

    private resetEnterWarId() {
        this._curReqWarid = 0;
    }

    /**
     * 胜利
     * @param id 关卡id
     * @param scoreFlag 评分 
     * @param leftHp 剩余血量
     * @param leftTime 剩余时间
     */
    reqWarSuccess(id: number, scoreFlag: number, leftHp: number, leftTime: number) {
        let data: GS_SceneRequestWarFinish = new GS_SceneRequestWarFinish();
        data.nwarid = id;
        data.uscoreflag = scoreFlag;
        data.nlefthp = leftHp;
        data.nlefttime = leftTime;
        this.send(GS_PLAZA_SCENE_MSG.PLAZA_SCENE_REQUESTWARFINISH, data);
    }

    /**
     * 失败
     * @param nwarid 关卡id
     * @param valid 是否有效失败
     */
    reqWarFail(nwarid: number, valid: number = 0) {
        let data: GS_SceneRequestWarFail = new GS_SceneRequestWarFail();
        data.nwarid = nwarid;
        data.btvalid = valid;
        this.send(GS_PLAZA_SCENE_MSG.PLAZA_SCENE_REQUESTWARFAIL, data);
    }

    /**
     * 请求使用技能卡ID
     * @param nskillcardid 
     */
    reqUseSkill(nskillcardid: number) {
        let data: GS_SceneWarUseSkill = new GS_SceneWarUseSkill();
        data.nskillcardid = nskillcardid;
        this.send(GS_PLAZA_SCENE_MSG.PLAZA_SCENE_WARUSESKILL, data);
        BuryingPointMgr.post(EBuryingPoint.USE_MAGIC_SKILL, JSON.stringify({ warid: GlobalVal.curMapCfg.nwarid, skillid: nskillcardid }));
    }


    /**
     * 上报怪物击杀
     * @param monsterid 
     * @param btheroattack 
     */
    reqKillMonster(monsterid: number, btheroattack: number) {
        // let data: GS_SceneKillMonster = new GS_SceneKillMonster();
        // data.btheroattack = btheroattack;
        // data.nmonsterid = monsterid;

        // this.send(GS_PLAZA_SCENE_MSG.PLAZA_SCENE_KILLMONSTER, data);
    }

    ///////////////////////////////////////////////////////////////////////
    reqEnterExperienceWar(warid: number) {
        let data: GS_SceneRequestExperienceWar = new GS_SceneRequestExperienceWar();
        data.nwarid = warid;
        this.send(GS_PLAZA_SCENE_MSG.PLAZA_SCENE_REQUESTEXPERIENCEWAR, data);
    }

    reqYiYuanGou() {
        let data:GS_SceneGetWarTroopsOrder = new GS_SceneGetWarTroopsOrder();
        data.nwarid = this._curPlayWarID;
        this.send(GS_PLAZA_SCENE_MSG.PLAZA_SCENE_GETWARTROOPSORDER , data);
    }

    /////////////////////////////////////////////////////////////////////////////
    reqLostFv() {
        let data: GS_SceneGetLostFV = new GS_SceneGetLostFV();
        data.nwarid = GlobalVal.curMapCfg.nwarid;
        this.send(GS_PLAZA_SCENE_MSG.PLAZA_SCENE_GETLOSTFV, data);
    }

    /**
     * 怪物击杀掉落
     * @param data 
     */
    private onMonsterDieDrop(data: GS_MonsterDieDrop) {
        //cc.log("-----------怪物击杀数", data.nmonsterid, data.nkillcount);
        let monsterid = data.nmonsterid;
        let preUnlockState = Game.monsterManualMgr.isMonsterUnlock(monsterid);

        this._monsterKillMap.set(monsterid, data.nkillcount);

        let afterUnlockState = Game.monsterManualMgr.isMonsterUnlock(monsterid);

        //如果已经领取奖励，就不提示红点
        if (!preUnlockState && afterUnlockState && !Game.monsterManualMgr.isMonsterGetedRewrad(monsterid)) {
            //新怪物图鉴可领取奖励
            GameEvent.emit(EventEnum.NEW_MONSTER_CAN_GETREWARD, monsterid);
            //暂时屏蔽
            SystemTipsMgr.instance.showCommentTips(EResPath.UNLOCK_NEW_MONSTER, monsterid);
        }
    }

    /**
     * 领取完美通关的奖励
     * @param warid 关卡id
     */
    reqGetPerfectReward(warid: number) {
        let data: GS_SceneGetPerfectReward = new GS_SceneGetPerfectReward();
        data.nwarid = warid;
        this.send(GS_PLAZA_SCENE_MSG.PLAZA_SCENE_GETPERFECTREWARD, data);
    }

    /**获取翻倍奖励 */
    reqFreeVideoReward() {
        if (!GlobalVal.getCanReqFvTime()) return;
        GlobalVal.changeNextReqFvTime();
        let data: GS_SceneGetAddFreeVideo = new GS_SceneGetAddFreeVideo();
        this.send(GS_PLAZA_SCENE_MSG.PLAZA_SCENE_GETWARFINISHFREEVIDEO, data);
    }

    /**请求增加失败增加攻击力 */
    reqLostAddAttackPer() {
        let data: GS_SceneUseLostAddAttackPer = new GS_SceneUseLostAddAttackPer();
        this.send(GS_PLAZA_SCENE_MSG.PLAZA_SCENE_USELOSTADDATTACKPER, data);
    }

    /**请求关卡教学视频 */
    reqGetTeachingFv(warid: number) {
        if (!GlobalVal.getCanReqFvTime()) return;
        GlobalVal.changeNextReqFvTime();
        let data: GS_SceneGetTeachingFV = new GS_SceneGetTeachingFV();
        data.nwarid = warid;
        this.send(GS_PLAZA_SCENE_MSG.PLAZA_SCENE_GETTEACHINGFV, data);
    }

    
    ////////////////////////////////////////////////////////////////////////////////////////// result
    //////////////////////////////////////////////////////////////////////////////////////////

    /**收到场景物件 */
    private oSceneThingInfo(data: GS_SceneThingInfo) {
        if (data.uitemcount == 0) return;
        data.thinglist.forEach(element => {
            this._sceneThingDic[element.nthingid] = element;
            Encryption.wrapIntProp(element, ["udropvalue"]);
        });
    }

    /**下发章节下面的所有关卡列表 */
    private onSetWorldWarList(data: GS_SceneSetWorldWarList) {
        cc.log('onSetWorldWarList:', data);
        if (data.uitemcount > 0) {
            let allCpScoreData = data.btmode == 0 ? this._allCpScoreData : this._allHardCpScoreData;
            data.warlist.forEach(element => {
                allCpScoreData[element.nwarid] = element;
            });
        }

        if (!this._chapterReqData[data.bttype]) {
            this._chapterReqData[data.bttype] = {};
        }

        if (!this._chapterReqData[data.bttype][data.nworldid]) {
            this._chapterReqData[data.bttype][data.nworldid] = {};
        }

        if (data.btmode == ServerDefine.WAR_MODEL_HARD) {
            let worldInfo = this.getHardChapterInfo(data.nworldid);
            let preWarid = worldInfo.nstartwarid - 1;
            for (let i = 0; i < 40; i++) {
                if (!data.warlist || !data.warlist[i] || data.warlist[i].uscoreflag == 0) {
                    this._curHardWarIds[data.nworldid] = preWarid + 1;
                    break;
                }
                preWarid = data.warlist[i].nwarid;
            }

            if (!this._curHardWarIds[data.nworldid]) {

                this._curHardWarIds[data.nworldid] = worldInfo ? data.uitemcount == 0 ? worldInfo.nstartwarid : worldInfo.nendwarid + 1 : 0;
            }
        }

        this._chapterReqData[data.bttype][data.nworldid][data.btmode] = true;
        GameEvent.emit(EventEnum.ON_WORLD_WAR_LIST, data);
    }

    /**下发关卡详情*/
    private onSetWarDetails(data: GS_SceneSetWarDetails) {
        this._warDetails[data.nwarid] = data;

        let pdata = this.getChapterPointData(data.nwarid);
        if (pdata.uscoreflag != data.uscoreflag) {
            pdata.uscoreflag = data.uscoreflag;
        }
        Game.bulletChatMgr.setSendChatState(data.nwarid, data.btsetbulletchat == 1);
        GameEvent.emit(EventEnum.ON_WORLD_WAR_DETAILS, data);
    }

    /**章节配置 */
    private onSceneWorldInfo(data: GS_SceneWorldInfo) {
        this._worldInfo = data;
        this._chapterInfoDic = {};

        if (data.data1) {
            data.data1.sort(this.sortWorldList);
        }

        if (data.data2) {
            data.data2.sort(this.sortWorldList);
        }

        for (let i = 0; i < data.uitemcount; i++) {
            let element: GS_SceneWorldInfo_WorldItem = this._worldInfo.data1[i];
            if (!this._chapterInfoDic[element.bttype]) {
                this._chapterInfoDic[element.bttype] = [];
            }
            this._chapterInfoDic[element.bttype].push(element);
        }

        this.calcTipsWar();
        GameEvent.emit(EventEnum.MODULE_INIT, GS_PLAZA_MSGID.GS_PLAZA_MSGID_SCENE);
    }

    /**章节数据 */
    private onSceneWorldData(data: GS_SceneWorldData) {
        cc.log("章节数据:", data);
        this._worldData = data;
        if (!this._worldData.data1) {
            this._worldData.data1 = [new GS_SceneWorldData_Base()];
        }
        this._worldData.data1[0].nhardlastwarid += ServerDefine.WARHARD_INDEX;
        this.calcCurWarID();
        GameEvent.emit(EventEnum.LAST_WAR_ID_CHANGE, this._worldData.data1[0].nlastwarid);

        if (this.getCurWarID() > 1) {
            GameEvent.emit(EventEnum.HIDE_MANHUA);
        }
    }

    /**收到胜利返回 */
    private onSceneWarFinish(data: GS_SceneWarFinish) {
        this._inMap = false;
        let model = this.isHardWar(data.nwarid) ? ServerDefine.WAR_MODEL_HARD : ServerDefine.WAR_MODEL_NORMAL;
        let cpData = this.getChapterPointData(data.nwarid, model);
        cpData.uscoreflag = data.uscoreflag | data.uoldscoreflag;

        let warDetailsData = this.getWarDetails(data.nwarid);
        if (warDetailsData) {
            warDetailsData.uscoreflag = cpData.uscoreflag;
        }

        this._allCpScoreData[data.nwarid] = cpData;

        if (cpData.uscoreflag > data.uoldscoreflag) {

            let chapterInfo = this.getChapterByWarID(data.nwarid);
            if (!this._worldData) {
                this.initWorldData();
            }

            if (model == ServerDefine.WAR_MODEL_HARD) {
                if (this._worldData.data1[0].nhardlastwarid <= data.nwarid) {
                    this._worldData.data1[0].nhardlastwarid = data.nwarid;
                }
                this.calcHardWarId(data.nwarid);
            } else if (chapterInfo.bttype == 0  && !this.isHideWar(data.nwarid)) {
                
                if (this.isPerfectPassWar(data.uscoreflag) && !this.isPerfectPassWar(data.uoldscoreflag)) {
                    let chapterData = this.getChapterData(chapterInfo.nworldid , chapterInfo.bttype);
                    if (chapterData) {
                        chapterData.uperfectcount ++;
                    }
                }
                if (this.getWarGrade(data.uscoreflag) == 3 && this.getWarGrade(data.uoldscoreflag) != 3) {
                    let chapterData = this.getChapterData(chapterInfo.nworldid , chapterInfo.bttype);
                    if (chapterData) {
                        chapterData.nfullhpwarcount ++;
                    }
                }
                if (this.checkAllTaslComplete(data.uscoreflag) && !this.checkAllTaslComplete(data.uoldscoreflag)) {
                    let chapterData = this.getChapterData(chapterInfo.nworldid , chapterInfo.bttype);
                    if (chapterData) {
                        chapterData.nfulltaskwarcount ++;
                    }
                }
                if ((data.uscoreflag & SCOREFLAG.SCOREFLAG_CLEARTHING) != 0 && (data.uoldscoreflag & SCOREFLAG.SCOREFLAG_CLEARTHING) == 0) {
                    let chapterData = this.getChapterData(chapterInfo.nworldid , chapterInfo.bttype);
                    if (chapterData) {
                        chapterData.nclearthingwarcount ++;
                    }
                }

                if (this._worldData.data1[0].nlastwarid <= data.nwarid) {
                    this._worldData.data1[0].nlastwarid = data.nwarid;
                    this.calcCurWarID();
                    
                    GlobalVal.cacheMapPosX = null;
                    GlobalVal.cacheMapId = null;
                    GameEvent.emit(EventEnum.LAST_WAR_ID_CHANGE, data.nwarid);
                    GameEvent.emit(EventEnum.LAST_WAR_ID_CHANGE2, data.nwarid);
                }
            }
        }

        if (this.isHideWar(data.nwarid)) {
            if (data.uoldscoreflag == 0) {
                this._worldData.data1[0].nfinishhidwarcount++;
            }

            if (this.isPerfectPassWar(data.uscoreflag) && !this.isPerfectPassWar(data.uoldscoreflag)) {
                this._worldData.data1[0].nperfectfinishhidwarcount++;
            }
        }

        this._worldData.data1[0].nthreegradecount = data.nthreegradecount;
        this._worldData.data1[0].nclearthingcount = data.nclearthingcount;
        this._worldData.data1[0].nthreestarcount = data.nthreestarcount;

        if (model == ServerDefine.WAR_MODEL_HARD) {
            let sceneAllKill = (data.uscoreflag & SCOREFLAG.SCOREFLAG_CLEARTHING) != 0;
            let level = Game.sceneNetMgr.getWarGrade(data.uscoreflag);
            let allTaskComplete = Game.sceneNetMgr.checkAllTaslComplete(data.uscoreflag);

            let oldSceneAllKill = (data.uoldscoreflag & SCOREFLAG.SCOREFLAG_CLEARTHING) != 0;
            let oldLevel = this.getWarGrade(data.uoldscoreflag);
            let oldAllTaskComplete = this.checkAllTaslComplete(data.uoldscoreflag);

            if (!oldSceneAllKill && sceneAllKill) {
                this._worldData.data1[0].nhardclearthingcount++;
            }

            if (oldLevel < 3 && level >= 3) {
                this._worldData.data1[0].nhardthreegradecount++;
            }

            if (!oldAllTaskComplete && allTaskComplete) {
                this._worldData.data1[0].nhardthreestarcount++;
            }
        }

        let oldGetedAward: boolean = this.checkGetPerfectAwarded(data.uoldscoreflag);
        let curGetedAward: boolean = this.checkGetPerfectAwarded(data.uscoreflag);

        if (!curGetedAward && oldGetedAward) {
            data.uscoreflag |= SCOREFLAG.SCOREFLAG_FINISHREWARD;
        }

        GameEvent.emit(EventEnum.GAME_SUCC, data);
    }

    /**收到失败返回 */
    private onSceneWarFail(data: GS_SceneWarFail) {
        this._inMap = false;
        GameEvent.emit(EventEnum.GAME_FAIL, data);
    }

    /**收到战场数据 */
    private onSceneOpenWar(data: GS_SceneOpenWar) {
        GlobalVal.curMapCfg = data;
        Game.actorMgr.reconnectionid = data.nreconnectionid;
        BuryingPointMgr.postWar(EBuryingPoint.STAR_ENTER_WAR);
        Game.ldNormalGameCtrl.loadGameScene();
        this._inMap = true;
        this._curReqWarid = -1;
        SysMgr.instance.clearTimer(Handler.create(this.resetEnterWarId, this), true);
    }

    private onWarFreeVideo(data: GS_SceneWarFreeVideo) {
        // __STCHARS			(szOrder, ORDER_LEN);		//单号	
        // __SLONG				(nSDKID);			        //客户端播放小视频使用的SDKID
        Game.nativeApi.showRewardAd(Game.actorMgr.nactordbid.toString(), data.szorder , data.szsdkkey);
        BuryingPointMgr.post(EBuryingPoint.HIDE_WAR_FREE, JSON.stringify({ order: data.szorder })); //隐藏关卡进入或重来埋点
    }

    /**
     * 翻倍领奖
     * @param data 
     */
    private onGetFreeVideo(data: GS_SceneSetAddFreeVideo) {
        //BuryingPointMgr.post(EBuryingPoint.TOUCH_DOUBLE, JSON.stringify({ order: data.szorder }));
        Game.nativeApi.showRewardAd(Game.actorMgr.nactordbid.toString(), data.szorder, data.szsdkkey);
    }

    /**
     * 下发满血复活视频订单
     * @param data 
     */
    private onFullUpFreeVideo(data: GS_SceneSetFullHPFreeVideo) {
        cc.log("下发满血复活视频订单", data);
        BuryingPointMgr.post(EBuryingPoint.REVICE_FREE_VIDEO, JSON.stringify({ order: data.szorder, warid: data.nwarid }));
        Game.nativeApi.showRewardAd(Game.actorMgr.nactordbid.toString(), data.szorder , data.szsdkkey);
    }

    /**
     * 通知客户端满血复活
     * @param data 
     */
    private onFullUp(data: GS_SceneFullHP) {
        cc.log("通知客户端满血复活");
        GameEvent.emit(EventEnum.DO_REVIVE, data);
    }

    /**
     * 战场数据
     * @param data 
     */
    private onBattleData(data: GS_SceneBattleData) {
        cc.log('onBattleData', data);
        this._battleData = data;
    }

    /**
     * 关卡教学视频订单
     * @param data 
     */
    private onSetTeachingFv(data: GS_SceneSetTeachingFV) {
        cc.log("下发关卡教学视频订单", data);
        BuryingPointMgr.post(EBuryingPoint.METHOD_FREE_VIDEO, JSON.stringify({ order: data.szorder, warid: data.nwarid }));
        Game.nativeApi.showRewardAd(Game.actorMgr.nactordbid.toString(), data.szorder , data.szsdkkey);
    }

    /**
     * 关卡
     * @param data 
     */
    private onSetTeachingInfo(data: GS_SceneSetTeachingInfo) {
        this._teachingInfo = data;
        UiManager.showDialog(EResPath.METHOD_VIEW, data.npicid);
    }

    /**下发进入体验关 */
    experienceWarData: GS_SceneSetExperienceWar;
    private onSetExperienceWar(data: GS_SceneSetExperienceWar) {
        let warData: GS_SceneOpenWar = new GS_SceneOpenWar();
        Utils.copyMsgObjPro(warData, data);

        GlobalVal.curMapCfg = warData;
        this.experienceWarData = data;

        UiManager.removeAll();

        // Game.experienceWarCtrl.loadGameScene();
    }

    /////////////////////////////////////////////////////////////////////////////
    getChapterByWarID(id: number, btType: number = 0): GS_SceneWorldInfo_WorldItem {
        id = id < ServerDefine.WARHARD_STARID ? id : id - ServerDefine.WARHARD_INDEX;
        let list: GS_SceneWorldInfo_WorldItem[] = this.getAllChapter(btType);
        let item: GS_SceneWorldInfo_WorldItem;

        if (this.isHideWar(id)) {
            for (let i = 0; i < list.length; i++) {
                item = list[i];
                if (item.nhidwarids.indexOf(id) != -1) {
                    return item;
                }
            }
        } else {
            for (let i = 0; i < list.length; i++) {
                item = list[i];
                if (id >= item.nstartwarid && id <= item.nendwarid) {
                    return item;
                }
            }
        }

        return null;
    }

    getHardChapterByWarID(id: number): GS_SceneWorldInfo_HardWorldItem {
        let list: GS_SceneWorldInfo_HardWorldItem[] = this.getAllHardChapter();
        let len = list ? list.length : 0;
        let item: GS_SceneWorldInfo_HardWorldItem;
        for (let i = 0; i < len; i++) {
            item = list[i];
            if (id >= item.nstartwarid && id <= item.nendwarid) {
                return item;
            }
        }
        return null;

    }

    private calcCurWarID() {
        if (this._worldData.data1 && this._worldData.data1[0].nlastwarid > 0) {
            let chapterInfo = this.getChapterByWarID(this._worldData.data1[0].nlastwarid);
            if (!chapterInfo) {
                cc.log("通关关卡id获取章节数据出错，关卡id:" + this._worldData.data1[0].nlastwarid);
                return;
            }
            this._curWorldID = chapterInfo.nworldid;

            if (this._worldData.data1[0].nlastwarid == chapterInfo.nendwarid) {
                if (this.isChapterUnlock(chapterInfo.nworldid + 1, chapterInfo.bttype)) {
                    this._curWorldID = chapterInfo.nworldid + 1;
                    this._curWarID = this._worldData.data1[0].nlastwarid + 1;
                } else {
                    this._curWarID = this._worldData.data1[0].nlastwarid;
                }
            } else {
                this._curWarID = this._worldData.data1[0].nlastwarid + 1;
            }

        } else {
            this._curWorldID = 1;
            this._curWarID = 1;
        }


        this.calcTipsWar();
    }

    private calcHardWarId(warid: number) {
        let worldData: GS_SceneWorldInfo_HardWorldItem = this.getHardChapterByWarID(warid);
        warid += 1;
        if (warid <= worldData.nendwarid) {
            let temp = this._curHardWarIds[worldData.nworldid];
            if (!temp || temp < warid) {
                this._curHardWarIds[worldData.nworldid] = warid;
            }
        } else {
            this._curHardWarIds[worldData.nworldid] = warid;
        }
    }

    private calcTipsWar() {
        this._curTipsWarID = -1;
        let maxTipsId = Game.cpCfgCtrl.getMaxTipsWarID();
        if (this._curWarID < maxTipsId) {
            for (let i = this._curWarID + 1; i <= maxTipsId; i++) {
                if (Game.cpCfgCtrl.getTips(i)) {
                    this._curTipsWarID = i;
                    break;
                }
            }
        }
    }

    private sortWorldList(a: GS_SceneWorldInfo_WorldItem, b: GS_SceneWorldInfo_WorldItem): number {
        return a.nworldid - b.nworldid;
    }

    private onCreatureDied(diedCfg: any, killCfg: any) {
        if (!diedCfg) return;
        let id = (diedCfg as MonsterConfig).id;
        if (id == 0 || !diedCfg) return;
        this.reqKillMonster(id, killCfg ? 1 : 0);
    }

    private onGetPerfectReward(data: GS_SceneSetPerfectReward) {
        cc.log("领取红包", data);
        let wardata: GS_SceneSetWorldWarList_WorldWarItem = this.getChapterPointData(data.nwarid);
        if (wardata.uscoreflag != data.uoldscoreflag) {
            cc.log('error onGetPerfectReward :  uscoreflag != uoldscoreflag');
        }

        wardata.uscoreflag = data.uscoreflag;

        let redpacketCount: number = 0;
        if (data.uitemcount > 0) {
            data.dropgoodslist.forEach(element => {
                let goodsInfo: GS_GoodsInfoReturn_GoodsInfo = Game.goodsMgr.getGoodsInfo(element.ngoodsid);
                if (goodsInfo && goodsInfo.lgoodstype == GOODS_TYPE.GOODSTYPE_RES_REDPACKET) {
                    redpacketCount += element.ngoodsnum;
                }
            });
        }

        // if (redpacketCount > 0) {
        //     // UiManager.showDialog(EResPath.OPEN_RED_PACKET_VIEW, redpacketCount);
        //     let viewData: RedPacketData = {
        //         isGameSucc: true,
        //         scoreflag: data.uscoreflag,
        //         oldscoreflag: data.uoldscoreflag,
        //         goodsid: GOODS_ID.REDPACKET,
        //         goodsnum: Game.cpMgr.curMissonData.ntrophyrewardgoodsnum,
        //     };
        //     UiManager.showDialog(EResPath.RED_PACKET, viewData);
        // }
    }


    private checkPerfectOptrs: number[] = [SCOREFLAG.SCOREFLAG_TASK1, SCOREFLAG.SCOREFLAG_TASK2, SCOREFLAG.SCOREFLAG_TASK3, SCOREFLAG.SCOREFLAG_CLEARTHING, SCOREFLAG.SCOREFLAG_GRADE3];
    /**
     * 是否是完美通关
     * @param flag 
     */
    private isPerfectPassWar(flag: number): boolean {
        let b = false;
        if (flag > 0) {
            b = true;
            for (let i = 0; i < 5; i++) {
                if ((flag & this.checkPerfectOptrs[i]) == 0) {
                    b = false;
                    break;
                }
            }
        }
        return b;
    }

    /**
     * 是否领取过完美通关奖励
     * @param flag 
     */
    private checkGetPerfectAwarded(flag: number): boolean {
        return (flag & SCOREFLAG.SCOREFLAG_FINISHREWARD) != 0;
    }

    private initWorldData() {
        this._worldData = new GS_SceneWorldData();
        this._worldData.data1 = [new GS_SceneWorldData_Base()];
        this._worldData.data1[0].nlastwarid = 1;
        //this._worldData.data1[0].uitemcount = 1;
        this._worldData.data1[0].nthreestarcount = 0;
        this._worldData.data1[0].nthreegradecount = 0;
        this._worldData.data1[0].nclearthingcount = 0;
        //常规关卡
        this._worldData.data2 = [];
        //困难关卡
        this._worldData.data3 = [];
        this._worldData.uharditemcount = 0;
        this._worldData.uitemcount = 0;
        this._worldData.data1[0].nperfectfinishhidwarcount = 0;
        this._worldData.data1[0].nhardlastwarid = 0;
        this._worldData.data1[0].nhardclearthingcount = 0;
        this._worldData.data1[0].nhardthreegradecount = 0;
        this._worldData.data1[0].nhardthreestarcount = 0;
    }

    /**
     * 获取怪物击杀数量
     */
    getMonsterKillNum(monsterId: number): number {
        let num = this._monsterKillMap.get(monsterId);
        return num === undefined ? 0 : num;
    }

    setNeedTellServerKill(sceneItemId: number, monsterId: number) {
        this._tallServerSkillSceneItem[sceneItemId] = monsterId;
    }

   

    

    private onSetLostFv(data: GS_SceneSetLostFV) {
        Game.nativeApi.showRewardAd(Game.actorMgr.nactordbid.toString(), data.szorder , data.szsdkkey);
    }

    private onFinishLostFV(data: GS_SceneFinishLostFV) {
        GameEvent.emit(EventEnum.FINISHLOSTFV);
    }


    

    

    

    

    

    

    

    private onSetWarTroopsOrder(data:GS_SceneSetWarTroopsOrder) {
        Game.mallProto.payOrder(data.szorder);
    }

    

}