import { EResPath } from "../../common/EResPath";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GS_SceneWarFail } from "../../net/proto/DMSG_Plaza_Sub_Scene";
import { GOODS_TYPE } from "../../net/socket/handler/MessageEnum";
import { GameEvent } from "../../utils/GameEvent";
import { StringUtils } from "../../utils/StringUtils";
import Dialog from "../../utils/ui/Dialog";
import ImageLoader from "../../utils/ui/ImageLoader";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/ui/active/YiYuanGouView")
export class YiYuanGouView extends Dialog {

    @property(ImageLoader)
    towerPic:ImageLoader = null;

    @property(ImageLoader)
    img:ImageLoader = null;

    @property(cc.Label)
    numLabel:cc.Label = null;

    @property(cc.RichText)
    pirceLabel:cc.RichText = null;

    private _data:GS_SceneWarFail;
    setData(data:GS_SceneWarFail) {
        this._data = data;
    }

    protected beforeShow(): void {
        this.pirceLabel.string = StringUtils.richTextSizeFormat("¥" , 36) + StringUtils.richTextSizeFormat("" + this._data.nrmb , 48);
        let goodsinfo = Game.goodsMgr.getGoodsInfo(this._data.ngoodsid);
        if (goodsinfo) {
            this.numLabel.string = goodsinfo.szgoodsname + 'x' + this._data.ngoodsnum;
            this.img.setPicId(goodsinfo.npacketpicid);

            if (goodsinfo.lgoodstype == GOODS_TYPE.GOODSTYPE_RES_UPGRADESTAR) {

                let towerInfo = Game.towerMgr.getTroopBaseInfo(goodsinfo.lparam[0]);
                this.towerPic.url = towerInfo ? EResPath.TOWER_IMG + towerInfo.sz3dpicres : "";
            }
        }

    }

    onClick() {
        GameEvent.on(EventEnum.GET_REWARD , this.onGetReward , this);
        Game.sceneNetMgr.reqYiYuanGou();
    }

    private onGetReward() {
        this.hide();
    }

}