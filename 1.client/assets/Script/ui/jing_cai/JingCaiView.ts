
import { BUY_COUNT_TYPE, GLOBAL_FUNC } from "../../common/AllEnum";
import { EResPath } from "../../common/EResPath";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GS_BountyConfig, GS_BountyData, GS_BountyData_TaskInfo } from "../../net/proto/DMSG_Plaza_Sub_Bounty";
import { ActorProp, BOUNTY_RERESH_MODE, SCOREFLAG } from "../../net/socket/handler/MessageEnum";
import { GameEvent } from "../../utils/GameEvent";
import { Handler } from "../../utils/Handler";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import AlertDialog from "../../utils/ui/AlertDialog";
import Dialog from "../../utils/ui/Dialog";
import List from "../../utils/ui/List";
import { UiManager } from "../../utils/UiMgr";
import GoodsItem, { GoodsItemData } from "../newhand_book/GoodsItem";
import JingCaiSelectTower, { JingCaiSelectTowerData } from "./JingCaiSelectTower";
import JingCaiTowerItem, { ICON_TYPE, TowerData, TypeData } from "./JingCaiTowerItem";
import JingCaiViewDesItem from "./JingCaiViewDesItem";
import { MapThumbnail } from "./MapThumbnail";

const { ccclass, property } = cc._decorator;

@ccclass
export default class JingCaiView extends Dialog {
    @property(cc.Node)
    stars: cc.Node[] = [];

    @property(cc.Node)
    bossState: cc.Node = null;

    @property(JingCaiViewDesItem)
    desItems: JingCaiViewDesItem[] = [];

    @property(List)
    list: List = null;

    @property(JingCaiTowerItem)
    towerItems: JingCaiTowerItem[] = [];

    @property(JingCaiSelectTower)
    selectTower: JingCaiSelectTower = null;

    @property(MapThumbnail)
    mapThumbnail: MapThumbnail = null;

    @property(cc.Node)
    mask: cc.Node = null;

    @property(cc.Node)
    refreshLabel: cc.Node = null;

    @property(GoodsItem)
    rewardItems: GoodsItem[] = [];

    @property(cc.Node)
    rewardGroup: cc.Node = null;

    @property(cc.Label)
    rewardCount: cc.Label = null;

    @property(cc.Node)
    yuekaGroup: cc.Node = null;

    @property(cc.Label)
    tili: cc.Label = null;

    @property(cc.Node)
    freeVideo: cc.Node = null;

    @property(cc.Node)
    diamondNode: cc.Node = null;

    @property(cc.Label)
    costDiamond: cc.Label = null;

    // private _currWarItem: GS_BountyData_BountyWarItem = null;
    private _currTowerItem: JingCaiTowerItem = null;
    // private _listItems: JingCaiListItem[] = [];

    private _bountyData: GS_BountyData = null;
    private _bountyCfg: GS_BountyConfig = null;

    private _maxChallengeCount: number = 0;
    private _chanllengeCount: number = 0;
    protected beforeShow() {
        this._bountyData = Game.bountyMgr.getBountData();
        this._bountyCfg = Game.bountyMgr.getBountyCfg();
        if (this._bountyData && this._bountyCfg) {
            this.refreshMapInfo();

            this.refreshBtnState();

            //选择炮塔
            if (this._bountyData.ntroopsid && this._bountyData.bttroopsgridstate) {
                this.towerItems.forEach((element, index) => {
                    element.setClickHandler(Handler.create(this.showSelectTowerInfo, this));
                    let power = Game.bountyMgr.getLevelPower(this._bountyData.btdifficulty);

                    let typeData: TypeData = {
                        towerid: this._bountyData.ntroopsid[index + 1],
                        gridId: this._bountyData.bttroopsgridstate[index + 1],
                        power: power,
                    }

                    let towerData: TowerData = {
                        towerid: this._bountyData.ntroopsid[index + 1],
                        power: power,
                    }

                    if (this._bountyData.bttroopsgridstate[index + 1]) {
                        if (this._bountyData.ntroopsid[index + 1]) {
                            element.setData(towerData, index);
                            element.setIconType(ICON_TYPE.COAST);
                        } else {
                            element.setData(typeData, index);
                            element.setIconType(ICON_TYPE.TYPE);
                        }
                    } else {
                        element.setData(typeData, index);
                        element.setIconType(ICON_TYPE.TYPE);
                    }
                    element.refresh();
                });
            }

            this.selectTower.setClickHandler(Handler.create(this.onSelectTower, this));
        }
    }

    protected afterShow() {

    }

