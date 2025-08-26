// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Dialog from "../utils/ui/Dialog";
import List from "../utils/ui/List";
import Game from "../Game";
import { UiManager } from "../utils/UiMgr";
import CpInfoTowerItem from "./CpInfoTowerItem";
import { EResPath } from "../common/EResPath";
import { StringUtils } from "../utils/StringUtils";
import { Handler } from "../utils/Handler";
import ImageLoader from "../utils/ui/ImageLoader";
import { EventEnum } from "../common/EventEnum";
import { GS_SceneSetWarDetails, GS_SceneSetWorldWarList_WorldWarItem } from "../net/proto/DMSG_Plaza_Sub_Scene";
import { SCOREFLAG, ServerDefine } from "../net/socket/handler/MessageEnum";
import { BuryingPointMgr, EBuryingPoint } from "../buryingPoint/BuryingPointMgr";
import CpInfoSelectTowerView from "./cpinfo/CpInfoSelectTowerView";
import { GS_TroopsInfo_TroopsInfoItem } from "../net/proto/DMSG_Plaza_Sub_Troops";
import { SystemGuideTriggerType } from "./guide/SystemGuideCtrl";
import GlobalVal from "../GlobalVal";
import { LoadResQueue } from "../utils/res/LoadResQueue";
import SystemTipsMgr from "../utils/SystemTipsMgr";
import GlobalFunc from "../GlobalFunc";
import { UIModelComp } from "./UIModelComp";
import { GameEvent, Reply } from "../utils/GameEvent";


const { ccclass, property } = cc._decorator;

@ccclass
export default class CpInfoView extends Dialog {

    @property(cc.Node)
    cpInfo: cc.Node = null;

    @property(cc.Node)
    taskInfo: cc.Node = null;

    iscpInfoSelected: boolean = true;
    // update (dt) {}
    ////////////////////////////////////////// 关卡信息
    @property(cc.Sprite)
    switchInfo: cc.Sprite = null;

    @property(cc.SpriteFrame)
    txtTask: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    txtCP: cc.SpriteFrame = null;

    @property(cc.Label)
    cpLv: cc.Label = null;

    @property(cc.Label)
    hideCpLv: cc.Label = null;

    @property(cc.Label)
    cpDes: cc.Label = null;

    @property(cc.Label)
    hideCpDes: cc.Label = null;

    @property(cc.Label)
    tili: cc.Label = null;

    @property(cc.Node)
    towerInfo: cc.Node = null;

    @property(cc.Prefab)
    towerItem: cc.Prefab = null;

    @property(cc.Sprite)
    mapImgBg: cc.Sprite = null;

    @property(cc.Node)
    pathNode: cc.Node = null;

    @property(cc.Node)
    itemNode: cc.Node = null;

    @property(cc.Node)
    cpUi: cc.Node = null;

    @property(cc.Node)
    hideCpUi: cc.Node = null;

    @property(cc.Node)
    cpBtn: cc.Node = null;

    @property(ImageLoader)
    gridImg: ImageLoader = null;

    @property(cc.Node)
    jiangbeiScene: cc.Node = null;

    @property(cc.Node)
    jiangbeiTask: cc.Node = null;

    @property(cc.Sprite)
    jiangbeiScore: cc.Sprite = null;

    @property([cc.SpriteFrame])
    scoreSfs: cc.SpriteFrame[] = [];
    @property(cc.Node)
    diamondCup: cc.Node = null;
    @property(cc.Node)
    commentUi: cc.Node = null;
    //////////////////////////////////////////  任务信息

    @property(List)
    list: List = null;

    @property(cc.Node)
    startBtn: cc.Node = null;

    @property(cc.Prefab)
    selectTowerPrefab: cc.Prefab = null;

    @property(cc.Node)
    bulletChatBtn: cc.Node = null;

    @property(cc.Node)
    tipsNode: cc.Node = null;

    @property(cc.Node)
    switchNode: cc.Node = null;

    @property(cc.Node)
    monsterNode: cc.Node = null;

    @property(UIModelComp)
    monsterItem: UIModelComp = null;

    @property(cc.Sprite)
    showTypeImg: cc.Sprite = null;

    @property(cc.SpriteFrame)
    monsterSf: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    towerSf: cc.SpriteFrame = null;

    @property(cc.Node)
    changeBtn: cc.Node = null;

    @property(cc.Node)
    tiliStartNode: cc.Node = null;

    @property(cc.Node)
    tvStartNode: cc.Node = null;

