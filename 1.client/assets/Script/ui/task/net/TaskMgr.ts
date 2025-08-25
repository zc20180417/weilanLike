import BaseNetHandler from "../../../net/socket/handler/BaseNetHandler";
import { CMD_ROOT, GOODS_ID, GOODS_TYPE, GS_PLAZA_MSGID, TASK_TYPE } from "../../../net/socket/handler/MessageEnum";
import { GS_PLAZA_TASK_MSG, GS_TaskAdd, GS_TaskChange, GS_TaskFinish, GS_TaskGetScoreReward, GS_TaskInfo, GS_TaskInfo_TaskItem, GS_TaskScore, GS_TaskScoreRewardFlag, GS_TaskView, GS_TaskView_ScoreRewardItem, GS_TaskView_TaskViewItem } from "../../../net/proto/DMSG_Plaza_Sub_Task";
import { Handler } from "../../../utils/Handler";
import { GameEvent } from "../../../utils/GameEvent";
import { EventEnum } from "../../../common/EventEnum";
import { UiManager } from "../../../utils/UiMgr";
import { EResPath } from "../../../common/EResPath";
import { GS_RewardTips_RewardGoods } from "../../../net/proto/DMSG_Plaza_Sub_Tips";
import { EVENT_REDPOINT } from "../../../redPoint/RedPointSys";
import Game from "../../../Game";
import SystemTipsMgr from "../../../utils/SystemTipsMgr";
import Debug from "../../../debug";
import Utils from "../../../utils/Utils";

export enum TASK_STATE {
    NONE,
    CANGET,//领取
    UNFINISHED,//未完成
    FINISHED,//完成
}
const TASK_TAG = "任务：";
export class TaskMgr extends BaseNetHandler {

    _taskInfo: GS_TaskInfo = null;//任务信息
    _taskInfoMap: Map<number, GS_TaskInfo_TaskItem> = null;

    _taskView: GS_TaskView = null;//任务视图
    _taskViewMap: Map<number, GS_TaskView_TaskViewItem> = null;//

    //日常任务
    private _dailyFinishedMap: Map<number, GS_TaskView_TaskViewItem> = null;
    private _dailyUnfinishedMap: Map<number, GS_TaskView_TaskViewItem> = null;
    private _dailyCanReceiveMap: Map<number, GS_TaskView_TaskViewItem> = null;

    //成就任务    
    private _achievementFinishedMap: Map<number, GS_TaskView_TaskViewItem> = null;
    private _achievementUnfinishedMap: Map<number, GS_TaskView_TaskViewItem> = null;
    private _achievementCanReceiveMap: Map<number, GS_TaskView_TaskViewItem> = null;

    private isTaskInfoInit: boolean = false;
    private isTaskViewInit: boolean = false;
    private _cacheChangedTask: Array<GS_TaskChange> = null;
    private _goodsId:number = 0;
    private _scoreMax:number = 0;

    constructor() {
        super(CMD_ROOT.CMDROOT_PLAZA_MSG, GS_PLAZA_MSGID.GS_PLAZA_MSGID_TASK);
        this.exitGame();
    }

    register() {
        this.registerAnaysis(GS_PLAZA_TASK_MSG.PLAZA_TASK_INFO, Handler.create(this.onTaskInfo, this), GS_TaskInfo);
        this.registerAnaysis(GS_PLAZA_TASK_MSG.PLAZA_TASK_VIEW, Handler.create(this.onTaskView, this), GS_TaskView);
        this.registerAnaysis(GS_PLAZA_TASK_MSG.PLAZA_TASK_ADD, Handler.create(this.onTaskAdd, this), GS_TaskAdd);
        this.registerAnaysis(GS_PLAZA_TASK_MSG.PLAZA_TASK_CHANGE, Handler.create(this.onTaskChange, this), GS_TaskChange);
        this.registerAnaysis(GS_PLAZA_TASK_MSG.PLAZA_TASK_SCOREREWARDFLAG, Handler.create(this.onScoreRewardFlag, this), GS_TaskScoreRewardFlag);
        this.registerAnaysis(GS_PLAZA_TASK_MSG.PLAZA_TASK_SCORE, Handler.create(this.onTaskScore, this), GS_TaskScore);
    }

