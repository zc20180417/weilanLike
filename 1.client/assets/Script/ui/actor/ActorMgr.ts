import BaseNetHandler from "../../net/socket/handler/BaseNetHandler";
import { CMD_ROOT, GS_PLAZA_MSGID, ActorProp, ServerDefine, POP_VIEW_TYPE, ACTIVE_TYPE, FIRST_RECHARGE_STATE, ACTOR_OPENFLAG, ACTOR_BEHAVIORCTRL } from "../../net/socket/handler/MessageEnum";
import { GS_PLAZA_ACTORINFO_MSG, GS_ActorPrivateInfo, GS_ActorVariable, GS_ActorModifyDateRet, GS_BindPhoneRet, GS_FeedbackRet, GS_FirstLogin, GS_FirstRechargeInfo, GS_FirstRechargeRet, GS_ModifyPwdRet, GS_ResetPwdRet, GS_VipInfo, GS_FaceChange, GS_PopActive, GS_ActorPopActiveNotice, GS_ActorModifyData, GS_BindPhone, GS_Feedback, GS_ModifyPwd, GS_ActorOpenFlag, GS_ActorVariable_Variable, GS_ActorCheckTime, GS_ActorFaceConfig, GS_ActorSetFaceID, GS_ActorSetFaceFrameID, GS_FirstRecharge, GS_ActorVipPrivate, GS_ActorGetVipReward, GS_ActorRechargeConfig, GS_ActorRechargeConfig_QuickRechargeItem, GS_ActorRankInfo, GS_VipInfo_VipLevel, GS_ActorRankInfo_RankItem, GS_ActorClientConfigList, GS_ActorClientConfig, GS_ActorRequestClientConfig, GS_ActorClientConfigList_ConfigItem, GS_ActorClientConfig_BaseData, GS_ActorActiveFaceList, GS_ActorActiveFace, GS_ActorActiveFaceFrame, GS_ActorActiveFaceList_FaceItem, GS_ActorActiveFaceList_FaceFrameItem, GS_ActorClientConfirmFreeVideo, GS_ActorSetVipOrder, GS_ActorGetVipRecharge, GS_ActorFirstRechargePrivate, GS_ActorGetFirstRechargeReward, GS_ActorFirstRechargePrivate_FirstRechargeItem, GS_FirstRechargeInfo_RechargeItem, GS_FirstRechargeInfo_GiveItem, GS_ActorFaceConfig_FaceFrameItem } from "../../net/proto/DMSG_Plaza_Sub_Actor";
import { Handler } from "../../utils/Handler";
import { EventEnum } from "../../common/EventEnum";
import SysMgr from "../../common/SysMgr";
import GlobalVal, { SEND_TYPE, ServerType } from "../../GlobalVal";
import HttpControl from "../../net/http/HttpControl";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import { UiManager } from "../../utils/UiMgr";
import { EResPath } from "../../common/EResPath";
import Game from "../../Game";
import { EVENT_REDPOINT } from "../../redPoint/RedPointSys";
import Debug from "../../debug";
import { BuryingPointMgr, EBuryingPoint } from "../../buryingPoint/BuryingPointMgr";
import { LocalStorageMgr } from "../../utils/LocalStorageMgr";
import { StringUtils } from "../../utils/StringUtils";
import Utils from "../../utils/Utils";
import LoadingTips from "../tips/LoadingTips";
import { MathUtils } from "../../utils/MathUtils";
import SocketManager from "../../net/socket/SocketManager";
import { GameEvent } from "../../utils/GameEvent";
import { md5 } from "../../libs/encrypt/md5";

const ACTOR_TAG = "玩家：";
export type FirstRechargeInfo = { item: GS_FirstRechargeInfo_RechargeItem, goodsItem: GS_FirstRechargeInfo_GiveItem[] };

export class ActorMgr extends BaseNetHandler {

    isNew:boolean = false;
    nactordbid: number = 0;
    loginKey: string = "";
    reconnectionid: number = 0;

    private _privateData: GS_ActorPrivateInfo;
    private _faceConfig: GS_ActorFaceConfig;
    private _faceFrameDic: {[key:number] : GS_ActorFaceConfig_FaceFrameItem} = {};
    private _activeFaceList: GS_ActorActiveFaceList;
    private _propEnum: any = {};
    private _birthdayStr: string = null;
    private _queryData: any = null;
    private _nextAddTime: number = 0;
    private _firstRechanrgeInfo: GS_FirstRechargeInfo;

    private _vipPrivateData: GS_ActorVipPrivate = null;
    private _vipInfo: GS_VipInfo = null;

    private _popViewData: GS_PopActive = null;
    private _popViewShowed: boolean = false;
    private _chargeConfig: { [key: string]: GS_ActorRechargeConfig_QuickRechargeItem } = {};
    private _rankInfo: GS_ActorRankInfo;
    private _configList: GS_ActorClientConfigList;
    private _configDic: any = {};
    private _waitLoadConfigList: number[] = [];

    private _firstRechargePrivateMap: Map<number, GS_ActorFirstRechargePrivate_FirstRechargeItem> = null;

