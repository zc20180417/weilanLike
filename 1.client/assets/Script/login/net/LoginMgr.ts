import BaseNetHandler from "../../net/socket/handler/BaseNetHandler";
import { GS_LOGIN_MSGID, GS_LOGIN_MSG, CLogin_Login, SLogin_Tips, SLogin_Login, SLogin_LoginError, CLogin_Regedit, SLogin_Regedit } from "../../net/proto/DMSG_Login_Sub_Login";
import GlobalVal, { SDK_CHANNEL, SEND_TYPE } from "../../GlobalVal";
import { CMD_ROOT, LOGINTYPE, SYSTEMTYPE, GS_PLAZA_MSGID, ActorProp } from "../../net/socket/handler/MessageEnum";
import { Handler } from "../../utils/Handler";
import { LocalStorageMgr } from "../../utils/LocalStorageMgr";
import { EventEnum } from "../../common/EventEnum";
import { GS_Login, GS_PLAZA_LOGIN_MSG } from "../../net/proto/DMSG_Plaza_Sub_Login";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import Game from "../../Game";
import SocketManager from "../../net/socket/SocketManager";
import HttpControl from "../../net/http/HttpControl";
import { BuryingPointMgr, EBuryingPoint } from "../../buryingPoint/BuryingPointMgr";
import { StringUtils } from "../../utils/StringUtils";
import { Channel, EGetOaidState } from "../../common/AllEnum";
import { NativeAPI, SysState } from "../../sdk/NativeAPI";
import { UiManager } from "../../utils/UiMgr";
import { EResPath } from "../../common/EResPath";
import { WxConst } from "../../thirdparty/WxConst";
import { GameEvent } from "../../utils/GameEvent";
import { md5 } from "../../libs/encrypt/md5";

// (1:账号错误 2:密码错误 3:停机维护中 4:授权失败 5:查看对应的web内容 6:客户端版本太低，需要下载最新的安装包)
const LOGIN_ERR = {
    "1": "账号错误",
    "2": "密码错误",
    "3": "停机维护中",
    "4": "授权失败",
    "5": "查看对应的web内容",
    "6": "游戏版本太低，需要下载新的安装包"
}

export class LoginMgr extends BaseNetHandler {
    /**缓存微信账号模块名 */
    private _wxAccountMoudle: string = "loginwx";
    /**微信账号有效时间长 */
    private _limitedWxAccountTime: number = 86400000;

    private _curAccount: string = '';
    private _curPswd: string = '';
    private _curCode: string = '';
    private _curLoginType: number = 0;
    private _requestState: number = 0;
    private _sendVerificationDy: number = 60000;
    private _sdk: NativeAPI;


    sendVerificationTime: number = 0;
    constructor() {
        super(CMD_ROOT.CMDROOT_LOGIN_MSG, GS_LOGIN_MSGID.LOGIN_MAINID_LOGIN);
        this._sdk = Game.nativeApi;
    }

    register() {
        this.registerAnaysis(GS_LOGIN_MSG.LOGIN_MSGID_LOGINEND, Handler.create(this.onLoginEnd, this), SLogin_Login);
        this.registerAnaysis(GS_LOGIN_MSG.LOGIN_MSGID_TIPS, Handler.create(this.onLoginTips, this), SLogin_Tips);
        this.registerAnaysis(GS_LOGIN_MSG.LOGIN_MSGID_LOGINERROR, Handler.create(this.onLoginError, this), SLogin_LoginError);
        this.registerAnaysis(GS_LOGIN_MSG.LOGIN_MSGID_REGEDITEND, Handler.create(this.onRegedit, this), SLogin_Regedit);
        this.registerAnaysis(GS_LOGIN_MSG.LOGIN_MSGID_LOGIN, Handler.create(this.onRegedit, this), CLogin_Login);

        GameEvent.on(EventEnum.SOCKET_CONNECTED, this.onSocketConnected, this);
        GameEvent.on(EventEnum.JAVA_CALL_LOGIN_SUCCESS, this.onJavaCallLoginSucc, this);
        GameEvent.on(EventEnum.JAVA_CALL_LOGIN_FAIL, this.onJavaCallLoginFail, this);
        GameEvent.on(EventEnum.JAVA_CALL_LOGIN_CANCEL, this.onJavaCallLoginCancel, this);
        GameEvent.on(EventEnum.JAVA_CALL_ON_GET_DEVICEID, this.onGetDeviceID, this);
        // GameEvent.on(EventEnum.ON_GAME_START, this.onGameStart, this);
        // GameEvent.on(EventEnum.PLAYER_PROP_CHANGE + ActorProp.ACTOR_PROP_VIPEXP, this.onRecharge, this);

        GameEvent.on(EventEnum.JAVA_CALL_ON_LOGOUT_SUCC, this.onLogoutSucc, this);
        GameEvent.on(EventEnum.JAVA_CALL_ON_LOGOUT_FAIL, this.onLogoutFail, this);

        // GameEvent.on(EventEnum.JAVA_CALL_ON_SDK_INIT_SUCC, this.onSdkInitSucc, this);
    }