    protected addEvent() {
        GameEvent.on(EventEnum.BOUNTY_OPEN_GRID, this.onOpenGrid, this);
        GameEvent.on(EventEnum.BOUNTY_SET_TROOPS, this.onSetTower, this);
        // GameEvent.on(EventEnum.PLAYER_PROP_CHANGE + ActorProp.ACTOR_PROP_DIAMONDS, this.refreshDiamond, this);
        GameEvent.on(EventEnum.BOUNTY_REF_MAP_RET, this.onMapRefresh, this);
        GameEvent.on(EventEnum.BOUNTY_REPLACEWAR, this.onReplaceWar, this);
        GameEvent.on(EventEnum.BOUNTY_REFRESH_POWER, this.onRefreshPower, this);
        GameEvent.on(EventEnum.PLAYER_PROP_CHANGE + ActorProp.ACTOR_PROP_VIPLEVEL, this.refreshChallengeNum, this);
        GameEvent.on(EventEnum.BOUNTY_REF_DAYCOUNT, this.refreshDayCount, this);
        GameEvent.on(EventEnum.BOUNTY_SHOW_FIGHT_TOWER_TIPS, this.showFightTowerTips, this);
    }

    private refreshMapInfo() {
        // this._bountyData = Game.bountyMgr.getBountData();
        // this._bountyCfg = Game.bountyMgr.getBountyCfg();
        if (!this._bountyData || !this._bountyCfg) return;

        this.tili.string = "x" + this._bountyCfg.nstrength.toString();

        //地图
        this.mapThumbnail.init(this._bountyData);

        //奖励
        //任务一
        let task: GS_BountyData_TaskInfo;
        task = this._bountyData.task && this._bountyData.task[0];
        let data: GoodsItemData = {
            goodsId: task ? task.nrewardgoodsid : 0,
            nums: task ? task.nrewardgoodsnums : 0,
            gray: !!(SCOREFLAG.SCOREFLAG_TASK1 & this._bountyData.btscoreflag),
            prefix: "x"
        };

        this.rewardItems[0].setData(data, 0);
        this.desItems[0].setData(task);
        this.desItems[0].refresh();
        //任务二
        task = this._bountyData.task && this._bountyData.task[1];
        data = {
            goodsId: task ? task.nrewardgoodsid : 0,
            nums: task ? task.nrewardgoodsnums : 0,
            gray: !!(SCOREFLAG.SCOREFLAG_TASK2 & this._bountyData.btscoreflag),
            prefix: "x"
        };

        this.rewardItems[1].setData(data, 1);
        this.desItems[1].setData(task);
        this.desItems[1].refresh();
        //任务三
        task = this._bountyData.task && this._bountyData.task[2];
        data = {
            goodsId: task ? task.nrewardgoodsid : 0,
            nums: task ? task.nrewardgoodsnums : 0,
            gray: !!(SCOREFLAG.SCOREFLAG_TASK3 & this._bountyData.btscoreflag),
            prefix: "x"
        };

        this.rewardItems[2].setData(data, 2);
        this.desItems[2].setData(task);
        this.desItems[2].refresh();
        //无伤
        data = {
            goodsId: this._bountyData.nfullrewardgoodsid,
            nums: this._bountyData.nfullrewardgoodsnum,
            gray: !!(SCOREFLAG.SCOREFLAG_GRADE3 & this._bountyData.btscoreflag),
            prefix: "x"
        };

        this.rewardItems[3].setData(data, 3);

        //全清
        data = {
            goodsId: this._bountyData.nclearrewardgoodsid,
            nums: this._bountyData.nclearrewardgoodsnum,
            gray: !!(SCOREFLAG.SCOREFLAG_CLEARTHING & this._bountyData.btscoreflag),
            prefix: "x"
        };

        this.rewardItems[4].setData(data, 4);

        //三星
        data = {
            goodsId: this._bountyData.nstart3rewardgoodsid,
            nums: this._bountyData.nstart3rewardgoodsnum,
            gray: !!(SCOREFLAG.SCOREFLAG_ALLTASK & this._bountyData.btscoreflag),
            prefix: "x"
        };

        this.rewardItems[5].setData(data, 5);

        //难度
        this.setCpLevel(this._bountyData.btdifficulty);
    }

