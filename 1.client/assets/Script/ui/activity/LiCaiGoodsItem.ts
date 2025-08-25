// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EResPath } from "../../common/EResPath";
import Game from "../../Game";
import { StringUtils } from "../../utils/StringUtils";
import BaseItem from "../../utils/ui/BaseItem";
import ImageLoader from "../../utils/ui/ImageLoader";
import { UiManager } from "../../utils/UiMgr";
import { DiaAndRedPacketTipsViewData } from "../tips/DiaAndRedPacketTipsView";

const { ccclass, property } = cc._decorator;

export interface LiCaiGoodsItemData {
    goodsId: number;
    nums: number;
    gray: boolean;
}

@ccclass
export default class LiCaiGoodsItem extends BaseItem {
    @property(cc.Label)
    num: cc.Label = null;

    @property(ImageLoader)
    icon: ImageLoader = null;

    @property(cc.Sprite)
    bg: cc.Sprite = null;

    @property([cc.SpriteFrame])
    bgs: cc.SpriteFrame[] = [];

    @property(cc.Node)
    mask: cc.Node = null;

    @property(cc.Label)
    goodsName: cc.Label = null;

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

    public setData(data: LiCaiGoodsItemData, index?: number): void {
        super.setData(data, index);
        if (!data) return;
        
        let goodsCfg = Game.goodsMgr.getGoodsInfo(data.goodsId);
        if (goodsCfg) {
            this.goodsName && (this.goodsName.string = goodsCfg.szgoodsname);
            this.num.string = "x " + data.nums.toString();
            this.icon.setPicId(goodsCfg.npacketpicid);
            this.bg.spriteFrame = this.bgs[cc['math'].clamp(goodsCfg.btquality - 1, 0, this.bgs.length - 1)];
        } else {
            this.num.string = "";
            this.goodsName && (this.goodsName.string = "");
        }

        if (this.mask) {
            this.mask.active = data.gray;
        }
    }

    private clickInfo(event) {
        if (!this.data) return;
        let goodsCfg = Game.goodsMgr.getGoodsInfo(this.data.goodsId);
        if (!goodsCfg) return;
        let str = "";
        let tempStr;
        str += StringUtils.richTextSizeFormat(StringUtils.richTextColorFormat(goodsCfg.szgoodsname, "#995124"), 24);
        tempStr = "\n" + goodsCfg.sztips;
        str += StringUtils.richTextSizeFormat(StringUtils.richTextColorFormat(tempStr, "#a75f49"), 20);
        let data: DiaAndRedPacketTipsViewData = {
            node: event.target,
            tips: str
        };
        UiManager.showTopDialog(EResPath.ITEM_MASK_TIPS_VIEW, data);
    }
}