    private onSocketConnected() {
        console.log('---------------onSocketConnected');
        if (this._requestState > 0) {
            if (this._requestState == 1) {
                console.log('-----------this._requestState 1');
                this.regedit(this._curAccount, this._curPswd, this._curCode);
            } else {
                if (this._curLoginType == LOGINTYPE.LOGINTYPE_WEIXIN) {
                    console.log("请求微信登录：ret.account:", this._curAccount, "ret.password:", this._curPswd);
                    this.loginByWxAccount(this._curAccount, this._curPswd);
                } else if (this._curLoginType == LOGINTYPE.LOGINTYPE_TOURIST) {
                    this.loginByTourist();
                } else {
                    this.loginByAccount(this._curAccount, this._curPswd, this._curLoginType);
                }
            }
        }
        this._requestState = 0;
    }

    /**
     * 注册账号
     * @param account 账号
     * @param pswd  密码
     */
    regedit(account: string, pswd: string, code: string) {
        this._curAccount = account;
        this._curPswd = pswd;
        this._curCode = code;
        if (!SocketManager.instance.isConnected) {
            SocketManager.instance.connect();
            this._requestState = 1;
            console.log("连接服务器");
            return;
        }
        let regeditData: CLogin_Regedit = new CLogin_Regedit();
        regeditData.account = account;
        regeditData.password = GlobalVal.isExtranet ? md5(pswd) : pswd;
        regeditData.nickname = account;
        regeditData.idcard = '362299123443211234';
        regeditData.btsystemtype = this.getSystemType();
        regeditData.phone = account;
        regeditData.szverification = code;
        regeditData.email = 'test@qq.com';
        regeditData.szchannel = GlobalVal.channel;
        regeditData.szidfa = 'test';
        regeditData.machinename = Game.nativeApi.getPhoneInfo(SysState.SYSSTATE_HDID);
        regeditData.sysversion = 'muzhiya';
        regeditData.mac = '1001';
        regeditData.buffhd = '1001';
        regeditData.buffbios = '1001';
        regeditData.buffcpu = '1001';
        this.send(GS_LOGIN_MSG.LOGIN_MSGID_REGEDIT, regeditData);
        BuryingPointMgr.postFristPoint(EBuryingPoint.REQUEST_REGEDIT);
    }

    /**
     * 通过账号密码登录
     * @param account 账号
     * @param pswd  密码
     */
    loginByAccount(account: string, pswd: string, logintype: number = LOGINTYPE.LOGINTYPE_PHONE) {
        if (!GlobalVal.serverOpened) {
            SystemTipsMgr.instance.notice(LOGIN_ERR[3]);
            return;
        }
        console.log('-------------------------------------------loginByAccount');
        this._curAccount = account;
        this._curPswd = pswd;
        this._curLoginType = logintype;
        if (!SocketManager.instance.isConnected) {
            SocketManager.instance.connect();
            this._requestState = 2;
            return;
        }

        let loginData: CLogin_Login = new CLogin_Login();
        loginData.btlogintype = logintype;
        loginData.loginaccount = account;
        loginData.loginpassword = GlobalVal.isExtranet ? md5(pswd) : pswd;
        loginData.btsystemtype = this.getSystemType();
        loginData.nplazaversion = GlobalVal.curPlazaversion;
        loginData.szclientversion = GlobalVal.curVersion;
        loginData.szchannel = GlobalVal.channel;
        loginData.nclientresversion = GlobalVal.curResVersion;
        // loginData.szchannel = "0";
        loginData.btsoftware = 2;
        loginData.szidfa = 'test';
        loginData.machinename = Game.nativeApi.getPhoneInfo(SysState.SYSSTATE_HDID);
        loginData.sysversion = 'muzhiya';
        loginData.mac = this._sdk.getPhoneInfo(SysState.SYSSTATE_MACADDRESS);
        loginData.buffhd = this.getHdid();
        loginData.buffbios = this._sdk.getPhoneInfo(SysState.SYSSTATE_BIOSID);
        loginData.buffcpu = this._sdk.getPhoneInfo(SysState.SYSSTATE_CUPID);

        this.send(GS_LOGIN_MSG.LOGIN_MSGID_LOGIN, loginData);
        BuryingPointMgr.postFristPoint(EBuryingPoint.REQUEST_PHP_LOGIN);
    }

