

import { Handler } from "../Handler";
import BaseItem from "./BaseItem";
import { HorizontalAnchor } from "./GroupImage";

const { ccclass, property, menu } = cc._decorator;
/**
 * 物品列表
 */
@ccclass
@menu("Game/utls/GoodsBox")
export class GoodsBox extends cc.Component {

    @property({
        type: cc.Node,
        tooltip: "单元格node",
    })
    item: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab:cc.Prefab = null;

    @property({
        type: cc.Enum(HorizontalAnchor),
    })
    hAnchor:HorizontalAnchor = HorizontalAnchor.NONE;

    @property
    space:number = 0;

    // @property
    // doSeparate:boolean = false;

    @property(cc.Boolean)
    showCardEffect:boolean = true;

    private _itemClickCb:Handler = null;
    private _select:boolean = false;

    private _cells:cc.Node[] = [];
    private _array:any[] = [];
    private _length:number = 0;

    start() {

    }

    onLoad() {
        if (this.item) {
            this.item.active = false;
        }
        // this._cells.push(this.item);
    }

    onDestroy() {
        //super.onDestroy();
        this.disposeCells();
    }

  
    /**获取数据 */
    get array(): Array<any> {
        if (this._array == null)
            return [];
        return this._array;
    }

    /**设置list的要显示的数据列表 */
    set array(value: Array<any>) {
        this._array = value || [];
        this._length = this._array.length;
        this.refresh();
    }

    set itemClickCb(h:Handler) {
        this._itemClickCb = h;
        this._select = true;
    }

    getCell(index:number):cc.Node {
        return this._cells[index];
    }

    private refresh() {

        let startX:number = 0;
        let totalWid:number = -1;

        let itemNode:cc.Node = null;
        for (let i = 0 ; i < this._length ; i++) {
            itemNode = this._cells[i];
            if (!itemNode) {
                itemNode = cc.instantiate(this.item || this.itemPrefab) as cc.Node;
                this._cells[i] = itemNode;
                this.node.addChild(itemNode);
            }
            itemNode.active = true;
            if (this._select) {
                itemNode.on('click' , this.onItemClick ,this);
            }

            let itemComp = itemNode.getComponent(BaseItem);

            if (itemComp) {
                // itemComp.doSeparate = this.doSeparate;
                itemComp.setData(this._array[i] , i);
            }

            let width = itemNode.width;
            if (this.hAnchor == HorizontalAnchor.Left) {
                itemNode.x = startX + width * 0.5;
                startX += width + this.space;
            } else if (this.hAnchor == HorizontalAnchor.Right) {
                itemNode.x = startX - width * 0.5;
                startX -= (width + this.space);
            } else if (this.hAnchor == HorizontalAnchor.Center) {
                if (totalWid == -1) {
                    totalWid = (width + this.space)* this._length - this.space;
                    startX = -totalWid * 0.5 + width * 0.5;
                }
                itemNode.x = startX;
                startX += width + this.space;
            }

            // itemComp.syncSeparateChildrenState();
        }

        let len = this._cells.length;
        if (len > this._length) {
            for (let i = this._length ; i < len ; i++) {
                itemNode = this._cells[i];
                itemNode.active = false;
                // itemNode.getComponent(BaseItem).syncSeparateChildrenState();
            }
        }
    }

    private onItemClick(evt:any) {
        if (!this._itemClickCb) return;
        if (evt) {
            let itemComp: BaseItem = evt.node.getComponent(BaseItem);
            this._itemClickCb.executeWith(itemComp.data);
        }
    }


    private disposeCells() {
        while (this._cells.length) {
            let cell: cc.Node = this._cells.pop();
            cell.stopAllActions();
            if (cell.isValid) {
                cell.getComponent(BaseItem).node.removeFromParent();
            }
        }
    }

    getCells():cc.Node[] {
        return this._cells;
    }





}