    @property(cc.Node)
    tvNode: cc.Node = null;

    @property(cc.Node)
    startTxtNode: cc.Node = null;

    @property(cc.Sprite)
    mapDiffSp: cc.Sprite = null;

    @property([cc.SpriteFrame])
    diffSps: cc.SpriteFrame[] = [];

    private _initMap: boolean = false;
    private _initTask: boolean = false;
    private _isLoaded: boolean = false;

    private _viewData: any;
    private _warDetails: GS_SceneSetWarDetails;
    private _curMapResObj: any;

    private getAnyCup: boolean = false;
    private _clickTowerCallBack: Handler;
    private _selectTowerNode: cc.Node;
    private _selectTowerComp: CpInfoSelectTowerView;
    private _selectTowerCallBack: Handler;
    private _hideCallBack: Handler;
    private _towerItemComps: CpInfoTowerItem[] = [];
    private _batchLoad: LoadResQueue;
    private _canEnter: Boolean = true;

    private _minTipsId: number = 20;
    private _maxTipsId: number = 40;
    private _tipsChapterId: number = 1;

    onLoad() {
        super.onLoad();
        this._isLoaded = true;
        this.checkShow();
        this.monsterNode.on("size-changed", this.onMonsterNodeSizeChanged, this);
    }

    setData(data: any) {
        this._viewData = data;
        this.switchNode.active = this._viewData.warID >= GlobalFunc.MIN_ID;
        this._canEnter = true;
        this._curMapResObj = Game.sceneNetMgr.getMapResObj(this._viewData.warID);
        GameEvent.on(EventEnum.ON_WORLD_WAR_DETAILS, this.onDetails, this);
        Game.sceneNetMgr.reqWarDetails(this._viewData.warID);
    }

    btnClickSwitch() {
        if (this._viewData.warID < GlobalFunc.MIN_ID) return;
        this.iscpInfoSelected = !this.iscpInfoSelected;
        if (this.iscpInfoSelected) {
            this.showMap();
        } else {
            this.showTask();
        }
    }

    /**
     * 进入普通关卡
     */
    btnClickStart() {
        if (!this.checkTili()) return;
        if (GlobalVal.mindCpinfo && this.isLowerPower()) {
            return UiManager.showDialog(EResPath.CPINFO_TIPS, this._viewData.warID);
        }

        if (!this._canEnter) {
            return SystemTipsMgr.instance.notice('地图数据出错，不能进入关卡');
        }

        UiManager.hideDialog(this);
        Game.sceneNetMgr.reqEnterWar(this._viewData.warID);
    }

    /**
     * 进入隐藏关卡
     */
    btnClickHideStart() {
        if (!this.checkTili()) return;
        if (GlobalVal.mindCpinfo && this.isLowerPower()) {
            return UiManager.showDialog(EResPath.CPINFO_TIPS, this._viewData.warID);
        }
        UiManager.hideDialog(this);
        Game.sceneNetMgr.reqEnterWar(this._viewData.warID);
    }

    private checkTili() {
        if (!this._warDetails) return false;
        let enough = Game.actorMgr.getStrength() >= this._warDetails.uopenneedstrength;
        if (!enough) {
            GameEvent.emit(EventEnum.STRENGTH_NOTENOUGH);
        }
        return enough;
    }

    addEvent() {
        GameEvent.onReturn('get_cpinfo_btn', this.onGetNode, this);
        GameEvent.on(EventEnum.ON_WAR_MY_CHAT_RET, this.onMyChatRet, this);
    }

    onJiangBeiClick() {
        if (!this._warDetails) return;
        let level = Game.sceneNetMgr.getWarGrade(this._warDetails.uscoreflag);
        let info = Game.sceneNetMgr.jiangBeiInfo[level - 1];
        UiManager.showDialog(EResPath.ANY_TIPS_VIEW, { title: info.name, info: info.info, node: this.jiangbeiScore.node });
    }

    onClearSceneItemClick() {
        let info = Game.sceneNetMgr.clearSceneInfo;
        UiManager.showDialog(EResPath.ANY_TIPS_VIEW, { title: info.name, info: info.info, node: this.jiangbeiScene });
    }

    on3StarClick() {
        let info = Game.sceneNetMgr.threeStarInfo;
        UiManager.showDialog(EResPath.ANY_TIPS_VIEW, { title: info.name, info: info.info, node: this.jiangbeiTask });
    }

