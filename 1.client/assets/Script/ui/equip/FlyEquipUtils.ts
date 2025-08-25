import { EResPath } from "../../common/EResPath";
import { EventEnum } from "../../common/EventEnum";
import { GameEvent } from "../../utils/GameEvent";
import { NodeUtils } from "../../utils/ui/NodeUtils";
import { UiManager } from "../../utils/UiMgr";

export class FlyEquipUtils {

    private static _indexs:number[] = [];
    private static _icos:cc.Node[] = [];


    static flyEquip(towerInfo , indexs:number[] , icos:cc.Node[]) {
        this._indexs = indexs;
        this.createIco(icos);
        GameEvent.on(EventEnum.AFTER_SHOW_DIALOG , this.onAfterShowDialog , this);
        UiManager.showDialog(EResPath.TOWER_STAR_LV_UP_VIEW ,{towerInfo:towerInfo , flyEquipIndex:this._indexs} );
    }

    private static onAfterShowDialog(name:string) {
        if (name == 'towerStarLvUpView') {
            GameEvent.off(EventEnum.AFTER_SHOW_DIALOG , this.onAfterShowDialog , this);
            this.doFly();
        }
    }

    private static createIco(icos:cc.Node[]) {
        this._icos.length = 0;
        let len = icos.length;
        let ico:cc.Node;
        for (let i = 0 ; i < len ; i++) {
            ico = icos[i];
            let sp = ico.getComponent(cc.Sprite);
            if (!sp) continue;
            let sf = sp.spriteFrame;
    
            let createWorldPos: cc.Vec2 = ico.convertToWorldSpaceAR(cc.Vec2.ZERO_R);
            let createNodePos: cc.Vec2 = UiManager.topLayer.convertToNodeSpaceAR(createWorldPos);
    
            let node: cc.Node = new cc.Node()
            node.width = ico.width;
            node.height = ico.height;
            node.scale = ico.scale;
            node.addComponent(cc.Sprite).spriteFrame = sf;
    
            node.x = createNodePos.x;
            node.y = createNodePos.y;
    
            this._icos.push(node);
            UiManager.topLayer.addChild(node);
        }
    }

    private static doFly() {
        let len = this._indexs.length;
        if (this._icos.length == 0 || len == 0) return;
        for (let i = 0 ; i < len ; i++) {

            let node = GameEvent.dispathReturnEvent('get_tower_equip' , (this._indexs[i] + 1));
            let ico = this._icos[i];
            if (!node || !ico) continue;

            let toWorldPos: cc.Vec2 = node.convertToWorldSpaceAR(cc.Vec2.ZERO_R);
            let toNodePos: cc.Vec2 = UiManager.topLayer.convertToNodeSpaceAR(toWorldPos);
    
            NodeUtils.to(ico, 0.5, {x:toNodePos.x , y:toNodePos.y}, 'sineIn' , this.flyIcoEnd, ico, this);
        }
    }

    private static flyIcoEnd(ico:cc.Node) {
        GameEvent.emit(EventEnum.FLY_EQUIP_END);
        if (ico) {
            ico.removeFromParent();
            ico = null;
        }
    }
}