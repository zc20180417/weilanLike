import Dialog from "../../utils/ui/Dialog";
import Game from "../../Game";
import { EventEnum } from "../../common/EventEnum";

import ImageLoader from "../../utils/ui/ImageLoader";
import { EResPath } from "../../common/EResPath";
import { BuryingPointMgr, EBuryingPoint } from "../../buryingPoint/BuryingPointMgr";
import { UiManager } from "../../utils/UiMgr";
import List from "../../utils/ui/List";
import { GS_StrengConfig_StrengItem } from "../../net/proto/DMSG_Plaza_Sub_Streng";
import { ScienceItem } from "./ScienceItem";
import SysMgr from "../../common/SysMgr";
import { Handler } from "../../utils/Handler";
import { StringUtils } from "../../utils/StringUtils";
import { getRichtextTips, RichTextTipsData, RichTextTipsType } from "../tips/RichTextTipsView";
import GlobalVal from "../../GlobalVal";
import { GameEvent, Reply } from "../../utils/GameEvent";


const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("Game/ui/science/ScienceView")

export class ScienceView extends Dialog {
    @property(List)
    list: List = null;

    @property(cc.Node)
    view: cc.Node = null;

    @property(cc.Label)
    lingdang: cc.Label = null;

    @property(ImageLoader)
    lingdangIco: ImageLoader = null;

    _firstShow: boolean = true;

    private _datas: GS_StrengConfig_StrengItem[][];
    private _curShowType: number = 0;

    setData(data: any) {
        if (data) {
            this._curShowType = data;
        }
    }

    protected beforeShow() {

        GameEvent.on(EventEnum.ITEM_COUNT_CHANGE, this.onItemChange, this);

        this.list.node.x = -cc.winSize.width * 0.5;
        this.list.node.width = cc.winSize.width;
        this.view.width = cc.winSize.width;
        //this.list.setContenWidth(cc.winSize.width);
        this._datas = [];
        let len = GlobalVal.hideSuperTower ? 7 : 8;
        for (let i = 1; i <= len; i++) {
            let data = Game.strengMgr.getStrengItemList(i);
            if (data) {
                this._datas.push(data);
            }
        }

        if (this._curShowType > 0) {
            this.list.dynamicShowItem = false;
            this.list.array = this._datas;

            if (this._curShowType >= this.list.getRepeatX()) {
                this.list.setStartIndex(this._curShowType);
                this.list.scrollToIndex(this._curShowType, 0);
            }

        } else {
            this.list.array = this._datas;
        }

        let goodsInfo = Game.goodsMgr.getGoodsInfo(Game.strengMgr.getUpgradeGoodsid());
        if (goodsInfo) {
            this.lingdangIco.setPicId(goodsInfo.npacketpicid);
        }
        this.lingdang.string = Game.containerMgr.getItemCount(Game.strengMgr.getUpgradeGoodsid()) + "";

        BuryingPointMgr.post(EBuryingPoint.SHARE_SCIENCE_VIEW);
    }

    protected addEvent() {
        GameEvent.onReturn('get_science_item', this.onGetScienceItem, this);
    }

    protected afterShow(): void {
        SysMgr.instance.doOnce(Handler.create(this.onDelayTime, this), 100, true);
    }

    private onDelayTime() {
        GameEvent.emit(EventEnum.AFTER_SHOW_DIALOG, this.dialogName);
    }

    private onGetScienceItem(reply:Reply, tag: string): cc.Node {
        let id = Number(tag);
        let len = this._datas.length;
        let tempLen: number = 0;
        let tempList: GS_StrengConfig_StrengItem[];
        let item: GS_StrengConfig_StrengItem;
        let i, j, flag;
        for (i = 0; i < len; i++) {
            tempList = this._datas[i];
            tempLen = tempList.length;
            for (j = 0; j < tempLen; j++) {
                item = tempList[j];
                if (item.nid == id) {
                    flag = true;
                    break;
                }
            }
            if (flag) {
                break;
            }
        }

        let node = this.list.getCell(i);
        let comp = node.getComponent(ScienceItem);
        return reply(comp.getItem(j));
    }

    protected afterHide() {
        GameEvent.emit(EventEnum.SCIENCE_VIWE_EXIT);
        GameEvent.targetOff(this);
    }



    private onItemChange(id: number, count: number) {
        if (id == Game.strengMgr.getUpgradeGoodsid()) {
            this.lingdang.string = count + '';
        }
    }

    onAddSlug() {
        let data: RichTextTipsData = {
            title: "获得铃铛",
            des: getRichtextTips(RichTextTipsType.LING_DANG)
        }

        UiManager.showDialog(EResPath.RICHTEXT_TIPS_VIEW, data);
    }

    onDestroy() {
        super.onDestroy();
        SysMgr.instance.clearTimer(Handler.create(this.onDelayTime, this), true);
    }


}