    private onGetNode(reply:Reply, name: string): cc.Node {
        if (name == "enter_war") {
            return reply(this.startBtn);
        }
        if (name == 'tower_type') {
            return reply(this._towerItemComps[0].node);
        }

        if (name == 'tower_type2') {
            //显示当前关卡可用炮塔
            let enbleTower = this._warDetails.btopenrolecards;
            let minBattle = 10000000;
            let minIndex = 0;
            let index = 0;
            for (let i = 0, len = enbleTower.length; i < len; i++) {
                let id: number = enbleTower[i] == 1 ? i + 1 : 0;
                if (id > 0) {
                    let fightid = Game.towerMgr.getFightTowerID(id);
                    let battleValue = Game.towerMgr.getPower(fightid, Game.towerMgr.getStar(fightid));
                    if (minBattle > battleValue) {
                        minBattle = battleValue;
                        minIndex = index;
                    }

                    index++;
                }
            }

            return reply(this._towerItemComps[minIndex].node);
        }

        return reply(null);
    }

    private checkNormalShowPanel() {
        if (!this._warDetails ||
            this._warDetails.uscoreflag == 0 ||
            Game.sceneNetMgr.checkAllTaslComplete(this._warDetails.uscoreflag) ||
            this._viewData.warID < GlobalFunc.MIN_ID ||
            this._viewData.state
        ) {
            this.showMap();
        } else {
            this.showTask();
        }
    }

    private showNormalCpUi() {
        this.cpUi.active = true;
        this.cpBtn.active = true;
    }

    private showHideCpUi() {
        this.hideCpUi.active = true;
        //this.hideCpBtn.active = true;
        this.diamondCup.active = !this.getAnyCup;
    }

    private hideNormalCpUi() {
        this.cpUi.active = false;
        //this.cpBtn.active = false;
    }

    private hideHideCpUi() {
        this.hideCpUi.active = false;
        //this.hideCpBtn.active = false;
    }

    private onMonsterNodeSizeChanged() {
        this.monsterNode.x = -this.monsterNode.width >> 1;
        if (this.monsterNode.width > 820) {
            let layout = this.monsterNode.getComponent(cc.Layout);
            if (this.monsterNode.width > 1800) {
                layout.spacingX -= 40;
            } else {
                layout.spacingX -= 20;
            }

        }
    }

    private showMap() {
        this.commentUi.active = true;
        if (!this._warDetails) return;
        this.changeBtn.active = true;
        let sceneAllKill = (this._warDetails.uscoreflag & SCOREFLAG.SCOREFLAG_CLEARTHING) != 0;
        let level = Game.sceneNetMgr.getWarGrade(this._warDetails.uscoreflag);
        let allTaskComplete = Game.sceneNetMgr.checkAllTaslComplete(this._warDetails.uscoreflag);

        this.jiangbeiScene.active = sceneAllKill;
        this.jiangbeiTask.active = allTaskComplete;
        this.jiangbeiScore.node.active = level > 0;
        this.getAnyCup = this.jiangbeiScene.active || this.jiangbeiTask.active || this.jiangbeiScore.node.active;
        if (level > 0) {
            this.jiangbeiScore.spriteFrame = this.scoreSfs[level - 1];
        }

        if (!this._initMap) {
            this._initMap = true;
            this.loadMapRes();
            if (Game.sceneNetMgr.isHideWar(this._warDetails.nwarid)) {
                this.hideNormalCpUi();
                this.showHideCpUi();
                this.hideCpLv.string = this._warDetails.szname;
                this.hideCpDes.string = this._warDetails.szdes;
            } else {
                this.hideHideCpUi();
                this.showNormalCpUi();
                //当前关卡数
                this.cpLv.string = this._warDetails.szname;
                this.cpDes.string = this._warDetails.szdes;
            }

            this.showEnableTower();

            //提示切换猫咪
            this.tipsNode.x = this.towerInfo.x - this.towerInfo.width * 0.5;
            this.tipsNode.active = GlobalVal.mindSwitchTower;
            /*
            let worldWarItem: GS_SceneSetWorldWarList_WorldWarItem = Game.sceneNetMgr.getChapterPointData(this._viewData.warID);
            if (GlobalVal.mindSwitchTower && this._viewData.worldID == this._tipsChapterId
                && this._viewData.warID >= this._minTipsId
                && this._viewData.warID <= this._maxTipsId
                && worldWarItem
                && worldWarItem.uscoreflag == 0) {
                this.tipsNode.x = this.towerInfo.x - this.towerInfo.width * 0.5;
            } else {
                this.tipsNode.active = false;
            }
            */
        }

        this.iscpInfoSelected = true;
        this.refreshPanel();
    }

