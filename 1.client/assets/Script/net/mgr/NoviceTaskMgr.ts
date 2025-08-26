// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EventEnum } from "../../common/EventEnum";
import Debug from "../../debug";
import Game from "../../Game";
import GlobalVal from "../../GlobalVal";
import { EVENT_REDPOINT } from "../../redPoint/RedPointSys";
import { GameEvent } from "../../utils/GameEvent";
import { Handler } from "../../utils/Handler";
import { GS_NoviceTaskConfig, GS_NoviceTaskConfig_NoviceTaskList, GS_NoviceTaskGetReward, GS_NoviceTaskPrivate, GS_NoviceTaskPrivate_TaskData, GS_NoviceTaskShare, GS_NoviceTaskUpData, GS_PLAZA_NOVICETASK_MSG } from "../proto/DMSG_Plaza_Sub_NoviceTask";
import BaseNetHandler from "../socket/handler/BaseNetHandler";
import { CMD_ROOT, GS_PLAZA_MSGID, NOVICE_TASK_STATE } from "../socket/handler/MessageEnum";

const { ccclass, property } = cc._decorator;
const TAG = "新手宝典：";

//操作类型
export enum OPERATION_TYPE {
    SELECT_MAP = 0,//选关界面
    SIGN = 1,//签到界面
    CAT_HOUSE = 2,//猫咪公寓
    FIRST_RECHARGE = 3,//首冲界面
    FRIENDS = 4,//好友界面
    TOWER = 5,//猫咪界面
    SHARE = 6,//分享界面
    PVP = 7,//对战
    YUEKA = 8,//月卡
    // DISSHOP = 9,//打折屋
    SCIENCE = 10,//天赋
    DAILY_ACTIVE = 11,//日常任务
    VIP = 12//VIP
}

@ccclass
export default class NoviceTaskMgr extends BaseNetHandler {
    private _taskCfg: GS_NoviceTaskConfig = null;
    private _taskIdToDayIndexMap: Map<number, number> = new Map();
    private _privateData: GS_NoviceTaskPrivate = null;
    private _privateDataMap: Map<number, GS_NoviceTaskPrivate_TaskData> = new Map();

    constructor() {
        super(CMD_ROOT.CMDROOT_PLAZA_MSG, GS_PLAZA_MSGID.GS_PLAZA_MSGID_NOVICETASK);
    }

    register() {
        this.registerAnaysis(GS_PLAZA_NOVICETASK_MSG.PLAZA_NOVICETASK_CONFIG, Handler.create(this.onConfig, this), GS_NoviceTaskConfig);
        this.registerAnaysis(GS_PLAZA_NOVICETASK_MSG.PLAZA_NOVICETASK_PRIVATE, Handler.create(this.onPrivateData, this), GS_NoviceTaskPrivate);
        this.registerAnaysis(GS_PLAZA_NOVICETASK_MSG.PLAZA_NOVICETASK_UPDATA, Handler.create(this.onUpdate, this), GS_NoviceTaskUpData);

        GameEvent.on(EventEnum.JAVA_CALL_SHARE_SUCCESS, this.share, this);
    }

    protected onSocketError() {
        this.exitGame();
    }

    exitGame() {
        this._taskCfg = null;
        this._privateData = null;
        this._privateDataMap.clear();
        this._taskIdToDayIndexMap.clear();
        this.unscheduleUpdate();
    }

    /**
     * 刷新红点
     */
    refreshRedpoints() {

        for (let i = 0, len = this.getCurrDay(); i < len; i++) {
            let node = Game.redPointSys.findRedPointNode(EVENT_REDPOINT.NOVICE + "-day" + (i + 1));
            if (node) {
                node.setRedPointNum(this.getRedpoinsNumByDay(i));
            }
        }
    }

    /**
     * 设置定时器
     * @returns 
     */
    private scheduleUpdate() {
        let schedule = cc.director.getScheduler();
        schedule.enableForTarget(this);
        schedule.scheduleUpdate(this, cc.Scheduler.PRIORITY_NON_SYSTEM, false);
    }

    private unscheduleUpdate() {
        //取消定时器
        let schedule = cc.director.getScheduler();
        schedule.enableForTarget(this);
        schedule.unscheduleUpdate(this);
    }

    /**
     * 配置
     * @param data 
     */
    onConfig(data: GS_NoviceTaskConfig) {
        Debug.log(TAG, "配置", data);
        this._taskCfg = data;
        this._taskIdToDayIndexMap.clear();
        if (data && data.tasklists) {
            let dayTasks: GS_NoviceTaskConfig_NoviceTaskList = null;
            for (let i = 0, len = data.tasklists.length; i < len; i++) {
                dayTasks = data.tasklists[i];
                this._taskIdToDayIndexMap.set(dayTasks.nid, i);
                if (dayTasks.tasks) {
                    dayTasks.tasks.forEach(element => {
                        this._taskIdToDayIndexMap.set(element.nid, i);
                    });
                }
            }
        }
        GameEvent.emit(EventEnum.ON_NOVICE_CONFIG);
    }

    /**
     * 私人数据(首次此配置客户端才能显示界面)
     * @param data 
     */
    onPrivateData(data: GS_NoviceTaskPrivate) {
        Debug.log(TAG, "私人数据", data);
        this._privateData = data;
        this._privateDataMap.clear();
        if (data && data.data) {
            for (let i = 0, len = data.data.length; i < len; i++) {
                this._privateDataMap.set(data.data[i].nid, data.data[i]);
            }
        }
        if (!this.isNoviceOver()) {
            this.scheduleUpdate();
            this.refreshRedpoints();
        }

        GameEvent.emit(EventEnum.ON_NOVICE_PRIVATEDATA);
    }

