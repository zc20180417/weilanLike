
import { ACTIVE_TAQING_PAGE_INDEX } from "../../common/AllEnum";
import { EResPath } from "../../common/EResPath";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { ActorProp } from "../../net/socket/handler/MessageEnum";
import { EVENT_REDPOINT } from "../../redPoint/RedPointSys";
import { GameEvent } from "../../utils/GameEvent";
import GroupImage from "../../utils/ui/GroupImage";
import ImageLoader from "../../utils/ui/ImageLoader";
import { PageDialog } from "../../utils/ui/PageDialog";
import TogGroup from "../../utils/ui/TogGroup";
import { UiManager } from "../../utils/UiMgr";
import { ShopIndex } from "../shop/ShopView";
const { ccclass, property ,menu } = cc._decorator;

@ccclass
@menu('Game/ui/active-taqing/ActiveTaqingView')
export class ActiveTaqingView extends PageDialog {

    @property(TogGroup)
    togGroup:TogGroup = null;

    @property(cc.Sprite)
    bg:cc.Sprite = null;

    @property(GroupImage)
    diamondLabel:GroupImage = null;

    @property(ImageLoader)
    diamondIco:ImageLoader = null;

    @property(GroupImage)
    goodsCountLabel:GroupImage = null;

    @property(ImageLoader)
    goodsIco:ImageLoader = null;

    @property(cc.Node)
    topNode:cc.Node = null;

    @property(cc.SpriteFrame)
    bgSf1:cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    bgSf2:cc.SpriteFrame = null;

    onLoad() {
        super.onLoad();
        
        this.togGroup.node.on("valueChange", this.onTogGroupValueChanged, this);
    }

    protected addEvent(): void {
        Game.redPointSys.registerRedPoint(EVENT_REDPOINT.FESTIVAL_ACTIVE_TASK, this.togGroup.toggles[ACTIVE_TAQING_PAGE_INDEX.TASK]);
        Game.redPointSys.registerRedPoint(EVENT_REDPOINT.FESTIVAL_ACTIVE_LEICHONG, this.togGroup.toggles[ACTIVE_TAQING_PAGE_INDEX.LEI_CHONG]);
        Game.redPointSys.registerRedPoint(EVENT_REDPOINT.FESTIVAL_ACTIVE_LEICHOU, this.togGroup.toggles[ACTIVE_TAQING_PAGE_INDEX.LEI_CHOU]);
        Game.redPointSys.registerRedPoint(EVENT_REDPOINT.FESTIVAL_ACTIVE_SIGN, this.togGroup.toggles[ACTIVE_TAQING_PAGE_INDEX.SIGN]);
        Game.redPointSys.registerRedPoint(EVENT_REDPOINT.FESTIVAL_ACTIVE_SHOP_GIFT, this.togGroup.toggles[ACTIVE_TAQING_PAGE_INDEX.SHOP_GIFT]);
        GameEvent.on(EventEnum.ACTIVE_TAQING_PAGE_CHANGE , this.onTaqingPageChange , this);
        GameEvent.on(EventEnum.ACTIVE_TAQING_CLOSE, this.onFestivalActivityClose, this);
        GameEvent.on(EventEnum.ITEM_COUNT_CHANGE , this.refreshExchangeGoodsCount , this);
        GameEvent.on(EventEnum.PLAYER_PROP_CHANGE + ActorProp.ACTOR_PROP_DIAMONDS , this.onDiamondChange , this);
    }

    start() {
        this.onTogGroupValueChanged(this.togGroup.selectedFlag);
    }

     /**
     * 初始化标签页数据
     */
      protected initPageDatas() {
        //test
        let data = {
            pageDatas: [
                null,
                {},
                {},
                {},
                {},
                {},
                {},
                // {},
            
            ],
            navDatas: [
                null,
                {},
                {},
                {},
                {},
                {},
                {},
                // {},
            
            ]
        }
        this._pageDatas = data;
    }

    private onTogGroupValueChanged(flag:string) {
        let index = Number(flag) - 1;
        this.pageCtrl.selectTap(index);
        this.bg.spriteFrame = index == ACTIVE_TAQING_PAGE_INDEX.LUCKY ? this.bgSf1 : this.bgSf2;
        // this.topNode.active = index != ACTIVE_TAQING_PAGE_INDEX.HE_CHENG;
        // switch (index) {
        //     case ACTIVE_TAQING_PAGE_INDEX.LEI_CHONG:
        //     case ACTIVE_TAQING_PAGE_INDEX.LEI_CHOU:
        //         MatUtils.setNormal(this.bg);
        //         break;
        
        //     default:
        //         MatUtils.useMat(this.bg , MatUtils.MAT.BLUR);
        //         break;
        // }
    }

    afterShow(): void {
        
    }

    private onTaqingPageChange(index:number) {
        this.togGroup.selectedIndex = index;
        
    }

    private onFestivalActivityClose() {
        this.hide();
    }

    protected afterHide(): void {
        Game.redPointSys.unregisterRedPoint(EVENT_REDPOINT.FESTIVAL_ACTIVE_TASK, this.togGroup.toggles[ACTIVE_TAQING_PAGE_INDEX.TASK]);
        Game.redPointSys.unregisterRedPoint(EVENT_REDPOINT.FESTIVAL_ACTIVE_LEICHONG, this.togGroup.toggles[ACTIVE_TAQING_PAGE_INDEX.LEI_CHONG]);
        Game.redPointSys.unregisterRedPoint(EVENT_REDPOINT.FESTIVAL_ACTIVE_LEICHOU, this.togGroup.toggles[ACTIVE_TAQING_PAGE_INDEX.LEI_CHOU]);
        Game.redPointSys.unregisterRedPoint(EVENT_REDPOINT.FESTIVAL_ACTIVE_SIGN, this.togGroup.toggles[ACTIVE_TAQING_PAGE_INDEX.SIGN]);
        Game.redPointSys.unregisterRedPoint(EVENT_REDPOINT.FESTIVAL_ACTIVE_SHOP_GIFT, this.togGroup.toggles[ACTIVE_TAQING_PAGE_INDEX.SHOP_GIFT]);
    }

    protected beforeShow(): void {
        let exchangegoodsid = Game.festivalActivityMgr.getExChangeGoodsId();
        let goodsInfo = Game.goodsMgr.getGoodsInfo(exchangegoodsid);
        if (goodsInfo) {
            this.goodsIco.setPicId(goodsInfo.npacketpicid);
        }
        this.diamondLabel.contentStr = Game.actorMgr.getDiamonds().toString();
        this.goodsCountLabel.contentStr = Game.containerMgr.getItemCount(exchangegoodsid).toString();
    }

    onWenClick() {
        UiManager.showDialog(EResPath.ACTIVE_TAQING_TIPS);
    }

    private refreshExchangeGoodsCount(id:number , count:number) {
        let exchangegoodsid = Game.festivalActivityMgr.getExChangeGoodsId();
        if ( id == exchangegoodsid) {
            this.goodsCountLabel.contentStr = count.toString();
        }
    }

    private onDiamondChange() {
        this.diamondLabel.contentStr = Game.actorMgr.getDiamonds().toString();
    }

    onAddClick() {
        GameEvent.emit(EventEnum.ACTIVE_TAQING_PAGE_CHANGE , ACTIVE_TAQING_PAGE_INDEX.LUCKY);
    }

    onAddDiamondClick() {
        UiManager.showDialog(EResPath.SHOP_VIEW , ShopIndex.DIAMOND);
    }
}