    private showTask() {
        this.commentUi.active = false;
        if (!this._warDetails) return;

        if (Game.sceneNetMgr.isHideWar(this._warDetails.nwarid)) {
            this.hideNormalCpUi();
            this.showHideCpUi();

            this.hideCpLv.string = this._warDetails.szname;
        }

        if (!this._initTask) {
            //任务
            let array = [];

            let len = this._warDetails.task.length;
            for (let i = 0; i < len; i++) {
                array[i] = { task: this._warDetails.task[i], isComplete: Game.sceneNetMgr.checkTaskComplete(this._warDetails.uscoreflag, i + 1) };
            }
            this.list.array = array;
            this._initTask = true;
        }
        this.changeBtn.active = false;
        this.iscpInfoSelected = false;
        this.refreshPanel();
    }

    private showEnableTower() {
        //显示当前关卡可用炮塔
        let enbleTower = this._warDetails.btopenrolecards;

        if (!this._clickTowerCallBack) {
            this._clickTowerCallBack = new Handler(this.onTowerClick, this);
        }
        this._towerItemComps = [];
        let count = 0;
        for (let i = 0, len = enbleTower.length; i < len; i++) {
            let id: number = enbleTower[i] == 1 ? i + 1 : 0;
            if (id > 0) {
                let towerItem = cc.instantiate(this.towerItem);
                let towerItemCom = towerItem.getComponent(CpInfoTowerItem);
                towerItemCom.setClickCallBack(this._clickTowerCallBack);

                let fightid = Game.towerMgr.getFightTowerID(id);
                let battleValue = Game.towerMgr.getPower(fightid, Game.towerMgr.getStar(fightid));
                let btLv = Game.sceneNetMgr.calcTowerBattleLevel(battleValue, this._warDetails.nminpower);
                towerItemCom.setTowerMainId(id, btLv);

                //if (this._viewData.worldID > 1) {
                let towerInfo = Game.towerMgr.getTroopBaseInfo(fightid);
                if (towerInfo) towerItemCom.setTowerInfo(towerInfo, btLv);
                //} else {
                //towerItemCom.show();
                //}

                this.towerInfo.addChild(towerItem);
                this._towerItemComps.push(towerItemCom);
                count++;
            }
        }

        let maxWid = count * 90;
        let startX = -maxWid * 0.5 + 45;
        for (let i = 0; i < count; i++) {
            this.towerInfo.children[i].x = startX + (90) * i;
        }

        this.towerInfo.width = maxWid;

        if (this._viewData.state) {
            GameEvent.emit(EventEnum.SYSTEM_GUIDE_TRIGGER, SystemGuideTriggerType.GAME_FAIL_GUIDE_BATTLE_ARRAY);
        }
        else if (this._viewData.warID == 41) {
            GameEvent.emit(EventEnum.SYSTEM_GUIDE_TRIGGER, SystemGuideTriggerType.CHANGE_TOWER_TYPE);
        }
    }

    private refreshPanel() {
        this.cpInfo.active = this.iscpInfoSelected;
        this.taskInfo.active = !this.iscpInfoSelected;
        //改变标签状态
        this.switchInfo.spriteFrame = this.iscpInfoSelected ? this.txtCP : this.txtTask;
    }

    private loadMapRes() {
        let batchLoadRes: string[] = [EResPath.MAP_BG_BASE + this._curMapResObj.szbgpic,
        EResPath.MAP_CFG_BASE + this._warDetails.szsceneres];
        let resTypes: any[] = [null, null];
        if (!StringUtils.isNilOrEmpty(this._curMapResObj.szpathres)) {
            batchLoadRes.push(EResPath.MAP_PATHS + this._curMapResObj.szpathres);
            resTypes.push(cc.SpriteAtlas);
        }
        this._canEnter = false;
        this._batchLoad = Game.resMgr.batchLoadRes(batchLoadRes,
            resTypes,
            null,
            Handler.create(this.onLoadComplete, this));
    }

