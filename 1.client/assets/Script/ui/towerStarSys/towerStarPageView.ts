// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
import RecyclePageView from "./RecyclePageView";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GameEvent } from "../../utils/GameEvent";


@ccclass
export default class TowerStarPageView extends RecyclePageView {


    onEnable() {
        super.onEnable();
        GameEvent.on(EventEnum.UP_STAR_SUCC, this.onUpStarSucc, this);
        GameEvent.on(EventEnum.ACTIVATE_TOWER, this.onActivateTower, this);
    }

    onDisable() {
        GameEvent.targetOff(this);
    }

    onUpStarSucc() {
        this.refreshPage(this.findPageByRealIndex(this._currRealPageIndex), this._currRealPageIndex);
    }

    start() {
        this.init();
    }

    init() {
        super.init({
            pageDatas: Game.towerMgr.getTowerStarPageData(),
            navDatas: Game.towerMgr.getTowerTypeArr(),
        });
    }

    onActivateTower() {
        this.refreshPage(this.findPageByRealIndex(this._currRealPageIndex), this._currRealPageIndex);
    }

    refreshPage(page, index) {
        let pageItemCom = page.getComponent("towerStarPageItem");
        pageItemCom.setData(this._pageDatas[index]);
        pageItemCom.refresh();
    }

}
