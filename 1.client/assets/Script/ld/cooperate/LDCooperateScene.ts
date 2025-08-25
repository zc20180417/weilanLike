import Game from "../../Game";

import LdScene from "../map/LdScene";

const { ccclass, property ,menu} = cc._decorator;

@ccclass
@menu("Game/LD/LDCooperateScene")
export default class LDCooperateScene extends LdScene {

    @property(cc.PolygonCollider)
    blockNode1:cc.PolygonCollider = null;

    @property(cc.PolygonCollider)
    blockNode2:cc.PolygonCollider = null;

    @property(cc.Node)
    cityWall:cc.Node = null;



    protected onLoad(): void {

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

        this.drawBlock(this.blockNode1);
        this.drawBlock(this.blockNode2);

        const gridGsNode2 = cc.instantiate(this.gridGs.node);
        this.gridGs.node.parent.addChild(gridGsNode2);
        const comp = gridGsNode2.getComponent(cc.Graphics);
        comp.lineWidth = 5;
        comp.strokeColor = cc.Color.GREEN;
        comp.clear();
        Game.ldSkillMgr.graphMoveLine = comp;

        Game.ldCooperateCtrl.setBlocks(this.blockNode1 , this.blockNode2);
        Game.ldCooperateCtrl.setBlocks(this.blockNode1 , this.blockNode2);
        


        Game.ldSkillMgr.graph = this.gridGs;
        Game.soMgr.setContainer(this.monsterNode , this.heroNode , this.effectTopNode , 
                                this.mapUINode , this.sommonNode , this.effectBottomNode , this.gridNode);
        Game.mapCtrl = Game.curLdGameCtrl.getMapCtrl();
        Game.ldCooperateCtrl.setCityWall(this.cityWall);
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

    private drawBlock(blockNode:cc.PolygonCollider) {
        const blockGs:cc.Graphics = blockNode.node.getComponent(cc.Graphics);
        const points = blockNode.points;
        for (let i = 0 ; i < points.length ; i++) {
            const p = points[i];
            if (i == 0) {
                blockGs.moveTo(p.x , p.y);
            } else {
                blockGs.lineTo(p.x , p.y);
            }
        }
        blockGs.close();
        blockGs.stroke();
        blockGs.fill();
    }
}