    private onLoadComplete(paths: string[]) {

        if (!this._curMapResObj) return;

        let obj = Game.resMgr.getRes(EResPath.MAP_BG_BASE + this._curMapResObj.szbgpic);
        this.mapImgBg.spriteFrame = new cc.SpriteFrame(obj);

        if (!StringUtils.isNilOrEmpty(this._curMapResObj.szpathres)) {
            let atlas = Game.resMgr.getRes(EResPath.MAP_PATHS + this._curMapResObj.szpathres);
            let mapCfg = Game.resMgr.getCfg(EResPath.MAP_CFG_BASE + this._warDetails.szsceneres);
            if (mapCfg) {
                this._canEnter = true;
                // Game.cpMgr.getMapCtrl().initAStar(mapCfg);
                // Game.cpMgr.getMapCtrl().createPath(mapCfg, this.pathNode, atlas, this.itemNode, this.gridImg, this._warDetails, this._curMapResObj.btpathtype, this._curMapResObj.szpathres);
            }
        }
    }

    private onDetails(data: GS_SceneSetWarDetails) {
        this._warDetails = data;

        if (data.uopenneedstrength == 0) {
            this.tiliStartNode.active = false;
            this.tvStartNode.active = true;
            this.tvNode.active = data.btjoinfv == 1 && !GlobalVal.closeAwardVideo;
            if (!this.tvNode.active) {
                this.startTxtNode.x = 0;
            }
        } else {
            this.tiliStartNode.active = true;
            this.tvStartNode.active = false;
            this.tili.string = "x" + data.uopenneedstrength;
        }
        if (data.btdifflv > 0) {
            this.mapDiffSp.node.active = true;
            this.mapDiffSp.spriteFrame = data.btdifflv == 1 ? this.diffSps[0] : this.diffSps[1];
        } else {
            this.mapDiffSp.node.active = false;
        }
        // this.startSp.spriteFrame = data.uopenneedstrength == 0 ? this.startFrame0 : this.startFrame1;
        BuryingPointMgr.post(Game.sceneNetMgr.isHideWar(this._warDetails.nwarid) ? EBuryingPoint.SHOW_HIDE_WAR_VIEW : EBuryingPoint.SHOW_WAR_INFO_VIEW);
        let isHard = Game.sceneNetMgr.isHardWar(data.nwarid);
        let bulletChatData = Game.bulletChatMgr.getWarBulletChat(data.nwarid);
        if (!isHard && bulletChatData.maxIndex != data.nlastbulletchatindexes) {
            Game.bulletChatMgr.reqGetWarBulletChat(data.nwarid);
            cc.log('---------------------请求关卡留言---->关卡id:', data.nwarid, '当前本地序列id', bulletChatData.maxIndex,
                '服务器最后的序列id:', data.nlastbulletchatindexes);
        }

        if (!isHard && data.btsetbulletchat == 1 && StringUtils.isNilOrEmpty(bulletChatData.selfChat)) {
            Game.bulletChatMgr.reqGetMyBulletChat(data.nwarid);
            cc.log('---------------------请求关卡自己的留言---->服务器有，本地清了缓存？', data.nwarid);
        }

        this.bulletChatBtn.active = (!isHard && data.btsetbulletchat == 0 && data.uscoreflag > 0) ? true : false;

        GameEvent.emit(EventEnum.PLAY_BULLET_CHAT, data.nwarid);

        this.checkShow();
    }

    private checkShow() {
        if (!this._isLoaded || !this._warDetails) return;
        this.checkNormalShowPanel();
    }

    protected afterHide() {
        // while (this.pathNode.childrenCount > 0) {
        //     let node: cc.Node = this.pathNode.children[0];
        //     Game.cpMgr.getMapCtrl().putPathNode(node);
        // }

        if (this._batchLoad && !this._batchLoad.isComplete) {
            this._batchLoad.stop();
            cc.log('this._batchLoad:', this._batchLoad.isComplete ? 'true' : 'false');
        }

        GameEvent.offReturn('get_cpinfo_btn', this.onGetNode, this);
    }

    private onTowerClick(node: cc.Node, id: number) {
        GlobalVal.mindSwitchTower = false;
        this.tipsNode.active = false;
        // cc.sys.localStorage.setItem("notmindSwitchTower", "1");
        if (!this._selectTowerNode) {
            this._selectTowerNode = cc.instantiate(this.selectTowerPrefab);
            this._selectTowerComp = this._selectTowerNode.getComponent(CpInfoSelectTowerView);

            this._selectTowerCallBack = new Handler(this.onSelectTower, this);
            this._hideCallBack = new Handler(this.onSelectTowerHide, this);
            this._selectTowerComp.setSelectTowerCallBack(this._selectTowerCallBack, this._hideCallBack);
            this.content.addChild(this._selectTowerNode);
        }
        if (node != this._selectTowerComp.towerNode) {
            this._selectTowerComp.setTowerInfos(node, Game.towerMgr.getTowerInfoListByType(id - 1), this._warDetails.nminpower);
        } else {
            this._selectTowerComp.onClick();
        }
    }

