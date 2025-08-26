
import { EResPath } from "../../common/EResPath";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GameEvent } from "../../utils/GameEvent";
import { StringUtils } from "../../utils/StringUtils";
import { UiManager } from "../../utils/UiMgr";
import { SystemGuideCtrl, SystemGuideTriggerType } from "./SystemGuideCtrl";

export class SystemGuideItem {

    private _group:number = 0;
    private _cfgList:any;
    private _ctrl:SystemGuideCtrl;
    private _headCfg:any;
    private _param:any;
    private _priority:number = 0;

    constructor(cfg:any , ctrl:SystemGuideCtrl) {
        this._cfgList = cfg;
        this._ctrl = ctrl;
        this._headCfg = cfg[0];
        this._group = this._headCfg.group;
        this._priority = this._headCfg.priority;
        this.register();
    }


    register() {
        GameEvent.on(EventEnum.SYSTEM_GUIDE_TRIGGER , this.onSystemGuideTrigger , this);
    }

    startGuide() {
        if (this._group == SystemGuideTriggerType.TURNTABLE || this._group == SystemGuideTriggerType.TURNTABLE_SHOW) {
            GameEvent.emit(EventEnum.STOP_BULLET_CHAT);
            UiManager.showDialog(EResPath.TURN_TABLE);
        }
    }

    endGuide() {
        if (!StringUtils.isNilOrEmpty(this._headCfg.targgerEvt)) {
            GameEvent.off(EventEnum[this._headCfg.targgerEvt] as unknown as EventEnum , this.tryStartGroup , this);
        } 
    }
    
    get group():number {
        return this._group;
    }

    get cfgList():any[] {
        return this._cfgList;
    }
    
    get param():any {
        return this._param;
    }

    get priority():number {
        return this._priority;
    }

    isNotSave():boolean {
        return this._headCfg.noSave == 1;
    }

    private onSystemGuideTrigger(targgerType:number , param?:any) {
        if (targgerType != this._headCfg.targgerType) {
            return;
        }

        if (targgerType == SystemGuideTriggerType.BUY_FASHION && (Game.fashionMgr.getTowerFashionAddHurtPer(param)
            || cc.director.getScene().name != "CatHouse") ) {
            return;
        }
        cc.log('------');

        this._param = param;
        if (StringUtils.isNilOrEmpty(this._headCfg.targgerEvt)) {
            this.tryStartGroup();
        } else {
            GameEvent.once(EventEnum[this._headCfg.targgerEvt] as unknown as EventEnum , this.tryStartGroup , this);
        }
    }

    private tryStartGroup(param?:any) {
        if (this._headCfg.targgerEvtParam == '' ||
            !StringUtils.isNilOrEmpty(this._headCfg.targgerEvtParam) && this._headCfg.targgerEvtParam == param) {
            this._ctrl.tryStartGroup(this , param);
        }
    }


}




