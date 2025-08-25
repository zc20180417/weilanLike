import Game from "../../Game";
import { EResPath } from "../../common/EResPath";
import GlobalVal from "../../GlobalVal";
import { EventEnum } from "../../common/EventEnum";
import { CpGuide } from "./CpGuide";
import SysMgr from "../../common/SysMgr";
import { StringUtils } from "../../utils/StringUtils";
import { UiManager } from "../../utils/UiMgr";
import { BuryingPointMgr, EBuryingPoint } from "../../buryingPoint/BuryingPointMgr";
import { CpGuideTips } from "./CpGuideTips";
import { Handler } from "../../utils/Handler";
import { GameEvent } from "../../utils/GameEvent";


export enum ETriggerStart {
    /**游戏开始时触发 */
    GAME_START = 1,
    /**完成某个指引时触发 */
    COMPLETE_GUIDE = 2,
    /**开始某波后xx毫秒后触发 */
    ON_BO_CHANGE_TIME = 3,
    /**完成某波 */
    COMPLETE_BO = 4,
    //倒计时结束触发
    COUNT_END = 5,
    /**完成某波后按时间间隔检测*/
    COMPLETE_BO_AND_TIME = 6,

    START_GUIDE = 7,

    KILL_SCENE_ITEM = 8,

    FAIL_GUIDE = 9,
    //关闭某个面板
    HIDE_VIEW = 10,
}

export enum ETriggerEnd {
    /**建塔 */
    CREATE_TOWER = 1,
    /**升塔 */
    UPGRADE_TOWER = 2,
    /**计时 */
    TIME = 3,
    /**杀怪 */
    KILL_OBJ = 4,
    /**完成某波 */
    COMPLETE_BO = 5,
    /**关闭某个面板 */
    HIDE_VIEW = 6,
    /**释放全屏技能 */
    RELEASE_MAGIC_SKILL = 7,
    /**选中某个目标 */
    SELECT_TARGET = 8,
    /**点击关卡内UI , 1 暂停 2 取消暂停 3 加速 4 恢复普通速度 5 */
    TOUCH_UI = 9,
    /**卖猫 */
    SELL_TOWER = 10,
    /**激活精英怪或boss */
    SELECT_GIANT = 11,
    /**点击出怪口 */
    TOUCH_EMPTY = 12,
    /**招财猫冒泡 */
    CAT_BUBBLE,
    /**表情 */
    CAT_FACE,
}


export enum ETriggerTipsStart {
    BO = 1,
    GAME_START = 2,
    TASK_COMPLETE = 3,
    TIPS_END = 4,
    KILL_SCENE_ITEM = 5,

}

export enum ETriggerTipsEnd {
    BO = 1,
    SHOW_TIME = 2,
    TASK_COMPLETE = 3,
    CREATE_TOWER = 4,
    USE_SKILL = 5,
}

export class CpGuideCtrl {

    private _guideCfg: any;
    private _guideDic: any = {};
    private _curGuideList: CpGuide[] = null;
    private _endTriggerDic: any = {};
    private _isShowGuide: boolean = false;

    private _guideUiCfg: any;
    private _guideTipsCfg:any;
    private _guideTipsDic: any = {};
    private _curGuideTipsList: CpGuideTips[] = [];

    private _closeMissionTips:boolean = false;
    private _missionTipsList:any[] = [];
    private _missionTipsListLen:number = 0;
    private _showMissionTipsEnum:EventEnum = null;

    /**初始化配置 */
    initCfg() {
        this._guideCfg = Game.gameConfigMgr.getCfg(EResPath.GUIDE_CFG);
        this._guideUiCfg = Game.gameConfigMgr.getCfg(EResPath.GUIDE_UI_CFG);
        this._guideTipsCfg = Game.gameConfigMgr.getCfg(EResPath.GUIDE_TIPS_CFG);
        if (this._guideCfg) {
            Object.values(this._guideCfg).forEach(element => {
                if (!this._guideDic[element['missionID']]) {
                    this._guideDic[element['missionID']] = [];
                }
                this._guideDic[element['missionID']].push(element);
            });
        }

        if (this._guideTipsCfg) {
            Object.values(this._guideTipsCfg).forEach(element => {
                if (!this._guideTipsDic[element['missionID']]) {
                    this._guideTipsDic[element['missionID']] = [];
                }
                this._guideTipsDic[element['missionID']].push(element);
            });
        }
        GameEvent.on(EventEnum.EXIT_GAME_SCENE, this.onExitGameScene, this);
        GameEvent.on(EventEnum.ON_SKIP,this.skip,this);
        GameEvent.on(EventEnum.CLOSE_GUIDE_MISSION_TIPS,this.onCloseMissionTips,this);
    }


