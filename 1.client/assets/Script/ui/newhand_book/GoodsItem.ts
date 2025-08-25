// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EResPath } from "../../common/EResPath";
import Game from "../../Game";
import { GOODS_TYPE } from "../../net/socket/handler/MessageEnum";
import { Handler } from "../../utils/Handler";
import { StringUtils } from "../../utils/StringUtils";
import BaseItem from "../../utils/ui/BaseItem";
import GroupImage from "../../utils/ui/GroupImage";
import ImageLoader from "../../utils/ui/ImageLoader";
import { UiManager } from "../../utils/UiMgr";
import CardQuailtyEffect from "../CardQuailtyEffect";
import { ItemMaskTipsViewData } from "../tips/ItemMaskTipsView";
import { ItemPopupData } from "../tips/ItemPopupTipsView";

const { ccclass, property, menu } = cc._decorator;

export interface GoodsItemData {
    goodsId: number;
    nums: number;
    gray?: boolean;
    prefix?: string;
    suffix?: string;
    desColor?: string;
    numColor?: string;
    hideNumWhenOne?: boolean;
    showNumWhenOne?: boolean;
    showGou?:boolean;
    limit?:number;
    notShowEffect?:boolean;
}

enum TIPS_TYPE {
    NONE,
    MASK,
    POPUP,
}

@ccclass
@menu("Game/ui/GoodsItem")
export default class GoodsItem extends BaseItem {
    @property(ImageLoader)
    icon: ImageLoader = null;

    @property(cc.Label)
    title: cc.Label = null;

    @property(cc.Node)
    numBg:cc.Node = null;

    @property(cc.Label)
    num: cc.Label = null;

    @property(cc.Label)
    des: cc.Label = null;

    @property(cc.RichText)
    desRichTxt: cc.RichText = null;

    @property(cc.Sprite)
    bg: cc.Sprite = null;

    @property([cc.SpriteFrame])
    bgs: cc.SpriteFrame[] = [];

    @property(cc.Node)
    mask: cc.Node = null;

    @property(cc.Node)
    mask2: cc.Node = null;

    @property(cc.Node)
    tipsTarget: cc.Node = null;

    @property(cc.Node)
    gouNode:cc.Node = null;

    @property({
        type: cc.Enum(TIPS_TYPE)
    })
    tipsType: TIPS_TYPE = TIPS_TYPE.NONE;

    @property(CardQuailtyEffect)
    cardEffect:CardQuailtyEffect = null;

    @property(GroupImage)
    numGroupImg: GroupImage = null;


    titleY:number = 0;
    private _showCardEffect:boolean = true;
    private _goodsEftNode:cc.Node = null;
    private _curGoodsEftId:number = -1;
    onLoad() {
        if (this.title) {
            this.titleY = this.title.node.y;
        }
    }

    set showCardEffect(value:boolean) {
        this._showCardEffect = value;
        if (!value && this.cardEffect) {
            this.cardEffect.showCardEffect(0);
        }

    }

    protected _limit: number = 0;
    set limit(value: number) {
        this._limit = value;
        if (this.icon) {
            this.icon.limitMaxHeight = this.icon.limitMaxWid = value;
        }
    }

    get limit(): number {
        return this._limit;
    }