    loginByWxAccount(account: string, pswd: string) {
        
        this._curAccount = account;
        this._curPswd = pswd;
        this._curLoginType = LOGINTYPE.LOGINTYPE_WEIXIN;
        if (!SocketManager.instance.isConnected) {
            console.log(' do SocketManager.instance.isConnected');
            SocketManager.instance.connect();
            this._requestState = 2;
            return;
        }

        let loginData: CLogin_Login = new CLogin_Login();
        loginData.btlogintype = LOGINTYPE.LOGINTYPE_WEIXIN;
        loginData.loginaccount = account;
        loginData.loginpassword = pswd;
        loginData.btsystemtype = this.getSystemType();
        loginData.nplazaversion = GlobalVal.curPlazaversion;
        loginData.szclientversion = GlobalVal.curVersion;
        loginData.nclientresversion = GlobalVal.curResVersion;
        loginData.szchannel = GlobalVal.channel;
        loginData.btsoftware = 2;
        loginData.szidfa = '';
        loginData.machinename = Game.nativeApi.getPhoneInfo(SysState.SYSSTATE_HDID);
        loginData.sysversion = 'muzhiya';
        loginData.mac = this._sdk.getPhoneInfo(SysState.SYSSTATE_MACADDRESS);
        loginData.buffhd = this.getHdid();
        loginData.buffbios = this._sdk.getPhoneInfo(SysState.SYSSTATE_BIOSID);
        loginData.buffcpu = this._sdk.getPhoneInfo(SysState.SYSSTATE_CUPID);
        cc.log('登录大厅:', "account:", account, "pswd:", pswd, "mac:", loginData.mac, 'device_id', loginData.buffhd, 'buffbios', loginData.buffbios, 'buffcpu:', loginData.buffcpu);
        this.send(GS_LOGIN_MSG.LOGIN_MSGID_LOGIN, loginData);
        BuryingPointMgr.postFristPoint(EBuryingPoint.REQUEST_PHP_LOGIN);
    }

    /**游客登录 */
    loginByTourist() {
        if (!GlobalVal.serverOpened) {
            SystemTipsMgr.instance.notice(LOGIN_ERR[3]);
            return;
        }
        this._curAccount = '';
        this._curPswd = '';
        this._curLoginType = LOGINTYPE.LOGINTYPE_TOURIST;
        if (!SocketManager.instance.isConnected) {
            SocketManager.instance.connect();
            this._requestState = 2;
            return;
        }

        let loginData: CLogin_Login = new CLogin_Login();
        loginData.btlogintype = LOGINTYPE.LOGINTYPE_TOURIST;
        loginData.loginaccount = '123456';
        loginData.loginpassword = '123456';
        loginData.btsystemtype = this.getSystemType();
        loginData.nplazaversion = GlobalVal.curPlazaversion;
        loginData.szclientversion = GlobalVal.curVersion;
        loginData.nclientresversion = GlobalVal.curResVersion;
        loginData.szchannel = GlobalVal.channel;
        loginData.btsoftware = 2;
        loginData.szidfa = '';
        loginData.machinename = Game.nativeApi.getPhoneInfo(SysState.SYSSTATE_HDID);
        loginData.sysversion = 'muzhiya';
        loginData.mac = this._sdk.getPhoneInfo(SysState.SYSSTATE_MACADDRESS);
        loginData.buffhd = this.getHdid();
        loginData.buffbios = this._sdk.getPhoneInfo(SysState.SYSSTATE_BIOSID);
        loginData.buffcpu = this._sdk.getPhoneInfo(SysState.SYSSTATE_CUPID);
        console.log('--------loginData:', "mac:", loginData.mac, 'buffhd:', loginData.buffhd, 'buffbios', loginData.buffbios, 'buffcpu:', loginData.buffcpu);
        this.send(GS_LOGIN_MSG.LOGIN_MSGID_LOGIN, loginData);
        BuryingPointMgr.postFristPoint(EBuryingPoint.REQUEST_PHP_LOGIN);
    }

