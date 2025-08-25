// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Game from "../Game";
import { MathUtils } from "../utils/MathUtils";
import BaseItem from "../utils/ui/BaseItem";
import UnlockMonsterStyleItem from "./UnlockMonsterStyleItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UnlockMonsterTips extends BaseItem {

    @property(cc.Prefab)
    styles: cc.Prefab[] = [];

    @property(cc.Node)
    content: cc.Node = null;

    public setData(data: any) {
        super.setData(data);
        if (!data) return;
        let cfg = Game.monsterManualMgr.getBookUnlockCfg(data);
        if (!cfg) cfg = Game.monsterManualMgr.getBookUnlockCfg(1);
        if (!cfg) return;
        let node = cc.instantiate(this.styles[MathUtils.clamp(cfg.style, 0, this.styles.length - 1)]);
        node.parent = this.content;
        let com = node.getComponent(UnlockMonsterStyleItem);
        com && com.setData(cfg);
    }
}