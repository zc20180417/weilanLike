import { ETriggerStart, ETriggerEnd, CpGuideCtrl } from "./CpGuideCtrl";
import { EventEnum } from "../../common/EventEnum";
import SysMgr from "../../common/SysMgr";
import { Handler } from "../../utils/Handler";
import GlobalVal from "../../GlobalVal";
import Game from "../../Game";
import { Tower } from "../../logic/sceneObjs/Tower";
import { GS_TroopsInfo_TroopsInfoItem, GS_TroopsInfo_Level } from "../../net/proto/DMSG_Plaza_Sub_Troops";
import { StringUtils } from "../../utils/StringUtils";
import { Monster } from "../../logic/sceneObjs/Monster";
import { CP_SYSTEM_TYPE } from "../../common/AllEnum";
import { SoType } from "../../logic/sceneObjs/SoType";
import { LocalStorageMgr } from "../../utils/LocalStorageMgr";
import { GameEvent, Reply } from "../../utils/GameEvent";

export class CpGuide {



    private _cfg: any;
    private _ctrl: CpGuideCtrl;
    private _viewData: any;//面板参数
    private _onEndTimer:Handler;
    constructor(cfg: any, ctrl: CpGuideCtrl) {
        this._cfg = cfg;
        this._ctrl = ctrl;
        this._viewData = this._ctrl.getGuideUiCfg(this._cfg.id);
        this._onEndTimer = new Handler(this.onEndTimer , this);
        this.init();
    }

    private init() {
        switch (this._cfg.triggerType) {
            case ETriggerStart.GAME_START:
                SysMgr.instance.doFrameOnce(Handler.create(this.start, this), 2, true);
                //this.start();
                break;
            case ETriggerStart.COMPLETE_GUIDE:
                this._ctrl.addEndTriggerGuide(this, this._cfg.triggerParam1);
                break;
            case ETriggerStart.ON_BO_CHANGE_TIME:
                GameEvent.on(EventEnum.MAP_BO_CHANGE, this.onBoChange, this);
                break;
            case ETriggerStart.COMPLETE_BO:
                GameEvent.on(EventEnum.COMPLETE_BO, this.onBoComplete, this);
                break;
            case ETriggerStart.COUNT_END:
                GameEvent.on(EventEnum.HIDE_START_GAME, this.onCountEnd, this);
                break;
            case ETriggerStart.COMPLETE_BO_AND_TIME:
                GameEvent.on(EventEnum.COMPLETE_BO, this.onBoComplete2, this);
                break;
            case ETriggerStart.START_GUIDE:
                GameEvent.on(EventEnum.CP_GUIDE_START, this.onGuideStart, this);
                break;
            case ETriggerStart.KILL_SCENE_ITEM:
                GameEvent.on(EventEnum.ON_OBJ_DIE, this.onSoRemoveTriggerStart, this);
                break;
            case ETriggerStart.FAIL_GUIDE:
                GameEvent.on(EventEnum.SHOW_FAIL_GUIDE, this.onFailGuide, this);
                break;
            case ETriggerStart.HIDE_VIEW:
                GameEvent.on(EventEnum.CP_GUIDE_HIDE_VIEW, this.onHideViewTrigger, this);
                break;
        }
    }

