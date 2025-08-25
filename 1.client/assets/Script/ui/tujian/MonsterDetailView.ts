// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GS_MonsterManualSetDetails, GS_MonsterManualUpDate } from "../../net/proto/DMSG_Plaza_Sub_MonsterManual";
import { MONSTER_STATE } from "../../net/socket/handler/MessageEnum";
import { GameEvent } from "../../utils/GameEvent";
import AnyDialog, { AnyDialogData } from "../../utils/ui/AnyDialog";
import { HeadComp, HeadInfo } from "../headPortrait/HeadComp";
import MonsterLayoutItem from "./monsterLayout/MonsterLayoutItem";

const { ccclass, property } = cc._decorator;
export const SHAPE_COLOR = {
    "0": "#009c23",
    "1": "#9a149e",
    "2": "#ff8258"
}

export const SHAPE = {
    "0": "小型",
    "1": "大型",
    "2": "巨型"
}

export interface MonsterDetailViewData extends AnyDialogData {
    targetButton: cc.Button;
    targetNode: cc.Node;
    item: MonsterLayoutItem;
    data: any;
}

@ccclass
export default class MonsterDetailView extends AnyDialog {

    @property(cc.Label)
    title: cc.Label = null;

    @property(cc.Label)
    des: cc.Label = null;

    @property(cc.ProgressBar)
    progressHp: cc.ProgressBar = null;

    @property(cc.ProgressBar)
    progressSpeed: cc.ProgressBar = null;

    @property(cc.Label)
    shapeLabel: cc.Label = null;

    @property(cc.Label)
    skillDes: cc.Label = null;

    @property(cc.Node)
    other: cc.Node = null;

    @property(cc.Label)
    diaLabel: cc.Label = null;

    // @property(cc.Sprite)
    // headIcon: cc.Sprite = null;

    @property(cc.SpriteAtlas)
    headAtlas: cc.SpriteAtlas = null;

    @property(cc.Node)
    rewardBtnNode: cc.Node = null;

    @property(cc.Node)
    stateNode: cc.Node = null;

    @property(HeadComp)
    headIcon: HeadComp = null;

    _data: MonsterDetailViewData = null;

    _oldParent: cc.Node = null;

    public setData(data: MonsterDetailViewData) {
        super.setData(data);
        this._data = data;
        this.coverBtn();
        let monsterInfo = Game.monsterManualMgr.getMonsterInfo(data.data);
        if (monsterInfo) {
            this.showMonsterInfo(monsterInfo);
        } else {
            GameEvent.on(EventEnum.SHOW_MONSTER_INFO, this.showMonsterInfo, this);
        }
    }

    addEvent() {
        GameEvent.on(EventEnum.ON_MONSTER_UPDATE, this.onMonsterUpdate, this);
    }

    protected beforeHide() {
        this.removeCoverBtn();
    }

    /**
     * 用一个按钮覆盖怪物按钮
     */
    private coverBtn() {
        let worldPos = this._data.targetNode.convertToWorldSpaceAR(cc.Vec2.ZERO);
        let localPos = this.other.convertToNodeSpaceAR(worldPos);
        this._oldParent = this._data.targetNode.parent;
        this._data.targetNode.removeFromParent(false);
        this.other.addChild(this._data.targetNode);
        this._data.targetNode.setPosition(localPos);
        this._data.targetButton.interactable = false;
    }

    /**
     * 还原被覆盖的怪物按钮
     */
    private removeCoverBtn() {
        let worldPos = this._data.targetNode.convertToWorldSpaceAR(cc.Vec2.ZERO);
        //关闭图鉴面板时同时点击了怪物详情面板，此时_oldParent已被销毁
        if (!this._oldParent.isValid) {
            this._data.targetNode.destroy();
            return;
        }
        let localPos = this._oldParent.convertToNodeSpaceAR(worldPos);
        this._data.targetNode.removeFromParent(false);
        this._oldParent.addChild(this._data.targetNode);
        this._data.targetNode.setPosition(localPos);
        this._data.targetButton.interactable = true;
        this._data.item.unSelect();
    }

    showMonsterInfo(data: GS_MonsterManualSetDetails) {
        let title, des, skillDes, shapeColor, shape, progressHp, progressSpeed, dia, headId, state;
        if (data) {
            let monsterCfg = Game.monsterManualMgr.getMonsterCfg(data.nmonsterid);
            let monsterPrivateData = Game.monsterManualMgr.getMonsterPrivateData(data.nmonsterid);
            title = monsterCfg.szname;
            des = data.szbooksdes;
            skillDes = data.szbooksskilldes;
            shapeColor = cc.color(SHAPE_COLOR[monsterCfg.bttype]);
            shape = SHAPE[monsterCfg.bttype];
            progressHp = data.btbookshpscore / 10;
            progressSpeed = data.btbooksspeedscore / 10;
            dia = monsterCfg.nopenrewarddiamonds;
            headId = monsterCfg.nopenrewardfaceid;
            state = monsterPrivateData && monsterPrivateData.btstate;

        } else {
            title = "怪物名称";
            des = "????";
            skillDes = "????";
            shapeColor = cc.Color.BLACK.fromHEX("#B25A43");
            shape = "??";
            progressHp = 0.5;
            progressSpeed = 0.5;
            dia = "00";
            headId = null;
            state = null;
        }
        //名称
        this.title.string = title;
        //描述
        this.des.string = des;
        //技能描述
        this.skillDes.string = skillDes;
        //体型
        this.shapeLabel.node.color = shapeColor;
        this.shapeLabel.string = shape;
        //血量
        this.progressHp.progress = progressHp;
        //速度
        this.progressSpeed.progress = progressSpeed;

        //钻石
        this.diaLabel.string = "x" + dia;
        //头像
        if (headId !== null && headId != 0) {
            this.headIcon.node.active = true;
            // let lconMane = 'tower_' + headId;
            // this.headIcon.spriteFrame = this.headAtlas.getSpriteFrame(lconMane);
            this.headIcon.isSelf = false;
            this.headIcon.isTujianReward = true;
            //头像		
            let headInfo: HeadInfo = {
                nfaceframeid: 0,
                nfaceid: headId,
                szmd5facefile: ""
            };
            this.headIcon.headInfo = headInfo;
            // this.headIcon.showOther();
        } else {
            this.headIcon.node.active = false;
        }

        if (state === null) {
            this.rewardBtnNode.active = false;
            this.stateNode.active = false;
        } else {

            this.refreshRewardState(state == MONSTER_STATE.UNGETED || state === undefined);
        }
    }

    private refreshRewardState(state: boolean) {
        this.rewardBtnNode.active = state;
        this.stateNode.active = !state;
    }

    private onMonsterUpdate(monsterData: GS_MonsterManualUpDate) {
        if (monsterData.nmonsterid != this._data.data) return;
        switch (monsterData.btstate) {
            case MONSTER_STATE.GETED:
                this.refreshRewardState(false);
                break;
        }
    }

    private getReward() {
        // this.hide();
        Game.monsterManualMgr.getReward(this._data.data);

    }
}