    /**
     * 请求验证码
     * @param account 手机号码
     * @param type （0：注册 ， 1 忘记密码）
     * @param channel （渠道：默认0）
     */
    reqVerificationCode(account: string, type: number, channel: string) {
        let token: string = md5(account + GlobalVal.TOKEN_FLAG);
        let obj = { destid: account, type: type, channel: channel, systemtype: SYSTEMTYPE.SYSTEMTYPE_PC, token: token };
        HttpControl.get(GlobalVal.CODE_URL, obj, this.onVerificationResult, true);
        this.sendVerificationTime = cc.sys.now() + this._sendVerificationDy;
    }

    getVerification() {

    }

    private _prevLoginTime:number = 0;
    /**
     * 登录中心服务器
     * @param nactordbid 
     * @param szkey 
     * @param reconnectid 重连id
     */
    doPlazaLogin(nactordbid: number, szkey: string, reconnectid: number) {

        if (this._prevLoginTime > 0 && (GlobalVal.now - this._prevLoginTime) < 1000) {
            return;
        }
        this._prevLoginTime = GlobalVal.now;
        let loginData: GS_Login = new GS_Login();
        loginData.btlogintype = this._curLoginType;
        loginData.nactordbid = nactordbid;
        loginData.szloginkey = szkey;

        loginData.btsystemtype = this.getSystemType();
        loginData.nplazaversion = GlobalVal.curPlazaversion;
        loginData.szclientversion = GlobalVal.curVersion;
        loginData.szchannel = GlobalVal.channel;
        loginData.btsoftware = 2;
        loginData.szidfa = 'test';
        loginData.machinename = Game.nativeApi.getPhoneInfo(SysState.SYSSTATE_HDID);
        loginData.sysversion = 'muzhiya';
        loginData.mac = this._sdk.getPhoneInfo(SysState.SYSSTATE_MACADDRESS);
        loginData.buffhd = Game.nativeApi.getPhoneInfo(SysState.SYSSTATE_HDID),
        loginData.buffbios = this._sdk.getPhoneInfo(SysState.SYSSTATE_BIOSID);
        loginData.buffcpu = this._sdk.getPhoneInfo(SysState.SYSSTATE_CUPID);
        loginData.nreconnectionid = reconnectid;

        console.log("用户ID:" + nactordbid, "szkey:" + szkey, "reconnectid:" + reconnectid);
        Game.actorMgr.nactordbid = nactordbid;
        Game.actorMgr.loginKey = szkey;
        this._socketMgr.sendData(CMD_ROOT.CMDROOT_PLAZA_MSG, GS_PLAZA_MSGID.GS_PLAZA_MSGID_LOGIN, GS_PLAZA_LOGIN_MSG.PLAZA_LOGIN_CLIENTLOGIN, loginData);
        BuryingPointMgr.postFristPoint(EBuryingPoint.REQUEST_SERVER_LOGIN);
        Game.nativeApi.preLoadRewardAd();
        
        // Game.atRewardMgr.tryPreLoad();
    }

    /**尝试快速登录 */
    tryFastLogin() {
        return false;
        if (!cc.sys.isNative) return false;
        let cache = LocalStorageMgr.getItem(this._wxAccountMoudle, false);
        if (!StringUtils.isNilOrEmpty(cache)) {
            let obj = JSON.parse(cache);
            //if (!obj.merchant_id) return false;
            if (obj && obj.limittime && obj.limittime >= cc.sys.now()) {
                GlobalVal.ckRoleId = obj.uid ? obj.uid : 0;
                this.loginByWxAccount(obj.account, obj.password);
                return true;
            }
        }
        return false;
    }

