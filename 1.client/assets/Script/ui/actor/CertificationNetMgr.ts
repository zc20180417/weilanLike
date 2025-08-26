import BaseNetHandler from "../../net/socket/handler/BaseNetHandler";
import { CMD_ROOT, GS_PLAZA_MSGID } from "../../net/socket/handler/MessageEnum";
import { GS_PLAZA_CERTIFICATION_MSG, GS_CertificationPopup, GS_CertificationUnderageTips, GS_CertificationState } from "../../net/proto/DMSG_Plaza_Sub_Certification";
import { Handler } from "../../utils/Handler";
import HttpControl from "../../net/http/HttpControl";
import GlobalVal from "../../GlobalVal";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import { GameEvent } from "../../utils/GameEvent";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import Debug from "../../debug";
import { EResPath } from "../../common/EResPath";
import { DialogLayer, UiManager } from "../../utils/UiMgr";
import { BuryingPointMgr, EBuryingPoint } from "../../buryingPoint/BuryingPointMgr";
const TAG = "实名认证:";
export class CertificationNetMgr extends BaseNetHandler {
    private _queryData: any = null;
    private _isNeedCert: boolean = false;
    constructor() {
        super(CMD_ROOT.CMDROOT_PLAZA_MSG, GS_PLAZA_MSGID.GS_PLAZA_MSGID_CERTIFICATION);
    }

    register() {
        this.registerAnaysis(GS_PLAZA_CERTIFICATION_MSG.PLAZA_CERTIFICATION_POPUP, Handler.create(this.onPopUp, this), GS_CertificationPopup);
        this.registerAnaysis(GS_PLAZA_CERTIFICATION_MSG.PLAZA_CERTIFICATION_UNDERAGETIPS, Handler.create(this.onUnderageTips, this), GS_CertificationUnderageTips);
        this.registerAnaysis(GS_PLAZA_CERTIFICATION_MSG.PLAZA_CERTIFICATION_STATE, Handler.create(this.onCertificationState, this), GS_CertificationState);
    }

    exitGame() {
        this._queryData = null;
        this._isNeedCert = false;
    }

    private onPopUp(data: GS_CertificationPopup) {
        Debug.log(TAG, "弹出实名认证");
        Debug.log(TAG, data);
    }

    private onUnderageTips(data: GS_CertificationUnderageTips) {
        Debug.log(TAG, "认证为未成年之后的提示");
    }

    private onCertificationState(data: GS_CertificationState) {
        Debug.log(TAG, "实名认证功能开关状态");
    }

    //http://mxhd.f3322.net:8002/VerifyRealname?realname=姓名&idcard=身份证号码&uid=用户ID
    /**
     * 请求实名认证
     * @param name 名字
     * @param num  身份证号码
     * @param uid  uid
     */
    reqCertification(name: string, num: string, uid: number) {
        let obj = { realname: name, idcard: num, uid: uid };
        HttpControl.get(GlobalVal.REAL_NAME_AUTH_RUL, obj, (suc: boolean, ret: string | any) => {
            this.onCertificatCallBack(suc, ret);
        }, true);
    }

    private onCertificatCallBack(suc: boolean, ret: string | any) {
        if (!suc) {
            Debug.log(TAG, "请求实名认证失败：" + ret);
            BuryingPointMgr.postFristPoint(EBuryingPoint.RET_CERTIFICATION_FAIL);
            SystemTipsMgr.instance.showSysTip2(ret);
        } else {
            let obj = ret ? ret : JSON.parse(ret);
            if (!obj || obj.status == 0) {
                Debug.log(TAG, "请求实名认证失败：" + obj.info);
                SystemTipsMgr.instance.showSysTip2(obj.info);
                BuryingPointMgr.postFristPoint(EBuryingPoint.RET_CERTIFICATION_FAIL);
                return;
            }
            //认证成功查询一次认证数据
            SystemTipsMgr.instance.showSysTip2("实名认证成功");
            if (ret.data.underage == 1) {
                BuryingPointMgr.postFristPoint(EBuryingPoint.RET_CERTIFICATION_FAIL2);
                UiManager.showTopDialog(EResPath.ADDICTION_TIPS_VIEW, 0);
            }
            GameEvent.emit(EventEnum.CERTIFICATION_SUCCESS, ret.data.underage == 1);
            Game.certification.reqQuery(Game.actorMgr.nactordbid, Game.actorMgr.loginKey, 0);
            BuryingPointMgr.postFristPoint(EBuryingPoint.RET_CERTIFICATION_SUC);
        }
    }


    /**
     * 查询玩家实名认证的数据
     * @param uid 
     * @param sign 
     * @param underage 
     */
    reqQuery(uid: number, sign: string, underage: number = 0) {
        let obj = { id: uid, sign: sign, underage: underage };
        // let obj = {realname : name , idcard:num}
        BuryingPointMgr.postFristPoint(EBuryingPoint.REQ_CERTIFICATION_QUARY);
        HttpControl.get(GlobalVal.QUARY_URL, obj, (suc: boolean, ret: string | any) => {
            this.onQuaryRet(suc, ret);
        }, true);
    }

    /**
     * 查询实名认证数据返回
     * @param suc 
     * @param ret 
     * @returns 
     */
    onQuaryRet(suc: boolean, ret: string | any) {
        /*
        返回json格式
        {
            adult:0                     //是否需要实名认证 0:不需要 1:需要
            data:{
                age: 24
                id: "10000184"
                online_times: 0             //每日在线时长(s)
                plaza_online_times: null
                status: 1                   //是否实名 0:未实名 1:已实名
                underage: 1                 //是否成年 0:未成年 1:已成年
                info: "success"
            }        
            status: 1                       //是否有用户信息
        }
        */
        Debug.log(TAG, "查询数据返回:", suc, ret);
        if (!suc) {
            Debug.log(TAG, "请求认证数据失败：" + ret);
        } else {
            if (!ret) return SystemTipsMgr.instance.showSysTip2("实名认证数据异常");
            BuryingPointMgr.postFristPoint(EBuryingPoint.RET_CERTIFICATION_QUARY);
            this._queryData = ret.data;
            if (!!ret.adult) {
                UiManager.showDialog(EResPath.ADDICTION_VIEW);
            } else {
                ret.underage ? GameEvent.emit(EventEnum.JAVA_CALL_ON_ANTI_ADDICTION_CANCEL) : GameEvent.emit(EventEnum.JAVA_CALL_ON_ANTI_ADDICTION_SUCC);
            }
            // this._isNeedCert = !!ret.adult;
            // GameEvent.emit(EventEnum.ON_QUERY_RET);
        }
    }

    /**
     * 记录数据
     * @param uid 
     * @param sign 
     * @param underage 
     */
    reqRecord(uid: number, sign: string, underage: number) {
        let obj = { id: uid, sign: sign, underage: underage };
        HttpControl.post(GlobalVal.RECORD_URL, obj, this.onRecordRet, true);
    }

    private onRecordRet() {
        // Debug.log(TAG, "记录数据成功");
        cc.log("记录数据成功");
    }

    // getQueryData(): any {
    //     return this._queryData;
    // }

    // isNeedCert(): boolean {
    //     return this._isNeedCert;
    // }

    isCert(): boolean {
        return this._queryData && !this._queryData.adult;
    }
}