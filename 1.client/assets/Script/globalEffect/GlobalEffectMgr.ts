// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EventEnum } from "../common/EventEnum";
import Game from "../Game";
import { GameEvent } from "../utils/GameEvent";


const { ccclass, property } = cc._decorator;

export default class GlobalEffectMgr {
    private static instance: GlobalEffectMgr = null;

    private effectNode: cc.Node = null;

    public static getInstance(): GlobalEffectMgr {
        return this.instance ? this.instance : this.instance = new GlobalEffectMgr();
    }

    public init() {
        this.effectNode = new cc.Node("global-effect");
        this.effectNode.zIndex = 1000;
        this.effectNode.setContentSize(cc.winSize);
        this.effectNode.addComponent(cc.BlockInputEvents);
        Game.fitMgr.addPersistRootNode(this.effectNode);
        this.effectNode.active = false;
    }


    public flyCat(catNode: cc.Node, endPos: cc.Vec2) {
        let worldStartPos = catNode.parent.convertToWorldSpaceAR(catNode.position);
        let localStartPos = this.effectNode.convertToNodeSpaceAR(worldStartPos);
        let localEndPos = this.effectNode.convertToNodeSpaceAR(endPos);
        catNode.removeFromParent();
        catNode.setPosition(localStartPos);
        this.effectNode.addChild(catNode);
        this.effectNode.active = true;
        cc.tween(catNode).to(0.8, { scale: 0.1, position: localEndPos }).call((node) => {
            node.removeFromParent();
            GameEvent.emit(EventEnum.FLY_CAT_TO_END);
            this.effectNode.active = false;
        }).start();
    }
}