    /**
     * 下发更新某个任务或者任务链数据
     * @param data 
     */
    onUpdate(data: GS_NoviceTaskUpData) {
        Debug.log(TAG, "更新", data);

        this._privateDataMap.set(data.nid, data);

        //超前完成不更新红点
        let dayIndex = this._taskIdToDayIndexMap.get(data.nid) || 0;
        if (dayIndex + 1 <= this.getCurrDay()) {
            if (data.btstate == NOVICE_TASK_STATE.CANGET) {
                GameEvent.emit(EVENT_REDPOINT.NOVICE + "-day" + (dayIndex + 1), 1);
            } else if (data.btstate == NOVICE_TASK_STATE.FINISHED) {
                GameEvent.emit(EVENT_REDPOINT.NOVICE + "-day" + (dayIndex + 1), -1);
            }
        }
        GameEvent.emit(EventEnum.ON_UPDATE_NOVICE, dayIndex);
    }

    /**
     * 领取奖励
     * @param index 
     * @param listIndex 
     * @returns 
     */
    getReward(nid: number) {
        if (nid === null || nid === undefined) return cc.warn("args error!");
        let data = new GS_NoviceTaskGetReward();
        data.nid = nid;
        this.send(GS_PLAZA_NOVICETASK_MSG.PLAZA_NOVICETASK_GETREWARD, data);
    }

    /**
     * 完成分享
     */
    share() {
        let data = new GS_NoviceTaskShare();
        this.send(GS_PLAZA_NOVICETASK_MSG.PLAZA_NOVICETASK_SHARE, data);
    }

    /**
     * 获取任务链配置
     * @param dayIndex 
     * @returns 
     */
    getTaskListCfg(dayIndex: number): GS_NoviceTaskConfig_NoviceTaskList {
        let cfg = null;
        if (this._taskCfg && this._taskCfg.tasklists) {
            cfg = this._taskCfg.tasklists[dayIndex];
        }
        return cfg;
    }

    /**
     * 获取私有数据
     * @param nid 
     * @returns 
     */
    getTaskPrivateData(nid: number): GS_NoviceTaskPrivate_TaskData {
        return this._privateDataMap.get(nid);
    }

    /**
     * 获取私有数据
     * @returns 
     */
    getPrivateData(): GS_NoviceTaskPrivate {
        return this._privateData;
    }

    /**
     * 新手宝典是否结束
     * @returns 
     */
    isNoviceOver(): boolean {
        let isOver: boolean = false;
        if (this._privateData) {
            let now = GlobalVal.getServerTime() * 0.001;
            isOver = this._privateData.nendgreentime - now <= 0;
        } else {
            isOver = true;
        }
        return isOver
    }

    update(dt) {
        let now = GlobalVal.getServerTime() * 0.001;
        let delta = this._privateData.nendgreentime - now;
        if (delta <= 0) {
            this.unscheduleUpdate();
            GameEvent.emit(EventEnum.ON_NOVICE_OVER);
        }

        // this._date.setTime(GlobalVal.getServerTime());
        // if (this._lastDay == -1) {
        //     this._lastDay = this._date.getDate();
        // } else {
        //     if (this._lastDay != this._date.getDate()) {
        //         this._lastDay = this._date.getDate();
        //         //跨天
        //         GameEvent.emit(EventEnum.ACROSS_DAY);
        //         this.refreshRedpoints();
        //     }
        // }
    }

    /**
     * 获取某天红点数
     * @param dayIndex 从0开始
     * @returns 
     */
    getRedpoinsNumByDay(dayIndex: number): number {
        if (!(this._taskCfg && this._taskCfg.tasklists)) return;
        let taskList = this._taskCfg.tasklists[dayIndex];
        let privateData: GS_NoviceTaskPrivate_TaskData = null;
        let redNum = 0;

        privateData = this.getTaskPrivateData(taskList.nid);
        if (privateData && privateData.btstate == NOVICE_TASK_STATE.CANGET) redNum++;

        if (taskList.tasks) {
            for (let i = 0, len = taskList.tasks.length; i < len; i++) {
                privateData = this.getTaskPrivateData(taskList.tasks[i].nid);
                if (privateData && privateData.btstate == NOVICE_TASK_STATE.CANGET) redNum++;
            }
        }

        return redNum;
    }

    /**
     * 某天任务是否全部完成并领取了奖励
     * @param dayIndex 
     * @returns 
     */
    isDayTaskAllFinished(dayIndex: number): boolean {
        if (!(this._taskCfg && this._taskCfg.tasklists)) return false;
        let taskList = this._taskCfg.tasklists[dayIndex];
        let privateData: GS_NoviceTaskPrivate_TaskData = null;
        privateData = this.getTaskPrivateData(taskList.nid);
        if (!(privateData && privateData.btstate == NOVICE_TASK_STATE.FINISHED)) return false;

        if (taskList.tasks) {
            for (let i = 0, len = taskList.tasks.length; i < len; i++) {
                privateData = this.getTaskPrivateData(taskList.tasks[i].nid);
                if (!(privateData && privateData.btstate == NOVICE_TASK_STATE.FINISHED)) return false;
            }
        }
        return true;
    }

    /**
     * 获取当前天数
     * @returns 
     */
    getCurrDay(): number {
        let day: number = 1;
        if (this._privateData) {
            let now = GlobalVal.getServerTime() * 0.001;
            day = Math.ceil((now - this._privateData.nstartgreentime) / 60 / 60 / 24);
            day = day > 7 ? 7 : day;
        }
        return day;
    }
}
