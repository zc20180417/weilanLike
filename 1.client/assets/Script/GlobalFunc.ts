// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EResPath } from "./common/EResPath";
import Game from "./Game";

import { EventEnum } from "./common/EventEnum";
import { UiManager } from "./utils/UiMgr";
import { MathUtils } from "./utils/MathUtils";
import { EMODULE, GLOBAL_FUNC, GLOBAL_FUNC_NAME } from "./common/AllEnum";
import { SystemGuideTriggerType } from "./ui/guide/SystemGuideCtrl";
import { ACTIVE_HALL_ACTIVE_NAME, ACTIVE_HALL_TAP_INDEX } from "./ui/activity/ActiveHallView";
import { ACTIVE_TYPE, ActorProp } from "./net/socket/handler/MessageEnum";
import GlobalVal from "./GlobalVal";
import SystemTipsMgr from "./utils/SystemTipsMgr";
import { GameDataCtrl } from "./logic/gameData/GameDataCtrl";
import { GameEvent } from "./utils/GameEvent";


const { ccclass, property } = cc._decorator;

export default class GlobalFunc extends GameDataCtrl {
    static MIN_ID: number = 0;
    // private _showHideData:any=null//入口显示/隐藏信息
    private _globalFuncCfg: any = null;//全局开关配置信息

    private _warId: number = null;
    private _openState: any = {};
    private _curOpenSystemID: number = 0;
    private _curOpenCatHouseID: number = 0;
    private _openGuideDic: any = {};
    private funcNodesMap: object = {};
    private _cacheData: any = {};

    constructor() {
        super();
        this.module = EMODULE.GLOBAL_FUNC;
        // this._onWarIdChange = this.onWarIdChange, this);

        GameEvent.once(EventEnum.LAST_WAR_ID_CHANGE, this.onWarIdChange, this);
        GameEvent.on(EventEnum.LAST_WAR_ID_CHANGE2, this.onWarIdChange2, this);
        GameEvent.on(EventEnum.EXIT_GAME, this.exitGame, this);
        GameEvent.on(EventEnum.ENTER_MAP_SCENE, this.onEnterMapScene, this);
        GameEvent.on(EventEnum.ON_STRENTH_INIT, this.onStrenthInit, this);
        GameEvent.on(EventEnum.PVP_CONFIG_INIT, this.onPvpInit, this);
        GameEvent.on(EventEnum.COOPERATE_CONFIG_INIT, this.onCooperateInit, this);

        GameEvent.on(EventEnum.ON_CATHOUSE_INFO, this.onFloorConfig, this);
        GameEvent.on(EventEnum.CHALLENGE_INIT, this.onChallengeInit, this);


        this._openGuideDic[GLOBAL_FUNC.DAILY_CP] = SystemGuideTriggerType.SIGN_IN_OPEN;
        this._openGuideDic[GLOBAL_FUNC.TUJIAN] = SystemGuideTriggerType.TU_JIAN_OPEN;
        this._openGuideDic[GLOBAL_FUNC.TASK] = SystemGuideTriggerType.TASK_OPEN;
        this._openGuideDic[GLOBAL_FUNC.SCIENCE] = SystemGuideTriggerType.SCIENCE_OPEN;
        this._openGuideDic[GLOBAL_FUNC.PVP] = SystemGuideTriggerType.PVP_OPEN;
        this._openGuideDic[GLOBAL_FUNC.CAT_HOUSE] = SystemGuideTriggerType.CAT_HOUSE_OPEN;
        this._openGuideDic[GLOBAL_FUNC.MALL] = SystemGuideTriggerType.SHOP_ZHI_ZUN_BOX;
        this._openGuideDic[GLOBAL_FUNC.HARD_CP] = SystemGuideTriggerType.HARD_GUIDE;
        this._openGuideDic[GLOBAL_FUNC.COOPERATE] = SystemGuideTriggerType.COOPERATE;

    }


    get curOpenSystemID():number {
        return this._curOpenSystemID;
    }

    set curOpenSystemID(value:number) {
        this._curOpenSystemID = value;
    }

    public init() {
        this._warId = Game.sceneNetMgr.getCurWarID();
    }

    tryStartSystemGuide(funcId:number) {
        if (this.checkSystemGuide(funcId)) {
            GameEvent.emit(EventEnum.SYSTEM_GUIDE_TRIGGER, this._openGuideDic[funcId]);
            this.clearSystemGuide(funcId);
        }
    }

    private checkSystemGuide(funcId:number):boolean {
        return this._cacheData[funcId] && this._cacheData[funcId] > 0;
    }

    private clearSystemGuide(funcId:number) {
        this._cacheData[funcId] = 0;
        this.write();
    }

