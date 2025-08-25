// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GameEvent } from "../../utils/GameEvent";
import TapPageItem from "../dayInfoView/TapPageItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CatTapPageItem extends TapPageItem {
    @property(cc.Node)
    catsNode: cc.Node = null;

    public init(): void {
        let children = this.catsNode.children, button: cc.Button;
        let towerId;
        for (const node of children) {
            towerId = parseInt(node.name);
            if (!Game.towerMgr.isTowerUnlock(towerId)) {
                node.color = cc.Color.BLACK;
            } else {
                button = node.addComponent(cc.Button);
                button.transition = cc.Button.Transition.COLOR;
                node.on('click', this.onCatClick, this);
            }
        }
    }

    private onCatClick(button: cc.Button) {
        GameEvent.emit(EventEnum.SHOW_CAT_INFO, parseInt(button.node.name));
    }
}