    /**
     * 刷新按钮状态
     */
    private refreshBtnState() {
        if (!this._bountyData) return;
        // this.rewardCount.string = this._bountyData.ndayrewardcount.toString();
        this.refreshChallengeNum();
        // this.rewardCount.string = this._chanllengeCount.toString();

        this.rewardGroup.active = this._chanllengeCount > 0;

        this.yuekaGroup.active = !this.rewardGroup.active && Game.globalFunc.isFuncOpened(GLOBAL_FUNC.VIP);

        if (this._bountyCfg) {
            this.diamondNode.active = this._bountyCfg.btrefmode === BOUNTY_RERESH_MODE.DIAMOND;
            this.costDiamond.string = "x" + this._bountyCfg.urefneeddiamonds;
            this.freeVideo.active = !this.diamondNode.active;
        }
    }

    private refreshDayCount() {
        this.refreshBtnState();
    }

    private onRefreshPower() {
        //选择炮塔
        if (this._bountyData.ntroopsid && this._bountyData.bttroopsgridstate) {
            this.towerItems.forEach((element, index) => {
                element.setClickHandler(Handler.create(this.showSelectTowerInfo, this));
                let power = Game.bountyMgr.getLevelPower(this._bountyData.btdifficulty);

                let towerData: TowerData = {
                    towerid: this._bountyData.ntroopsid[index + 1],
                    power: power,
                }

                if (this._bountyData.bttroopsgridstate[index + 1]) {
                    if (this._bountyData.ntroopsid[index + 1]) {
                        element.setData(towerData, index);
                        element.setIconType(ICON_TYPE.COAST);
                    }
                }
                element.refresh();
            });
        }

    }

    private onReplaceWar() {
        // this.list.array = this._bountyData.data1;
        this.list.refresh();
    }

    private onOpenGrid(type: number) {
        this.towerItems[type - 1].setGray(false);

        //选中第一个炮塔
        /*
        let towerCfgs = Game.towerMgr.getTowerInfoListByType(type - 1);
        if (towerCfgs) {
            Game.bountyMgr.reqSetTroops(type, towerCfgs[0].ntroopsid);
        }
        */
    }

    private onSetTower(type: number, towerid: number) {
        this.towerItems[type - 1].setIconType(ICON_TYPE.COAST);

        let power = Game.bountyMgr.getLevelPower(this._bountyData.btdifficulty);

        let towerData: TowerData = {
            towerid: towerid,
            power: power,
        }
        this.towerItems[type - 1].setData(towerData, type - 1);

        this.towerItems[type - 1].refresh();
    }

    private onMapRefresh() {
        this.refreshMapInfo();

        this.refreshBtnState();
    }

    private refreshChallengeNum() {
        let vipInfo = Game.actorMgr.getVipInfo();
        let vipLv = Game.actorMgr.getProp(ActorProp.ACTOR_PROP_VIPLEVEL);
        this._maxChallengeCount = 0;
        if (vipInfo && vipInfo.data) {
            this._maxChallengeCount = vipInfo.data[vipLv].ndaybountycount;
        }
        let bountyData = Game.bountyMgr.getBountData();
        if (bountyData) {
            this._maxChallengeCount -= bountyData.ndayrewardcount;
        }
        this._chanllengeCount = Math.max(this._maxChallengeCount, 0);
        this.rewardCount.string = this._chanllengeCount.toString();
    }

    private showFightTowerTips() {
        let info = '选择并激活您最强的猫咪，至少3只';
        let item = this.towerItems[this._curMaxPowerType - 1];
        if (item) {
            UiManager.showDialog(EResPath.ANY_TIPS_VIEW, { title: '', info: info, node: item.node });
        }
    }

    private showSelectTowerInfo(item: JingCaiTowerItem) {
        this._currTowerItem = item;
        this.mask.active = true;
        this.selectTower.node.active = true;

        let worldPos = item.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        let localPos = this.selectTower.node.parent.convertToNodeSpaceAR(worldPos);

        this.selectTower.node.x = localPos.x;

        this.selectTower.show(true);

        let power = Game.bountyMgr.getLevelPower(this._bountyData.btdifficulty);

        let activeCount = 0;
        for (let i = 1, len = this._bountyData.bttroopsgridstate.length; i < len; i++) {
            if (this._bountyData.bttroopsgridstate[i]) {
                activeCount++;
            }
        }

        let data: JingCaiSelectTowerData = {
            type: item.index,
            power: power,
            coast: this._bountyCfg.uactiveneeddiamonds[activeCount + 1] || 0,
            active: !!this._bountyData.bttroopsgridstate[item.index + 1],
            item: item
        };

        this.selectTower.setData(data);
        this.selectTower.refresh();
    }