    /**开始 */
    start() {
        switch (this._cfg.endType) {
            case ETriggerEnd.CREATE_TOWER:
                if (!this.checkCreateTower()) {
                    this.end();
                    return;
                }
                GameEvent.on(EventEnum.CREATE_TOWER_SHOW, this.onCreateTowerShow, this);
                GameEvent.on(EventEnum.CREATE_TOWER_ALL, this.onCreateTower, this);
                break;
            case ETriggerEnd.UPGRADE_TOWER:
                if (!this.checkUpgradeTower()) {
                    this.end();
                    return;
                }
                GameEvent.on(EventEnum.SELECT_TOWER_SHOW, this.onSelectTower, this)
                GameEvent.on(EventEnum.UPDATE_TOWER, this.onUpdateTower, this);
                break;
            case ETriggerEnd.SELL_TOWER:
                if (!this.checkSellTower()) {
                    this.end();
                    return;
                }
                GameEvent.on(EventEnum.SELECT_TOWER_SHOW, this.onSelectTower, this)
                GameEvent.on(EventEnum.SELL_TOWER, this.onSellTower, this);
                break;
            case ETriggerEnd.TIME:
                SysMgr.instance.doOnce(this._onEndTimer, this._cfg.endParam1[0], true);
                break;
            case ETriggerEnd.CAT_BUBBLE:
                GameEvent.emit(EventEnum.CAT_SHOW_BUBBLE , this._cfg.info , this._cfg.labelHeight == 0 ? 50 : this._cfg.labelHeight);
                SysMgr.instance.doOnce(this._onEndTimer, this._cfg.endParam1[0], true);
                break;
            case ETriggerEnd.CAT_FACE:
                GameEvent.emit(EventEnum.CAT_SHOW_FACE , this._cfg.info);
                SysMgr.instance.doOnce(this._onEndTimer, this._cfg.endParam1[0], true);
                break;
            case ETriggerEnd.KILL_OBJ:
                if (!this.checkKillObj()) {
                    this.end();
                    return;
                }
                GameEvent.on(EventEnum.SELECT_TARFER, this.onSelectTarget, this);
                GameEvent.on(EventEnum.ON_OBJ_DIE, this.onSoRemove, this);
                break;
            case ETriggerEnd.COMPLETE_BO:
                GameEvent.on(EventEnum.COMPLETE_BO, this.onBoCompleteEnd, this);
                break;
            case ETriggerEnd.HIDE_VIEW:
                GameEvent.on(EventEnum.CP_GUIDE_HIDE_VIEW, this.onHideViewEnd, this);
                break;
            case ETriggerEnd.RELEASE_MAGIC_SKILL:
                GameEvent.on(EventEnum.CP_GUIDE_RELEASE_MAGIC_SKILL, this.onBoCompleteEnd, this);
                break;
            case ETriggerEnd.SELECT_TARGET:
                if (!this.checkKillObj()) {
                    this.end();
                    return;
                }
                GameEvent.on(EventEnum.ON_ENEMY_TOUCH, this.onEnemyTouch, this);
                break;
            case ETriggerEnd.TOUCH_UI:
                if (!this.checkCpSys()) {
                    this.end();
                    return;
                }
                GameEvent.on(EventEnum.TOUCH_TOP_UI, this.onTouchUi, this);
                break;
            case ETriggerEnd.SELECT_GIANT:
                if (!this.checkGiant()) {
                    this.end();
                    return;
                }
                GameEvent.on(EventEnum.SELECT_TARFER, this.onSelectTarget2, this);
                GameEvent.onReturn('find_giant' , this.onFindGiant , this);
                break;
            case ETriggerEnd.TOUCH_EMPTY:
                GameEvent.on(EventEnum.BEGIN_ITEM_CLICK , this.onMapTouch , this);
                break;
        }

        if (!StringUtils.isNilOrEmpty(this._cfg.soundEft)) {
            Game.soundMgr.playSound(this._cfg.soundEft);
            Game.soundMgr.setMusicVolume(0.1);
        }
        this._ctrl.onGuideStart(this);

    }

    tryJump() {
        SysMgr.instance.clearTimer(this._onEndTimer , true);
        SysMgr.instance.doOnce(this._onEndTimer, 1000, true);
    }

    /**结束 */
    end() {
        if (this._cfg.endType == ETriggerEnd.CAT_BUBBLE) {
            GameEvent.emit(EventEnum.CAT_HIDE_BUBBLE , this._cfg.triggerType);
        }
        if (this._cfg.endType == ETriggerEnd.CAT_FACE) {
            GameEvent.emit(EventEnum.CAT_HIDE_FACE);
        }

        let exit = this.cancel();
        this._ctrl.onGuideEnd(this);

        if (this._cfg.noOnce == 1 && !exit) {
            this.init();
        }
    }

    cancel(exit:Boolean = false) {
        this.stopSound();
        GameEvent.targetOff(this);
        if (this._cfg.endType == ETriggerEnd.SELECT_GIANT) {
            GameEvent.offReturn('find_giant' , this.onFindGiant , this);
        }
        if (this._cfg.noOnce != 1 || exit) {
            SysMgr.instance.clearTimerByTarget(this, true);
            SysMgr.instance.clearTimerByTarget(this, false);
            Handler.dispose(this);
        }
        return exit;
    }

    stopSound() {
        if (this._cfg && !StringUtils.isNilOrEmpty(this._cfg.soundEft)) {
            Game.soundMgr.stopSoundByPath(this._cfg.soundEft);
            Game.soundMgr.setMusicVolume(1.0);
        }
    }

