import Dialog from "../../utils/ui/Dialog";
import List from "../../utils/ui/List";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { TAGID } from "../../net/mgr/MallProto";
import { ActorProp, GOODS_ID, MALL_PRICETYPE } from "../../net/socket/handler/MessageEnum";
import { BuryingPointMgr, EBuryingPoint } from "../../buryingPoint/BuryingPointMgr";
import ImageLoader from "../../utils/ui/ImageLoader";
import { GameEvent } from "../../utils/GameEvent";



const {ccclass, property,menu} = cc._decorator;

@ccclass
@menu("Game/ui/shop/SkillShopView")
export class SkillShopView extends Dialog {

    @property(List) 
    list:List = null;

    @property(cc.Label)
    diamondLabel:cc.Label = null;

    @property(ImageLoader)
    imgLoader:ImageLoader = null;

    private pricegoodsid:number = 0;
    private isDiamond:boolean = false;
    protected beforeShow() {
        BuryingPointMgr.post(EBuryingPoint.SHOW_SKILL_SHOP_VIEW);

        let datas = Game.mallProto.getGoodListByTagId(TAGID.PROP);
        let item = datas[1];
        if (MALL_PRICETYPE.MALL_PRICETYPE_DIAMONDS == item.btpricetype) {
            this.isDiamond = true;
            this.diamondLabel.string = Game.actorMgr.getDiamonds() + '';
            this.imgLoader.setPicId(Game.goodsMgr.getGoodsInfo(GOODS_ID.DIAMOND).npacketpicid);
        } else if (MALL_PRICETYPE.MALL_PRICETYPE_GOODS == item.btpricetype) {
            this.pricegoodsid = item.npricegoodsid;
            let itemCount = Game.containerMgr.getItemCount(this.pricegoodsid);
            this.setItemCount(itemCount);
            this.imgLoader.setPicId(Game.goodsMgr.getGoodsInfo(item.npricegoodsid).npacketpicid);
        }
        this.list.array = datas;

        if (this.isDiamond) {
            GameEvent.on(EventEnum.PLAYER_PROP_CHANGE + ActorProp.ACTOR_PROP_DIAMONDS , this.diamondChange , this);
        } else {
            GameEvent.on(EventEnum.ITEM_COUNT_CHANGE  , this.itemChange , this);
        }
    }

    protected afterHide() {
        this.list.array = [];
    }

    private itemChange(id: number, num: number) {
        if (id == this.pricegoodsid) {
            this.setItemCount(num);
        }
    }

    private diamondChange(newValue: number, oldValue: number) {
        this.diamondLabel.string = newValue + '';
    }

    private setItemCount(count:number) {
        this.diamondLabel.string = count + '';
    }
}