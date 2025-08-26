import { PrizeRollItemData } from "../../common/AllEnum";
import { Handler } from "../../utils/Handler";
import { MathUtils } from "../../utils/MathUtils";
import TweenNum from "../../utils/TweenNum";
import BaseItem from "../../utils/ui/BaseItem";
import { NodeUtils } from "../../utils/ui/NodeUtils";
import { LdPrizeRollItem } from "./LdPrizeRollItem";


const { ccclass, property , menu } = cc._decorator;

@ccclass
@menu("Game/LD/ui/PrizeRollCol")
export class PrizeRollCol extends BaseItem {

    @property(LdPrizeRollItem)
    item:LdPrizeRollItem = null;

    @property(cc.Node)
    container:cc.Node = null;

    @property(cc.Node)
    maskImg:cc.Node = null;

    @property(cc.Color)
    selectColor:cc.Color = null;

    @property(cc.Color)
    unSelectColor:cc.Color = null;

    @property
    rollItemHeight: number = 80;

    private _items: cc.Node[] = [];
    private _minShowItems: number = 3;
    private _totalHeight: number = 0;
    private _rolling: boolean = false;
    private _rollId:string = '';

    protected onLoad(): void {
        // this._items.push(this.item.node);
        this._rollId = 'PrizeRollCol' + this.node.uuid ;
    }

    protected onDestroy(): void {
        TweenNum.kill(this._rollId);
    }

    public setData(data: PrizeRollItemData[], index?: number): void {
        this._rolling = false;
        super.setData(data, index);
        if (!data) return;
        this.maskImg.active = false;
        this.initItems();
    }

    private initItems() {
        this._items.length = 0;
        this.container.children.forEach(element => {
            this._items.push(element);

        });

        const datasLen = (this.data as PrizeRollItemData[]).length;
        let itemCount = Math.max(this._minShowItems, datasLen);
        if (itemCount % 2 == 1) itemCount++;
        this._totalHeight = itemCount * this.rollItemHeight;
        let len = Math.max(this._items.length, itemCount);

        for (let i = 0; i < len; i++) {
            let item = this._items[i];
            if (i < itemCount) {
                if (!item) {
                    item = cc.instantiate(this.item.node);
                    item.parent = this.container;
                    this._items.push(item);
                }
                item.active = true;
                item.y = i == len -1 ? -this.rollItemHeight : i * this.rollItemHeight;
                item.getComponent(BaseItem).setData(this.data[i % datasLen], i);
            } else if (item) {
                item.active = false;
            }
        }
        this.container.y = 0;
    }

    private _toY:number = 0;
    private _isSelect: boolean = false;
    rollToIndex(index: number , isSelect:boolean) {
        if (this._rolling) return;
        this._rolling = true;
        this.container.y = 0;
        this._toY = index * this.rollItemHeight + this._totalHeight * MathUtils.randomIntReal(3 , 5);
        this._isSelect = isSelect;
        TweenNum.to(0 , this._toY , 2.5 , Handler.create(this.refreshItemsPos , this) , this._rollId , Handler.create(this.rollEnd , this))
    }

    private _endCallBack:Handler = null;

    rollToData(data:PrizeRollItemData , endCallBack?:Handler) {
        this._endCallBack = endCallBack;
        for (let i = 0; i < this.data.length; ++i) {
            if ((this.data[i] as PrizeRollItemData).itemID == data.itemID) {
                this.rollToIndex(i , data.isSelect)
                return;
            }
        }
    }

    rollToEnd() {
        TweenNum.kill(this._rollId);
        this.refreshItemsPos(this._toY);
        this.rollEnd();
    }

    private rollEnd() {
        this._rolling = false;
        this.maskImg.active = true;
        this.maskImg.color = this._isSelect ? this.selectColor : this.unSelectColor;
        if (this._endCallBack ) {
            this._endCallBack.execute();
        }
    }


    private refreshItemsPos(value:number) {
        const index = Math.floor(value / this.rollItemHeight);
        const len = this._items.length;
        const len2 = index + len;
        const offsetY = value % this.rollItemHeight;
        let showIndex = 0;
        for (let i = index; i < len2; i++) {
            let item = this._items[i % len];
            item.y = (i == len2 - 1 ? - this.rollItemHeight :  showIndex * this.rollItemHeight) - offsetY;
            showIndex ++;
        }
    }


}