import Game from "../../Game";
import GlobalVal from "../../GlobalVal";
import { GS_SignMonthCardConfig, GS_SignMonthCardPrivate } from "../../net/proto/DMSG_Plaza_Sub_Sign";
import ImageLoader from "../../utils/ui/ImageLoader";
import Utils from "../../utils/Utils";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/ui/yueka/YuekaState2")
export class YuekaState2 extends cc.Component {


    @property(cc.Label)
    itemNumLabel1: cc.Label = null;

    @property(cc.Label)
    itemNumLabel2: cc.Label = null;

    @property(cc.Label)
    signCountLabel: cc.Label = null;

    @property(ImageLoader)
    ico: ImageLoader = null;

    @property(cc.Node)
    getedNode1: cc.Node = null;

    @property(cc.Node)
    getedNode2: cc.Node = null;

    @property([cc.Node])
    normalNodes: cc.Node[] = [];

    @property([cc.Node])
    freeNodes: cc.Node[] = [];

    onClickNormal() {
        Game.signMgr.reqGetRewardMonthCard(0);
    }

    onClickFreeVideo() {
        Game.signMgr.reqGetRewardMonthCard(1);
    }

    show() {
        let data: GS_SignMonthCardPrivate = Game.signMgr.getMonthCardPrivate();
        if (!data) return;

        let info: GS_SignMonthCardConfig = Game.signMgr.getMonthCardConfig();
        let goodsInfo = Game.goodsMgr.getGoodsInfo(info.sdaygoods1.ngoodsid);
        if (goodsInfo) {
            this.itemNumLabel1.string = goodsInfo.szgoodsname + "x" + info.sdaygoods1.ngoodsnums.toString();
        }
        goodsInfo = Game.goodsMgr.getGoodsInfo(info.sdayfvgoods.ngoodsid);

        if (goodsInfo) {
            this.itemNumLabel2.string = goodsInfo.szgoodsname + "x" + info.sdayfvgoods.ngoodsnums.toString();
            this.ico.setPicId(goodsInfo.npacketpicid);
        }

        this.signCountLabel.string = `领取已满${data.ncontinuecount}/30日`;
        let curTime = GlobalVal.getServerTime();
        let lastfvtimes = data.nlastfvtimes * 1000;
        let lastfreetimes = data.nlastfreetimes * 1000;
        let curDay = new Date(curTime).getDay();
        let fvDay = new Date(lastfvtimes).getDay();
        let freeDay = new Date(lastfreetimes).getDay();
        this.setNormalBtnState(!Utils.isTimeInToday(data.nlastfreetimes));
        this.setFreeBtnState(!Utils.isTimeInToday(data.nlastfvtimes));
    }

    private setNormalBtnState(flag: boolean) {
        this.getedNode1.active = !flag;
        this.normalNodes.forEach(element => {
            element.active = flag;
        });
    }

    private setFreeBtnState(flag: boolean) {
        this.getedNode2.active = !flag;
        this.freeNodes.forEach(element => {
            element.active = flag;
        });
    }

}