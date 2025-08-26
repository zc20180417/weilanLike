import { BuryingPointMgr } from "../../buryingPoint/BuryingPointMgr";
import { EMODULE, GLOBAL_FUNC } from "../../common/AllEnum";
import { EResPath } from "../../common/EResPath";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GameDataCtrl } from "../../logic/gameData/GameDataCtrl";
import { GS_TroopsInfo_TroopsInfoItem } from "../../net/proto/DMSG_Plaza_Sub_Troops";
import { GOODS_ID } from "../../net/socket/handler/MessageEnum";
import { GameEvent } from "../../utils/GameEvent";
import { StringUtils } from "../../utils/StringUtils";
import { DialogLayer, UiManager } from "../../utils/UiMgr";
import { SystemGuideItem } from "./SystemGuideItem";

export enum SystemGuideTriggerType {
    /**星星满了 */
    STAR_ENOUGH = 1,
    /**猫咪可以升级了 */
    TOWER_CAN_UPGRADE,
    /**商城系统开放 */
    SHOP_SYSTEM_OPEN,
    /**首次获取非绿色猫咪 */
    GET_NEW_HIGH_TOWER,
    /**签到系统开放 */
    SIGN_IN_OPEN,
    /**第一次进入游戏 */
    FRIST_ENTER,
    /**第一次获得红包 */
    FRIST_GET_RPK,
    /**猫咪可以激活 */
    TOWER_CAN_ACTIVE,
    /**商城至尊宝箱指引 */
    SHOP_ZHI_ZUN_BOX,
    /**图鉴系统开放 */
    TU_JIAN_OPEN,
    /**任务开放 */
    TASK_OPEN,
    /**天赋开放 */
    SCIENCE_OPEN,
    /**pvp开放 */
    PVP_OPEN,
    /**猫咪公寓开放 */
    CAT_HOUSE_OPEN,
    /**指引换塔*/
    CHANGE_TOWER_TYPE,
    /**指引购买时装 */
    BUY_FASHION,
    /**指引购买时装2 */
    BUY_FASHION2,
    /**继续挑战 */
    GOON_PLAY,
    /**转盘指引 */
    TURNTABLE,
    /**转盘指引(纯展示，不强制指引点击抽奖) */
    TURNTABLE_SHOW,
    /**失败指引升级炮塔 */
    GAME_FAIL_GUIDE_UPGRADE_TOWER,
    /**失败指引加天赋 */
    GAME_FAIL_GUIDE_SCIENCE,
    /**失败指引买装备 */
    GAME_FAIL_GUIDE_EQUIP,
    /**失败指引买皮肤 */
    GAME_FAIL_GUIDE_SKIN,
    /**失败指引阵容*/
    GAME_FAIL_GUIDE_BATTLE_ARRAY,
    /**困难模式指引 */
    HARD_GUIDE,
    COOPERATE,
    TO_FRIEND_CATHOUSE,         //好友猫咪公寓
    PVP_SHOP,                   //竞技商店
    COOP_SHOP,                  //合作商店
    CAT_HOUSE_LAYER_OPEN,       //猫咪公寓楼层开放
    CLICK_BOOK,     //猫咪公寓楼层开放
}


export class SystemGuideCtrl extends GameDataCtrl {

    private _cacheData: any = {};
    private _allHeadGuide: any[] = null;
    private _guideGroupDic: any = null;
    private _systemGuideCfg: any = null;


    private _guideDic: any = {};

    //private _cacheShowItem:SystemGuideItem[] = [];
    private _curIndex: number = -1;
    private _curGuideCfg: any = null;
    private _curItem: SystemGuideItem;
    private _curTowerInfo: GS_TroopsInfo_TroopsInfoItem;
    private _checkEvt: boolean = false;
    private _showGuideEvtEnum: EventEnum = null;
    private _breakGuideGroup: number = 0;
    private _showTurnTabelGuide: boolean = false;
    private _preDialog:string = '';

    constructor() {
        super();
        this.module = EMODULE.SYSTEM_GUIDE;
    }