    constructor() {
        super(CMD_ROOT.CMDROOT_PLAZA_MSG, GS_PLAZA_MSGID.GS_PLAZA_MSGID_ACTOR);
        this._propEnum[ActorProp.ACTOR_PROP_DBID] = 'nactordbid';
        this._propEnum[ActorProp.ACTOR_PROP_STRENGTH] = 'i64strength';
        this._propEnum[ActorProp.ACTOR_PROP_DIAMONDS] = 'i64diamonds';
        this._propEnum[ActorProp.ACTOR_PROP_VIPEXP] = 'i64vipexp';
        this._propEnum[ActorProp.ACTOR_PROP_VIPLEVEL] = 'i64viplevel';
        this._propEnum[ActorProp.ACTOR_PROP_NEXTVIPLEVELEXP] = 'i64nextviplevelexp';
        this._propEnum[ActorProp.ACTOR_PROP_LASTUPVIPTIMES] = 'nlastupviptime';
        this._propEnum[ActorProp.ACTOR_PROP_SEX] = 'btsex';
        this._propEnum[ActorProp.ACTOR_PROP_OPENFLAG] = 'i64openflag';
        this._propEnum[ActorProp.ACTOR_PROP_ISGUEST] = 'btguest';
        this._propEnum[ActorProp.ACTOR_PROP_CERTIFICATION] = 'certification';
        this._propEnum[ActorProp.ACTOR_PROP_OFFICIALPAY] = 'btofficialpay';
        this._propEnum[ActorProp.ACTOR_PROP_LASTADDSTRENGTIME] = 'nlastaddstrengtime';
        this._propEnum[ActorProp.ACTOR_PROP_FACEID] = 'nfaceid';
        this._propEnum[ActorProp.ACTOR_PROP_FACEFRAMEID] = 'nfaceframeid';
        this._propEnum[ActorProp.ACTOR_PROP_RANKSCORE] = 'nrankscore';
        this._propEnum[ActorProp.ACTOR_PROP_INFINITESTRENGTH] = 'i64infinitestrength';
        this._propEnum[ActorProp.ACTOR_PROP_RANKMATCHID] = 'nRankMatchID';
        this._propEnum[ActorProp.ACTOR_PROP_PVPWIN] = 'npvpwin';
        this._propEnum[ActorProp.ACTOR_PROP_PVPLOST] = 'npvplost';
        this._propEnum[ActorProp.ACTOR_PROP_PVPDRAW] = 'npvpdraw';
        this._propEnum[ActorProp.ACTOR_PROP_VIPRECHARGEFLAG] = 'nviprechargeflag';
        this._propEnum[ActorProp.ACTOR_PROP_SOPRTSPOINT] = 'nsoprtspoint';
        this._propEnum[ActorProp.ACTOR_PROP_COOPERATIONPOINT] = 'ncooperationpoint';
        this._propEnum[ActorProp.ACTOR_PROP_BOUNTYCOOPERATIONLAYER] = 'nbountycooperationlayer';
        this._propEnum[ActorProp.ACTOR_PROP_CLIENTOPENFLAG] = 'nclientflag';
        this._propEnum[ActorProp.ACTOR_PROP_ISAUDIT] = 'btaudit';
        this._propEnum[ActorProp.ACTOR_PROP_CHALLENGEPOINT] = 'nchallengepoint';
        this._propEnum[ActorProp.ACTOR_PROP_BEHAVIORCTRL] = 'nbehaviorctrlflag';

        this._firstRechargePrivateMap = new Map();

        this.init();
    }

    register() {
        this.registerAnaysis(GS_PLAZA_ACTORINFO_MSG.PLAZA_ACTOR_PRIVATE, Handler.create(this.onPrivateData, this), GS_ActorPrivateInfo);
        this.registerAnaysis(GS_PLAZA_ACTORINFO_MSG.PLAZA_ACTOR_VARIABLE, Handler.create(this.onVariableData, this), GS_ActorVariable);
        this.registerAnaysis(GS_PLAZA_ACTORINFO_MSG.PLAZA_ACTOR_MODIFYDATERET, Handler.create(this.onModifDateRet, this), GS_ActorModifyDateRet);
        this.registerAnaysis(GS_PLAZA_ACTORINFO_MSG.PLAZA_ACTOR_BINDPHONERET, Handler.create(this.onBindPoneRet, this), GS_BindPhoneRet);
        this.registerAnaysis(GS_PLAZA_ACTORINFO_MSG.PLAZA_ACTOR_FEEDBACKRET, Handler.create(this.onFeedbackRet, this), GS_FeedbackRet);

        this.registerAnaysis(GS_PLAZA_ACTORINFO_MSG.PLAZA_ACTOR_FIRSTLOGIN, Handler.create(this.onFristLogin, this), GS_FirstLogin);
        this.registerAnaysis(GS_PLAZA_ACTORINFO_MSG.PLAZA_ACTOR_FIRSTRECHARGEINFO, Handler.create(this.onFristRechargeInfo, this), GS_FirstRechargeInfo);
        this.registerAnaysis(GS_PLAZA_ACTORINFO_MSG.PLAZA_ACTOR_FIRSTRECHARGERET, Handler.create(this.onFristRechargeRet, this), GS_FirstRechargeRet);
        this.registerAnaysis(GS_PLAZA_ACTORINFO_MSG.PLAZA_ACTOR_MODIFYPWDRET, Handler.create(this.onModifyPwdRet, this), GS_ModifyPwdRet);
        this.registerAnaysis(GS_PLAZA_ACTORINFO_MSG.PLAZA_ACTOR_RESETPWDRET, Handler.create(this.onResetPswd, this), GS_ResetPwdRet);
        this.registerAnaysis(GS_PLAZA_ACTORINFO_MSG.PLAZA_ACTOR_VIPINFO, Handler.create(this.onVipInfo, this), GS_VipInfo);
        this.registerAnaysis(GS_PLAZA_ACTORINFO_MSG.PLAZA_ACTOR_FACECHANGE, Handler.create(this.onFaceChange, this), GS_FaceChange);
        this.registerAnaysis(GS_PLAZA_ACTORINFO_MSG.PLAZA_ACTOR_POPACTIVE, Handler.create(this.onPopActive, this), GS_PopActive);
        this.registerAnaysis(GS_PLAZA_ACTORINFO_MSG.PLAZA_ACTOR_POPACTIVENOTICE, Handler.create(this.onPopActiveNotice, this), GS_ActorPopActiveNotice);
        this.registerAnaysis(GS_PLAZA_ACTORINFO_MSG.PLAZA_ACTOR_CHECKTIME, Handler.create(this.onCheckTime, this), GS_ActorCheckTime);
        this.registerAnaysis(GS_PLAZA_ACTORINFO_MSG.PLAZA_ACTOR_FACECONFIG, Handler.create(this.onFaceConfig, this), GS_ActorFaceConfig);
        this.registerAnaysis(GS_PLAZA_ACTORINFO_MSG.PLAZA_ACTOR_VIPPRIVATE, Handler.create(this.onActorVipPrivateData, this), GS_ActorVipPrivate);
        this.registerAnaysis(GS_PLAZA_ACTORINFO_MSG.PLAZA_ACTOR_RECHARGECONFIG, Handler.create(this.onRechargeConfig, this), GS_ActorRechargeConfig);
        this.registerAnaysis(GS_PLAZA_ACTORINFO_MSG.PLAZA_ACTOR_RANKINFO, Handler.create(this.onRankInfo, this), GS_ActorRankInfo);
        this.registerAnaysis(GS_PLAZA_ACTORINFO_MSG.PLAZA_ACTOR_CLIENTCONFIGLIST, Handler.create(this.onConfigList, this), GS_ActorClientConfigList);
        this.registerAnaysis(GS_PLAZA_ACTORINFO_MSG.PLAZA_ACTOR_CLIENTCONFIG, Handler.create(this.onConfigItem, this), GS_ActorClientConfig);

        this.registerAnaysis(GS_PLAZA_ACTORINFO_MSG.PLAZA_ACTOR_ACTIVEFACELIST, Handler.create(this.onActiveFaceList, this), GS_ActorActiveFaceList);
        this.registerAnaysis(GS_PLAZA_ACTORINFO_MSG.PLAZA_ACTOR_ACTIVEFACE, Handler.create(this.onActiveFace, this), GS_ActorActiveFace);
        this.registerAnaysis(GS_PLAZA_ACTORINFO_MSG.PLAZA_ACTOR_ACTIVEFACEFRAME, Handler.create(this.onActiveFaceFrame, this), GS_ActorActiveFaceFrame);


        this.registerAnaysis(GS_PLAZA_ACTORINFO_MSG.PLAZA_ACTOR_SETVIPORDER, Handler.create(this.onVipOrder, this), GS_ActorSetVipOrder);

        this.registerAnaysis(GS_PLAZA_ACTORINFO_MSG.PLAZA_ACTOR_FIRSTRECHARGEPRIVATE, Handler.create(this.onFirstRechargePrivate, this), GS_ActorFirstRechargePrivate);

        GameEvent.on(EventEnum.FIRST_RECHARGE_END, this.onFristRechargeEnd, this);
        GameEvent.on(EventEnum.PLAYER_PROP_CHANGE + ActorProp.ACTOR_PROP_VIPLEVEL, this.vipLevelChanged, this);
        GameEvent.on(EventEnum.PLAYER_PROP_CHANGE + ActorProp.ACTOR_PROP_VIPRECHARGEFLAG, this.refreshVipRedpoint, this);
        GameEvent.on(EventEnum.JAVA_CALL_ON_REWARDAD_SUCC, this.reqFreeVideo, this);
        GameEvent.on(EventEnum.JAVA_CALL_ON_REWARDAD_FAIL, this.freeVideoFail, this);
        GameEvent.on(EventEnum.JAVA_CALL_ON_REWARDAD_CLOSE, this.freeVideoClose, this);
        GameEvent.on(EventEnum.PLAYER_PROP_CHANGE + ActorProp.ACTOR_PROP_OPENFLAG, this.onOpenflagChange, this);
    }