    private onSelectTowerHide(id: number) {

    }

    private onSelectTower(towerInfo: GS_TroopsInfo_TroopsInfoItem, battleLevel: number) {
        let len = this._towerItemComps.length;

        for (let i = 0; i < len; i++) {
            if (this._towerItemComps[i]._towerId == towerInfo.bttype) {
                this._towerItemComps[i].setTowerInfo(towerInfo, battleLevel);
                Game.towerMgr.requestActive(towerInfo.ntroopsid);
                break;
            }
        }
    }

    private onBulletChatClick() {
        UiManager.showDialog(EResPath.BULLET_CHAT_VIEW, this._viewData.warID);
    }

    private onMyChatRet(warid: number) {
        if (warid == this._viewData.warID) {
            if (this._warDetails) {
                this._warDetails.btsetbulletchat = 1;
            }
            this.bulletChatBtn.active = false;
        }
    }

    protected beforeHide() {
        GameEvent.emit(EventEnum.STOP_BULLET_CHAT);
    }

    private isLowerPower(): boolean {
        if (!this._warDetails) return false;
        let isLowerPower: boolean = false;
        let enbleTower = this._warDetails.btopenrolecards;
        for (let i = 0, len = enbleTower.length; i < len; i++) {
            let id: number = enbleTower[i] == 1 ? i + 1 : 0;
            if (id > 0 && id != 3 && id < 7) { //排除减速，打钱和超能系
                let fightid = Game.towerMgr.getFightTowerID(id);
                let battleValue = Game.towerMgr.getPower(fightid, Game.towerMgr.getStar(fightid));
                let battleLv = Game.sceneNetMgr.calcTowerBattleLevel(battleValue, this._warDetails.nminpower);
                if (battleLv > 0 && battleLv <= 2) {
                    isLowerPower = true;
                    break;
                }
            }
        }
        return isLowerPower;
    }



    private initMonster: boolean = false;
    private showMonster: boolean = false;
    private onShowMonsterOrTower() {
        this.showMonster = !this.showMonster;
        if (this.showMonster) {
            this.showMonsters();
        }

        this.monsterNode.active = this.showMonster;
        this.towerInfo.active = !this.showMonster;
        this.showTypeImg.spriteFrame = this.showMonster ? this.towerSf : this.monsterSf;
        this.cpDes.node.active = !this.showMonster;
    }

    private _notShowids: number[] = [221, 223, 225];
    private showMonsters() {
        if (!this._warDetails) return;
        if (!this.initMonster) {
            let nMonsterIDList: number[] = this._warDetails.nmonsteridlist;
            if (nMonsterIDList && nMonsterIDList.length > 0) {
                let len = nMonsterIDList.length;
                let count = 0;
                let node: cc.Node;
                let comp: UIModelComp;
                let imgLoader: ImageLoader;
                let parent: cc.Node = this.monsterItem.node.parent;
                let nodeList: cc.Node[] = [];
                for (let i = 0; i < len; i++) {
                    const element = nMonsterIDList[i];
                    if (element > 0) {
                        if (this._notShowids.indexOf(element) != -1) {
                            continue;
                        }
                        if (count == 0) {
                            nodeList[0] = this.monsterItem.node;
                        } else {
                            node = cc.instantiate(this.monsterItem.node);
                            parent.addChild(node);
                            nodeList[count] = node;
                        }
                        count++;
                    } else {
                        break;
                    }
                }

                for (let i = 0; i < count; i++) {
                    const element = nMonsterIDList[i];
                    if (element > 0 && this._notShowids.indexOf(element) == -1) {
                        node = nodeList[i];
                        comp = node.getComponent(UIModelComp);
                        imgLoader = node.getComponent(ImageLoader);
                        let monsterData = Game.monsterManualMgr.getMonsterCfg(element);
                        if (monsterData.nbookspicid > 0) {
                            imgLoader.setPicId(monsterData.nbookspicid);
                        } else {
                            comp.setBodyAnchorY(0);
                            comp.setBodyAnchorX(0);
                            node.scale = monsterData.uscale > 0 ? monsterData.uscale / 1000 : 1;
                            comp.setModelUrl(EResPath.CREATURE_MONSTER + monsterData.resName);
                        }
                    }
                }
            }
        }
        this.initMonster = true;
        this.monsterNode.active = true;
    }






}

