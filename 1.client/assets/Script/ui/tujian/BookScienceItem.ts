// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EResPath } from "../../common/EResPath";
import Game from "../../Game";
import { GS_StrengConfig_StrengItem } from "../../net/proto/DMSG_Plaza_Sub_Streng";
import BaseItem from "../../utils/ui/BaseItem";
import ImageLoader from "../../utils/ui/ImageLoader";
import { NodeUtils } from "../../utils/ui/NodeUtils";
import { UiManager } from "../../utils/UiMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BookScienceItem extends BaseItem {
    @property(ImageLoader)
    icon: ImageLoader = null;

    @property(cc.Button)
    btn: cc.Button = null;

    @property(cc.Label)
    scienceName: cc.Label = null;
    
    private _interactable: boolean = true;
    setData(data: any, index?: number) {
        super.setData(data, index);
        this.refresh();
    }

    refresh() {
        let data: GS_StrengConfig_StrengItem = this.data as GS_StrengConfig_StrengItem;
        //icon
        this.icon.setPicId(data.npicid);

        //name
        this.scienceName.string=data.szname;

        //科技是否激活
        let scienceData = Game.strengMgr.getStrengData(data.nid);
        this._interactable=!!scienceData;
        this.setIconGray(!this._interactable);
    }

    private setIconGray(isGray:boolean){
        NodeUtils.setNodeGray(this.icon.node,isGray);
        NodeUtils.setNodeGray(this.scienceName.node,isGray);
    }

    private onClick() {
        if (this._interactable) {
            UiManager.showDialog(EResPath.SCIENCE_TYPE_VIEW , (this.data as GS_StrengConfig_StrengItem).btrolecardtype );
            // UiManager.showDialog(EResPath.SCIENCE_DETAIL_VIEW, { data: this.data, index: this.index, isShow: true });
        }
    }
}