    protected onSocketError() {
        this.exitGame();
    }

    exitGame() {
        this._taskInfoMap = new Map();
        this._taskViewMap = new Map();

        this._dailyFinishedMap = new Map();
        this._dailyUnfinishedMap = new Map();
        this._dailyCanReceiveMap = new Map();
        this._achievementFinishedMap = new Map();
        this._achievementUnfinishedMap = new Map();
        this._achievementCanReceiveMap = new Map();

        this.isTaskInfoInit = false;
        this.isTaskViewInit = false;

        this._cacheChangedTask = [];
    }

    /**
     * 刷新任务红点
     */
    private refreshRedPoint() {
        if (!this.isTaskViewInit) return;
        //刷新任务红点数
        let redPointsNum = this.getCangetTaskNum(TASK_TYPE.TASK_TYPE_DAY);
        let taskNode = Game.redPointSys.findRedPointNode(EVENT_REDPOINT.TASK_DAILY);
        if (taskNode) {
            taskNode.setRedPointNum(redPointsNum);
        }
        redPointsNum = this.getCangetTaskNum(TASK_TYPE.TASK_TYPE_ACHIEVEMENT);
        taskNode = Game.redPointSys.findRedPointNode(EVENT_REDPOINT.TASK_ACHIEVEMENT);
        if (taskNode) {
            taskNode.setRedPointNum(redPointsNum);
        }

        this.checkBoxRedPoint();
    }

    /**
     * 刷新某一类型任务红点
     * @param type 
     */
    private refreshRedPointByType(type: TASK_TYPE, addOrReduce: number) {
        if (type == TASK_TYPE.TASK_TYPE_DAY) {
            GameEvent.emit(EVENT_REDPOINT.TASK_DAILY, addOrReduce);
        } else if (type == TASK_TYPE.TASK_TYPE_ACHIEVEMENT) {
            GameEvent.emit(EVENT_REDPOINT.TASK_ACHIEVEMENT, addOrReduce);
        }
    }

    /**任务信息 */
    private onTaskInfo(taskInfo: GS_TaskInfo) {
        if (!taskInfo || !taskInfo.task) return;
        Debug.log(TASK_TAG, "任务信息", taskInfo);
        this._taskInfo = taskInfo;
        this._taskInfoMap.clear();

        if (this._taskInfo && this._taskInfo.task) {
            this._taskInfo.task.forEach((element) => {
                this._taskInfoMap.set(element.ltasklistid, element);
            });
        }
        this.isTaskInfoInit = true;
        this.initTask();
        this.refreshRedPoint();
    }

    /**任务视图 */
    private onTaskView(taskView: GS_TaskView) {
        Debug.log(TASK_TAG, "任务视图", taskView);
        this._taskView = taskView;
        this._taskViewMap.clear();
        this._goodsId = 0;
        if (this._taskView && this._taskView.data2 && this._taskView.data2.length > 0) {
            

            this._taskView.data2.forEach((element) => {
                this._taskViewMap.set(element.stasklistid, element);

                if (element.bttype == TASK_TYPE.TASK_TYPE_DAY && this._goodsId == 0 && element.nrewardgoodsid[0] != GOODS_ID.DIAMOND) {
                    this._goodsId = element.nrewardgoodsid[0];
                }

            });
        }

        // this._scoreMax = 0;
        // if (this._taskView && taskView.data1 && taskView.data1.length > 0) {
        //     taskVie
        // }

        this.isTaskViewInit = true;
        this.initTask();
        this.refreshRedPoint();
    }

