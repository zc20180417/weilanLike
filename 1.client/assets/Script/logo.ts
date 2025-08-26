// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


import { BuryingPointMgr, EBuryingPoint } from "./buryingPoint/BuryingPointMgr";
import SceneMgr from "./common/SceneMgr";
import GlobalVal from "./GlobalVal";
import { PreLoad } from "./loading/PreLoad";


const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
export default class NewClass extends cc.Component {


    // LIFE-CYCLE CALLBACKS:
    start() {
        // this.node.runAction(cc.sequence(cc.delayTime(2),cc.fadeOut(1),cc.callFunc(()=>{
        //     SceneMgr.instance.loadScene("Loading");
        // })));
        cc.debug.setDisplayStats(GlobalVal.isTest);
        cc.tween(this.node).delay(2).to(1, { opacity: 0 }).call(() => {
            BuryingPointMgr.post(EBuryingPoint.GAME_START);
            SceneMgr.instance.loadScene("Loading");
        }).start();

        // PreLoad.instance.preLoad();
    }

}


