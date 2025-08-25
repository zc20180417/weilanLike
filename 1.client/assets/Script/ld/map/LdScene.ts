import Game from "../../Game";
import { LdMapCtrl } from "./LdMapCtrl";

const { ccclass, property ,menu} = cc._decorator;

@ccclass
@menu("Game/LD/LdScene")
export default class LdScene extends cc.Component {

    @property(cc.Graphics)
    gridGs:cc.Graphics = null;

    @property(cc.Node)
    monsterNode:cc.Node = null;

    @property(cc.Node)
    sommonNode:cc.Node = null;

    @property(cc.Node)
    gridNode:cc.Node = null;

    // @property(cc.Node)
    // dropNode:cc.Node = null;

    @property(cc.Node)
    mapUINode:cc.Node = null;

    @property(cc.Node)
    effectBottomNode:cc.Node = null;

    @property(cc.Node)
    effectTopNode:cc.Node = null;

    @property(cc.Node)
    heroNode:cc.Node = null;

    @property(cc.Sprite)
    bg:cc.Sprite = null;

    protected _mapCtrl:LdMapCtrl = null;

    protected onLoad(): void {
        // this.fitScene();
    }

    protected start(): void {
        if (CC_DEBUG) {
            for (let i = 0 ; i < 10; i++) {
                this.gridGs.moveTo(i * 88 + 49 , 0);
                this.gridGs.lineTo(i * 88 + 49 , 1500);
            }
    
            for (let i = 0 ; i < 20; i++) {
                this.gridGs.moveTo(0 , 88 * i);
                this.gridGs.lineTo(720 , 88 * i);
            }
        }
            
        this.gridGs.stroke();
        // const gridGsNode2 = cc.instantiate(this.gridGs.node);
        // this.gridGs.node.parent.addChild(gridGsNode2);
        // const comp = gridGsNode2.getComponent(cc.Graphics);
        // comp.lineWidth = 5;
        // comp.strokeColor = cc.Color.GREEN;
        // comp.clear();
        // Game.ldSkillMgr.graphMoveLine = comp;


        Game.ldSkillMgr.graph = this.gridGs;
        Game.soMgr.setContainer(this.monsterNode , this.heroNode , this.effectTopNode , 
                                this.mapUINode , this.sommonNode , this.effectBottomNode , this.gridNode);
        Game.mapCtrl = Game.curLdGameCtrl.getMapCtrl();
        this._mapCtrl = Game.mapCtrl;
        this._mapCtrl.init(this.gridGs , this.bg);
        this._mapCtrl.enterMap();
    }

    protected onDestroy(): void {
        
    }

     onEnable() {
        if (cc.sys.isNative) {
            jsb["Device"].setKeepScreenOn(true);
        }

    }
    onDisable() {
        Game.soundMgr.stopMusic();
        if (cc.sys.isNative) {
            jsb["Device"].setKeepScreenOn(false);
        }
    }

}