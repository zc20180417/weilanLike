import Game from "../../Game";
import { GS_RewardTips_RewardGoods } from "../../net/proto/DMSG_Plaza_Sub_Tips";
import { GOODS_TYPE } from "../../net/socket/handler/MessageEnum";
import BaseItem from "../../utils/ui/BaseItem";
import GroupImage from "../../utils/ui/GroupImage";
import ImageLoader from "../../utils/ui/ImageLoader";
import { NodeUtils } from "../../utils/ui/NodeUtils";
import { HeadComp, HeadInfo } from "../headPortrait/HeadComp";
import TowerStarTitle from "../towerStarSys/towerStarTitle";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/ui/shop/NewGoodsItem")
export default class NewGoodsItem extends BaseItem {
    @property(ImageLoader)
    imageLoad: ImageLoader = null;

    @property(GroupImage)
    countLable: GroupImage = null;

    @property(cc.Node)
    bg: cc.Node = null;

    @property(HeadComp)
    headIcon: HeadComp = null;

    @property(TowerStarTitle)
    towerStarTitle: TowerStarTitle = null;

    public isHead: boolean = false;
    private _scale:number = 1.0;
    onLoad() {
        this.imageLoad.node.on("size-changed", this.contentSizeChanged, this);
    }


    setViewInfo(scale:number , countLableY:number) {
        this._scale = scale;
        this.countLable.node.y = countLableY;
    }

    /**数据源 */
    public setData(data: any, index?: number) {
        super.setData(data, index);
        if (data) {
            let goodsItem = data as GS_RewardTips_RewardGoods;

            if (this.isHead) {//支持头像奖励
                this.headIcon.node.active = true;
                this.headIcon.isSelf = false;
                this.headIcon.isTujianReward = true;
                this.towerStarTitle.node.active = false;

                //头像		
                let headInfo: HeadInfo = {
                    nfaceframeid: 0,
                    nfaceid: goodsItem.sgoodsid,
                    szmd5facefile: ""
                };
                this.headIcon.headInfo = headInfo;

                this.countLable.contentStr = 'x' + goodsItem.sgoodsnum;
                this.countLable.node.active = false;

                this.headSizeChanged();
                return;
            }

            this.countLable.contentStr = 'x' + goodsItem.sgoodsnum;
            this.countLable.node.active = false;
            let goodsInfo = Game.goodsMgr.getGoodsInfo(goodsItem.sgoodsid);
            if (goodsInfo) {
                this.imageLoad.setPicId(goodsInfo.npacketpicid);
            }

            //如果是炮塔，添加类型标识
            if (goodsInfo.lgoodstype == GOODS_TYPE.GOODSTYPE_RES_UPGRADESTAR) {
                this.towerStarTitle.node.active = true;
                let cfg = Game.towerMgr.getTroopBaseInfo(goodsItem.sgoodsid);
                cfg && this.towerStarTitle.setIndex(cfg.bttype - 1);
            } else {
                this.towerStarTitle.node.active = false;
            }
        }
    }

    show() {
        this.node.scale = 0;
        NodeUtils.scaleTo(this.node, 0.2, this._scale, this.showLabel, this, "backOut");
    }

    private showLabel() {
        this.countLable.node.active = true;
        this.countLable.node.scale = 2.5;
        this.countLable.node.opacity = 0;
        NodeUtils.to(this.countLable.node, 0.3, { scale: this._scale, opacity: 255 }, "backOut");
    }

    private contentSizeChanged() {

        this.bg.width = this.imageLoad.node.width + 100;
        this.bg.height = this.imageLoad.node.height + 100;

        if (this.imageLoad.node.height > 150) {
            this.countLable.node.y = this.imageLoad.node.y - this.imageLoad.node.height * 0.5 - 25;
        }

        this.node.width = this.imageLoad.node.width > 100 ? this.imageLoad.node.width : 100;
    }

    private headSizeChanged() {
        this.bg.width = this.headIcon.node.width + 100;
        this.bg.height = this.headIcon.node.height + 100;

        if (this.headIcon.node.height > 150) {
            this.countLable.node.y = this.headIcon.node.y - this.headIcon.node.height * 0.5 - 25;
        }

        this.node.width = this.headIcon.node.width > 100 ? this.headIcon.node.width : 100;
    }

}