    /**初始化场景指引 */
    initGuide(): boolean {
        
        let flag: boolean = false;
        let cfgList = Game.cpMgr.isHelpEvent() ? this._guideDic[10000 + GlobalVal.curMapCfg.nwarid]: this._guideDic[GlobalVal.curMapCfg.nwarid];
        let commonList = this._guideDic['0'];
        if (!this._curGuideList) {
            this._curGuideList = [];
        }
        if (cfgList) {
            flag = this.insertGuide(cfgList);
        }

        if (commonList) {
            if (this.insertGuide(commonList)) {
                flag = true;
            }
        }

        const len = this._curGuideList.length;
        if (len > 0) {
            GameEvent.emit(EventEnum.ON_INIT_GUIDE, len);
        }

        let cfgTipsList = this._guideTipsDic[GlobalVal.curMapCfg.nwarid];
        if (cfgTipsList) {
            
            let len = cfgTipsList.length;
            for (let i = 0; i < len; i++) {
                let cfg = cfgTipsList[i];
                let guideTips: CpGuideTips = new CpGuideTips(cfg, this);
                this._curGuideTipsList.push(guideTips);
            }
        }

        this._missionTipsList = [];
        if (!this._closeMissionTips) {
            this._missionTipsList = Game.cpCfgCtrl.getMissionTipsList();
            this._missionTipsIndex = 0;
            if (this._missionTipsList && this._missionTipsList.length > 0) {
                this._missionTipsListLen = this._missionTipsList.length;
                this._showMissionTipsEnum = GlobalVal.curMapCfg.nwarid <= 10 ? EventEnum.SHOW_MISSION_TIPS : EventEnum.CAT_SHOW_BUBBLE2;
                this.addGuideMissionTipsTimer();
            }
        } 

        return flag;
    }

    private insertGuide(list:any[]):boolean {
        let len = list.length;
        let flag = false;
        for (let i = 0; i < len; i++) {
            let cfg = list[i];
            let guide: CpGuide = new CpGuide(cfg, this);
            if (cfg.triggerType == ETriggerStart.GAME_START) {
                flag = true;
            }
            this._curGuideList.push(guide);
        }
        return flag;
    }

    /**添加一个由指引触发的指引 */
    addEndTriggerGuide(guide: CpGuide, prevGuideID: number) {
        this._endTriggerDic[prevGuideID] = guide;
    }

    /**一个指引开始 */
    onGuideStart(guide: CpGuide) {
        this._isShowGuide = true;
        if (guide.cfg.noPause == 0) {
            SysMgr.instance.pauseGame('cpGuide', true);
        } else {
            SysMgr.instance.pauseGame('cpGuide', false);
        }

        if (!StringUtils.isNilOrEmpty(guide.cfg.viewPath)) {
            UiManager.showDialog(guide.cfg.viewPath, guide.getViewData());
            GameEvent.emit(EventEnum.HIDE_GUIDE_VIEW);
        } else {
            GameEvent.emit(EventEnum.SHOW_GUIDE_VIEW, guide.cfg , guide);
        }
        BuryingPointMgr.post(EBuryingPoint.SHOW_WAR_GUIDE , JSON.stringify({ warid:GlobalVal.curMapCfg.nwarid ,guideid:guide.cfg.id}));
        if (guide && guide.cfg && guide.cfg.bpId > 0) {
            BuryingPointMgr.postFristPoint(guide.cfg.bpId , guide.cfg.bpType , guide.cfg.bpName);
        }
        GameEvent.emit(EventEnum.CP_GUIDE_START, guide.cfg);
    }