    private _nameCfg: any = {};
    private init() {
        let cfg = Game.gameConfigMgr.getCfg(EResPath.NAME_CFG);

        for (const key in cfg) {
            if (Object.prototype.hasOwnProperty.call(cfg, key)) {
                const element = cfg[key];
                if (element.type == 0 || StringUtils.isNilOrEmpty(element.des)) continue;
                if (!this._nameCfg[element.type]) {
                    this._nameCfg[element.type] = [];
                }

                this._nameCfg[element.type].push(element.des);
            }
        }
    }

    get nameCfg(): any {
        return this._nameCfg;
    }

    private vipLevelChanged() {
        this.refreshVipRedpoint();
        // this.roleInfoChange(SEND_TYPE.ROLE_INFO_CHANGE);
        GameEvent.emit(EventEnum.CK_ROLE_INFO_CHANGE, SEND_TYPE.ROLE_INFO_CHANGE);
    }

    private refreshVipRedpoint() {
        let flag = Game.actorMgr.getProp(ActorProp.ACTOR_PROP_VIPRECHARGEFLAG);
        let lv = Game.actorMgr.getProp(ActorProp.ACTOR_PROP_VIPLEVEL);
        let index = lv <= 0 ? 0 : lv;
        let redPointsNum = 0;
        let cfgs = Game.actorMgr.getVipInfo();
        let vipCfgs = cfgs ? cfgs.data : [];
        for (let i = 1; i <= index; i++) {
            if (vipCfgs[i] && vipCfgs[i].nrechargegoodsid) {
                //炮塔未解锁不提示红点
                if (vipCfgs[i].nrechargelimittroopsid && !Game.towerMgr.isTowerUnlock(vipCfgs[i].nrechargelimittroopsid)) {
                    continue;
                }
                if (!Utils.checkBitFlag(flag, i)) {
                    redPointsNum++;
                }
            }
        }
        let node = Game.redPointSys.findRedPointNode(EVENT_REDPOINT.VIP);
        if (node) {
            node.setRedPointNum(redPointsNum);
        }
    }

    public getVipInfo(): GS_VipInfo {
        return this._vipInfo;
    }

    public getVipPrivateData(): GS_ActorVipPrivate {
        return this._vipPrivateData;
    }

    /**
     * VIP个人数据
     * @param data GS_ActorVipPrivate
     */
    private onActorVipPrivateData(data: GS_ActorVipPrivate) {
        Debug.log(ACTOR_TAG, "vip个人数据", data);
        this._vipPrivateData = data;
        this.refreshVipRedpoint();
        GameEvent.emit(EventEnum.ON_VIP_PRIVATE_DATA);
    }

    /**
     * 领取vip奖励
     * @param vipLv vip等级
     * @param mode （0：快充订单 1：钻石直购）
     */
    public getVipReward(vipLv: number, mode: number) {
        let data: GS_ActorGetVipRecharge = new GS_ActorGetVipRecharge();
        data.btviplevel = vipLv;
        data.btmode = mode;
        this.send(GS_PLAZA_ACTORINFO_MSG.PLAZA_ACTOR_GETVIPRECHARGE, data);
    }

    /**
     * 
     * @param data 
     */
    private onVipOrder(data: GS_ActorSetVipOrder) {

    }

    protected exitGame() {
        this._firstRechanrgeInfo = null;
        this._activeFaceList = null;
    }

    private onFristRechargeEnd() {
        this._firstRechanrgeInfo = null;
    }

    /**请求修改名字 */
    modifyName(name: string) {
        name = StringUtils.filterCensorWords(name);
        this.modifyDate(name, this._privateData.btsex, this._privateData.szsign);
    }

    /**
     * 玩家修改资料
     * @param name 姓名
     * @param sex  性别
     * @param sign 签名
     */
    modifyDate(name: string, sex: number, sign: string) {
        let data: GS_ActorModifyData = new GS_ActorModifyData();

        data.szname = name;
        data.btsex = sex;
        data.szsign = sign;
        this.send(GS_PLAZA_ACTORINFO_MSG.PLAZA_ACTOR_MODIFYDATA, data);
    }

    /**
     * 绑定手机
     * @param phone  手机号码
     * @param verification 验证码
     * @param pswd 用户密码
     * @param expPwd 用户的密码明文
     */
    bindPhone(phone: string, verification: string, pswd: string, expPwd: string) {
        let data: GS_BindPhone = new GS_BindPhone();
        data.szphone = phone;
        data.szverification = verification;
        data.szpassword = pswd;
        data.szexppwd = expPwd;
        this.send(GS_PLAZA_ACTORINFO_MSG.PLAZA_ACTOR_BINDPHONE, data);
    }

