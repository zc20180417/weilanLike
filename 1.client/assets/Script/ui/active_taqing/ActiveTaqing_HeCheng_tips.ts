import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GS_FestivalActivityConfig, GS_FestivalActivityConfig_Material, GS_FestivalActivityPrivate } from "../../net/proto/DMSG_Plaza_Sub_FestivalActivity";
import { GameEvent } from "../../utils/GameEvent";
import { Handler } from "../../utils/Handler";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import Dialog from "../../utils/ui/Dialog";
import { GoodsBox } from "../../utils/ui/GoodsBox";
import { GoodsItemData } from "../newhand_book/GoodsItem";

const { ccclass, property ,menu } = cc._decorator;

@ccclass
@menu('Game/ui/active-taqing/ActiveTaqing_HeCheng_tips')
export class ActiveTaqing_HeCheng_tips extends Dialog {


    @property(GoodsBox)
    goodsBox:GoodsBox = null;

    private _config:GS_FestivalActivityConfig;
    private _data:GS_FestivalActivityPrivate;
    private _tag:string ;
    setData(data:any) {
        this._tag = data;
    }

    protected beforeShow(): void {

        this._config = Game.festivalActivityMgr.getConfig();
        this._data = Game.festivalActivityMgr.getData();
        if (!this._config || !this._config.combine || !this._data) return;

        let materials:GS_FestivalActivityConfig_Material[] = this._config.combine.materialitemlist;
        let material:GS_FestivalActivityConfig_Material;
        let len = materials.length;
        let items:GoodsItemData[] = [];
        for (let i = 0 ; i < len ; i++) {
            material = materials[i];
            if (material.ngoodsid > 0) {
                let goodsData:GoodsItemData = {
                    goodsId:material.ngoodsid,
                    prefix:"x",
                    showNumWhenOne:true,
                    nums:Game.containerMgr.getItemCount(material.ngoodsid) - Game.festivalActivityMgr.getCombingItemCount(material.ngoodsid),
                }

                items.push(goodsData);
            }
        }


        this.goodsBox.itemClickCb = Handler.create(this.onItemClick , this);
        this.goodsBox.array = items;
    }

    private onItemClick(data:GoodsItemData) {
        if (data.nums > 0) {
            GameEvent.emit(EventEnum.ACTIVE_TAQING_SELECT_HECHENG_ITEM , this._tag , data.goodsId);
            this.hide();
        } else {
            SystemTipsMgr.instance.notice("道具不足");
        }
    }

}