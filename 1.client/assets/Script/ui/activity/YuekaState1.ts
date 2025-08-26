import Game from "../../Game";
import GlobalVal from "../../GlobalVal";
import { GS_SignMonthCardConfig } from "../../net/proto/DMSG_Plaza_Sub_Sign";
import { ActorProp, GOODS_ID } from "../../net/socket/handler/MessageEnum";
import ImageLoader from "../../utils/ui/ImageLoader";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/ui/yueka/YuekaState1")
export class YuekaState1 extends cc.Component {
    @property(ImageLoader)
    tiliIcon: ImageLoader = null;

    @property(ImageLoader)
    diamondIcon: ImageLoader = null;

    @property(cc.RichText)
    diamondDes: cc.RichText = null;

    @property(ImageLoader)
    skillIcon: ImageLoader = null;

    @property(cc.RichText)
    skillDes: cc.RichText = null;

    @property(cc.Label)
    pirceLabel:cc.Label = null;

    onLoad(){
        let info: GS_SignMonthCardConfig = Game.signMgr.getMonthCardConfig();
        if(info){
            let goodsInfo = Game.goodsMgr.getGoodsInfo(info.sdaygoods1.ngoodsid);
            if (goodsInfo) {
                this.diamondIcon.setPicId(goodsInfo.npacketpicid);
                this.diamondDes.string="每日领取 <size=60><color=#ca221c>"+
                info.sdaygoods1.ngoodsnums+
                "</color></size> 钻，累计获得<size=60><color=#ca221c>"+
                (info.sdaygoods1.ngoodsnums*30)+
                "</color></size>钻";
            }else{
                this.diamondDes.string="";
            }
            goodsInfo = Game.goodsMgr.getGoodsInfo(info.sdayfvgoods.ngoodsid);
            if (goodsInfo) {
                this.skillIcon.setPicId(goodsInfo.npacketpicid);
                this.skillDes.string="每日领取额外 <size=60><color=#ca221c>"+
                goodsInfo.szgoodsname+
                "</color></size>道具礼包";
            }else{
                this.skillDes.string="";
            }

            if (GlobalVal.setRechargeFree) {
                this.pirceLabel.string = '领 取';
            }

        }else{
            this.diamondDes.string="";
            this.skillDes.string="";
        }

        let goodsInfo=Game.goodsMgr.getGoodsInfo(GOODS_ID.TILI);
        if(goodsInfo){
            this.tiliIcon.setPicId(goodsInfo.npacketpicid);
        }
    }



    onClick() {
        Game.signMgr.reqBuyMonthCard();
    }
}