    /**
     * 反馈
     * @param md5Pic_1 //图片1	md5
     * @param md5Pic_2 //图片2	md5
     * @param md5Pic_3 //图片3	md5
     * @param md5Pic_4 //图片4	md5
     * @param md5Pic_5 //图片5	md5
     * @param msg 
     */
    reqFeedBack(msg: string, md5Pic_1: string = "0", md5Pic_2: string = "0", md5Pic_3: string = "0", md5Pic_4: string = "0", md5Pic_5: string = "0") {
        let data: GS_Feedback = new GS_Feedback();
        data.md5pic_1 = md5Pic_1;
        data.md5pic_2 = md5Pic_2;
        data.md5pic_3 = md5Pic_3;
        data.md5pic_4 = md5Pic_4;
        data.md5pic_5 = md5Pic_5;
        data.szmsg = msg;
        this.send(GS_PLAZA_ACTORINFO_MSG.PLAZA_ACTOR_FEEDBACK, data);
    }

    reqFeedBackPic(picname: string, picdata: any) {
        let temp = md5(picname);
        let obj = {
            token: md5(this.nactordbid + temp + GlobalVal.TOKEN_FLAG),
            uid: this.nactordbid,
            filename: picname,
            sendfile: picdata,
        }
        cc.log(temp, obj.token);
        HttpControl.post(GlobalVal.FEEDBACK_URL, obj, this.onFeedBackResult, true);
    }


    fristRechargeInfo() {
        let data: GS_FirstRechargeInfo = new GS_FirstRechargeInfo();
        /*
        __SLONG		(nRID);						//唯一RID
        __UINT64	(nDefPayKeyFlag);	//默认支付的支付通路标示(参考PAYPLATFLAG定义)
        __UINT64	(nPayKeyFlag);		//可进行支付的支付通路标示(参考PAYPLATFLAG定义)
        __SLONG		(nRMB);						//充值金额	
        __SLONG		(nGoodsID);					//购买的物品ID
        __SLONG		(nGoodsNums);				//购买的物品数量		
        __SLONGS	(nGiveGoodsID, 3);			//赠送物品ID
        __SLONGS	(nGiveGoodsNum, 3);			//赠送物品ID
        */
    }

    /**
     * 修改密码
     * @param oldpassword 老密码
     * @param newpassword 新密码
     */
    modifPwd(oldpassword: string, newpassword: string) {
        let data: GS_ModifyPwd = new GS_ModifyPwd();

        data.oldpassword = oldpassword;
        data.newpassword = newpassword;
        this.send(GS_PLAZA_ACTORINFO_MSG.PLAZA_ACTOR_MODIFYPWD, data);
    }

    /**
     * 客户端领取相关功能开启奖励
     * @param nflag 功能标识（参考ACTOR_OPENFLAG）
     */
    openFlag(nflag: number) {
        let data: GS_ActorOpenFlag = new GS_ActorOpenFlag();
        data.nflag = nflag;
        let value = this._privateData.nclientflag | nflag;
        this._privateData.nclientflag = this._privateData.nclientflag | nflag;
        this.send(GS_PLAZA_ACTORINFO_MSG.PLAZA_ACTOR_CLIENTOPENFLAG, data);
    }

    /**请求同步时间 */
    reqCheckTime() {
        let data: GS_ActorCheckTime = new GS_ActorCheckTime();
        data.nclienttimestamp = cc.sys.now();
        data.nservertimestamp = 0;
        cc.log("data.nclienttimestamp:", data.nclienttimestamp);
        this.send(GS_PLAZA_ACTORINFO_MSG.PLAZA_ACTOR_CHECKTIME, data);
    }

    /**请求设置头像id */
    reqSetFaceID(id: number) {
        let data: GS_ActorSetFaceID = new GS_ActorSetFaceID();
        data.nfaceid = id;
        this.send(GS_PLAZA_ACTORINFO_MSG.PLAZA_ACTOR_SETFACEID, data);
    }

    /**请求设置头像框id */
    reqSetFaceFrameID(id: number) {
        let data: GS_ActorSetFaceFrameID = new GS_ActorSetFaceFrameID();
        data.nfaceframeid = id;
        this.send(GS_PLAZA_ACTORINFO_MSG.PLAZA_ACTOR_SETFACEFRAMEID, data);
    }

    /**请求首冲 */
    reqFirstRecharge(flag: number) {
        let data: GS_FirstRecharge = new GS_FirstRecharge();
        data.btflag = flag;
        this.send(GS_PLAZA_ACTORINFO_MSG.PLAZA_ACTOR_FIRSTRECHARGE, data);
    }

    reqClientConfig(ids: number[]) {
        let data: GS_ActorRequestClientConfig = new GS_ActorRequestClientConfig();
        data.nconfigids = ids;
        this.send(GS_PLAZA_ACTORINFO_MSG.PLAZA_ACTOR_REQUESTCLIENTCONFIG, data);
    }

    private _prevFreeVideoOrderId:string = '';
    reqFreeVideo(orderId: string) {
        if (!SocketManager.instance.isConnected) {
            this._prevFreeVideoOrderId = orderId;
            return;
        }
        this._prevFreeVideoOrderId = '';
        let data: GS_ActorClientConfirmFreeVideo = new GS_ActorClientConfirmFreeVideo();
        data.szorder = orderId;
        data.nenquiry = 0;
        data.nadplatformid = 0;
        data.nadsourceid = 0;
        this.send(GS_PLAZA_ACTORINFO_MSG.PLAZA_ACTOR_CLIENTCONFIRMFREEVIDEO, data);
        LoadingTips.hideLoadingTips('showRewardAd');
    }

    private freeVideoFail(errorCode: string) {
        // if (errorCode == "102006") {
        //     SystemTipsMgr.instance.notice("广告请求过于频繁，请稍后再试");
        // } else {
        SystemTipsMgr.instance.notice("广告加载失败:" + errorCode);
        // }
        LoadingTips.hideLoadingTips('showRewardAd');
    }

    private freeVideoClose(errorCode: string) {
        LoadingTips.hideLoadingTips('showRewardAd');
    }



    //////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////
    /**玩家私有属性 */
    get privateData(): GS_ActorPrivateInfo {
        return this._privateData;
    }

    /**获取属性 */
    getProp(propid: number): any {
        let propStr = this._propEnum[propid];
        if (propStr && this._privateData) {
            return this._privateData[propStr];
        }
        return null;
    }

    /**获取体力 */
    getStrength(): number {
        let value = this.getInfiniteStrength();
        if (value > 0 && value * 1000 > GlobalVal.getServerTime()) {
            return ServerDefine.MAX_STRENGTH;
        }
        return this.getProp(ActorProp.ACTOR_PROP_STRENGTH);
    }