    /**
     * 初始化任务
     */
    private initTask() {
        if (!this.isTaskViewInit) return;
        this._dailyFinishedMap.clear();
        this._dailyUnfinishedMap.clear();
        this._dailyCanReceiveMap.clear();
        this._achievementFinishedMap.clear();
        this._achievementUnfinishedMap.clear();
        this._achievementCanReceiveMap.clear();
        let tempArr = Array.from(this._taskViewMap.values());
        for (let v of tempArr) {
            this.addTask(v);
        }

        //将缓存起来的任务改变统一触发
        for (let i = this._cacheChangedTask.length - 1; i >= 0; i--) {
            this.onTaskChange(this._cacheChangedTask.pop());
        }
        GameEvent.emit(EventEnum.ON_TASK_INIT);
    }

    /**
     * 添加一个任务
     * @param taskViewItem 
     */
    private addTask(taskViewItem: GS_TaskView_TaskViewItem, isNew: boolean = false) {
        let infoItem: GS_TaskInfo_TaskItem = null;
        let taskState: TASK_STATE;
        let finishMap, unfinishMap, canreceiveMap;
        infoItem = this.getTaskListCfg(taskViewItem.stasklistid);
        taskState = this.getTaskState(infoItem, taskViewItem);
        if (taskViewItem.bttype == TASK_TYPE.TASK_TYPE_DAY) {
            finishMap = this._dailyFinishedMap;
            unfinishMap = this._dailyUnfinishedMap;
            canreceiveMap = this._dailyCanReceiveMap;
        } else if (taskViewItem.bttype == TASK_TYPE.TASK_TYPE_ACHIEVEMENT) {
            finishMap = this._achievementFinishedMap;
            unfinishMap = this._achievementUnfinishedMap;
            canreceiveMap = this._achievementCanReceiveMap;
        }

        switch (taskState) {
            case TASK_STATE.FINISHED:
                finishMap.set(taskViewItem.stasklistid, taskViewItem);
                break;
            case TASK_STATE.UNFINISHED:
                unfinishMap.set(taskViewItem.stasklistid, taskViewItem);
                break;
            case TASK_STATE.CANGET:
                canreceiveMap.set(taskViewItem.stasklistid, taskViewItem);
                if (isNew) {
                    this.refreshRedPointByType(taskViewItem.bttype, 1);
                    SystemTipsMgr.instance.showCommentTips(EResPath.TASK_FINISHED_TIPS);
                }
                break;
        }
    }

    /**
     * 新增任务
     * @param data 
     */
    private onTaskAdd(data: GS_TaskAdd) {
        Debug.log(TASK_TAG, "新增任务", data);
        this._taskViewMap.set(data.stasklistid, data);
        this.addTask(data, true);
        GameEvent.emit(EventEnum.TASK_ADD, data);
    }

