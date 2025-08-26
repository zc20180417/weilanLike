// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EResPath } from "../../common/EResPath";
import Game from "../../Game";
import { GS_SignConfig_SignReward } from "../../net/proto/DMSG_Plaza_Sub_Sign";
import { GOODS_TYPE } from "../../net/socket/handler/MessageEnum";
import { StringUtils } from "../../utils/StringUtils";
import BaseItem from "../../utils/ui/BaseItem";
import ImageLoader from "../../utils/ui/ImageLoader";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SignTapItem extends BaseItem {
    @property(cc.Node)
    selectedBg: cc.Node = null;

    @property(cc.Node)
    signState: cc.Node = null;

    @property(cc.Label)
    dayLable: cc.Label = null;

    @property(cc.Button)
    signButton: cc.Button = null;

    @property(ImageLoader)
    icon: ImageLoader = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.SpriteAtlas)
    gameui: cc.SpriteAtlas = null;

    @property(cc.RichText)
    num: cc.RichText = null;

    private _sign: boolean = null;
    get sign(): boolean {
        return this._sign;
    }
    set sign(value: boolean) {
        this._sign = value;
        this.content.opacity = this._sign ? 150 : 255;
        this.signState.active = this.sign;
    }

    public onSelect(): void {
        this.selectedBg.active = true;
        // this.signButton.interactable = true;
    }

    public unSelect(): void {
        this.selectedBg.active = false;
        // this.signButton.interactable = false;
    }

    private onClick() {
        Game.signMgr.sign();
    }

    public refreshState(index: number, count: number) {
        // let d: GS_SignConfig_SignReward = this.data;
        let cfg = Game.goodsMgr.getGoodsInfo(this.data.ngoodsid);
        if (!cfg) return;
        // this.des.string = cfg.szgoodsname + " x" + this._data.ngoodsnums;
        this.dayLable.string = (this.index + 1).toString();
        if (cfg.lgoodstype === GOODS_TYPE.GOODSTYPE_RES_UPGRADESTAR) {
            // let picid = Game.towerMgr.getCardPicid(this.data.ngoodsid);
            // picid && (this.icon.url = EResPath.TOWER_IMG + picid);
            const towerId = cfg.lparam[0];
            this.icon.setSpriteFrame(this.gameui.getSpriteFrame(towerId.toString()));
        } else {
            this.icon.setPicId(cfg.npacketpicid);
        }

        this.num.string = StringUtils.richTextColorFormat(cfg.szgoodsname, "#8e8c8d") + StringUtils.richTextColorFormat(" x" + this.data.ngoodsnums, "#c16d74");

        let isSign = index === -1;
        let lastIndex = count - 1;
        if (isSign ? this.index < lastIndex : this.index <= lastIndex) {
            this.sign = true;
            this.selected = false;
            this.signButton.interactable = false;
            this.num.node.active = false;
        } else if (isSign ? this.index === lastIndex : this.index === index) {
            this.selected = true;
            this.signButton.interactable = !isSign;
            this.sign = isSign;
            this.num.node.active = !isSign;
        } else {
            this.sign = false;
            this.selected = false;
            this.signButton.interactable = false;
            this.num.node.active = true;
        }
    }
}