    /**
     * 点击微信登录
     */
    loginByWx() {
        if (cc.sys.isNative) {
            // let cache = LocalStorageMgr.getItem(this._wxAccountMoudle, false);
            // if (!StringUtils.isNilOrEmpty(cache)) {
            //     let obj = JSON.parse(cache);
            //     if (!obj.merchant_id) {
            //         return this.tryGetWxCode();
            //     }

            //     if (obj && obj.limittime >= cc.sys.now()) {
            //         this.loginByWxAccount(obj.account, obj.password);
            //         return;
            //     }
            // }
            this.tryGetWxCode();
        } else {
            this.tryGetWxCode();
            //this.doLoginByWx("ozC-v1dOnlEU-Am1UJwmjnR4oYxc");
            // this.loginByWxAccount("wx_ozC-v1dOnlEU-Am1UJwmjnR4oYxc", "cc0829db6305521c42004c67f09822eb");
        }
    }

    tryGetWxCode() {
        this._sdk.login();
    }

    //isLogining:boolean = false;
    private _time: number = 0;
    private _wxCode: string = "";

    private _requestWxLoginCd: boolean = true;
    private _waitOaitState: EGetOaidState = EGetOaidState.NONE;

    
    

    /**
     * 触控登录
     * @param uid 
     * @param token 
     * @param channelId 
     * @param gameId 
     * @param nickName 
     * @param sex 
     * @param headimg 
     */
    ckLogin(uid: string, token: string, channelId: string, gameId: string, nickName: string, sex: string, headimg: string) {
        if (!GlobalVal.serverOpened) {
            SystemTipsMgr.instance.notice(LOGIN_ERR[3]);
            return;
        }

        if (!this._requestWxLoginCd && cc.sys.now() - this._time < 2000) return;
        this._requestWxLoginCd = false;
        this._waitOaitState = EGetOaidState.LOGIN;

        let channel = GlobalVal.channel;
        if (channel == Channel.xw) {
            //buffhd = this._sdk.getXwOaid();
            return;
        }
        GlobalVal.ckRoleId = uid;
        let obj = {
            clienttype: this.getSystemType(),
            channel: channel,
            token: token,
            buffhd: "",
            gametype: 1,
            server_id: 1,
            channel_id: "",
            regional_id: "",
            cps_id: "",

            machinename: nickName,
            user_id: uid,
            channel_ids: channelId,
            game_id: gameId,
            sex: sex,
            headimgurl: headimg,
            edition:GlobalVal.curPlazaversion,
            packageVersionName:GlobalVal.packageVersionName
        };

        obj.buffhd = Game.nativeApi.getPhoneInfo(SysState.SYSSTATE_HDID);
        obj.channel_id = Game.nativeApi.getPhoneInfo(SysState.SYSSTATE_CHANNEL_ID);
        obj.regional_id = Game.nativeApi.getPhoneInfo(SysState.SYSSTATE_REGIONALID);
        obj.cps_id = Game.nativeApi.getPhoneInfo(SysState.SYSSTATE_CPSID);

        this._time = cc.sys.now();
        console.log("触控登录请求ur：", GlobalVal.CK_LOGIN_URL, encodeURI(JSON.stringify(obj)));
        BuryingPointMgr.postFristPoint(EBuryingPoint.REQ_GET_ACCOUNT);
        HttpControl.post(GlobalVal.CK_LOGIN_URL, obj, (suc: boolean, ret: string | any) => {
            console.log("触控登录返回数据:", suc, suc ? JSON.stringify(ret) : ret, ' , end');
            this._requestWxLoginCd = true;
            if (suc) {
                if (ret.status == 1) {
                    BuryingPointMgr.postFristPoint(EBuryingPoint.RET_GET_ACCOUNT);
                    let md5PassWord = md5(ret.password);
                    this._time = cc.sys.now();
                    Game.actorMgr.isNew = ret.is_new == 1;
                    
                    if (ret.is_new == 1) {
                        console.log('--is new --GameEvent.emit(EventEnum.CK_ROLE_INFO_CHANGE, SEND_TYPE.CREATE_ROLE);');
                        // GameEvent.emit(EventEnum.CK_ROLE_INFO_CHANGE, SEND_TYPE.CREATE_ROLE);
                    }
                    //LocalStorageMgr.setItem(this._wxAccountMoudle, { uid: GlobalVal.ckRoleId, account: ret.account, password: md5PassWord, buffhd: obj.buffhd, limittime: cc.sys.now() + this._limitedWxAccountTime }, false);
                    this.loginByWxAccount(ret.account, md5PassWord);
                }
            }
        }, true);
    }

    