    /**获取钻石 */
    getDiamonds(): number {
        return this.getProp(ActorProp.ACTOR_PROP_DIAMONDS);
    }

    /**获取头像id */
    getFaceID(): number {
        return this.getProp(ActorProp.ACTOR_PROP_FACEID);
    }

    /**获取头像框id */
    getFaceFrameID(): number {
        return this.getProp(ActorProp.ACTOR_PROP_FACEFRAMEID);
    }
    /**获取段位积分 */
    getNrankScore(): number {
        return this.getProp(ActorProp.ACTOR_PROP_RANKSCORE);
    }
    /**获取无限体力到期时间 */
    getInfiniteStrength(): number {
        return this.getProp(ActorProp.ACTOR_PROP_INFINITESTRENGTH);
    }

    getVipEx(): number {
        return this.getProp(ActorProp.ACTOR_PROP_VIPEXP);
    }

    getVipLevel(): number {
        return this.getProp(ActorProp.ACTOR_PROP_VIPLEVEL);
    }

    getRankWin(): number {
        return this.getProp(ActorProp.ACTOR_PROP_PVPWIN);
    }

    getRankLost(): number {
        return this.getProp(ActorProp.ACTOR_PROP_PVPLOST);
    }

    getRankDraw(): number {
        return this.getProp(ActorProp.ACTOR_PROP_PVPDRAW);
    }

    /**获取总的对战次数 */
    getRankTotal(): number {
        return this.getRankWin() + this.getRankLost() + this.getRankDraw();
    }

    getSelfVipItem(): GS_VipInfo_VipLevel {
        let level = this.getVipLevel();
        return this.getVipItem(level);
    }

    getVipItem(level: number): GS_VipInfo_VipLevel {
        if (this._vipInfo && this._vipInfo.data) {
            let len = this._vipInfo.data.length;
            for (let index = 0; index < len; index++) {
                const element = this._vipInfo.data[index];
                if (element.nnowlevel == level) {
                    return element;
                }
            }
        }

        return null;
    }

    getNextAddStrengthTime(): number {
        if (this._nextAddTime != -1) {
            return this._nextAddTime - GlobalVal.getServerTime();
        }
    }

    /**通过快充id获取一个快充配置 */
    getChargeConifg(rid: number): GS_ActorRechargeConfig_QuickRechargeItem {
        return this._chargeConfig[rid];
    }

