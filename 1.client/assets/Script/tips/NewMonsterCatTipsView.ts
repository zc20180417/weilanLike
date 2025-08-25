// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EResPath } from "../common/EResPath";
import { EventEnum } from "../common/EventEnum";
import SysMgr from "../common/SysMgr";
import Game from "../Game";
import { SHAPE, SHAPE_COLOR } from "../ui/tujian/MonsterDetailView";
import { UIModelComp } from "../ui/UIModelComp";
import { GameEvent } from "../utils/GameEvent";
import Dialog from "../utils/ui/Dialog";
import ImageLoader from "../utils/ui/ImageLoader";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewMonsterCatTipsView extends Dialog {
    @property(cc.Label)
    title: cc.Label = null;

    @property(cc.Label)
    targetName: cc.Label = null;

    @property(cc.Node)
    catNode: cc.Node = null;

    @property(ImageLoader)
    catIcon: ImageLoader = null;

    @property(cc.Label)
    catStory: cc.Label = null;

    @property(cc.Label)
    catAttackDes: cc.Label = null;

    @property(cc.ProgressBar)
    catProgressBars: cc.ProgressBar[] = [];

    @property(cc.Node)
    monsterNode: cc.Node = null;

    @property(ImageLoader)
    monsterIcon: ImageLoader = null;

    @property(cc.Label)
    monsterStory: cc.Label = null;

    @property(cc.Label)
    monsterSkillDes: cc.Label = null;

    @property(cc.ProgressBar)
    monsterProgressBars: cc.ProgressBar[] = [];

    @property(cc.Label)
    sizeDes: cc.Label = null;

    @property(UIModelComp)
    uiModel: UIModelComp = null;

    private _data: any;
    setData(tipsConfig: any) {
        this._data = tipsConfig;

        this._data.tipsType ? this.refreshCatInfo() : this.refreshMonsterInfo();
    }

    protected addEvent(): void {
        GameEvent.on(EventEnum.SHOW_MONSTER_INFO, this.refreshMonsterInfo, this);
    }

    private refreshCatInfo() {
        this.monsterNode.active = false;
        this.catNode.active = true;

        let towerCfg = Game.towerMgr.getTroopBaseInfo(this._data.targetId);
        if (towerCfg) {
            this.catIcon.url = EResPath.TOWER_IMG + towerCfg.sz3dpicres;

            this.targetName.string = towerCfg.szname;

            this.title.string = this._data.notNew ? '' : "新猫咪";
            //背景
            this.catStory.string = towerCfg.szdes2;
            //攻击方式
            this.catAttackDes.string = towerCfg.szdes1;

            //属性
            this.catProgressBars[0].progress = towerCfg.btattackhurt / 10;
            this.catProgressBars[1].progress = towerCfg.btattackdist / 10;
            this.catProgressBars[2].progress = towerCfg.btattackspeed / 10;
            this.catProgressBars[3].progress = towerCfg.btctr / 10;
        }
    }

    private refreshMonsterInfo() {
        this.monsterNode.active = true;
        this.catNode.active = false;
        let monsterInfo = Game.monsterManualMgr.getMonsterInfo(this._data.targetId);
        let name, des, skillDes, shapeColor, shape, progressHp, progressSpeed, dia, headId, state;
        let monsterCfg = Game.monsterManualMgr.getMonsterCfg(this._data.targetId);
        let monsterPrivateData = Game.monsterManualMgr.getMonsterPrivateData(this._data.targetId);
        if (monsterInfo) {
            name = monsterCfg.szname;
            des = monsterInfo.szbooksdes;
            skillDes = monsterInfo.szbooksskilldes;
            shapeColor = cc.color(SHAPE_COLOR[monsterCfg.bttype]);
            shape = SHAPE[monsterCfg.bttype];
            progressHp = monsterInfo.btbookshpscore / 10;
            progressSpeed = monsterInfo.btbooksspeedscore / 10;
            dia = monsterCfg.nopenrewarddiamonds;
            headId = monsterCfg.nopenrewardfaceid;
            state = monsterPrivateData && monsterPrivateData.btstate;
        } else {
            name = "??";
            des = "????";
            skillDes = "????";
            shapeColor = cc.Color.BLACK.fromHEX("#B25A43");
            shape = "??";
            progressHp = 0.5;
            progressSpeed = 0.5;
            headId = null;
            state = null;
        }
        //名称
        this.title.string = "新怪物";
        this.targetName.string = name;
        //描述
        this.monsterStory.string = des;
        //技能描述
        this.monsterSkillDes.string = skillDes;
        //体型
        this.sizeDes.node.color = shapeColor;
        this.sizeDes.string = shape;
        //血量
        this.monsterProgressBars[0].progress = progressHp;
        //速度
        this.monsterProgressBars[1].progress = progressSpeed;

        //头像
        if (monsterCfg) {
            if (monsterCfg.nbookspicid > 0) {
                this.monsterIcon.setPicId(monsterCfg.nbookspicid);
            } else {
                this.uiModel && this.uiModel.setModelUrl(EResPath.CREATURE_MONSTER + monsterCfg.resName);
            }
        }
        this.monsterIcon.node.scaleX = this._data.monsterScaleX;
        this.monsterIcon.node.scaleY = this._data.monsterScaleY;
    }

    public show(): void {
        super.show();
        // if (!Game.curNetGameCtrl) {
        //     SysMgr.instance.pauseGame(this, true);
        // }
    }

    protected onHideAniEnd(): void {
        super.onHideAniEnd();
        // if (!Game.curNetGameCtrl) {
        //     SysMgr.instance.pauseGame(this, false);
        // }
    }
}