    /**
     * 任务改变
     * @param data 
     */
    private onTaskChange(data: GS_TaskChange) {
        Debug.log(TASK_TAG, "任务改变", data);
        //任务没有初始化时，暂时缓存起来
        if (!this.isTaskViewInit) {
            this._cacheChangedTask.push(data);
            return;
        }

        let preState = TASK_STATE.NONE, currState = TASK_STATE.NONE, isSameReceive = true;
        let taskViewItem = this._taskViewMap.get(data.ltasklistid), taskInfo = this._taskInfoMap.get(data.ltasklistid);

        preState = this.getTaskState(taskInfo, taskViewItem);
        isSameReceive = !taskInfo || data.ureceivefinish == taskInfo.ureceivefinish;

        if (!taskInfo) {
            taskInfo = new GS_TaskInfo_TaskItem();
            taskInfo.ltasklistid = data.ltasklistid;
            this._taskInfoMap.set(data.ltasklistid, taskInfo);
        }

        taskInfo.unowfinish = data.unowfinish;
        taskInfo.ureceivefinish = data.ureceivefinish;

        currState = this.getTaskState(taskInfo, taskViewItem);

        if (!isSameReceive) {//领取奖励
            // let taskItem: GS_TaskView_TaskViewItem = this._sortedTaskView[data.ltasklistid];
            let awardList: GS_RewardTips_RewardGoods[] = [];
            let socre:number = 0;
            for (let i = 0; i < taskViewItem.nrewardgoodsid.length; i++) {
                let id = taskViewItem.nrewardgoodsid[i];
                if (id > 0) {

                    let goodsInfo = Game.goodsMgr.getGoodsInfo(id);
                    if (goodsInfo && goodsInfo.lgoodstype == GOODS_TYPE.GOODSTYPE_TASK_SCORE) {
                        socre += taskViewItem.nrewardgoodsnum[i];
                    } else {
                        let awardItem: GS_RewardTips_RewardGoods = new GS_RewardTips_RewardGoods();
                        awardItem.sgoodsid = taskViewItem.nrewardgoodsid[i];
                        awardItem.sgoodsnum = taskViewItem.nrewardgoodsnum[i];
                        awardList.push(awardItem);
                    }

                }
            }
            if (awardList.length > 0) {
                Game.tipsMgr.showNewGoodsView(awardList);
            }
        }

        let finishMap, unfinishMap, canreceiveMap;
        if (taskViewItem.bttype == TASK_TYPE.TASK_TYPE_DAY) {
            finishMap = this._dailyFinishedMap;
            unfinishMap = this._dailyUnfinishedMap;
            canreceiveMap = this._dailyCanReceiveMap;
        } else if (taskViewItem.bttype == TASK_TYPE.TASK_TYPE_ACHIEVEMENT) {
            finishMap = this._achievementFinishedMap;
            unfinishMap = this._achievementUnfinishedMap;
            canreceiveMap = this._achievementCanReceiveMap;
        }

        if (preState == TASK_STATE.UNFINISHED && currState == TASK_STATE.CANGET) {
            unfinishMap.delete(taskViewItem.stasklistid);
            canreceiveMap.set(taskViewItem.stasklistid, taskViewItem);
            SystemTipsMgr.instance.showCommentTips(EResPath.TASK_FINISHED_TIPS);
            this.refreshRedPointByType(taskViewItem.bttype, 1);
        } else if (preState == TASK_STATE.CANGET && currState == TASK_STATE.FINISHED) {
            canreceiveMap.delete(taskViewItem.stasklistid);
            finishMap.set(taskViewItem.stasklistid, taskViewItem);
            this.refreshRedPointByType(taskViewItem.bttype, -1);
        }

        GameEvent.emit(EventEnum.TASK_CHANGE, data);
    }

    private onScoreRewardFlag(data:GS_TaskScoreRewardFlag) {
        if (this._taskView) {
            this._taskView.nscorerewardflag = data.nscorerewardflag;
            this.checkBoxRedPoint();
            GameEvent.emit(EventEnum.TASK_SCORE_REWARD_CHANGE);
        }
    }

    private onTaskScore(data:GS_TaskScore) {
        if (this._taskView) {
            this._taskView.nscore = data.nscore;
            this.checkBoxRedPoint();
            GameEvent.emit(EventEnum.TASK_SCORE_REWARD_CHANGE);
        }
    }

    /**
     * 完成任务
     * @param taskListId
     */
    public finish(taskListId) {
        let data: GS_TaskFinish = new GS_TaskFinish();
        data.ltasklistid = taskListId;
        this.send(GS_PLAZA_TASK_MSG.PLAZA_TASK_FINISH, data);
    }