    /**
     * 科技系统初始化
     * @param openWarid 科技开放等级
     */
    private onStrenthInit(openWarid: number) {
        this._globalFuncCfg[GLOBAL_FUNC.SCIENCE].funcOpenCondition = openWarid;
        if (this.isFuncOpened(GLOBAL_FUNC.SCIENCE)) {
            this._openState[GLOBAL_FUNC.SCIENCE] = true;
        }
    }

    private onPvpInit(openWarid: number) {
        this._globalFuncCfg[GLOBAL_FUNC.PVP].funcOpenCondition = openWarid;
        if (this.isFuncOpened(GLOBAL_FUNC.PVP)) {
            this._openState[GLOBAL_FUNC.PVP] = true;
        }
        GameEvent.emit(EventEnum.REFRESH_SYSTEM_OPEN_WAR);
    }

    private onCooperateInit(openWarid: number) {
        this._globalFuncCfg[GLOBAL_FUNC.COOPERATE].funcOpenCondition = openWarid;
        if (this.isFuncOpened(GLOBAL_FUNC.COOPERATE)) {
            this._openState[GLOBAL_FUNC.COOPERATE] = true;
        }
        GameEvent.emit(EventEnum.REFRESH_SYSTEM_OPEN_WAR);
    }

    private onFloorConfig() {
        // let config = Game.catHouseMgr.getFloorConfig();
        // if (config) {
        //     this._globalFuncCfg[GLOBAL_FUNC.CAT_HOUSE].funcOpenCondition = config.nopenwarid;
        //     if (this.isFuncOpened(GLOBAL_FUNC.CAT_HOUSE)) {
        //         this._openState[GLOBAL_FUNC.CAT_HOUSE] = true;
        //     }
        // }
    }

    private onChallengeInit(warid:number) {
        if (warid < 20) return;
        if (this._globalFuncCfg[GLOBAL_FUNC.CHALLENGE]) {
            this._globalFuncCfg[GLOBAL_FUNC.CHALLENGE].funcOpenCondition = warid;
            if (this.isFuncOpened(GLOBAL_FUNC.CHALLENGE)) {
                this._openState[GLOBAL_FUNC.CHALLENGE] = true;
            }
        }
    }

    private onWarIdChange(warId: number) {
        this._warId = warId;
        this.checkAllFunNode();
        Object.values(this._globalFuncCfg).forEach(element => {
            if (this.isFuncOpened(element['id'])) {
                this._openState[element['id']] = true;
            }
        });
    }

    private checkAllFunNode() {
        for (let k in this.funcNodesMap) {
            this.checkFuncNode(this.funcNodesMap[k].node, parseInt(k), this.funcNodesMap[k].parent);
        }
    }

    public checkFuncNode(funcNode: cc.Node, funcId: number, parent?: cc.Node) {
        if (this._warId !== null && this._warId !== undefined) {
            funcNode && (funcNode.active = this.canShowFunc(funcId));
            if (parent) {
                parent.active = parent.active && funcNode.active;
            }
            //显示隐藏lock和icon
            let isOpen = this.isFuncOpened(funcId);
            let node = funcNode.getChildByName("icon");
            node && (node.active = isOpen);
            node = funcNode.getChildByName("lock");
            node && (node.active = !isOpen);
        } else {//章节数据未下发，暂存功能节点，下发时再检测
            this.funcNodesMap[funcId] = { node: funcNode, parent: parent };
            funcNode && (funcNode.active = false);
            parent && (parent.active = false);
        }
    }

    read() {
        this._globalFuncCfg = Game.gameConfigMgr.getCfg(EResPath.GLOBAL_FUNC);

        let warTaskItem = this._globalFuncCfg[GLOBAL_FUNC.WAR_TASK];
        if (warTaskItem) {
            GlobalFunc.MIN_ID = warTaskItem.funcOpenCondition;
        }

        this._cacheData = this.readData() || {};
    }

    write() {
        this.writeData(this._cacheData);
    }

    /**
     * 能否显示功能
     * @param funcId 
     */
    public canShowFunc(funcId: number): boolean {
        //审核版本屏蔽兑换
        if (Game.actorMgr.getProp(ActorProp.ACTOR_PROP_ISAUDIT)) {
            if (funcId === GLOBAL_FUNC.DUIHUAN) {
                return false;
            }
        }
        return this._warId >= this._globalFuncCfg[funcId].uiShowCondition;
    }