    /////////////////////////////////////////触发开始
    /**指引完成 */
    /*
    private onGuideEnd(guide:Guide) {
        if (guide.cfg.id == this._cfg.triggerParam1) {
            this.start();
            GameEvent.off(EventEnum.GUIDE_END , this.onGuideEnd , this);
        }
    }
    */

    private onFailGuide() {
        this.start();
    }

    private onHideViewTrigger(dialogName: string) {
        if (dialogName == this._cfg.triggerParam3) {
            this.start();
        }
    }

    /**杀死某个物体 */
    private onSoRemoveTriggerStart(target: any, cfg?: any, ediyPro?: any, x?: number, y?: number) {
        let gx = GlobalVal.toGridPos(x);
        let gy = GlobalVal.toGridPos(y);
        if (gx == this._cfg.triggerParam1 && gy == this._cfg.triggerParam2) {
            this.start();
        }
    }

    /**波改变 */
    private onBoChange(boIndex: number, total: number) {
        if (boIndex == this._cfg.triggerParam1) {
            GameEvent.off(EventEnum.MAP_BO_CHANGE, this.onBoChange, this);
            SysMgr.instance.doOnce(Handler.create(this.start, this), this._cfg.triggerParam2);
        }
    }

    private onBoComplete(boIndex: number) {
        if (boIndex == this._cfg.triggerParam1) {
            this.start();
        }
    }

    private onBoComplete2(boIndex: number) {
        if (boIndex == this._cfg.triggerParam1) {
            this.start();
            cc.log('================');
            SysMgr.instance.doLoop(Handler.create(this.start, this), this._cfg.triggerParam2);
        }
    }

    private onGameSuccess() {
        this.start();
        cc.log('================');
        SysMgr.instance.doLoop(Handler.create(this.start, this), this._cfg.triggerParam2);
    }

    private onGuideStart(cfg:any) {
        if (cfg.id == this._cfg.triggerParam1) {
            this.start();
        }
    }

    private onEnemyTouch(m:Monster) {
        if (!m) return;
        let gx = GlobalVal.toGridPos(m.x);
        let gy = GlobalVal.toGridPos(m.y);

        if (gx == Math.floor(this._cfg.endParam1[0]) && gy == Math.floor(this._cfg.endParam1[1])) {
            this.end();
        }
    }

    private onTouchUi(flag:CP_SYSTEM_TYPE) {
        if (flag == this._cfg.endParam1[0]) {
            this.end();
        }
    }

    /**当点击地图 */
    protected onMapTouch(x:number , y:number) {
        this.end();
    }
    ///////////////////////////////////////////////状态改变

    private onSelectTower(flag: boolean) {
        GameEvent.emit(EventEnum.CP_GUIDE_REFRESH_ARROW_POS);
    }

    private onCreateTowerShow(flag: boolean) {
        GameEvent.emit(EventEnum.CP_GUIDE_REFRESH_ARROW_POS);
    }

    private onSelectTarget(target: any) {
        GameEvent.emit(EventEnum.SHOW_GUIDE_ARROW, target ? false : true);
    }

    private onSelectTarget2(target: any) {
        this.end();
    }

    private onFindGiant(reply:Reply) {
        let allMonster:Monster[] = Game.soMgr.getAllMonster();
        let len = allMonster.length;
        for (let i = 0 ; i < len ; i++) {
            if (SoType.isGiant(allMonster[i])) {
                return reply(allMonster[i].renderNode.parent.convertToWorldSpaceAR(allMonster[i].centerPos));
            }
        }
        return reply(cc.Vec2.ZERO_R);
    }
    ///////////////////////////////////////触发结束

    /**建塔 */
    private onCreateTower(gx: number, gy: number, so: Tower) {
        //if ((so.cfg as GS_TroopsInfo_TroopsInfoItem).bttype == this._cfg.endParam2 && gx == this._cfg.endParam1[0] && gy == this._cfg.endParam1[1]) {
            this.end();
        //}
    }

    /**升塔 */
    private onUpdateTower(id: number, gx: number, gy: number) {
        //if (gx == Math.floor(this._cfg.endParam1[0]) && gy == Math.floor(this._cfg.endParam1[1])) {
            this.end();
        //}
    }

    /**升塔 */
    private onSellTower(id: number, gx: number, gy: number) {
        //if (gx == Math.floor(this._cfg.endParam1[0]) && gy == Math.floor(this._cfg.endParam1[1])) {
            this.end();
        //}
    }

    /**结束计时 */
    private onEndTimer() {
        this.end();
    }

