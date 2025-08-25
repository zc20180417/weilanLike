import { ETriggerStart, ETriggerEnd, CpGuideCtrl, ETriggerTipsStart, ETriggerTipsEnd } from "./CpGuideCtrl";
import { EventEnum } from "../../common/EventEnum";
import SysMgr from "../../common/SysMgr";
import { Handler } from "../../utils/Handler";
import GlobalVal from "../../GlobalVal";
import Game from "../../Game";
import { Tower } from "../../logic/sceneObjs/Tower";
import { GS_SceneOpenWar_WarTaskData } from "../../net/proto/DMSG_Plaza_Sub_Scene";
import { CpGuideTipsView } from "./CpGuideTipsView";
import { GameEvent } from "../../utils/GameEvent";

export class CpGuideTips {


    private _cfg: any;
    private _ctrl: CpGuideCtrl;
    private _node:cc.Node;

    constructor(cfg: any, ctrl: CpGuideCtrl) {
        this._cfg = cfg;
        this._ctrl = ctrl;
        this.init();
    }

    private init() {
        switch (this._cfg.triggerType) {
            case ETriggerTipsStart.GAME_START:
                SysMgr.instance.doFrameOnce(Handler.create(this.start, this), 2, true);
                break;
            case ETriggerTipsStart.TASK_COMPLETE:
                GameEvent.on(EventEnum.CPTASK_STATE_CHANGE , this.onTaskStateChange , this);
                break;
            case ETriggerTipsStart.BO:
                GameEvent.on(EventEnum.MAP_BO_CHANGE, this.onBoChange, this);
                break;
            case ETriggerTipsStart.TIPS_END:
                GameEvent.on(EventEnum.CP_GUIDE_TIPS_END, this.onTipsEnd, this);
                break;
            case ETriggerTipsStart.KILL_SCENE_ITEM:
                GameEvent.on(EventEnum.ON_OBJ_DIE, this.onSoRemoveTriggerStart, this);
                break;
        }
    }

    /**开始 */
    start() {
        switch (this._cfg.endType) {
            case ETriggerTipsEnd.BO:
                GameEvent.on(EventEnum.MAP_BO_CHANGE, this.onBoTriggerEnd, this);
                break;
            case ETriggerTipsEnd.SHOW_TIME:
                SysMgr.instance.doOnce(Handler.create(this.onEndTimer, this), this._cfg.endParam1[0]);
                break;
            case ETriggerTipsEnd.TASK_COMPLETE:
                GameEvent.on(EventEnum.CPTASK_STATE_CHANGE , this.onTaskCompleteTriggerEnd , this);
                break;
            case ETriggerTipsEnd.CREATE_TOWER:
                GameEvent.on(EventEnum.CREATE_TOWER_ALL, this.onCreateTower, this);
                break;
            case ETriggerTipsEnd.USE_SKILL:
                GameEvent.on(EventEnum.RELEASE_MAGIC_SKILL, this.onReleaseSkill, this);
                break;
            
        }

        this._node = GameEvent.dispathReturnEvent('createGuideTips');
        if (this._node) {
            let comp = this._node.getComponent(CpGuideTipsView);
            if (comp) {
                comp.initData(this);
            }
        }
    }

    /**结束 */
    end() {
        this.cancel();
        if (this._node && this._node.isValid) {
            let comp = this._node.getComponent(CpGuideTipsView);
            if (comp) {
                comp.startHide();
            }
        }
        
    }

    cancel() {
        GameEvent.targetOff(this);
        SysMgr.instance.clearTimerByTarget(this);
        Handler.dispose(this);
        if (this._node && this._node.isValid) {
            this._node.stopAllActions();
        }
    }

    onHideEnd() {
        GameEvent.emit(EventEnum.CP_GUIDE_TIPS_END , this.cfg.id);
    }

    /////////////////////////////////////////触发开始

    /**波改变 */
    private onBoChange(boIndex: number, total: number) {
        if (boIndex == this._cfg.triggerParam1[0]) {
            GameEvent.off(EventEnum.MAP_BO_CHANGE, this.onBoChange, this);
            this.start();
        }
    }


    private onTipsEnd(id:number) {
        if (id == this._cfg.triggerParam1[0]) {
            this.start();
        }
    }

    private onTaskStateChange(cfg:GS_SceneOpenWar_WarTaskData, state:number) {
        if (state && state == 3) {
            let index = Game.cpMgr.getTaskCtrl().getTaskIndex(cfg);
            if (index == this._cfg.triggerParam1[0]) {
                this.start();
            }
        }
    }

    /**杀死某个物体 */
    private onSoRemoveTriggerStart(target: any, cfg?: any, ediyPro?: any, x?: number, y?: number) {
        let gx = GlobalVal.toGridPos(x);
        let gy = GlobalVal.toGridPos(y);
        if (gx == this._cfg.triggerParam1[0] && gy == this._cfg.triggerParam1[1]) {
            this.start();
        }
    }

    
    ///////////////////////////////////////触发结束

    /**建塔 */
    private onCreateTower(gx: number, gy: number, so: Tower) {
        if (gx == this._cfg.endParam1[0] && gy == this._cfg.endParam1[1]) {
            this.end();
        }
    }

    /**结束计时 */
    private onEndTimer() {
        this.end();
    }

    /**杀死某个物体 */
    private onSoRemove(target: any, cfg?: any, ediyPro?: any, x?: number, y?: number) {
        let gx = GlobalVal.toGridPos(x);
        let gy = GlobalVal.toGridPos(y);
        if (gx == this._cfg.endParam1[0] && gy == this._cfg.endParam1[1]) {
            this.end();
        }
    }

    private onReleaseSkill(skillId: number, cdTime: number) {
        if (skillId == this._cfg.endParam1[0]) {
            this.end();
        }
    }

    private onBoTriggerEnd(boIndex: number) {
        if (boIndex == this._cfg.endParam1[0]) {
            this.end();
        }
    }

    private onTaskCompleteTriggerEnd(cfg:GS_SceneOpenWar_WarTaskData, state:number) {
        if (state && state == 3) {
            let index = Game.cpMgr.getTaskCtrl().getTaskIndex(cfg);
            if (index == this._cfg.endParam1[0]) {
                this.end();
            }
        }
    }

    
    get cfg(): any { return this._cfg };
    
}