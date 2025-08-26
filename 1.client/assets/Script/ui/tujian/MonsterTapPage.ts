import { EResPath } from "../../common/EResPath";
import Game from "../../Game";

import { MathUtils } from "../../utils/MathUtils";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TapPageItem from "../dayInfoView/TapPageItem";
import TapView from "../dayInfoView/TapView";
import Navigation from "../guide/Navigation";
import MonsterLayoutBase from "./monsterLayout/MonsterLayoutBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MonsterTapPage extends TapPageItem {

    @property(cc.Node)
    layoutNode: cc.Node = null;

    @property(cc.Prefab)
    layoutPrefabs: cc.Prefab[] = [];

    @property(Navigation)
    nav: Navigation = null;

    _layoutsCache: object = {};

    _len: number = 0;

    _currIndex: number = 1;

    _init: boolean = false;
    private isInit: boolean = false;

    private preState: boolean = true;
    private nextState: boolean = true;

    @property(cc.Node)
    preNode: cc.Node = null;

    @property(cc.Node)
    nextNode: cc.Node = null;

    start() {
        this.refresh();
    }

    // onEnable() {
    //     GameEvent.on(EventEnum.TUJIAN_NEXT_PAGE, this.nextPage, this));
    //     GameEvent.on(EventEnum.TUJIAN_PRE_PAGE, this.prePage, this));
    //     // GameEvent.on(EventEnum.SHOW_MONSTER_INFO, this.showMonsterInfo, this));
    //     // GameEvent.on(EventEnum.ALL_CURR_MONSTER_LOCK, this.showMonsterInfo, this));
    // }

    // onDisable() {
    //     GameEvent.targetOffAll(this);
    // }

    refresh() {
        if (!this.isInit) {
            for (let k in this.data) {
                this._len++;
            }
            this._len = Math.min(this._len, this.layoutPrefabs.length);
            this._init = true;
            this.nav.init(this._len);
            this.isInit = true;
        }
        this.checkPreNextState();
        this.nav.selectIndex(this._currIndex - 1);
        this.layoutNode.removeAllChildren();
        if (this._layoutsCache[this._currIndex]) {
            let com: MonsterLayoutBase = this._layoutsCache[this._currIndex].getComponent(MonsterLayoutBase);
            this.layoutNode.addChild(com.node);
            com.setData(this.data[this._currIndex]);
            com.refresh();
        } else {
            let node = cc.instantiate(this.layoutPrefabs[this._currIndex - 1]);
            this.layoutNode.addChild(node);
            this._layoutsCache[this._currIndex] = node;
            let com = node.getComponent(MonsterLayoutBase);
            com.setData(this.data[this._currIndex]);
            com.refresh();
        }
    }

    prePage() {
        if (!this.preState) return;
        Game.soundMgr.playSound(EResPath.PAGE_SOUND);
        let lastIndex = this._currIndex;
        this._currIndex--;
        this._currIndex = MathUtils.clamp(this._currIndex, 1, this._len);
        if (lastIndex == this._currIndex) return;
        this.refresh();
    }

    nextPage() {
        if (!this.nextState) return;
        Game.soundMgr.playSound(EResPath.PAGE_SOUND);
        let lastIndex = this._currIndex;
        this._currIndex++;
        this._currIndex = MathUtils.clamp(this._currIndex, 1, this._len);
        if (lastIndex == this._currIndex) return;
        this.refresh();
    }

    checkPreNextState() {
        let preState: boolean = false, nextState: boolean = false;
        if (this._len == 1) {

        } else if (this._len != 1 && this._currIndex == 1) {
            nextState = true;
        } else if (this._len != 1 && this._currIndex == this._len) {
            preState = true;
        } else {
            preState = true;
            nextState = true;
        }
        this.preState = preState;
        this.nextState = nextState;
        // GameEvent.emit(EventEnum.TUJIAN_REFRESH_PRENEXT_STATE, preState, nextState);
        this.preNode.active = this.preState;
        this.nextNode.active = this.nextState;
    }

    onDestroy() {
        Object.values(this._layoutsCache).forEach(element => {
            element.isValid && element.destroy();
        });

    }
}
