// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import BaseItem from "../../utils/ui/BaseItem";
import Game from "../../Game";
import { EResPath } from "../../common/EResPath";
import { UiManager } from "../../utils/UiMgr";
import ImageLoader from "../../utils/ui/ImageLoader";
import { MatUtils } from "../../utils/ui/MatUtils";
import { GS_StrengConfig_StrengItem } from "../../net/proto/DMSG_Plaza_Sub_Streng";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TowerStarScienceItem extends BaseItem {
    @property(cc.Label)
    levelLabel: cc.Label = null;

    @property(cc.Node)
    levelLabelBgNode: cc.Node = null;

    @property(ImageLoader)
    icon: ImageLoader = null;

    private _iconSprite: cc.Sprite = null;
    private _btn: cc.Button = null;
    private _interactable: boolean = true;
    setData(data: any, index?: number) {
        super.setData(data, index);
        this._iconSprite = this.icon.node.getComponent(cc.Sprite);
        this._btn = this.node.getComponent(cc.Button);
        this.refresh();
    }

    refresh() {
        if (!this.data) {
            this.node.active = false;
            this.icon.node.active = false;
            this.levelLabel.node.active = false;
            this.levelLabelBgNode.active = false;
            return;
        }
        this.node.active = true;
        this.icon.node.active = true;
        this.levelLabel.node.active = true;
        this.levelLabelBgNode.active = true;
        let data: GS_StrengConfig_StrengItem = this.data as GS_StrengConfig_StrengItem;
        let scienceData = Game.strengMgr.getStrengData(data.nid);
        this.icon.setPicId(data.npicid);
        this.levelLabel.string = (scienceData ? scienceData.nlevel : 0) + "/" + data.btmaxlevel;
    }

    public setIconGray() {
        if (!this._iconSprite) return;
        MatUtils.setSpriteGray(this._iconSprite);
        // this._btn.interactable = false;
        this._interactable = false;
    }

    public setIconNormal() {
        if (!this._iconSprite) return;
        MatUtils.setSpriteNormal(this._iconSprite);
        // this._btn.interactable = true;
        this._interactable = true;
    }

    private onClick() {
        if (this._interactable) {
            UiManager.showDialog(EResPath.SCIENCE_DETAIL_VIEW, { data: this.data, index: this.index, isShow: true });
        } else {
            UiManager.showDialog(EResPath.SCIENCE_VIEW);
        }
    }

}
