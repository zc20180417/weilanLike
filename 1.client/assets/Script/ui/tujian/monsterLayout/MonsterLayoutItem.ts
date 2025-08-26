import { EResPath } from "../../../common/EResPath";
import Game from "../../../Game";
import { EVENT_REDPOINT } from "../../../redPoint/RedPointSys";
import { GameEvent } from "../../../utils/GameEvent";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseItem from "../../../utils/ui/BaseItem";
import ImageLoader from "../../../utils/ui/ImageLoader";
import { NodeUtils } from "../../../utils/ui/NodeUtils";
import { UiManager } from "../../../utils/UiMgr";
import { TIPS_TYPE } from "../../AnyTipsView";
import { UIModelComp } from "../../UIModelComp";
import { MonsterDetailViewData } from "../MonsterDetailView";
import MonsterLayoutBase from "./MonsterLayoutBase";

const { ccclass, property } = cc._decorator;

const TIPS_LOCK = "图鉴未收集";

@ccclass
export default class MonsterLayoutItem extends BaseItem {
    @property(cc.Node)
    stick: cc.Node = null;

    @property(ImageLoader)
    icon: ImageLoader = null;

    @property(UIModelComp)
    uiModel: UIModelComp = null;

    @property(cc.Button)
    btn: cc.Button = null;

    @property(cc.Node)
    bg: cc.Node = null;

    _target: MonsterLayoutBase = null;

    _isUnlock: boolean = false;

    _originPos: cc.Vec2 = null;

    _originColor: cc.Color = null;//原始颜色

    _registedRedPoint: boolean = false;//是否注册了红点

    setTarget(target: MonsterLayoutBase) {
        this._target = target;
    }

    refresh() {
        if (!this._originPos) {
            this._originPos = cc.v2(this.stick.x, this.stick.y);
        }

        if (!this._originColor) {
            this._originColor = this.bg.color;
        }

        if (!this.data) {
            this.btn.interactable = false;
        } else {
            this._isUnlock = Game.monsterManualMgr.isMonsterUnlock(this.data.nmonsterid);
            //图标
            if (this.data.nbookspicid > 0) {
                this.icon.setPicId(this.data.nbookspicid);
            } else {
                this.uiModel.setModelUrl(EResPath.CREATURE_MONSTER + this.data.szres);
            }

            this.refreshUnlockState(this._isUnlock);
        }
        this.unSelect();

        //注册红点
        if (!this._registedRedPoint) {
            this._registedRedPoint = true;
            Game.redPointSys.registerRedPoint(EVENT_REDPOINT.TUJIAN_GUAIWU + "-" + this.data.nmonsterid, this.node);
        }
    }

    /**
     * 刷新解锁状态
     * @param isUnlock 
     */
    refreshUnlockState(isUnlock: boolean) {
        if (isUnlock) {//解锁
            this.icon.node.color = cc.Color.WHITE;
            this.uiModel.setDragonColor(cc.Color.WHITE);
            this.bg.color = this._originColor;
            NodeUtils.setNodeGray(this.bg, false);
        } else {//未解锁
            this.icon.node.color = cc.Color.BLACK;
            this.uiModel.setDragonColor(cc.Color.BLACK);
            NodeUtils.setNodeGray(this.bg, true);
        }
    }

    onSelect() {
        this.stick.active = true;
        this.stick.scale = 1.6;
        this.stick.x = this._originPos.x + 50;
        this.stick.y = this._originPos.y + 50;
        cc.tween(this.stick).to(0.1, { position: this._originPos, scale: 1 }).start();
    }

    unSelect() {
        this.stick.active = false;
        cc.Tween.stopAllByTarget(this.stick);
    }

    public onClick() {
        if (!this._isUnlock) {
            //提示 
            let killNum = Game.monsterManualMgr.getMonsterKillNum(this.data.nmonsterid);
            let name = this.data.szname;
            let data = {
                title: "",
                info: "打败" + this.data.nopenkillcount + "只“" + name + "”解锁",
                node: this.node,
                type: TIPS_TYPE.MONSTER_LOCK,
                progress: "解锁进度：" + killNum + "/" + this.data.nopenkillcount,
            };
            UiManager.showDialog(EResPath.ANY_TIPS_VIEW, data);
            return;
        }
        //显示信息
        let monsterDetailInfo: MonsterDetailViewData = {
            targetButton: this.btn,
            targetNode: this.node,
            targetBoundingBox: this.btn.node.getBoundingBoxToWorld(),
            item: this,
            data: this.data.nmonsterid,
        }
        UiManager.showDialog(EResPath.MONSTER_DETAIL_VIEW, monsterDetailInfo);
        this._target.onSelectItem(this.index);
    }

    onDestroy() {
        GameEvent.targetOffAll(this);
        //取消红点
        if (this._registedRedPoint) {
            Game.redPointSys.unregisterRedPoint(EVENT_REDPOINT.TUJIAN_GUAIWU + "-" + this.data.nmonsterid, this.node);
        }
    }
}