    /**
     * 功能是否开启
     * @param funcId 
     */
    public isFuncOpened(funcId: number): boolean {
        if (!this._globalFuncCfg[funcId]) {
            cc.log('not found global cfg , funcId:' , funcId);
            return;
        }
        if (this._warId === null || this._warId === undefined) return false;
        let openWarid = this._globalFuncCfg[funcId].funcOpenCondition;
        let opened = false;
        switch (funcId) {
            default:
                opened = openWarid != -1 && this._warId >= openWarid;
                break;
        }

        return opened;
    }

    public isFuncOpenAndCanShow(funcId: number) {
        return this.isFuncOpened(funcId) && this.canShowFunc(funcId);
    }

    public getOpenCfg(funcId: number) {
        return this._globalFuncCfg[funcId];
    }

    checkOpen(funcId: number, warid: number): boolean {
        let cfg = this.getOpenCfg(funcId);
        return cfg ? warid >= cfg.funcOpenCondition : true;
    }

    /**
     * 获取功能开启和显示的关卡id
     */
    public getOpenAndShowWarId(funcId: number): number {
        let cfg = this._globalFuncCfg[funcId];
        return cfg ? Math.max(cfg.funcOpenCondition, cfg.uiShowCondition) : 0;
    }

    public clearFuncNodes() {
        this.funcNodesMap = {};
    }

    public getTips(funcId: number) {
        return this._globalFuncCfg[funcId].tips;
    }

    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////

    private onWarIdChange2(warId: number) {
        this._warId = warId;
        this.checkAllFunNode();
        let list: any[] = Object.values(this._globalFuncCfg);
        let len = list.length;
        let element: any;
        for (let i = 0; i < len; i++) {
            element = list[i];
            if (!this._openState[element['id']] && this.isFuncOpened(element['id'])) {
                this._openState[element['id']] = true;

                if (element['showOpenView'] == 1 && element['uiShowCondition'] <= this._warId) {
                    this._curOpenSystemID = element['id'];
                    break;
                }
            }
        }

        if (this._curOpenSystemID > 0 && this._openGuideDic[this._curOpenSystemID]) {
            if (this._curOpenSystemID == GLOBAL_FUNC.COOPERATE) {
                GameEvent.emit(EventEnum.SYSTEM_GUIDE_TRIGGER, this._openGuideDic[this._curOpenSystemID]);
            } else {
                this._cacheData[this._curOpenSystemID] = this._openGuideDic[this._curOpenSystemID];
                this.write();
            }
        }

        /*
        // this._curOpenSystemID = GLOBAL_FUNC.COOPERATE;
        if (this._curOpenSystemID > 0 && this._openGuideDic[this._curOpenSystemID]) {
            this._cacheData[this._curOpenSystemID] = this._openGuideDic[this._curOpenSystemID];
            this.write();
            // GameEvent.emit(EventEnum.SYSTEM_GUIDE_TRIGGER, this._openGuideDic[this._curOpenSystemID]);
        } else {
            //check cathouse layer open
            // this._curOpenCatHouseID = GameEvent.dispathReturnEvent('check_open_cathouse_layer' , warId);
            // if (this._curOpenCatHouseID > 0) {
            //     GameEvent.emit(EventEnum.SYSTEM_GUIDE_TRIGGER, SystemGuideTriggerType.CAT_HOUSE_LAYER_OPEN);
            // }
        }
        */
    }

    private exitGame() {
        this._openState = {};
        this._curOpenSystemID = 0;
        this._curOpenCatHouseID = 0;
        this._warId = null;
        GameEvent.once(EventEnum.LAST_WAR_ID_CHANGE, this.onWarIdChange , this);
    }

    private onEnterMapScene() {
        GameEvent.off(EventEnum.LAST_WAR_ID_CHANGE, this.onWarIdChange , this);
        GameEvent.emit(EventEnum.CHECK_SYSTEM_OPEN_END, this._curOpenSystemID > 0);
        if (this._curOpenSystemID > 0 && this._curOpenSystemID != GLOBAL_FUNC.COOPERATE ) {
            UiManager.showDialog(EResPath.SYSTEM_OPEN_VIEW, this._globalFuncCfg[this._curOpenSystemID]);
        } else if (this._curOpenCatHouseID > 0) {
            UiManager.showDialog(EResPath.SYSTEM_OPEN_VIEW, {id:GLOBAL_FUNC.CAT_HOUSE , layer:this._curOpenCatHouseID});
        }

        this._curOpenCatHouseID = 0;
        this._curOpenSystemID = 0;
    }

    randomOpenCfg(): any {
        let list: any[] = Object.values(this._globalFuncCfg);
        return MathUtils.randomGetItemByList(list);
    }