    /**杀死某个物体 */
    private onSoRemove(target: any, cfg?: any, ediyPro?: any, x?: number, y?: number) {
        let gx = GlobalVal.toGridPos(x);
        let gy = GlobalVal.toGridPos(y);
        if (gx == Math.floor(this._cfg.endParam1[0]) && gy == Math.floor(this._cfg.endParam1[1])) {
            this.end();
        }
    }

    private onBoCompleteEnd(boIndex: number) {
        if (boIndex == this._cfg.endParam1[0]) {
            this.end();
        }
    }

    private onHideViewEnd(dialogName: string) {
        if (dialogName == this._cfg.endParam1[0]) {
            this.end();
        }
    }

    //////////////////////////////////////////////////////check
    private checkCreateTower(): boolean {
        let gx = Math.floor(this._cfg.endParam1[0]);
        let gy = Math.floor(this._cfg.endParam1[1]);

        if (Game.soMgr.gridIsEmpty(gx, gy)) {
            let fightTower: GS_TroopsInfo_TroopsInfoItem = Game.towerMgr.getFightTower(this._cfg.endParam2);
            let levelData: GS_TroopsInfo_Level = Game.towerMgr.getLevelData(fightTower, 1);
            return Game.cpMgr.gold >= levelData.ncreategold;
        }

        return false;
    }

    private checkUpgradeTower(): boolean {
        let gx = Math.floor(this._cfg.endParam1[0]);
        let gy = Math.floor(this._cfg.endParam1[1]);
        let tower: Tower = Game.soMgr.getGridTower(gx, gy);
        if (tower) {
            if (tower.level < 3 && Game.cpMgr.gold >= Game.towerMgr.getLevelData(tower.cfg, tower.level + 1).ncreategold) {
                return true;
            }
        }

        return false;
    }

    private checkSellTower(): boolean {
        let gx = Math.floor(this._cfg.endParam1[0]);
        let gy = Math.floor(this._cfg.endParam1[1]);
        let tower: Tower = Game.soMgr.getGridTower(gx, gy);
        if (tower) {
            return true;
        }

        return false;
    }


    private checkKillObj():boolean {
        let gx = Math.floor(this._cfg.endParam1[0]);
        let gy = Math.floor(this._cfg.endParam1[1]);
        let item = Game.soMgr.getGridSceneItem(gx , gy);
        return item ? true : false;
    }

    private checkCpSys():boolean {
        switch (this._cfg.endParam1[0]) {
            case CP_SYSTEM_TYPE.PAUSE:
                if (GameEvent.dispathReturnEvent('get_top_is_top')) {
                    return false;
                }
                return !SysMgr.instance.pause;
                break;
            case CP_SYSTEM_TYPE.RESUME:
                if (GameEvent.dispathReturnEvent('get_top_is_top')) {
                    return false;
                }
                return SysMgr.instance.pause;
            case CP_SYSTEM_TYPE.NORMAL_SPEED:
                if (GameEvent.dispathReturnEvent('get_top_is_top')) {
                    return false;
                }
                return SysMgr.instance.warSpeed != 1;
                break;
            case CP_SYSTEM_TYPE.DOUBLE_SPEED:
                if (GameEvent.dispathReturnEvent('get_top_is_top')) {
                    return false;
                }
                // console.log('===========' , LocalStorageMgr.getItem(LocalStorageMgr.DOUBLE_SPEED));
                // console.log('===========' , (GlobalVal.curMapCfg && GlobalVal.curMapCfg.nwarid == 7 && LocalStorageMgr.getItem(LocalStorageMgr.DOUBLE_SPEED)));
                if (GlobalVal.curMapCfg && GlobalVal.curMapCfg.nwarid == 7 && LocalStorageMgr.getItem(LocalStorageMgr.DOUBLE_SPEED)) {
                    return false;
                }
                return SysMgr.instance.warSpeed == 1;
                break;
            case CP_SYSTEM_TYPE.TASK:
                return Game.cpMgr.getTaskCtrl().checkHaveTask();
                break;
        }
        return false;
    }

    private checkGiant():boolean {
        let allMonster:Monster[] = Game.soMgr.getAllMonster();
        let len = allMonster.length;
        for (let i = 0 ; i < len ; i++) {
            if (SoType.isGiant(allMonster[i]) && allMonster[i].renderNode) {
                return true;
            }
        }
        return false;
    }

    get cfg(): any { return this._cfg };

    private onCountEnd() {
        this.start();
    }

    public getViewData() {
        return this._viewData;
    }
}