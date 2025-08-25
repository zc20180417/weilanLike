import Game from "../../Game";
import { Lang, LangEnum } from "../../lang/Lang";
import { ACTIVE_TYPE } from "../../net/socket/handler/MessageEnum";
import { EVENT_REDPOINT } from "../../redPoint/RedPointSys";
import { StringUtils } from "../../utils/StringUtils";
import BaseItem from "../../utils/ui/BaseItem";
import { GoodsBox } from "../../utils/ui/GoodsBox";
import ImageLoader from "../../utils/ui/ImageLoader";
import { NodeUtils } from "../../utils/ui/NodeUtils";

const { ccclass, property ,menu } = cc._decorator;

@ccclass
@menu("Game/ui/active/DailyGiftItem")
export class DailyGiftItem extends BaseItem {

    @property(GoodsBox)
    goodsBox:GoodsBox = null;

    @property(cc.RichText)
    btnLabel:cc.RichText = null;

    @property(cc.Node)
    btnNode:cc.Node = null;

    @property(cc.Button)
    btnComp:cc.Button = null;

    @property(cc.Label)
    tipsLabel:cc.Label = null;

    @property(cc.Sprite)
    bgImg:cc.Sprite = null;

    @property(cc.Sprite)
    titleImg:cc.Sprite = null;

    @property([cc.SpriteFrame])
    bgSfs:cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    titleSfs:cc.SpriteFrame[] = [];

    @property(ImageLoader)
    pirceIco:ImageLoader = null;

    setData(data:any , index:number) {
        this.clearRedPoint();
        super.setData(data , index);
        if (!this.data) return;

        //{cfg:element , privateData:this._privateData , flag:Utils.checkBitFlag(this._privateData.nflag , element.btindex)}
        this.titleImg.spriteFrame = this.titleSfs[index];
        this.bgImg.spriteFrame = this.bgSfs[index];

        let chargeInfo = Game.actorMgr.getChargeConifg(data.cfg.nparam1);
        let goodsArray:any[] = [];
        let price:number = 0;
        if (chargeInfo) {
            let goodsDataItem;
            const len = chargeInfo.ngivegoodsid.length;
            for (let i = 0; i < len; i++) {
                let goodsid = chargeInfo.ngivegoodsid[i];
                if (goodsid > 0) {
                    goodsDataItem = {
                        goodsId:goodsid,
                        nums:chargeInfo.ngivegoodsnums[i],
                        prefix: 'x',
                        gray: data.flag,
                        showGou:data.flag,
                    }
                    goodsArray.push(goodsDataItem);
                } else {
                    break;
                }
            }
            price = chargeInfo.nneedrmb;
            this.goodsBox.array = goodsArray;
            this.tipsLabel.string = `购买立得${chargeInfo.ngoodsnum}`;
        }

        // this.btnLabel.node.active = this.btnNode.active = !data.flag;
        if (!data.flag) {
            Game.redPointSys.registerRedPointSub(EVENT_REDPOINT.ACTIVE_HALL_DAILY_GIFT_ITEM , this.data.cfg.btindex.toString() , this.btnNode);
            this.btnLabel.string = data.privateData.nmainprogress <= 0 ? 
            (chargeInfo.btbuytype !== 1 ? StringUtils.richTextSizeFormat(Lang.getL(LangEnum.RMB) , 36) + " " + StringUtils.richTextSizeFormat(price.toString() , 44) :
            StringUtils.richTextSizeFormat(chargeInfo.nneedgoodsnum.toString() , 44)
            ):

            "领 取";

            if (chargeInfo.btbuytype == 1) {
                const goodsInfo = Game.goodsMgr.getGoodsInfo(chargeInfo.nneedgoodsid);
                this.pirceIco.setPicId(goodsInfo.npacketpicid);
                this.btnLabel.node.color = Game.containerMgr.isEnough(chargeInfo.nneedgoodsid , chargeInfo.nneedgoodsnum) ? cc.Color.BLACK.fromHEX("#833314") : cc.Color.RED;
            } else {
                this.btnLabel.node.anchorX = 0.5;
                this.btnLabel.node.x = 119.5;
            }

        } else {
            this.btnLabel.string = '已领取';
        }
        this.btnComp.enabled = !data.flag;
        NodeUtils.setNodeGray(this.btnNode , data.flag);
        NodeUtils.setNodeGray(this.btnLabel.node , data.flag);
    }

    private initPirce() {
        
    }

    onBtnClick() {
        if (!this.data) return;
        Game.sysActivityMgr.joinSysActivity(ACTIVE_TYPE.DAILY_GIFT , this.data.cfg.btindex);
    }

    private clearRedPoint() {
        if (this._data) {
            Game.redPointSys.unregisterRedPointSub(EVENT_REDPOINT.ACTIVE_HALL_DAILY_GIFT_ITEM , this.data.cfg.btindex.toString() , this.btnNode);
        }
    }

    onDestroy() {
        this.clearRedPoint();
    }

}