    init() {
        this._allHeadGuide = [];
        this._guideGroupDic = {};

        this._systemGuideCfg = Game.gameConfigMgr.getCfg(EResPath.SYSTEM_GUIDE_CFG);
        Object.values(this._systemGuideCfg).forEach(element => {
            if (!this._guideGroupDic[element['group']]) {
                this._guideGroupDic[element['group']] = [];
                this._allHeadGuide.push(element);
            }
            this._guideGroupDic[element['group']].push(element);

        });

        GameEvent.on(EventEnum.SYSTEM_GUIDE_CLICK, this.onGuideClick, this);
        GameEvent.on(EventEnum.ITEM_COUNT_CHANGE, this.onItemChange, this);
        GameEvent.on(EventEnum.ENTER_MAP_SCENE, this.onEnterMapScene, this);
        GameEvent.on(EventEnum.END_SYSTEM_GUIDE, this.completeGuide, this);
        GameEvent.on(EventEnum.LAST_WAR_ID_CHANGE2, this.onLastWarChange, this);
        GameEvent.on(EventEnum.EXIT_GAME_SCENE, this.onExitGameScene, this);
    }

    read() {
        this._cacheData = this.readData() || {};
        // this._cacheData = {};
        this.registerGuide();
    }

    write() { 
        this.writeData(this._cacheData);
    }

    tryStartGroup(item: SystemGuideItem, param?: any) {
        if (this._cacheData[item.group]) {
            return;
        }
        this._breakGuideGroup = 0;
        if (this._curItem) {
            if (this._curItem.priority >= item.priority) {
                return;
            } else {
                this._breakGuideGroup = this._curItem.group;
                if (!this._curItem.isNotSave()) {
                    this._cacheData[this._curItem.group] = false;
                    this.write();
                }
                this.completeGuide();
            }

        }

        this._curItem = item;
        if (!item.isNotSave()) {
            this._cacheData[item.group] = true;
        }
        this.write();

        this._curIndex = 0;
        this._curGuideCfg = this._curItem.cfgList[0];
        if (this._curGuideCfg.hideUI == 1) {
            UiManager.removeAll();
        }

        this.showGuide(param);
        item.startGuide();
    }

    get curItem(): SystemGuideItem {
        return this._curItem;
    }

    isGuideComplete(group: number): boolean {
        return this._cacheData[group];
    }

    setUpdateTowerInfo(info: GS_TroopsInfo_TroopsInfoItem) {
        this._curTowerInfo = info;
    }

    get breakGuideGroup(): number {
        return this._breakGuideGroup;
    }

    private registerGuide() {
        this._guideDic = {};
        this._allHeadGuide.forEach(element => {
            if (!this._cacheData[element.group]) {
                this._guideDic[element.group] = new SystemGuideItem(this._guideGroupDic[element.group], this);
            }
        });
    }


    private startGuide() {
        let guideCfgList = this._curItem.cfgList;
        if (this._curIndex >= guideCfgList.length) return;
        this._curGuideCfg = guideCfgList[this._curIndex];

        if (StringUtils.isNilOrEmpty(this._curGuideCfg.targgerEvt)) {
            this.showGuide();
        } else if (this._curGuideCfg.targgerEvt == 'CHECK_SYSTEM_OPEN_END') {
            this._checkEvt = true;
            GameEvent.on(EventEnum.CHECK_SYSTEM_OPEN_END, this.onCheckSystemOpen, this);
        } else {
            this._showGuideEvtEnum = EventEnum[this._curGuideCfg.targgerEvt] as unknown as EventEnum;
            GameEvent.on(EventEnum[this._curGuideCfg.targgerEvt] as unknown as EventEnum, this.showGuide, this);
        }


    }

    private onCheckSystemOpen(flag: boolean) {
        if (!this._curGuideCfg) return;
        let id = !flag ? this._curGuideCfg.nextids[0] : this._curGuideCfg.nextids[1];
        let guideCfgList = this._curItem.cfgList;
        let len = guideCfgList.length;
        for (let i = 0; i < len; i++) {
            if (guideCfgList[i].id == id) {
                this._curIndex = i;
                break;
            }
        }
        this.startGuide();
    }

    private completeGuide() {
        let temp = this._curItem;
        if (!StringUtils.isNilOrEmpty(this._preDialog)) {
            UiManager.hideDialog(this._preDialog);
            this._preDialog = '';
        }
    
        if (this._checkEvt) {
            GameEvent.off(EventEnum.CHECK_SYSTEM_OPEN_END, this.onCheckSystemOpen, this);
        }
        if (this._showGuideEvtEnum) {
            GameEvent.off(EventEnum[this._curGuideCfg.targgerEvt] as unknown as EventEnum, this.showGuide, this);
        }
        this._curItem.endGuide();
        this._curItem = null;
        this._curGuideCfg = null;
        this._curIndex = -1;

        this._checkEvt = false;
        this._showGuideEvtEnum = null;
    }

    private completeGuideReal(group: number) {
        this._cacheData[group] = true;
        this.write();
    }