    getConfig(): any {
        return this._configDic;
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    /**玩家私有数据 */
    private onPrivateData(data: GS_ActorPrivateInfo) {
        Debug.log(ACTOR_TAG, "玩家私有数据", JSON.stringify(data));
        this._privateData = data;
        if (this._privateData.nlastaddstrengtime != -1) {
            this._nextAddTime = this._privateData.nlastaddstrengtime * 1000 + ServerDefine.STRENGTH_SPACE;
        } else {
            this._nextAddTime = -1;
        }

        //UCHAR	(btDropJoinState);			// 掉线重入状态（0:重入失败，相关的数据被清理链 1:客户端短线前的数据有效，可
        if (data.btdropjoinstate == 0 && this.reconnectionid != 0) {
            cc.log("RELOGIN_FAIL");
            GameEvent.emit(EventEnum.RELOGIN_FAIL);
        } else if (data.btdropjoinstate == 1) {
            cc.log('断线重连成功！');
        }

        this.reqCheckTime();
        // Game.nativeApi.commitRoleInfo(data.nactordbid.toString(), data.szname);
        GameEvent.emit(EventEnum.MODULE_INIT, GS_PLAZA_MSGID.GS_PLAZA_MSGID_ACTOR);
        BuryingPointMgr.postFristPoint(EBuryingPoint.RET_SERVER_LOGIN_SUC);

        if (this.isNew) {
            console.log(' GameEvent.emit(EventEnum.CK_ROLE_INFO_CHANGE, SEND_TYPE.CREATE_ROLE);')
            GameEvent.emit(EventEnum.CK_ROLE_INFO_CHANGE, SEND_TYPE.CREATE_ROLE);
        } else {
            GameEvent.emit(EventEnum.CK_ROLE_INFO_CHANGE, SEND_TYPE.LOGIN);
        }
        this.isNew = false;

        if (!StringUtils.isNilOrEmpty(this._prevFreeVideoOrderId)) {
            this.reqFreeVideo(this._prevFreeVideoOrderId);
        }
    }

    /**玩家易变属性 */
    private onVariableData(data: GS_ActorVariable) {
        Debug.log(ACTOR_TAG, "玩家易变属性", data);
        let len = data.svariable.length;
        for (let i = 0; i < len; i++) {
            let prodata: GS_ActorVariable_Variable = data.svariable[i];
            this.setProp(prodata.btpropid, prodata.i64newvalue);
        }
    }

    /**玩家修改资料返回 */
    private onModifDateRet(data: GS_ActorModifyDateRet) {
        Debug.log(ACTOR_TAG, "玩家修改资料返回", data);
        this._privateData.szname = data.szname;
        this._privateData.btsex = data.btsex;
        this._privateData.szsign = data.szsign;
        LocalStorageMgr.setItem(LocalStorageMgr.CHANGE_NAME, 1, true);
        GameEvent.emit(EventEnum.PLAYER_NAME_CHANGE, data.szname);

    }

    /**绑定手机返回 */
    private onBindPoneRet(data: GS_BindPhoneRet) {
        Debug.log(ACTOR_TAG, "绑定手机返回", data);
        cc.log(data);
    }

    /**反馈信息返回 */
    private onFeedbackRet(data: GS_FeedbackRet) {
        SystemTipsMgr.instance.notice("反馈成功");
        GameEvent.emit(EventEnum.FEED_BACK_SUCC);
    }

    /**首次登陆游戏 */
    private onFristLogin(data: GS_FirstLogin) {

    }

    /**首充配置下发 */
    private onFristRechargeInfo(data: GS_FirstRechargeInfo) {
        Debug.log(ACTOR_TAG, "首充配置下发", data);
        this._firstRechanrgeInfo = data;
    }

    /**首充订单下发 */
    private onFristRechargeRet(data: GS_FirstRechargeRet) {
        Game.mallProto.payOrder(data.szorder);

        BuryingPointMgr.post(EBuryingPoint.PAY_FRIST_RECHARGE, JSON.stringify({ order: data.szorder }));
    }

    /**用户修改密码返回 */
    private onModifyPwdRet(data: GS_ModifyPwdRet) {

    }

    /**用户重置密码返回 */
    private onResetPswd(data: GS_ResetPwdRet) {

    }

    /**VIP描述信息下发 */
    private onVipInfo(data: GS_VipInfo) {
        Debug.log(ACTOR_TAG, "VIP描述信息下发", data);
        this._vipInfo = data;
    }

    /**玩家修改头像 */
    private onFaceChange(data: GS_FaceChange) {
        Debug.log(ACTOR_TAG, "玩家修改头像", data);
    }

    /**弹出活动窗口 */
    private onPopActive(data: GS_PopActive) {
        Debug.log(ACTOR_TAG, "弹出活动窗口", data);
        this._popViewData = data;
        this.showPopView();
    }

    /**弹出告示面板 */
    private onPopActiveNotice(data: GS_ActorPopActiveNotice) {
        Debug.log(ACTOR_TAG, "弹出告示面板", data);
    }

    private setProp(propid: number, newvalue: any) {
        let propStr: string = this._propEnum[propid];
        if (propStr) {
            let oldValue = this._privateData[propStr];
            this._privateData[propStr] = newvalue;

            if (propid == ActorProp.ACTOR_PROP_LASTADDSTRENGTIME) {
                if (newvalue != -1) {
                    this._nextAddTime = this._privateData.nlastaddstrengtime * 1000 + ServerDefine.STRENGTH_SPACE;
                } else {
                    this._nextAddTime = -1;
                }
            }
            GameEvent.emit(EventEnum.PLAYER_PROP_CHANGE + propid, newvalue, oldValue);
        }
    }

    private onCheckTime(data: GS_ActorCheckTime) {
        let now = cc.sys.now();
        let ping = Math.floor(now - data.nclienttimestamp);
        GlobalVal.timeDifference = now - data.nservertimestamp - ping;
        cc.log('_timeDifference:', GlobalVal.timeDifference, 'ping:', ping);
        SysMgr.instance.doOnce(Handler.create(this.reqCheckTime, this), 120000, true);
    }

    /**
     * 头像数据
     * @param data 
     */
    private onFaceConfig(data: GS_ActorFaceConfig) {
        Debug.log(ACTOR_TAG, "头像数据", data);
        this._faceConfig = data;
        this._faceFrameDic = {};
        if (data.data2) {
            data.data2.forEach(element => {
                this._faceFrameDic[element.nid] = element;
            });
        }
    }

    /**
     * 特殊激活的头像框和头像列表
     * @param data 
     */
    private onActiveFaceList(data: GS_ActorActiveFaceList) {
        Debug.log(ACTOR_TAG, "特殊激活的头像框和头像列表", data);
        this._activeFaceList = data;
    }

    /**
     * 激活一个可使用的头像
     * @param data 
     */
    private onActiveFace(data: GS_ActorActiveFace) {
        Debug.log(ACTOR_TAG, "激活一个可使用的头像", data);
        if (this._activeFaceList) {
            this._activeFaceList.data1 = this._activeFaceList.data1 || [];
            let faceData = new GS_ActorActiveFaceList_FaceItem();
            faceData.nid = data.nid;
            faceData.nlasttimes = data.nlasttimes;
            this._activeFaceList.data1.push(faceData);
        }
    }

    /**
     * 激活一个可使用的头像框
     * @param data 
     */
    private onActiveFaceFrame(data: GS_ActorActiveFaceFrame) {
        Debug.log(ACTOR_TAG, "激活一个可使用的头像框", data);
        if (this._activeFaceList) {
            this._activeFaceList.data2 = this._activeFaceList.data2 || [];
            let faceFrameData = new GS_ActorActiveFaceList_FaceFrameItem();
            faceFrameData.nid = data.nid;
            faceFrameData.nlasttimes = data.nlasttimes;
            this._activeFaceList.data2.push(faceFrameData);
        }
    }

    public hasSpecialFaceFrame(frameId: number): boolean {
        if (this._activeFaceList && this._activeFaceList.data2) {
            let arr = this._activeFaceList.data2;
            for (let i = arr.length - 1; i >= 0; i--) {
                if (arr[i].nid == frameId) {
                    return true;
                }
            }
        }
        return false;
    }

    public hasSpecialFace(faceid: number): boolean {
        if (this._activeFaceList && this._activeFaceList.data1) {
            let arr = this._activeFaceList.data1;
            for (let i = arr.length - 1; i >= 0; i--) {
                if (arr[i].nid == faceid) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * 快充配置
     * @param data 
     */
    private onRechargeConfig(data: GS_ActorRechargeConfig) {
        Debug.log(ACTOR_TAG, "快充配置", data);
        this._chargeConfig = {};
        if (data.uitemcount > 0) {
            data.data.forEach(element => {
                this._chargeConfig[element.nrid] = element;
            });
        }
    }

    /**pvp info */
    private onRankInfo(data: GS_ActorRankInfo) {
        Debug.log(ACTOR_TAG, "段位配置", data);
        this._rankInfo = data;
    }

    private onConfigList(data: GS_ActorClientConfigList) {
        this._configList = data;
        this._waitLoadConfigList = [];
        let requestIds: number[] = [];
        let loacalIds: number[] = [];
        if (data.uitemcount > 0) {
            for (let i = 0; i < data.uitemcount; i++) {
                let item: GS_ActorClientConfigList_ConfigItem = data.items[i];
                let v = LocalStorageMgr.getItem(LocalStorageMgr.CONFIG_VERSION + item.nconfigid);
                if (StringUtils.isNilOrEmpty(v) || Number(v) != item.nversion) {
                    requestIds.push(item.nconfigid);
                } else {
                    loacalIds.push(item.nconfigid);
                }
                this._waitLoadConfigList.push(item.nconfigid);
            }
        }

        if (requestIds.length > 0) {
            this.reqClientConfig(requestIds);
        }

        let len = loacalIds.length;
        if (len > 0) {

            for (let i = 0; i < len; i++) {
                Game.resMgr.loadLocalJsonRes(loacalIds[i].toString(), Handler.create(this.onLocalConfigLoaded, this))
            }
        }

        this.loadedConfig(-1);
    }

    private onLocalConfigLoaded(name: string, tex: any) {
        console.log('-----onLocalConfigLoaded,', name);
        console.log('-----onLocalConfigLoaded,', JSON.stringify(tex));

        this._waitLoadConfigList[name] = true;
        this._configDic[name] = tex;
        this.loadedConfig(Number(name));


    }

    private onConfigItem(data: GS_ActorClientConfig) {
        if (data.ubasecount <= 0) return;

        let dataDic: any = {};
        let i = 0;
        let baseDataIndex: number = 0;
        let baseData: GS_ActorClientConfig_BaseData = data.data1[baseDataIndex];
        let keyIndex: number = 0;
        let key: string;
        for (i = 0; i < data.ukeyitemcount; i++) {
            key = data.data2[i].szname;
            if (keyIndex == 0) {
                baseData['rowKeyList'] = [];
                baseData['colKeyList'] = [];

            }

            if (keyIndex < baseData.bttransversekeycount) {
                baseData['rowKeyList'].push(key);
                keyIndex++;
            } else if (keyIndex < baseData.bttransversekeycount + baseData.btverticalkeycount) {
                baseData['colKeyList'].push(key);
                keyIndex++;
            } else {
                keyIndex = 0;
                baseDataIndex++;
                baseData = data.data1[baseDataIndex];
            }
        }

        baseDataIndex = 0;
        baseData = data.data1[baseDataIndex];

        let dataObj: any;
        let valueIndex = 0;
        let colKeyIndex = 0;
        let itemObj: any;

        dataDic[baseData.nconfigid] = {};
        dataObj = dataDic[baseData.nconfigid];

        for (i = 0; i < data.uvalueitemcount; i++) {

            if (valueIndex == 0) {
                dataObj[baseData['colKeyList'][colKeyIndex]] = {};
                itemObj = dataObj[baseData['colKeyList'][colKeyIndex]];
            }

            itemObj[baseData['rowKeyList'][valueIndex]] = data.data3[i].nvalue;
            valueIndex++;

            if (valueIndex >= baseData.bttransversekeycount) {
                valueIndex = 0;
                colKeyIndex++;

                if (colKeyIndex >= baseData.btverticalkeycount) {
                    colKeyIndex = 0;
                    baseDataIndex++;
                    this._configDic[baseData.nconfigid] = dataObj;
                    this.loadedConfig(baseData.nconfigid);

                    if (cc.sys.isNative) {
                        if (Game.resMgr.writeLocalJsonRes(baseData.nconfigid.toString(), JSON.stringify(dataObj))) {
                            LocalStorageMgr.setItem(LocalStorageMgr.CONFIG_VERSION + baseData.nconfigid, baseData.nversion);
                        }
                    }

                    baseData = data.data1[baseDataIndex];
                    if (baseData) {
                        dataDic[baseData.nconfigid] = {};
                        dataObj = dataDic[baseData.nconfigid];
                    }
                }
            }
        }
    }

    private loadedConfig(id: number) {
        let index = this._waitLoadConfigList.indexOf(id);
        if (index != -1) {
            this._waitLoadConfigList.splice(index, 1);
        }

        if (this._waitLoadConfigList.length == 0) {
            GameEvent.emit(EventEnum.CLIENT_CONFIG_LOADED);
        }
    }

    private onFeedBackResult(suc: boolean, ret: string | any) {
        if (suc) {
            cc.log(ret);
        }
    }

    /**获取头像数据 */
    public getFaceConfig(): GS_ActorFaceConfig {
        return this._faceConfig;
    }

    getFaceFrameItem(id:number):GS_ActorFaceConfig_FaceFrameItem {
        return this._faceFrameDic ? this._faceFrameDic[id] : null;
    }

    /**获取首冲数据 */
    getFirstRechanrgeInfo(): GS_FirstRechargeInfo {
        return this._firstRechanrgeInfo;
    }

    /**
     * 获取首充配置
     * @returns 
     */
    getFirstRechargeInfos(): FirstRechargeInfo[] {
        let results: FirstRechargeInfo[] = [];
        if (this._firstRechanrgeInfo && this._firstRechanrgeInfo.urechargeitemcount) {
            let goodsItemIndex = 0;
            let data2 = this._firstRechanrgeInfo.data2;
            for (let i = 0, len = this._firstRechanrgeInfo.data1.length; i < len; i++) {
                let goodsItem = [];
                let day = 0;
                for (let j = goodsItemIndex, len = this._firstRechanrgeInfo.ugiveitemcount; j < len; j++) {
                    if (data2[j].btday > day) {
                        goodsItem.push(data2[j]);
                        goodsItemIndex++;
                        day = data2[j].btday;
                    } else break;
                }

                results.push({
                    item: this._firstRechanrgeInfo.data1[i],
                    goodsItem: goodsItem
                })
            }
        }
        return results;
    }

    /**
     * 显示活动弹窗
     */
    showPopView() {
        if (!this._popViewData || this._popViewShowed) return;
        this._popViewShowed = true;
        if (this._popViewData.uflag == POP_VIEW_TYPE.MESSAGE) {
            UiManager.showDialog(EResPath.POP_TIPS_VIEW, this._popViewData.szparam);
        } else if (this._popViewData.uflag == POP_VIEW_TYPE.URL) {
            // UiManager.showDialog(EResPath.NOTICE_WEB_VIEW, data.szurl);
        }
    }

    /**获取rankinfo */
    getRankInfo(): GS_ActorRankInfo {
        return this._rankInfo;
    }

    /**
     * 获取段位
     * @param rankScore 
     * @returns 
     */
    public getPvpRankIndex(rankScore: number): number {
        let index = 0;
        if (this._rankInfo && this._rankInfo.data) {
            let arr = this._rankInfo.data;
            for (let i = 0, len = arr.length; i < len; i++) {
                if (rankScore < arr[i].nscore) {
                    index = i;
                    break;
                }
            }

            if (arr.length > 0 && rankScore >= arr[arr.length - 1].nscore) {
                index = arr.length - 1;
            }
        }
        return index;
    }

    getSelfPvpRankLv(): number {
        return this.getPvpRankLv(this.getProp(ActorProp.ACTOR_PROP_RANKSCORE));
    }

    public getPvpRankLv(rankScore: number): number {
        let index = this.getPvpRankIndex(rankScore);
        return this._rankInfo && this._rankInfo.data[index] ? this._rankInfo.data[index].nlevel : 1;
    }

    /**
     * 获取所有段位奖励配置
     * @returns 
     */
    public getPvpRankRewardCfgs(): Array<GS_ActorRankInfo_RankItem> {
        return (this._rankInfo && this._rankInfo.data) || [];
    }

    /**
     * 获取单个段位奖励配置
     * @param index 
     * @returns 
     */
    public getPvpRankRewardCfg(index: number): GS_ActorRankInfo_RankItem {
        return this._rankInfo && this._rankInfo.data ? this._rankInfo.data[index] : null;
    }

    /**
     * 是否领取了该段位奖励
     * @param index 
     * @returns 
     */
    public isGetRankReward(index: number): boolean {
        return false;
        //if (!this._privateData) return false;
        //return Utils.checkBitFlag(this.privateData.nrankrewardflag, index + 1);
    }

    /**
     * 领取奖励
     * @param index 
     */
    public getRankReward(index: number) {
        //let data = new GS_ActorGetRankReward();
        //data.ulv = index + 1;
        //this.send(GS_PLAZA_ACTORINFO_MSG.PLAZA_ACTOR_GETRANKREWARD, data);
    }

    /**
     * 获取小于或大于当前段位可领取奖励数量
     * @param index 
     * @param OrRight 
     * @returns 
     */
    public getRewardNum(index: number, leftOrRight: boolean): number {
        if (!this._privateData) return 0;
        let currRankIndex = Game.actorMgr.getPvpRankIndex(Game.actorMgr.privateData.nrankscore);
        // index = MathUtils.clamp(index, 0, currRankIndex);
        let redPointNum = 0;
        let start = leftOrRight ? 0 : index + 1;
        let end = leftOrRight ? index : currRankIndex + 1;
        for (let i = start; i < end; i++) {
            if (index <= currRankIndex && !this.isGetRankReward(i)) {
                redPointNum++;
            }
        }
        return redPointNum;
    }

    /**
     * 首充私有数据
     * @param data 
     */
    public onFirstRechargePrivate(data: GS_ActorFirstRechargePrivate) {
        cc.log("首充私有数据", data);
        if (data.uitemcount) {
            for (let v of data.items) {
                this._firstRechargePrivateMap.set(v.btflag, v);

                let state = Game.actorMgr.getFirstRechargeState(v.btflag, 0);
                switch (state) {
                    case FIRST_RECHARGE_STATE.RECIVE:
                        //自动领取
                        this.reciveFirstRechargeReward(v.btflag, 0);
                        break;
                    case FIRST_RECHARGE_STATE.RECIVED:
                        GameEvent.emit(EventEnum.ON_FIRST_RECHARGE_RECIVED, v.btflag, 0);
                        break;
                }
            }
        }
        GameEvent.emit(EventEnum.FIRST_RECHARGE_PRIVATE, data);
    }

    public getFirstRechargePrivate(flag: number): GS_ActorFirstRechargePrivate_FirstRechargeItem {
        return this._firstRechargePrivateMap.get(flag);
    }

    /**
     * 领取首充奖励
     * @param flag 
     * @param index 
     */
    public reciveFirstRechargeReward(flag: number, index: number) {
        let data = new GS_ActorGetFirstRechargeReward();
        data.btflag = flag;
        data.btindex = index;
        this.send(GS_PLAZA_ACTORINFO_MSG.PLAZA_ACTOR_GETFIRSTRECHARGEREWARD, data);
    }

    /**
     * 获取首充领取状态
     * @param flag 
     * @param index 
     * @returns 
     */
    public getFirstRechargeState(flag: number, index: number): FIRST_RECHARGE_STATE {
        let state = FIRST_RECHARGE_STATE.NONE;
        let privateData = this.getFirstRechargePrivate(flag);
        if (privateData) {
            state = Utils.checkBitFlag(privateData.btfinishflag, index) ? FIRST_RECHARGE_STATE.RECIVED : FIRST_RECHARGE_STATE.RECIVE;
        } else {
            state = FIRST_RECHARGE_STATE.BUY;
        }
        return state;
    }

    /**
     * 获取首充活动当前天下标
     * @param flag 
     * @returns 
     */
    public getFirstRechargeCurrDayIndex(flag: number) {
        let index = 0;
        let privateData = this.getFirstRechargePrivate(flag);
        if (privateData) {
            //活动开启当天零点时间戳
            let times = new Date(new Date(privateData.nactivetimes * 1000).toLocaleDateString()).getTime();
            index = Math.floor((Date.now() - times) / (24 * 60 * 60 * 1000));
        }
        return MathUtils.clamp(index, 0, 2);
    }

    public isFirstRechargeFinished() {
        console.log("this.getProp(ActorProp.ACTOR_PROP_OPENFLAG):" , this.getProp(ActorProp.ACTOR_PROP_OPENFLAG))
        console.log("this.getProp(ActorProp.ACTOR_PROP_OPENFLAG) & ACTOR_OPENFLAG.OPENFLAG_FIRSTRECHARGE:" , this.getProp(ActorProp.ACTOR_PROP_OPENFLAG) & ACTOR_OPENFLAG.OPENFLAG_FIRSTRECHARGE)
        return !!(this.getProp(ActorProp.ACTOR_PROP_OPENFLAG) & ACTOR_OPENFLAG.OPENFLAG_FIRSTRECHARGE);
    }

    private onOpenflagChange(newValue, oldValue) {
        if (!(ACTOR_OPENFLAG.OPENFLAG_FIRSTRECHARGE & oldValue) && (ACTOR_OPENFLAG.OPENFLAG_FIRSTRECHARGE & newValue)) {
            GameEvent.emit(EventEnum.FIRST_RECHARGE_END);
        }

        if (!(ACTOR_OPENFLAG.OPENFLAG_FINISHZEROMALL & oldValue) && (ACTOR_OPENFLAG.OPENFLAG_FINISHZEROMALL & newValue)) {
            GameEvent.emit(EventEnum.ZERO_MALL_STATE_CHANGE);
        }
    }

    public getFirstRechargeViewData(): [number, FirstRechargeInfo] {
        //第一天
        let infos = this.getFirstRechargeInfos();
        for (let i = 0, len = infos.length; i < len; i++) {
            if (this.getFirstRechargeState(infos[i].item.btflag, 0) === FIRST_RECHARGE_STATE.BUY) {
                return [i, infos[i]];
            }
        }
        return null;
    }

    public getFirstRechargeViewPath() {
        let data = this.getFirstRechargeViewData();
        // let paths = [EResPath.FIRST_RECHARGE_VIEW0, EResPath.FIRST_RECHARGE_VIEW1, EResPath.FIRST_RECHARGE_VIEW2];
        return data ? EResPath.FIRST_RECHARGE_VIEW0 : "";
    }

    getOnlineTime():number {
        // return 0;
        if (!this._privateData) return 0;
        return this._privateData.nhistoryplaytime + Math.floor(GlobalVal.getServerTimeS() - this._privateData.nlogingreentime);
    }

    /**获取渠道开放多少天了 */
    getChannelOpenDays():number {
        if (this.privateData) {
            return Utils.getDiffDay(this.privateData.nchannelopentimes * 1000 , GlobalVal.getServerTime());
        }
        return 0;
    }

    checkDontSpeak():boolean {
        return (this.privateData.nbehaviorctrlflag & ACTOR_BEHAVIORCTRL.ACTOR_BEHAVIORCTRL_SPEAK) != 0;
    }
}