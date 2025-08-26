// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EMODULE } from "../../common/AllEnum";
import { EventEnum } from "../../common/EventEnum";
import SysMgr from "../../common/SysMgr";
import { GameDataCtrl } from "../../logic/gameData/GameDataCtrl";
import { GameEvent } from "../../utils/GameEvent";

const HOLIDAY = {
    //元旦
    "1-1": true,
    "1-2": true,
    "1-3": true,
    //春节
    "2-1": true,
    "2-2": true,
    "2-3": true,
    "2-4": true,
    "2-5": true,
    "2-6": true,
    "2-7": true,
    //清明节
    "4-3": true,
    "4-4": true,
    "4-5": true,
    //劳动节
    "5-1": true,
    "5-2": true,
    "5-3": true,
    "5-4": true,
    "5-5": true,
    //端午节
    "6-12": true,
    "6-13": true,
    "6-14": true,
    //中秋节
    "9-19": true,
    "9-20": true,
    "9-21": true,
    //国庆节
    "10-1": true,
    "10-2": true,
    "10-3": true,
    "10-4": true,
    "10-5": true,
    "10-6": true,
    "10-7": true,
}

export const TIPS = {
    LEGAL: "<color=#ad5b29>根据《国家新闻出版署关于防止未成年人沉迷网络游戏的通知》要求，法定节假日未成年用户</color>"
        + "<color=#ea5718>每日游戏</color><color=#ad5b29>累计时长不得超过</color><color=#ea5718>3</color>"
        + "<color=#ad5b29>小时，您在线累计时长已到，暂时无法继续游戏，建议您休息！</color>",
    ILLEGAL: "<color=#ad5b29>根据《国家新闻出版署关于防止未成年人沉迷网络游戏的通知》要求，非法定节假日未成年用户</color>"
        + "<color=#ea5718>每日游戏</color><color=#ad5b29>累计时长不得超过</color><color=#ea5718>1.5</color>"
        + "<color=#ad5b29>小时，您在线累计时长已到，暂时无法继续游戏，建议您休息！</color>",
    BETWEEN_22_8: "<color=#ad5b29>根据《国家新闻出版署关于防止未成年人沉迷网络游戏的通知》要求,未满</color>"
        + "<color=#ea5718>18</color><color=#ad5b29>周岁的用户每日</color><color=#ea5718>22:00</color>"
        + "<color=#ad5b29>至次日</color><color=#ea5718>08:00</color><color=#ad5b29>禁止游戏。</color>",
    UNCERFICATION: "未实名认证用户累计时长不超过60分钟，",
    LEGAL_LESS18: "法定假日未成年用户每日累计时长不超过180分钟，",
    ILLEGAL_LESS18: "非法定节假日未成年用户每日累计时长不超过90分钟，"
}

export default class AddictionMgr extends GameDataCtrl {
    _uncertificationLimitTime: number = 60;

    private _leaglLimitTime: number = 180;
    private _illegalLimitTime: number = 90;

    _minTime: number = 8;
    _maxTime: number = 22;

    private _queryData: any = null;

    private _time: number = 0;//累计在线时间(s)

    private _enableCheck: boolean = false;
    private _data: any = null;
    private _canWriteDate: boolean = false;
    constructor() {
        super();
        this.module = EMODULE.ADDICTION;

        /*
        let schedule = cc.director.getScheduler();
        schedule.enableForTarget(this);
        schedule.scheduleUpdate(this, cc.Scheduler.PRIORITY_NON_SYSTEM, false);
        */

        GameEvent.on(EventEnum.EXIT_GAME, this.exitGame, this);
        this.exitGame();
    }

    exitGame() {
        this._time = 0;
        this._queryData = null;
        this._enableCheck = false;
        SysMgr.instance.clearTimerByTarget(this);
    }

    // onQueryRet() {
    //     this._queryData = Game.certification.getQueryData();
    //     if (!this._queryData || !Game.certification.isNeedCert()) return;
    //     // age: 24
    //     // id: "10000184"
    //     // online_times: 0             //在线时长(s)
    //     // plaza_online_times: null
    //     // status: 1                   //是否实名
    //     // underage: 1                 //是否成年
    //     // info: "success"
    //     this._time = this._queryData.online_times;