    private onGetDeviceID(id: string) {
        this._hdid = id;
        switch (this._waitOaitState) {
            case EGetOaidState.LOGIN:
                this.requestLoginByWx(id);
                break;
        
            default:
                break;
        }

    }

    private requestLoginByWx(buffhd: string) {
        console.log('--------------------------buffhd:', buffhd);
        let channel = this._sdk.getChannel();
        if (StringUtils.isNilOrEmpty(buffhd)) {
            //buffhd = this._sdk.getXwOaid();
            return;
        }

        if (!this._requestWxLoginCd) return;
        this._requestWxLoginCd = false;

        if (StringUtils.isNilOrEmpty(buffhd)) {
            buffhd = '0';
        }

        //this._buffhd = buffhd;
        let obj = {
            //appid:'wx5901399477e20b7e',
            appid: WxConst.WX_APP_ID,
            code: this._wxCode,
            buffhd: buffhd,
            clienttype: this.getSystemType(),
            machinename: Game.nativeApi.getPhoneInfo(SysState.SYSSTATE_HDID),
            gametype: "",
            idfa: "",
            channel: channel
        };

        this._time = cc.sys.now();
        console.log('------------------------------------->doLoginByWx:' + this._wxCode);
        BuryingPointMgr.postFristPoint(EBuryingPoint.REQ_GET_ACCOUNT);
        HttpControl.get(GlobalVal.WECHAT_LOGIN_URL, obj, (suc: boolean, ret: string | any) => {
            //cc.log("------------------------------------>请求微信登录返回:", cc.sys.now() - this._time, suc, ret);
            this._requestWxLoginCd = true;
            if (suc) {
                if (ret.status == 1) {
                    BuryingPointMgr.postFristPoint(EBuryingPoint.RET_GET_ACCOUNT);
                    let md5PassWord = md5(ret.password);
                    LocalStorageMgr.setItem(this._wxAccountMoudle, { account: ret.account, password: md5PassWord, buffhd: buffhd, limittime: cc.sys.now() + this._limitedWxAccountTime }, false);
                    console.log("请求微信登录：ret.account:", ret.account, "ret.password:", ret.password, md5PassWord);
                    this._time = cc.sys.now();
                    this.loginByWxAccount(ret.account, md5PassWord);
                }
            }
        }, true);
    }


