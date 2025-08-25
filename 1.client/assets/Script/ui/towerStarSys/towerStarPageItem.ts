// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Game from "../../Game";
import { ItemMgr } from "../../logic/item/ItemMgr";
import { NodePool } from "../../logic/sceneObjs/NodePool";
import BaseItem from "../../utils/ui/BaseItem";
import TowerStarTowerItem from "./towerStarTowerItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TowerStarPageItem extends BaseItem {

    @property(cc.Prefab)
    towerStarMonsterItem: cc.Prefab = null;

    _towerItems: Array<cc.Node> = null;

    @property(cc.Node)
    towerUiLayout: cc.Node = null;

    @property(cc.Node)
    gameUiLayout: cc.Node = null;

    @property(cc.Node)
    textUiLayout: cc.Node = null;

    @property(cc.Node)
    otherUiLayout: cc.Node = null;

    private starX: number = -349.75;
    private itemWid: number = 230.5;
    private _towerNodePool: { [key: string]: cc.NodePool; } = {};

    refresh() {
        if (!this.data) return;
        this._towerItems = this._towerItems || [];
        // if (this.index == 7) {
        //     this.setData(this.data.slice(0, 2), this.index);
        // }
        let dataLen = this.data.length;
        let i = 0;
        let bgAniInterval = 0.05;
        while (i < dataLen) {//更新towerItem数据
            // this.pages[i]=this.pages[i]||cc.instantiate(this.pageItem);
            if (this._towerItems[i]) {

                let towerItemCom: TowerStarTowerItem = this._towerItems[i].getComponent("towerStarTowerItem");
                towerItemCom.setPageCtrl(this);
                towerItemCom.unregisterRedPoint();
                towerItemCom.setData(this.data[i]);
                towerItemCom.registerRedPoint();
                towerItemCom.refresh(false);
                towerItemCom.refreshAniNode(i * bgAniInterval);
            } else {
                let pageItem = cc.instantiate(this.towerStarMonsterItem);
                this._towerItems.push(pageItem);
                let towerItemCom: TowerStarTowerItem = pageItem.getComponent("towerStarTowerItem");
                towerItemCom.setPageCtrl(this);
                towerItemCom.setData(this.data[i]);
                this.addItem(towerItemCom, i);
                // towerItemCom.registerRedPoint();
                towerItemCom.refresh(false);
                towerItemCom.refreshAniNode(i * bgAniInterval);
            }
            i++;
        }

        //移除多余的item
        if (dataLen < this._towerItems.length) {
            for (let i = dataLen, len = this._towerItems.length; i < len; i++) {
                let towerItemCom: TowerStarTowerItem = this._towerItems[i].getComponent("towerStarTowerItem");
                if (towerItemCom) {
                    this.removeItem(towerItemCom);
                }
                this._towerItems.splice(i, 1);
                i--;
                len--;
            }
        }
    }

    /**
     * 因为指引会把item提取到最顶层，将脱离这个UI,所有item父节点不适用layout，不然位置都会乱序！！
     * @param item 
     * @param index 
     */
    addItem(item: TowerStarTowerItem, index: number) {
        let x = this.starX + this.itemWid * index;
        let node = item.getTowerUiRoot();
        node.x = x;
        this.towerUiLayout.addChild(node);
        node = item.getGameUiRoot();
        node.removeFromParent();
        node.x = x
        this.gameUiLayout.addChild(node);
        node = item.getTextUiRoot();
        node.removeFromParent();
        node.x = x
        this.textUiLayout.addChild(node);
        node = item.getOtherUiRoot();
        node.removeFromParent();
        node.x = x
        this.otherUiLayout.addChild(node);
    }

    removeItem(item: TowerStarTowerItem) {
        let node = item.getTowerUiRoot();
        node.removeFromParent();
        node = item.getGameUiRoot();
        node.removeFromParent();
        node = item.getTextUiRoot();
        node.removeFromParent();
        node = item.getOtherUiRoot();
        node.removeFromParent();
        item.node.removeFromParent();
    }

    /**
     * 指引获取item
     * 要将item下的子节点都添加回item.node下，不然GG了
     *
     * @param index 
     */
    getItemNode(index: number): cc.Node {
        let item = this._towerItems[index];
        let towerItemCom: TowerStarTowerItem = item.getComponent("towerStarTowerItem");
        let node = towerItemCom.getTowerUiRoot();
        node.removeFromParent();
        node.x = this.starX + this.itemWid * index;
        this.towerUiLayout.addChild(node);

        let childNode = towerItemCom.getGameUiRoot();
        childNode.removeFromParent();
        childNode.x = 0;
        node.addChild(childNode);

        childNode = towerItemCom.getTextUiRoot();
        childNode.removeFromParent();
        childNode.x = 0;
        node.addChild(childNode);

        childNode = towerItemCom.getOtherUiRoot();
        childNode.removeFromParent();
        childNode.x = 0;
        node.addChild(childNode);

        return this._towerItems[index];
    }

    putPool(url: string, node: cc.Node) {
        let pool = this._towerNodePool[url];
        if (!pool) {
            pool = new cc.NodePool();
            this._towerNodePool[url] = pool;
        }
        pool.put(node);
    }

    getTowerNode(url: string): cc.Node {
        return this._towerNodePool[url] && this._towerNodePool[url].get();
    }

    onDestroy() {
        Object.values(this._towerNodePool).forEach(element => {
            element.clear();
        });
        Object.keys(this._towerNodePool).forEach(value=>{
            Game.resMgr.removeLoad(value);
        });
        this._towerNodePool = null;
    }
}
