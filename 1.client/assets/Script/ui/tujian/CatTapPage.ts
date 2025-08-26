import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import GlobalVal from "../../GlobalVal";
import { GameEvent } from "../../utils/GameEvent";
import TapPageItem from "../dayInfoView/TapPageItem";
import TapView, { TapViewData } from "../dayInfoView/TapView";
import Navigation from "../guide/Navigation";
import CatInfo from "./CatInfo";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CatTapPage extends TapPageItem {
    @property(TapView)
    catTabView: TapView = null;

    @property(Navigation)
    nav: Navigation = null;

    @property(CatInfo)
    catInfo: CatInfo = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    preNode: cc.Node = null;

    @property(cc.Node)
    nextNode: cc.Node = null;

    private initTowerId: number = null;
    private isSkin:boolean = false;

    onLoad(): void {
        this.catTabView.node.on(TapView.EventType.ON_SELECT_TAB, this.onSelectTab, this);
        this.catTabView.node.on(TapView.EventType.ON_SELECT_FIRST, this.onSelectFirst, this);
        this.catTabView.node.on(TapView.EventType.ON_SELECT_LAST, this.onSelectLast, this);
        GameEvent.on(EventEnum.SHOW_CAT_INFO, this.onShowCatInfo, this);
        GameEvent.on(EventEnum.HIDE_CAT_INFO, this.onHideCatInfo, this);
    }

    // protected onEnable(): void {
    //     GameEvent.on(EventEnum.TUJIAN_NEXT_PAGE, this.clickNext, this));
    //     GameEvent.on(EventEnum.TUJIAN_PRE_PAGE, this.clickPre, this));
    // }

    // protected onDisable(): void {
    //     GameEvent.off(EventEnum.TUJIAN_NEXT_PAGE, this.clickNext, this));
    //     GameEvent.off(EventEnum.TUJIAN_PRE_PAGE, this.clickPre, this));
    // }

    protected onDestroy(): void {
        // this.catTabView.node.on(TapView.EventType.ON_SELECT_TAB, this.nav.selectIndex, this.nav);
        // this.catTabView.node.off(TapView.EventType.ON_SELECT_FIRST, this.onSelectFirst, this);
        // this.catTabView.node.off(TapView.EventType.ON_SELECT_LAST, this.onSelectLast, this);
        GameEvent.targetOff(this);
    }

    onSelectFirst() {
        this.preNode.active = false;
        // GameEvent.emit(EventEnum.TUJIAN_REFRESH_PRENEXT_STATE, false, true);
    }

    onSelectLast() {
        this.nextNode.active = false;
        // GameEvent.emit(EventEnum.TUJIAN_REFRESH_PRENEXT_STATE, true, false);
    }

    onSelectTab(index: number) {
        this.nav.selectIndex(index);
        GameEvent.emit(EventEnum.ON_SELECT_CAT_BAB, index);

        if (this.initTowerId) {
            this.onShowCatInfo(this.initTowerId);
            this.initTowerId = null;
            this.isSkin = false;
        }
    }

    clickPre() {
        !this.nextNode.active && (this.nextNode.active = true);
        // GameEvent.emit(EventEnum.TUJIAN_REFRESH_PRENEXT_STATE, true, true);
        this.catTabView.selectPreTap();
    }

    clickNext() {
        !this.preNode.active && (this.preNode.active = true);
        // GameEvent.emit(EventEnum.TUJIAN_REFRESH_PRENEXT_STATE, true, true);
        this.catTabView.selectNextTap();
    }

    public init(...args): void {
        let datas: TapViewData = {
            pageDatas: [{}, {}, {}, {}, {}]
        }
        if (!GlobalVal.hideSuperTower) datas.pageDatas.push({});
        this.catTabView.init(datas);
        this.nav.init(datas.pageDatas.length);
        let newcatMap = Game.towerMgr.getNewCatMap();
        if (args.length) {
            this.initTowerId = args[1];
            this.isSkin = args[2] || false;
            this.catTabView.selectTap(args[0]);
        } else if (newcatMap.size) {
            let keys = newcatMap.keys();
            this.catTabView.selectTap(keys.next().value);
        } else {
            this.catTabView.selectFirstTap();
        }
    }

    private onShowCatInfo(towerId: number) {
        this.catInfo.node.active = true;
        this.content.active = false;
        this.catInfo.setData(towerId);
        this.catInfo.refresh();

        if (this.isSkin) {
            this.catInfo.onWeaponSelected(3);
        }
    }

    private onHideCatInfo() {
        this.content.active = true;
    }
}
