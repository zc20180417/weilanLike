import Game from "../../Game";
import ImageLoader from "../../utils/ui/ImageLoader";
import { GS_StrengConfig_StrengItem } from "../../net/proto/DMSG_Plaza_Sub_Streng";
import BaseItem from "../../utils/ui/BaseItem";
import { MatUtils } from "../../utils/ui/MatUtils";
import { EventEnum } from "../../common/EventEnum";
import { GameEvent } from "../../utils/GameEvent";

const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("Game/ui/science/ScienceItem2")
export class ScienceItem2 extends BaseItem {

    @property(ImageLoader)
    ico: ImageLoader = null;

    @property(cc.Label)
    levelLabel: cc.Label = null;

    @property(cc.Label)
    starLabel:cc.Label = null;

    @property(cc.Node)
    starNode:cc.Node = null;

    

    private _btn: cc.Button = null;
    private _icoSprite: cc.Sprite = null;

    setData(data: any, index?: number) {
        super.setData(data, index);
        this._btn = this.node.getComponent(cc.Button);
        this._icoSprite = this.ico.node.getComponent(cc.Sprite);
        this.refresh();
    }

    refresh() {
        let item: GS_StrengConfig_StrengItem = this.data as GS_StrengConfig_StrengItem;
        this.ico.setPicId(item.npicid);
        let scienceData = Game.strengMgr.getStrengData(item.nid);
        // this.levelLabel.string = (scienceData ? scienceData.nlevel : 0) + "/" + item.btmaxlevel;
        this.levelLabel.string = "Lv." + (scienceData ? scienceData.nlevel : 0);
        if (scienceData || (!scienceData && Game.strengMgr.canActive(item.nid))) {
            this.setIconNormal();
            this.starLabel.node.active = this.starNode.active = false;
        } else {
            this.setIconGray();
            let activeStarCount = Game.strengMgr.getActiveStarCountById(item.nid);
            let curStarCount = Game.towerMgr.getTypeAllStar(item.btrolecardtype);
            let flag = curStarCount < activeStarCount;
            this.starLabel.node.active = this.starNode.active = flag;
            this.levelLabel.node.active = !flag;
            if (flag) {
                this.starLabel.string = activeStarCount + '';
            }
        }
    }

    addIco() {
        this.ico.node.parent = this.node;
        this.ico.node.x = this.ico.node.y = 0;
    }

    public setIconGray() {
        if (!this._icoSprite) return;
        MatUtils.setSpriteGray(this._icoSprite);
    }

    public setIconNormal() {
        if (!this._icoSprite) return;
        MatUtils.setSpriteNormal(this._icoSprite);
    }

    private onClick() {
        // UiManager.showDialog(EResPath.SCIENCE_DETAIL_VIEW, { data: this.data, index: this.index });

        GameEvent.emit(EventEnum.SCIENCE_SELECT_ITEM , this.data);
    }
}