    setData(data: GoodsItemData, index: number = -1) {
        super.setData(data, index);
        let goodsCfg = Game.goodsMgr.getGoodsInfo(this.data.goodsId);
        let showEft = false;
        if (data.limit) {
            this.limit = data.limit;
        }
        this.tryRemoveEftNode();
        if (goodsCfg) {
            if (goodsCfg.naniid > 0) {
                this._curGoodsEftId = goodsCfg.naniid;
                Game.resMgr.loadRes(EResPath.GOODS_EFT + goodsCfg.naniid , cc.Prefab , Handler.create(this.onGoodsEftLoaded , this));
            } else {

                this.icon.setPicId(goodsCfg.npacketpicid);
            }

            this.title && (this.title.string = goodsCfg.szgoodsname);
            this.num && (this.num.string = (this.data.prefix || "") + this.data.nums);
            this.numGroupImg && (this.numGroupImg.contentStr = this.data.nums + '');
            this.des && (this.des.string = goodsCfg.szgoodsname +  (this.data.showNumWhenOne || this.data.nums > 1 ? (this.data.prefix || "") + this.data.nums + (this.data.suffix || "") : ""));
            this.num && this.setNodeActive(this.num.node , this.data.nums > 1 || this.data.showNumWhenOne);
            this.numBg && this.setNodeActive(this.numBg , this.data.nums > 1 || this.data.showNumWhenOne);
            if (this.desRichTxt) {
                let str;
                this.desRichTxt.string = (this.data.desColor ? StringUtils.richTextColorFormat(goodsCfg.szgoodsname, this.data.desColor) : goodsCfg.szgoodsname);
                str = (this.data.prefix || "") + this.data.nums + (this.data.suffix || "");
                this.desRichTxt.string += (this.data.hideNumWhenOne && this.data.nums <= 1 ? "" : (this.data.numColor ? StringUtils.richTextColorFormat(str, this.data.numColor) : str));
            }

            this.bg && (this.bg.spriteFrame = this.bgs[cc['math'].clamp(goodsCfg.btquality, 0, this.bgs.length - 1)]);

            if (!data.notShowEffect && this._showCardEffect && (goodsCfg.lgoodstype == GOODS_TYPE.GOODSTYPE_RES_UPGRADESTAR || goodsCfg.lgoodstype == GOODS_TYPE.GOODSTYPE_RES_SKIN)) {
                if (!this.cardEffect && this.icon) {
                    let effectNode = new cc.Node();
                    effectNode.x = this.icon.node.x;
                    effectNode.y = this.icon.node.y;
                    this.icon.node.parent.addChild(effectNode);
                    this.cardEffect = effectNode.addComponent(CardQuailtyEffect);
                }

                if (this.cardEffect) {
                    this.cardEffect.showCardEffect(goodsCfg.btquality);
                    this.icon.setTexCb(new Handler(this.onIconLoaded , this))
                    showEft = true;
                }
            }

        } else {
            this.title && (this.title.string = "");
            this.num && (this.num.string = "");
            this.des && (this.des.string = "");
            this.desRichTxt && (this.desRichTxt.string = "");
        }
        this.mask && this.setNodeActive(this.mask , this.data.gray);
        this.gouNode && this.setNodeActive(this.gouNode , this.data.showGou);

        if (!showEft && this.cardEffect) {
            this.cardEffect.showCardEffect(0);
        }
    }

    private onGoodsEftLoaded(data:any , path:string) {
        Game.resMgr.addRef(path);
        let eftNode = cc.instantiate(data);
        if (eftNode) {
            this.icon.url = '';
            this.icon.spriteTarget.spriteFrame = null;
            let scale = 0;
            if (this.icon.limitMaxWid > 0 ) {
                scale = this.icon.limitMaxWid / 100;
            }

            if (this.icon.limitMaxHeight > 0) {
                scale = this.icon.limitMaxWid / 100;
            }

            if (scale == 0) {
                scale = this.icon.imageWidth / 100;
            }

            eftNode.scale = scale;
            this.icon.node.addChild(eftNode);
            this._goodsEftNode = eftNode;
        }
    }

    private tryRemoveEftNode() {
        if (this._goodsEftNode) {
            this._goodsEftNode.removeFromParent();
            this._goodsEftNode = null;
        }

        if (this._curGoodsEftId > 0) {
            Game.resMgr.removeLoad(EResPath.GOODS_EFT + this._curGoodsEftId , Handler.create(this.onGoodsEftLoaded , this));
            this._curGoodsEftId = -1;
        }
    }

    private onIconLoaded() {
        if (this.cardEffect) {
            this.cardEffect.node.scale = this.icon.node.scale;
            if (this.icon.node.anchorY != 0.5) {
                this.cardEffect.node.y = this.icon.node.y + (0.5 - this.icon.node.anchorY) * (this.icon.node.height * this.icon.node.scale);
            }
        }
    }

    private clickInfo(event: cc.Event.EventTouch) {
        if (this.tipsType === TIPS_TYPE.NONE) return;
        let goodsCfg = Game.goodsMgr.getGoodsInfo(this.data.goodsId);

        if (goodsCfg && goodsCfg.lgoodstype === GOODS_TYPE.GOODSTYPE_CARD_TROOPSCARDBAG) {
            UiManager.showDialog(EResPath.CARD_BAG_PREVIEW, goodsCfg.lgoodsid);
            return;
        }

        let str = "";
        let tempStr;
        str += StringUtils.richTextSizeFormat(StringUtils.richTextColorFormat(goodsCfg.szgoodsname, "#995124"), 24);
        tempStr = "\n" + goodsCfg.sztips;
        str += StringUtils.richTextSizeFormat(StringUtils.richTextColorFormat(tempStr, "#a75f49"), 20);
        if (this.tipsType === TIPS_TYPE.MASK) {
            let data: ItemMaskTipsViewData = {
                node: this.tipsTarget || event.target,
                tips: str
            };
            UiManager.showDialog(EResPath.ITEM_MASK_TIPS_VIEW, data);
        } else {
            let data: ItemPopupData = {
                node: this.tipsTarget || event.target,
                tips: str
            };
            UiManager.showDialog(EResPath.ITEM_POPUP_TIPS_VIEW, data);
        }
    }

    onDestroy() {
        this.tryRemoveEftNode();
    }
}
