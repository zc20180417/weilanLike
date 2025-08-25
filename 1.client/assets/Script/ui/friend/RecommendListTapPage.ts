// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EResPath } from "../../common/EResPath";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GameEvent } from "../../utils/GameEvent";
import List from "../../utils/ui/List";
import { UiManager } from "../../utils/UiMgr";
import TapPageItem from "../dayInfoView/TapPageItem";
import RecommendListItem from "./RecommendListItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RecommendListTapPage extends TapPageItem {
    @property(List)
    list: List = null;

    start() {
        GameEvent.on(EventEnum.ON_RELATION_RECOMMEND, this.onRecommendRet, this);
        this.btnRefresh();
    }

    onDestroy() {
        GameEvent.targetOff(this);
    }

    btnFind() {
        UiManager.showDialog(EResPath.FRIEND_INVITE_VIEW);
    }

    btnRefresh() {
        Game.relationMgr.relationGetRecommend();
    }

    btnAllAdd() {
        let recommendInfo = Game.relationMgr.getRecommendInfo();
        if (!recommendInfo || !recommendInfo.data) return;
        let content = this.list.getContent();
        let children = content.children;
        let com: RecommendListItem = null;
        if (children) {
            children.forEach(el => {
                com = el.getComponent(RecommendListItem);
                com.btnAdd();
            });
        }
        // recommendInfo.data.forEach((v) => {
        //     Game.relationMgr.relationAdd(v.nactordbid);
        // });
    }

    private onRecommendRet() {
        this.list.array = Game.relationMgr.getRecommendInfo().data || [];
    }
}