    private showGuide(param?: any) {
        if (!this._curGuideCfg) return;
        if (!StringUtils.isNilOrEmpty(this._curGuideCfg.targgerEvtParam) && this._curGuideCfg.targgerEvtParam != param) return;

        if (this._curGuideCfg.targgerEvt == 'CHECK_SYSTEM_OPEN_END') {
            GameEvent.off(EventEnum.CHECK_SYSTEM_OPEN_END, this.onCheckSystemOpen, this);
        } else if (!StringUtils.isNilOrEmpty(this._curGuideCfg.targgerEvt)) {
            GameEvent.off(EventEnum[this._curGuideCfg.targgerEvt] as unknown as EventEnum, this.showGuide, this);
        }

        this._checkEvt = false;
        this._showGuideEvtEnum = null;

        if (this._curGuideCfg && this._curGuideCfg.bpId > 0) {
            BuryingPointMgr.postFristPoint(this._curGuideCfg.bpId , this._curGuideCfg.bpType , this._curGuideCfg.bpName);
        }
        // BuryingPointMgr.post(70000 + this._curGuideCfg.id);

        let dialogPath = StringUtils.isNilOrEmpty(this._curGuideCfg.guideView) ? EResPath.SYSTEM_GUIDE_VIEW : EResPath[this._curGuideCfg.guideView];

        if (!StringUtils.isNilOrEmpty(this._preDialog) && this._preDialog != dialogPath) {
            UiManager.hideDialog(this._preDialog);
            this._preDialog = '';
        }

        if (this._curGuideCfg.hideBlock == 1) {
            UiManager.showBottomDialog(dialogPath, this._curGuideCfg);
        } else {
            UiManager.showTopDialog(dialogPath, this._curGuideCfg);
        }
        this._preDialog = dialogPath;
        
        if (this._curGuideCfg.targgerEvt != 'CHECK_SYSTEM_OPEN_END' && this._curGuideCfg.getPosEvt == "") {
            this.onGuideClick();
        }
    }

    private onGuideClick() {
        if (!this._curItem) return;
        let guideCfgList = this._curItem.cfgList;
        let len = guideCfgList.length;
        if (this._curGuideCfg && this._curGuideCfg.nextids.length > 0) {
            this._curIndex = len;
            let id = this._curGuideCfg.nextids[0];
            for (let i = 0; i < len; i++) {
                if (guideCfgList[i].id == id) {
                    this._curIndex = i;
                    break;
                }
            }
        } else {
            this._curIndex++;
        }

        if (this._curIndex >= len) {
            this.completeGuide();
        } else {
            this.startGuide();
        }
    }

    private onItemChange(id: number, count: number) {
        if (id == GOODS_ID.REDPACKET && count >= 30 && Game.sceneNetMgr.getCurWarID() <= 20 && !this._showTurnTabelGuide) {
            if (!this._cacheData[SystemGuideTriggerType.TURNTABLE]) {
                GameEvent.emit(EventEnum.SYSTEM_GUIDE_TRIGGER, SystemGuideTriggerType.TURNTABLE);
            } else {
                GameEvent.emit(EventEnum.SYSTEM_GUIDE_TRIGGER, SystemGuideTriggerType.TURNTABLE_SHOW);
            }
            this._showTurnTabelGuide = true;
        }

        //写死蝴蝶结大于100的皮肤指引
        //取消强制指引购买皮肤
        // if (id == GOODS_ID.EQUIP_UPGRADE_MATERIAL && count >= 100 && cc.director.getScene().name == "CatHouse") {
        //     let guideid = Game.catHouseMgr.tryExitCatHouse ? SystemGuideTriggerType.BUY_FASHION2 : SystemGuideTriggerType.BUY_FASHION;
        //     GameEvent.emit(EventEnum.SYSTEM_GUIDE_TRIGGER, guideid, 101);
        // }
    }

    private onEnterMapScene() {
        if (this._curTowerInfo && !this._curGuideCfg) {
            UiManager.showDialog(EResPath.TOWER_STAR_MAIN_VIEW, this._curTowerInfo.bttype - 1);
            UiManager.showDialog(EResPath.TOWER_STAR_LV_UP_VIEW, { towerInfo: this._curTowerInfo });
        }
        this._curTowerInfo = null;
    }

    private onLastWarChange(warid: number) {
        //go on
        if (warid <= 5) {
            GameEvent.emit(EventEnum.SYSTEM_GUIDE_TRIGGER, SystemGuideTriggerType.GOON_PLAY);
        } else if (warid == 6) {
            this.completeGuideReal(SystemGuideTriggerType.GOON_PLAY);
        }
    }

    private onExitGameScene() {
        this._showTurnTabelGuide = false;
    }
}