    /**一个指引结束 */
    onGuideEnd(guide: CpGuide) {
        cc.log('guide.cfg.id end' , guide.cfg.id);
        this._isShowGuide = false;
        let triggerGuide: CpGuide = this._endTriggerDic[guide.cfg.id];
        if (guide.cfg.noOnce != 1) {
            let index = this._curGuideList.indexOf(guide);
            if (index != -1) {
                this._curGuideList.splice(index, 1);
            }
        }

        if (guide.cfg.endCreateMonster == 1) {
            GameEvent.emit(EventEnum.CP_GUIDE_CREATE_MONSTER);
        }

        if (triggerGuide) {
            triggerGuide.start();
            cc.log('triggerGuide.cfg.id end' , triggerGuide.cfg.id);
        } else {
            this.exitGuide(guide);
            if (guide.cfg.showCountDown == 1) {
                GameEvent.emit(EventEnum.SHOW_GAME_START_VIEW);
            }
        }

        if (guide.cfg.endTriggerEvt > 0) {
            GameEvent.emit(guide.cfg.endTriggerEvt);
        }
    }

    get isShowGuide(): boolean {
        return this._isShowGuide;
    }

    private exitGuide(guide: CpGuide) {
        SysMgr.instance.pauseGame('cpGuide', false);

        if (StringUtils.isNilOrEmpty(guide.cfg.viewPath)) {
            GameEvent.emit(EventEnum.HIDE_GUIDE_VIEW);
        }

        GameEvent.emit(EventEnum.CP_GUIDE_END);
    }

    private onExitGameScene() {
        this.onHideGuideTips();
        if (!this._curGuideList) return;
        let len = this._curGuideList.length;
        let guide: CpGuide;
        for (let i = 0; i < len; i++) {
            guide = this._curGuideList[i];
            guide.cancel(true);
            guide = null;
        }

        len = this._curGuideTipsList.length;
        let guideTips: CpGuideTips;
        for (let i = 0 ; i < len ; i++) {
            guideTips = this._curGuideTipsList[i];
            guideTips.cancel();
            guideTips = null;
        }

        this._curGuideList.length = 0;
        this._curGuideTipsList.length = 0;
        this._endTriggerDic = {};
        this._isShowGuide = false;
    }

    public getGuideUiCfg(guideId: number) {
        let cfg = null;
        if (this._guideUiCfg) cfg = this._guideUiCfg[guideId];
        return cfg;
    }

    public skip(){
        let len = this._curGuideList.length;
        let guide: CpGuide;
        let showCountDown:boolean = false;
        for (let i = 0; i < len; i++) {
            guide = this._curGuideList[i];
            if (guide.cfg.showCountDown == 1) {
                showCountDown = true;
            }
            if (guide.cfg.canSkip == 1) {
                guide.cancel();
            }
        }

        this._isShowGuide = false;
        SysMgr.instance.pauseGame('cpGuide', false);
        if (showCountDown) {
            GameEvent.emit(EventEnum.SHOW_GAME_START_VIEW);
        }
    }

    private _missionTipsIndex:number = 0;
    private addGuideMissionTipsTimer() {
        SysMgr.instance.doLoop(Handler.create(this.onShowGuideTips , this) , 10000 , 0 ,true);
    }

    private onShowGuideTips() {
        let info = this._missionTipsList[this._missionTipsIndex % this._missionTipsListLen];
        if (info && !StringUtils.isNilOrEmpty(info.info)) {
            // this.cpGuideTips2.showInfo(info.info);
            GameEvent.emit(this._showMissionTipsEnum , info.info);
        }
        this._missionTipsIndex ++;
    }

    private onHideGuideTips() {
        SysMgr.instance.clearTimer(Handler.create(this.onShowGuideTips , this) , true);
        GameEvent.emit(EventEnum.CAT_HIDE_BUBBLE2);
    }

    private onCloseMissionTips() {
        this.onHideGuideTips();
        this._closeMissionTips = true;
    }
}