    private onSelectTower(item: JingCaiTowerItem) {
        let towerCfg = Game.towerMgr.getTroopBaseInfo(item.data.towerid);
        if (towerCfg) {
            Game.bountyMgr.reqSetTroops(towerCfg.bttype, towerCfg.ntroopsid);
        }
    }

    private setCpLevel(lv: number) {
        this.stars.forEach((el, index) => {
            el.active = index + 1 <= lv;
        });
    }

    /**
     * 增加挑战次数
     */
    private clickAddChallengeNum() {
        UiManager.showDialog(EResPath.BOUNTY_BUY_COUNT_VIEW, BUY_COUNT_TYPE.BOUNTRY);
    }

    private _curMaxPowerType: number = 0;
    /**
     * 挑战本关
     */
    private clickStart() {
        let tiliCount = Game.actorMgr.getStrength();
        if (tiliCount <= 0) {
            SystemTipsMgr.instance.notice("体力不足");
        } else if (this._chanllengeCount <= 0) {
            SystemTipsMgr.instance.notice("今日领取次数已用完，请明日再来");
        }
        else {
            if (this._bountyData) {
                let openStates = this._bountyData.bttroopsgridstate;
                let len = openStates.length;
                let count = 0;
                for (let i = 0; i < len; i++) {
                    if (openStates[i] == 1) {
                        count++;
                    }
                }

                if (count < 3) {
                    this._curMaxPowerType = 0;
                    let dc = 3 - count;
                    let powers: number[] = Game.towerMgr.getAllStrongestTowerPower();
                    let powerObjs: any[] = [];
                    for (let i = 0; i < powers.length; i++) {
                        powerObjs.push({ type: i + 1, power: powers[i] });
                    }

                    powerObjs.sort((a: any, b: any) => {
                        return b.power - a.power;
                    });

                    let tipDatas: any[] = [];
                    for (let i = 0; i < powerObjs.length; i++) {
                        let obj = powerObjs[i];
                        if (!openStates[obj.type]) {
                            if (this._curMaxPowerType == 0) {
                                this._curMaxPowerType = obj.type;
                            }
                            tipDatas.push({ towerid: Game.towerMgr.getStrongestTowerid(obj.type), type: obj.type });

                            if (tipDatas.length == dc) {
                                break;
                            }
                        }
                    }

                    UiManager.showDialog(EResPath.BOUNTY_FIGHT_TOWER_TIPS, { tipDatas: tipDatas, warid: this._bountyData.nwarid });
                    return;
                }

                if (Game.bountyMgr.hasUnreceiveReward()) {
                    return AlertDialog.showAlert("重新挑战，会重置之前的关卡奖励", Handler.create(this.onStartConfirm, this));
                }

                Game.bountyMgr.reqEnterWar(this._bountyData.nwarid);
            }
        }
    }

    private onStartConfirm() {
        Game.bountyMgr.reqEnterWar(this._bountyData.nwarid);
    }

    private clickExit() {
        this.hide();
    }


    private clickYueKa() {
        UiManager.showDialog(EResPath.VIP_VIEW);
    }

    private clickReward() {
        if (!this._bountyData) return;
        if (Game.bountyMgr.hasUnreceiveReward()) {
            if (this._chanllengeCount <= 0) {
                SystemTipsMgr.instance.notice("领取次数不足");
            } else {
                Game.bountyMgr.getReward(this._bountyData.nwarid);
            }
        } else {
            SystemTipsMgr.instance.notice("没有奖励可以领取");
        }
    }

    protected afterHide() {
        this.mapThumbnail.stop();
    }

    private showJingCaiTips() {
        UiManager.showDialog(EResPath.JING_CAI_TIPS_VIEW);
    }

    private clickRefresh() {
        if (!this._bountyData || !this._bountyCfg) return;
        if (Game.bountyMgr.isAllRewardCanrecive()) {
            SystemTipsMgr.instance.notice("请领取奖励后重试");
        } else if (Game.bountyMgr.hasUnreceiveReward()) {
            AlertDialog.showAlert("刷新后，未领取关卡奖励将会重置", Handler.create(this.onConfirm, this));
        } else {
            this.onConfirm();
        }
    }

    private onConfirm() {
        if (this._bountyCfg.btrefmode === BOUNTY_RERESH_MODE.DIAMOND) {
            if (Game.actorMgr.getProp(ActorProp.ACTOR_PROP_DIAMONDS) >= this._bountyCfg.urefneeddiamonds) {
                Game.bountyMgr.reqRefMap();
            } else {
                SystemTipsMgr.instance.notice("钻石不足");
            }
        } else {
            Game.bountyMgr.reqRefMap();
        }
    }
}