    public checkGlobalFuncState(funcId: number, withTips: boolean, activeIndex: number = -1) {
        let result = false;
        if (GLOBAL_FUNC.ACTIVE_HALL === funcId) {
            if (this.isFuncOpenAndCanShow(funcId)) {
                if (activeIndex == -1 || !this.isActiveHallActiveFinished(activeIndex)) {
                    result = true;
                } else {
                    withTips && SystemTipsMgr.instance.notice(ACTIVE_HALL_ACTIVE_NAME[activeIndex] + "活动尚未开启");
                }
            } else {
                withTips && SystemTipsMgr.instance.notice("通关" + this.getOpenAndShowWarId(funcId) + "关后开启" + GLOBAL_FUNC_NAME[funcId]);
            }
        } else if (GLOBAL_FUNC.ACTIVITE === funcId ||
            GLOBAL_FUNC.FIRST_RECHARGE === funcId ||
            GLOBAL_FUNC.YUEKA === funcId ||
            GLOBAL_FUNC.BATTLE_PASS === funcId ||
            GLOBAL_FUNC.VIP === funcId) {
            if (!this.isGlobalActiveFinished(funcId) && this.isFuncOpenAndCanShow(funcId)) {
                result = true;
            } else if (GLOBAL_FUNC.ACTIVITE === funcId) {
                withTips && SystemTipsMgr.instance.notice("钢铁侠活动尚未开启");
            } else {
                withTips && SystemTipsMgr.instance.notice("通关" + this.getOpenAndShowWarId(funcId) + "关后开启" + GLOBAL_FUNC_NAME[funcId]);
            }
        } else {
            if (this.isFuncOpenAndCanShow(funcId)) {
                result = true;
            } else {
                let funcCfg = this.getOpenCfg(funcId);
                if (funcCfg && funcCfg.funcOpenCondition == -1) {
                    withTips && SystemTipsMgr.instance.notice(GLOBAL_FUNC_NAME[funcId] + "正在开发中，敬请期待");
                } else {
                    withTips && SystemTipsMgr.instance.notice("通关" + this.getOpenAndShowWarId(funcId) + "关后开启" + GLOBAL_FUNC_NAME[funcId]);
                }
            }
        }
        return result;
    }

    private isGlobalActiveFinished(funcId: number): boolean {
        let finished = true;
        switch (funcId) {
            case GLOBAL_FUNC.ACTIVITE:
                finished = Game.sysActivityMgr.isActivityFinished(ACTIVE_TYPE.GANGTIEXIA);
                break;
            case GLOBAL_FUNC.FIRST_RECHARGE:
                finished = Game.actorMgr.isFirstRechargeFinished();
                break;
            case GLOBAL_FUNC.BATTLE_PASS:
                finished = Game.battlePassMgr.isAllBattlePassFinished();
                break;
            default:
                finished = false;
        }
        return !GlobalVal.openRecharge || finished;
    }

    private isActiveHallActiveFinished(activeIndex): boolean {
        let finished = true;
        switch (activeIndex) {
            case ACTIVE_HALL_TAP_INDEX.SIGN:
                finished = !this.isFuncOpenAndCanShow(GLOBAL_FUNC.SIGN);
                break;
            case ACTIVE_HALL_TAP_INDEX.JI_JIN:
                finished = !this.isFuncOpenAndCanShow(GLOBAL_FUNC.JIJIN);
                break;
            case ACTIVE_HALL_TAP_INDEX.DAILY_ACTIVE:
                finished = (Game.sysActivityMgr.isActivityFinished(ACTIVE_TYPE.DAILY_ZHADANREN) &&
                    Game.sysActivityMgr.isActivityFinished(ACTIVE_TYPE.DAILY_LEISHEN) &&
                    Game.sysActivityMgr.isActivityFinished(ACTIVE_TYPE.DAILY_GANGTIEXIA));
                break;
            case ACTIVE_HALL_TAP_INDEX.DAILY_EQUIP:
                finished = Game.sysActivityMgr.isActivityFinished(ACTIVE_TYPE.DAILY_EQUIP);
                break;
            case ACTIVE_HALL_TAP_INDEX.WEEK_TEHUI:
                finished = Game.sysActivityMgr.isActivityFinished(ACTIVE_TYPE.WEEK_TEHUI);
                break;
            case ACTIVE_HALL_TAP_INDEX.WEEK_RECHARGE:
                finished = Game.sysActivityMgr.isActivityFinished(ACTIVE_TYPE.WEEK_RECHARGE);
                break;
            case ACTIVE_HALL_TAP_INDEX.CONTINUE_RECHARGE:
                finished = Game.sysActivityMgr.isActivityFinished(ACTIVE_TYPE.CONTINUE_RECHARGE);
                break;
        }

        return !GlobalVal.openRecharge || finished;
    }
}