    /**
     * 登录授权返回
     * @param plat 
     * @param msg 
     */
    private onJavaCallLoginSucc(channel, ...args) {
        this._wxCode = args[1];
        console.log('--------onJavaCallLoginSucc:', channel, this._wxCode);
        switch (channel) {
            case SDK_CHANNEL.MI_GAME:
                this.requestLoginByWx(this.getHdid());
                break;
            case SDK_CHANNEL.CHUKONG:
                BuryingPointMgr.postFristPoint(EBuryingPoint.WX_CODE_SUC);
                this.ckLogin(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
                break;
        }
    }

    private onJavaCallLoginFail(channel, ...args) {
        if (args && args.length > 0) {
            SystemTipsMgr.instance.notice(args[0]);
        }
        BuryingPointMgr.postFristPoint(EBuryingPoint.WX_CODE_FAIL);
    }

    private onJavaCallLoginCancel(channel, ...args) {
        if (args && args.length > 0) {
            SystemTipsMgr.instance.notice(args[0]);
        }
        BuryingPointMgr.postFristPoint(EBuryingPoint.WX_CODE_CANCEL);
    }

    /**登录完成 */
    private onLoginEnd(data: SLogin_Login) {
        //this.isLogining = false;
        console.log('----------------------登录完成,nactordbid:', cc.sys.now() - this._time, data.nactordbid, data.szkey);
        LocalStorageMgr.setItem(LocalStorageMgr.ACCOUNT, this._curAccount, false);
        LocalStorageMgr.setItem(LocalStorageMgr.PSWD, this._curPswd, false);
        GlobalVal.moduleName = GlobalVal.DEFAULT_MODULE_NAME + "_" + data.nactordbid;
        BuryingPointMgr.postFristPoint(EBuryingPoint.RET_PHP_LOGIN_SUC);
        this.doPlazaLogin(data.nactordbid, data.szkey, 0);
        GameEvent.emit(EventEnum.ENTER_GAME_SUC);
        Game.shareMgr.initPhpObj();
    }

    /**登录提升信息 */
    private onLoginTips(data: SLogin_Tips) {
        /*
        //提示信息	LOGINMSGID_TIPS
        #define	LOGIN_ERROR_LOGIN		1			//	登录错误
        #define	LOGIN_ERROR_REGEDIT		2			//	注册错误
        #define	LOGIN_TIPS_MSG			3			//	无错误,仅仅提示信息
        #define LOGIN_ERROR_RESET		4			//	重置错误
        #define	LOGIN_ERROR_MODIFY		5			//	修改密码错误
        #define	LOGIN_VERIFICATION_MSG	6			//	验证码获取成功提示信息
        */


        console.log('onLoginTips:' + data.bttype);
        SystemTipsMgr.instance.notice('提示:' + data.szdes);
    }

    /**登录出错 */
    private onLoginError(data: SLogin_LoginError) {

        //this.isLogining = false;
        //登录失败类型	(1:账号错误 2:密码错误 3:停机维护中 4:授权失败 5:查看对应的web内容 6 版本太低)
        console.log('================onLoginError:' + data.uerrortype);
        //URL地址
        // SystemTipsMgr.instance.notice('onLoginError:' +data.uerrortype + "," + data.szurl);
        let msg = LOGIN_ERR[data.uerrortype];
        SystemTipsMgr.instance.notice('提示:' + msg);

        if (data.uerrortype == 6) {
            UiManager.showDialog(EResPath.DOWN_LOAD_GAME_VIEW, '游戏版本过低，请下载新的安装包或加群下载新包');
            return;
        }

        if ((data.uerrortype == 2 || data.uerrortype == 1 || data.uerrortype == 3) && this._curLoginType == LOGINTYPE.LOGINTYPE_WEIXIN) {
            GameEvent.emit(EventEnum.LOGIN_WX_ERROR);
            //this._sdk.enterWx();
            return;
        }
    }

    /**注册返回 */
    private onRegedit(data: SLogin_Regedit) {
        //	是否注册成功
        if (data.bok == 1) {
            SystemTipsMgr.instance.notice("注册成功");
            LocalStorageMgr.setItem(LocalStorageMgr.ACCOUNT, this._curAccount, false);
            LocalStorageMgr.setItem(LocalStorageMgr.PSWD, this._curPswd, false);

            GameEvent.emit(EventEnum.REGEDIT_SUC);
        } else {
            SystemTipsMgr.instance.notice("提示: " + data.bok);
        }
    }

    private onVerificationResult(suc: boolean, ret: string | any) {
        if (!suc) {
            GameEvent.emit(EventEnum.VERIFICATION_SEND_RESULT, 0);
            return;
        }
        GameEvent.emit(EventEnum.VERIFICATION_SEND_RESULT, ret.status);
        SystemTipsMgr.instance.notice(ret.info);
    }

    private getSystemType() {
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            return SYSTEMTYPE.SYSTEMTYPE_ANDROID;
        }
        if (cc.sys.os === cc.sys.OS_IOS) {
            return SYSTEMTYPE.SYSTEMTYPE_IOS;
        }
        return SYSTEMTYPE.SYSTEMTYPE_ANDROID;
    }



    public getAccount(): string {
        return this._curAccount;
    }

    private _hdid: string = '';
    private getHdid(): string {
        if (!StringUtils.isNilOrEmpty(this._hdid)) {
            return this._hdid;
        }
        return this._sdk.getPhoneInfo(SysState.SYSSTATE_HDID);
    }

    private onLogoutSucc() {
        Game.reconnectMgr.enterLoginScene(false);
    }

    private onLogoutFail() {
        SystemTipsMgr.instance.notice("登出失败，请重试！");
    }
}