    //     if (this._canWriteDate) {
    //         this._canWriteDate = false;
    //         let data = {
    //             timeInterval: new Date(new Date().toLocaleDateString()).getTime(),
    //             time: this._time
    //         }
    //         this._data = data;
    //         this.write();
    //     }

    //     SysMgr.instance.clearTimerByTarget(this);
    //     if (0 == this._queryData.status) {
    //         //未实名认证
    //         UiManager.showDialog(EResPath.ADDICTION_VIEW);
    //         //UiManager.showBottomDialog(EResPath.TIME_VIEW);
    //         //SysMgr.instance.doLoop(Handler.create(this.write, this), 60);//每分钟写一次数据
    //     } else if (0 == this._queryData.underage) {
    //         //未成年
    //         //UiManager.showBottomDialog(EResPath.TIME_VIEW);
    //     } else {
    //         UiManager.hideDialog(EResPath.TIME_VIEW);
    //     }

    //     this._enableCheck = true;
    // }

    // private update(dt) {
    //     if (!this._queryData || !this._enableCheck || (this._queryData.status == 1 && this._queryData.underage == 1)) return;
    //     this._time += dt;
    //     let minute = this.getMinute();
    //     if (0 == this._queryData.status) {
    //         this._data.time += dt;
    //         //未实名认证
    //         let min = this._data.time / 60;
    //         if (min >= this._uncertificationLimitTime) {
    //             this._enableCheck = false;
    //             UiManager.showDialog(EResPath.TO_IDENTIFICATION_View);
    //         }
    //     } else if (0 == this._queryData.underage) {
    //         let b = this.isTodayHoliday();
    //         let tips = b ? TIPS.LEGAL : TIPS.ILLEGAL;
    //         let limitTime = b ? this._leaglLimitTime : this._illegalLimitTime;
    //         if (minute >= limitTime) {
    //             this._enableCheck = false;
    //             UiManager.showDialogWithZIndex(EResPath.EXIST_TIPS_VIEW, 1000, tips);
    //         }
    //     }

    //     //未成年人和未实名用户22:00到次日8:00无法游戏
    //     let hour = new Date().getHours();
    //     if (!(hour >= this._minTime && hour < this._maxTime)) {
    //         this._enableCheck = false;
    //         UiManager.showDialogWithZIndex(EResPath.EXIST_TIPS_VIEW, 1000, TIPS.BETWEEN_22_8);
    //     }
    // }

    /**
     * 获取时间描述的字符串
     */
    public getTimeDesString(): string {
        let minute = this.getMinute();
        let desStr = "";
        let limitTime = 0;
        if (!this._queryData) return "";

        if (0 == this._queryData.status) {
            //未实名认证
            desStr = TIPS.UNCERFICATION;
            limitTime = this._uncertificationLimitTime;
        } else if (0 == this._queryData.underage) {
            //未成年
            let b = this.isTodayHoliday();
            desStr = b ? TIPS.LEGAL_LESS18 : TIPS.ILLEGAL_LESS18;
            limitTime = b ? this._leaglLimitTime : this._illegalLimitTime;
        }

        minute = minute > limitTime ? limitTime : minute;
        desStr += "您当前已体验" + minute + "分钟";
        return desStr;
    }

    public getMinute(): number {
        return Math.floor(this._time / 60);
    }

    /**
     * 今天是否是法定假日
     * @returns 
     */
    public isTodayHoliday(): boolean {
        let date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        return HOLIDAY[month + "-" + day];
    }

    read() {
        this._data = this.readData();
        if (!this._data) {
            //存储今天零点时间戳
            let data = {
                timeInterval: new Date(new Date().toLocaleDateString()).getTime(),
                time: 0
            }
            this._data = data;
            this.write();
            this._canWriteDate = true;
        }

        //每15天重置一次时间
        if (Date.now() - this._data.timeInterval >= 15 * 24 * 60 * 60 * 1000) {
            this._canWriteDate = true;
        }
    }

    write() {
        this.writeData(this._data);
    }
}
