// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseItem from "../utils/ui/BaseItem";
import { GS_SceneSetWarDetails_TaskInfo } from "../net/proto/DMSG_Plaza_Sub_Scene";
import ImageLoader from "../utils/ui/ImageLoader";
import Game from "../Game";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CpInfoItem extends BaseItem {

    @property(cc.Label)
    des: cc.Label = null;

    @property(cc.Label)
    rewards: cc.Label = null;

    @property(cc.Node)
    awardBg:cc.Node = null;

    @property(cc.Node)
    awardIco:cc.Node = null;

    @property(cc.Node)
    completeNode:cc.Node = null;

    @property(ImageLoader)
    ico:ImageLoader = null;

    @property(cc.SpriteAtlas)
    atlas:cc.SpriteAtlas = null;

    @property(cc.Node)
    labelNode:cc.Node = null;

    @property(cc.Sprite)
    bg: cc.Sprite = null;

    @property(ImageLoader)
    awardImg:ImageLoader = null;


    setData(data: any, index?: number) {
        if (!data) return;
        super.setData(data, index);
        this.refresh();
    }

    refresh() {
        
    }

    // update (dt) {}
}