    /**
     * 获取某一类型所有任务
     * @param taskType 
     * @returns 
     */
    public getAllUnfinishedTask(taskType: TASK_TYPE): Array<any> {
        let unfinished;
        let canGet;
        let finished;
        switch (taskType) {
            case TASK_TYPE.TASK_TYPE_DAY://日常任务
                unfinished = Array.from(this._dailyUnfinishedMap.values());
                canGet = Array.from(this._dailyCanReceiveMap.values());
                finished = Array.from(this._dailyFinishedMap.values());
                break;
            case TASK_TYPE.TASK_TYPE_ACHIEVEMENT://成就任务
                unfinished = Array.from(this._achievementUnfinishedMap.values());
                canGet = Array.from(this._achievementCanReceiveMap.values());
                finished = Array.from(this._achievementFinishedMap.values());
                break;
        }
        return canGet.concat(unfinished, finished);
    }

    /**
     * 获取某一类型可领取任务的数量
     */
    public getCangetTaskNum(taskType: TASK_TYPE): number {
        let num = 0;
        switch (taskType) {
            case TASK_TYPE.TASK_TYPE_DAY:
                num = this._dailyCanReceiveMap.size;
                break;
            case TASK_TYPE.TASK_TYPE_ACHIEVEMENT:
                num = this._achievementCanReceiveMap.size;
                break;
        }
        return num;
    }

    /**
     * 获取任务链配置
     * @param taskListId 
     */
    public getTaskListCfg(taskListId: number): GS_TaskInfo_TaskItem {
        return this._taskInfoMap.get(taskListId);
    }

    /**
     * 获取任务视图
     * @param taskListId 
     * @returns 
     */
    public getTaskView(taskListId: number): GS_TaskView_TaskViewItem {
        return this._taskViewMap.get(taskListId);
    }

    getTaskRewardGoodsId():number {
        return this._goodsId;
    }

    getTaskScoreRewards():GS_TaskView_ScoreRewardItem[] {
        return this._taskView ? this._taskView.data1 : [];
    }

    // getTaskScoreMax():number {

    // }

    get taskView():GS_TaskView {
        return this._taskView;
    }

    /**
     * 获取任务功能开启的关卡数
     */
    public getOpenWarId(): number {
        return this._taskView && this._taskView.nopenwarid;
    }

    /**
     * 获取任务状态
     * @param taskInfo 
     * @param taskView 
     */
    public getTaskState(taskInfo: GS_TaskInfo_TaskItem, taskView: GS_TaskView_TaskViewItem): TASK_STATE {
        let state = TASK_STATE.NONE;
        if (!taskInfo || taskInfo.ureceivefinish != taskView.ufinishtimes && taskInfo.unowfinish < taskView.ufinishtimes) {
            state = TASK_STATE.UNFINISHED;
        } else if (taskInfo.ureceivefinish == taskView.ufinishtimes) {
            state = TASK_STATE.FINISHED;
        } else {
            state = TASK_STATE.CANGET;
        }
        return state;
    }

    getAchievementTaskFinished(taskid: number): boolean {
        let taskCfg = this._taskInfoMap.get(taskid);
        let taskView = this._taskViewMap.get(taskid);
        if (!taskView) return false;
        return this.getTaskState(taskCfg, taskView) == TASK_STATE.FINISHED;
    }

    reqGetScoreReward(index:number) {
        let data:GS_TaskGetScoreReward = new GS_TaskGetScoreReward();
        data.btindex = index;
        this.send(GS_PLAZA_TASK_MSG.PLAZA_TASK_GETSCOREREWARD , data);
    }


    private checkBoxRedPoint() {
        if (!this._taskView || !this._taskView.data1) return;
        let len = 5;
        for (let i = 0 ; i < len ; i++) {
            let item = this._taskView.data1[i];
            let flag = false;
            if (item) {
                flag = !Utils.checkBitFlag(this._taskView.nscorerewardflag , i) && this._taskView.nscore >= item.nneedscore;
            }

            Game.redPointSys.setRedPointNumSub(EVENT_REDPOINT.TASK_DAILY_BOX , i.toString() , flag ? 1 : 0);
        }
        
    }
}

