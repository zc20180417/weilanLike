import { EventEnum } from "../../common/EventEnum";
import SysMgr from "../../common/SysMgr";
import { GameEvent } from "../GameEvent";
import { Handler } from "../Handler";
import BaseItem from "./BaseItem";
import ListDynamic from "./ListDynamic";

const { ccclass, property, menu } = cc._decorator;

/**
 * 列表类
 */
@ccclass
@menu("Game/utls/List")
export default class List extends cc.Component {
    @property({
        type: cc.ScrollView,
        tooltip: "scrollView",
    })
    scrollView: cc.ScrollView = null

    @property({
        type: cc.Prefab,
        tooltip: "单元格的prefab",
    })
    itemPrefab: cc.Prefab = null;

    @property({
        type: cc.Integer,
        tooltip: "X方向单元格数量，填0默认通过宽高计算",
    })
    repeatX: number = 0;

    @property({
        type: cc.Integer,
        tooltip: "Y方向单元格数量,填0默认通过宽高计算",
    })
    repeatY: number = 0;

    @property({
        type: cc.Integer,
        tooltip: "X方向单元格间距",
    })
    spaceX: number = 0;

    @property({
        type: cc.Integer,
        tooltip: "Y方向单元格间距",
    })
    spaceY: number = 0;

    @property({
        type: cc.Node,
        tooltip: "单元格node",
    })
    item: cc.Node = null;

    @property({
        tooltip: "是否需要检测父节点尺寸改变",
    })
    needCheckSize: boolean = false;

    @property({
        tooltip: "当显示数量不足可展示数量时是否需要居中显示",
    })
    isCenter:boolean = false;
    //////////////////////////ui相关
    /**内容节点 */
    private content: cc.Node;
    /**是否水平滚动 */
    private horizontal: boolean;
    /**列表显示区域宽高 */
    private contentSize: cc.Size;
    private contentInitPos: cc.Vec2 = cc.Vec2.ZERO;
    
    /**临时的一个单元 */
    private tempCell: cc.Node;
    private cellWidth: number;
    private cellHeight: number;
    private tempComponent: BaseItem;
    private cells: Array<cc.Node> = [];
    private cellDic: any = {};
    ///////////////////////////数据相关
    public selectEnable: boolean = false;
    private _selectedIndex: number = -1;
    private _length: number;
    private _array: Array<any>;
    private _startIndex: number;
    private _repeatX2: number;
    private _repeatY2: number;
    private _renderNumChange: boolean;
    private _renderNeedRebuild: boolean = true;
    private _showNullDataCell: boolean;
    private _clickFunc: Handler;
    private _selectHandler: Handler;
    private _maxScrollValue: number = 0;
    private _scorllProgress: number = 0;
    private _pageDownHandler: Handler = null;
    ///////////////////////////逻辑相关
    private _changeCellHandler: Handler;
    private _changeStartIndexCallBack: Handler;
    private _dynamicComp: ListDynamic = null;
    private _dynamicShowItem: boolean = false;
    private _offsetYSymbol:number = 1;
    start() {

    }

    onLoad() {
        this._changeCellHandler = new Handler(this.changeCells, this);
        this.content = this.scrollView.content;
        this.horizontal = this.scrollView.horizontal;
        this.contentSize = this.content.parent.getContentSize();
        this.contentInitPos.x = this.content.position.x;
        this.contentInitPos.y = this.content.position.y;
        this.scrollView.node.on("scrolling", this.onScrolling, this);
        this.scrollView.node.on("scroll-ended", this.onScrollEnd, this);
        this.content.parent.on("size-changed", this.contentSizeChanged, this);
        this._offsetYSymbol = this.content.anchorY == 0 ? 1 : -1;
        this._dynamicComp = this.node.getComponent(ListDynamic);
        if (this.array.length > 0) {
            this.refresh();
        }

        if (this.item) {
            this.item.removeFromParent();
        }

    }

    protected onEnable(): void {
        GameEvent.on(EventEnum.LIST_STOP_MOVE , this.onStopMove, this);
    }

    protected onDisable(): void {
        GameEvent.off(EventEnum.LIST_STOP_MOVE , this.onStopMove, this);
    }

    private onStopMove() {
        this.scrollView.stopAutoScroll();
    }

    onDestroy() {
        this.disposeCells();
    }

    private resetSize() {
        if (this.needCheckSize) {
            let size: cc.Size = this.scrollView.node.getContentSize();
            if (size.height != this.contentSize.height || size.width != this.contentSize.width) {
                this.contentSize = this.scrollView.node.getContentSize();
                let curY = this.contentSize.height * (1 - this.content.parent.anchorY);
                if (this.contentInitPos.y != curY) {
                    this.contentInitPos.y = curY;
                }
                this._renderNeedRebuild = true;
                this._dynamicShowItem = true;
                SysMgr.instance.callLater(this._changeCellHandler , true);
            }
        }
    }

    private contentSizeChanged(evt: any) {
        this.resetSize();
        this.onScrolling(null);
    }

    /**滚动的时候通过 content 位置来计算显示区域的第一个单元格的index，如果跟之前不一致则刷新单元格 */
    private onScrolling(evt: any) {
        //console.log("onScrolling" , this.scorllProgress)
        let startIndex = -1;
        let moveValue: number = 0;
        if (this.horizontal) {
            moveValue = this.contentInitPos.x - this.content.position.x;
            if (moveValue < 0) moveValue < 0;
            if (moveValue > this._maxScrollValue) moveValue = this._maxScrollValue;

            if (this._otherItem && moveValue > this._otherItem.x) {
                moveValue -= this._otherWidth;
            }

            startIndex = Math.floor((moveValue) / (this.cellWidth + this.spaceX));
            startIndex = startIndex * this.getRepeatY();
        } else {
            moveValue = (this.content.position.y - this.contentInitPos.y) * -this._offsetYSymbol;
            if (moveValue < 0) moveValue = 0;
            if (moveValue > this._maxScrollValue) moveValue = this._maxScrollValue;
            if (this._otherItem && moveValue > -this._otherItem.y) {
                moveValue -= this._otherHeight;
            }
            startIndex = Math.floor((moveValue) / (this.cellHeight + this.spaceY));
            startIndex = startIndex * this.getRepeatX();
            //this.offset = (moveValue) % (this.cellHeight + this.spaceY);
        }

        if (startIndex < 0) startIndex = 0;

        if (startIndex != this._startIndex) {
            this.startIndex = startIndex;
        }

        this._scorllProgress = moveValue / this._maxScrollValue;
        if (this._scorllProgress > 0.8 && this._pageDownHandler) {
            this._pageDownHandler.execute();
        }
    }

    private onScrollEnd(evt: any) {
        // console.log("onScrollEnd", this.content.x);
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
        this._dynamicShowItem = true;
        //重设selectedIndex
        let temp = this._selectedIndex;
        this._selectedIndex = -1;
        this.selectedIndex = temp < this._length ? temp : length - 1;
        //重设startIndex
        this.startIndex = this._startIndex;
        // this.refresh();
    }

    /**开始索引*/
    get startIndex(): number {
        return this._startIndex;
    }

    set startIndex(value: number) {
        this._startIndex = value > 0 ? value : 0;
        this.refresh();

        if (this._changeStartIndexCallBack) {
            this._changeStartIndexCallBack.executeWith(this._startIndex);
        }
    }

    setStartIndex(value: number) {
        this._startIndex = value > 0 ? value : 0;
        let maxIndex = 0;
        if (this.horizontal) {
            maxIndex = Math.floor((this._maxScrollValue) / (this.cellWidth + this.spaceX));
        } else {
            maxIndex = Math.floor((this._maxScrollValue) / (this.cellHeight + this.spaceY));
        }

        if (this._startIndex > maxIndex) {
            this._startIndex = maxIndex;
        }

        this.scrollView.stopAutoScroll();
        let moveValue: number = 0;
        if (this.horizontal) {
            moveValue = Math.floor(this._startIndex / this.getRepeatY()) * (this.cellWidth + this.spaceX);
            if (moveValue > this._maxScrollValue) {
                moveValue = this._maxScrollValue;
            }
            this.content.x = this.contentInitPos.x - moveValue;
        } else {
            moveValue = Math.floor(this._startIndex / this.getRepeatX()) * (this.cellHeight + this.spaceY);
            if (moveValue > this._maxScrollValue) {
                moveValue = this._maxScrollValue;
            }
            this.content.y = this.contentInitPos.y + moveValue;
        }
        this.changeCells();
    }

    scrollToIndex(index: number, time: number = 0.3) {
        this.scrollView.stopAutoScroll();
        if (index < 0) index = 0;
        if (index >= this._length) index = this._length - 1;

        let moveValue: number = 0;
        if (this.horizontal) {
            moveValue = Math.floor(index / this.getRepeatY()) * (this.cellWidth + this.spaceX);
            moveValue = this.contentInitPos.x - moveValue;
            this.scrollView.scrollToPercentHorizontal((Math.abs(moveValue) / (this.content.width - this.contentSize.width)), time);
        } else {
            moveValue = Math.floor(index / this.getRepeatX()) * (this.cellHeight + this.spaceY);
            moveValue = this.contentInitPos.y - moveValue;
            let r = (Math.abs(moveValue) / (this.content.height - this.contentSize.height));
            if (this._offsetYSymbol == -1) r = 1- r;
            this.scrollView.scrollToPercentVertical(r, time);
            //cc.log('--------------r:' , r);
        }

    }

    set changeStartIndexCallBack(handler: Handler) {
        this._changeStartIndexCallBack = handler;
    }

    /**初始化 repeatX repeatY等数据 */
    private initList() {
        //确定render宽高
        if (this.tempCell == null) {
            let initItem = this.itemPrefab ? this.itemPrefab : this.item;
            this.tempCell = cc.instantiate(initItem) as cc.Node;
            this.tempComponent = this.tempCell.getComponent(BaseItem);
        }

        if (!this.cellWidth) {
            this.cellWidth = this.tempComponent.itemWidth;
        }

        if (!this.cellHeight) {
            this.cellHeight = this.tempComponent.itemHeight;
        }

        //计算render数量
        if (this.repeatX < 1 && !isNaN(this.contentSize.width)) {
            this.setRepeatX2(Math.ceil(this.contentSize.width / (this.cellWidth + this.spaceX)));
        }
        if (this.repeatY < 1 && !isNaN(this.contentSize.height)) {
            this.setRepeatY2(Math.ceil(this.contentSize.height / (this.cellHeight + this.spaceY)));
        }
    }

    /**
     * 自检一下，以免被外部环境把cell释放了导致报错
     */
    private checkCells() {
        let len = this.cells.length;
        let i = 0;
        let change: boolean = false;
        for (i = len - 1; i >= 0; i--) {
            if (!this.cells[i] || !this.cells[i].isValid) {
                this.cells.splice(i, 1);
                change = true;
            }
        }

        if (change) {
            this.cellDic = {};
            len = this.cells.length;
            for (i = 0; i < len; i++) {
                this.cellDic[i] = this.cells[i];
            }

            this._renderNumChange = true;
        }
    }

    private changeCells() {
        if ((this.itemPrefab == null && this.item == null) || this.isValid == false || this.content == null) return;

        //是否需要重建render
        if (this._renderNeedRebuild) {
            this.initList();
            this._renderNeedRebuild = false;
            this._renderNumChange = true;
            // this.disposeCells();
        } else {
            this.checkCells();
        }

        //render数量是否改变
        let numX: number = this.horizontal ? this.getRepeatY() : this.getRepeatX();
        let numY: number = this.horizontal ? this.getRepeatX() : this.scrollView.vertical ? this.getRepeatY() : this.getRepeatY();
        if (this.horizontal || this.scrollView.vertical) {
            numY += 1;
        }
        //计算显示区域总大小，关联scrollbar的滚动区域的
        if (this.horizontal) {
            this.content.width = Math.max(Math.ceil(this._length / this.getRepeatY()) * (this.cellWidth + this.spaceX) - this.spaceX, this.contentSize.width) + 10 + this._otherWidth;
        } else {
            this.content.height = Math.max(Math.ceil(this._length / this.getRepeatX()) * (this.cellHeight + this.spaceY) - this.spaceY, this.contentSize.height) + 1 + this._otherHeight;
        }

        //实例化显示区域的单元格，固定这么多，循环使用
        var cell: cc.Node;
        let initItem = this.itemPrefab ? this.itemPrefab : this.item;
        let totalNum: number = numX * numY;
        if (this._renderNumChange || (!this.cells || this.cells.length != totalNum)) {
            this._renderNumChange = false;
            while (this.cells.length < totalNum) {
                cell = cc.instantiate(initItem) as cc.Node;
                this.addCell(cell);
            }

            while (this.cells.length > totalNum) {
                cell = this.cells.pop();
                cell.removeFromParent();
            }

            const len = this.cells.length;
            for (let i = 0 ; i < len ; i++) {
                this.cellDic[i] = this.cells[i];
            }
        }
        this.refreshItemIndex();
        this.refreshCellPos();
        this.changeCellState();
        if (this._dynamicShowItem && this._dynamicComp) {
            this._dynamicComp.play(this.cells);
            this._dynamicShowItem = false;
        }
        if (this.horizontal) {
            this._maxScrollValue = this.content.width - this.scrollView.node.width;
        } else {
            this._maxScrollValue = this.content.height - this.scrollView.node.height;
        }
    }

    private refreshItemIndex() {
        let numX: number = this.horizontal ? this.getRepeatY() : this.getRepeatX();
        let numY: number = this.horizontal ? this.getRepeatX() : this.scrollView.vertical ? this.getRepeatY() : this.getRepeatY();
        if (this.horizontal || this.scrollView.vertical) {
            numY += 1;
        }
        let length = this.cells.length;
        let startIndex = this._startIndex % length;
        let index = 0;
        for (let i: number = 0; i < numY; i++) {
            for (let j: number = 0; j < numX; j++) {
                this.cells[index] = this.cellDic[startIndex];
                index++;
                startIndex++;
                if (startIndex >= length) startIndex = 0;
            }
        }
    }

    private refreshCellPos() {
        //render数量是否改变
        let numX: number = this.horizontal ? this.getRepeatY() : this.getRepeatX();
        let numY: number = this.horizontal ? this.getRepeatX() : this.scrollView.vertical ? this.getRepeatY() : this.getRepeatY();
        if (this.horizontal || this.scrollView.vertical) {
            numY += 1;
        }
        var cell: cc.Node;
        //渲染排列render
        let i: number = this._startIndex;
        let cellIndex: number = 0;
        let cellX: number = 0, cellY: number = 0;
        let itemComp: BaseItem;
        let pos: cc.Vec2 = cc.Vec2.ZERO;
        let initY: number = 0;
        let initX: number = 0;
        let indexY: number = 0;
        // let separateRender:SeparateRender;
        const offsetX = this.content.anchorX == 0 && this.tempCell.anchorX != 0 ? this.cellWidth * this.tempCell.anchorX : 0;
        const offsetY = this.content.anchorY == 1 && this.tempCell.anchorY != 1 ? this.cellHeight * this.tempCell.anchorY * this._offsetYSymbol : 0;

        //暂时只支持纵向
        if (this.isCenter && !this.horizontal) {
            const dataLen = this.array.length;
            if (dataLen < numX) {
                const wid = dataLen * this.cellWidth + (dataLen - 1) * this.spaceX;
                initX = (this.content.width - wid) * 0.5;
                initY = (this.content.height - this.cellHeight) * 0.5 * this._offsetYSymbol;

            } else if (dataLen < (numX * (numY - 2))) {
                const row = Math.ceil(dataLen / numX);
                const hei = row * this.cellHeight + (row - 1) * this.spaceY;
                initY = this._offsetYSymbol * (this.content.height - hei) * 0.5;
            }
        }

        let otherIndex = 0;
        if (this._otherItem) {
            otherIndex = this._otherIndex == -1 || this._otherIndex > this._length ? this._length : this._otherIndex;
            indexY = Math.floor(otherIndex / numX);
            if (!this.horizontal) {
                //布局显示
                cellY = (initY + this._offsetYSymbol * (indexY * (this.spaceY + this.cellHeight)));
                cellX = initX;
            } else {
                //布局显示
                cellY = 0;
                cellX = initX + indexY * (this.spaceX + this.cellWidth);
            }

            this._otherItem.x = cellX + offsetX;
            this._otherItem.y = cellY + offsetY;
        }

        let isAfterOtherItem = false;
        for (let k: number = 0; k < numY; k++) {
            indexY = Math.floor(i / numX);
            for (let l: number = 0; l < numX; l++) {
                isAfterOtherItem = this._otherItem && i >= otherIndex;
                if (!this.horizontal) {
                    //布局显示
                    cellY = (initY + this._offsetYSymbol * indexY * (this.spaceY + this.cellHeight));
                    cellX = (l * (this.spaceX + this.cellWidth)) + initX;
                    if (isAfterOtherItem) {
                        cellY += this._otherHeight * this._offsetYSymbol;
                    }
                } else {
                    //布局显示
                    cellY = this._offsetYSymbol * (l * (this.spaceY + this.cellHeight));
                    cellX = initX + indexY * (this.spaceX + this.cellWidth) + this._otherWidth;

                    if (isAfterOtherItem) {
                        cellX += this._otherWidth;
                    }
                }

                //cell
                var data: any = null;
                if (this.array)
                    data = this.array[i];
                cell = this.cells[cellIndex];
                itemComp = cell.getComponent(BaseItem);
                if (data) itemComp.setData(data, i);
                cell.active = data || this._showNullDataCell;
                cell.name = itemComp.name + (k * numX + l);
                pos.x = cellX; pos.y = cellY;
                cell.x = pos.x + offsetX;
                cell.y = pos.y + offsetY;
                i++;
                cellIndex++;

                // separateRender = cell.getComponent(SeparateRender);
                // if (separateRender) {
                //     separateRender.syncSeparateChildrenState();
                // }
            }
        }
    }

    

    private changeCellState() {
        if (!this.selectEnable) return;
        let len = this.cells.length;
        let item: BaseItem;
        for (let i = 0; i < len; i++) {
            item = this.cells[i].getComponent(BaseItem);
            item.selected = item.index == this._selectedIndex;
        }
    }

    private addCell(cell: cc.Node) {
        this.cellDic[this.cells.length] = cell;
        this.cells.push(cell);
        cell.on("click", this.onCellClick, this);
        this.content.addChild(cell);
    }

    private onCellClick(evt: any) {
        if (evt) {
            let itemComp: BaseItem = evt.node.getComponent(BaseItem);
            if (this._clickFunc != null) {
                this._clickFunc.executeWith(itemComp);
            }
            if (this.selectEnable && itemComp.canSelect) {
                this.selectedIndex = itemComp.index;
            }
        }
    }

    public refresh() {
        SysMgr.instance.exeCallLater(this._changeCellHandler);
        //this.exeCallLater(this.changeCells);
    }

    public setSelectedHandler(handler: Handler) {
        this._selectHandler = handler;
    }

    public setClickHandler(handler: Handler) {
        this._clickFunc = handler;
    }

    get selectedIndex(): number {
        return this._selectedIndex;
    }

    set selectedIndex(value: number) {
        if (this._selectedIndex == value) return;
        this._selectedIndex = value;
        this.changeCellState();
        if (this._selectHandler != null) {
            this._selectHandler.executeWith(value, this._array[value]);
        }
    }

    get selectedItem():cc.Node {
        return this.cells[this._selectedIndex - this._startIndex];
    }

    set pageDownHandler(handler: Handler) {
        this._pageDownHandler = handler;
    }

    public disposeCells() {
        while (this.cells.length) {
            let cell: cc.Node = this.cells.pop();
            cell.stopAllActions();
            cell.removeFromParent();
        }
        this.cellDic = {};
    }

    protected setRepeatX2(value: number) {
        if (this._repeatX2 != value) {
            this._repeatX2 = value;
            this._renderNumChange = true;
        }
    }

    protected setRepeatY2(value: number) {
        if (this._repeatY2 != value) {
            this._repeatY2 = value;
            this._renderNumChange = true;
        }
    }

    /**X方向单元格数量*/
    public getRepeatX(): number {
        return this.repeatX > 0 ? this.repeatX : this._repeatX2 > 0 ? this._repeatX2 : 1;
    }

    /**Y方向单元格数量*/
    public getRepeatY(): number {
        return this.repeatY > 0 ? this.repeatY : this._repeatY2 > 0 ? this._repeatY2 : 1;
    }

    get scorllProgress(): number {
        return this._scorllProgress;
    }

    public getContent(): cc.Node {
        return this.content;
    }

    getCell(index: number) {
        if (index < this._startIndex || index > this._startIndex + Math.floor(this.cells.length * 0.5)) {
            this.setStartIndex(index);
        }

        return this.cells[index - this._startIndex];
    }

    refreshItem(index: number, data: any = null) {
        if (data == null) {
            data = this._array[index];
        } else {
            this._array[index] = data;
        }

        if (this._startIndex <= index && index <= this._startIndex + this.getRepeatX() * this.getRepeatY()) {
            let showIndex = index - this._startIndex;
            this.cells[showIndex].getComponent(BaseItem).setData(data, showIndex);
        }
    }


    ////////////////////////////////////////////////

    private _otherItem:cc.Node = null;
    private _otherIndex:number = 0;
    private _otherWidth:number = 0;
    private _otherHeight:number = 0;

    /**
     * 添加一个额外节点到scorllView
     * @param item 
     * @param index -1添加到末尾，0-n。添加到具体的位置
     */
    addOtherItem(item:cc.Node , index:number = -1) {
        this._otherItem = item;
        this._otherIndex = index;
        this._otherWidth = item.width;
        this._otherHeight = item.height;
        if (item.parent) {
            item.removeFromParent(false);
        }
        this.content.addChild(item);
        this.refresh();
    }

    /**移除额外节点 */
    removeOtherItem() {
        if (!this._otherItem) return;
        this._otherItem.removeFromParent();
        this._otherItem = null;

        this._otherIndex = 0;
        this._otherWidth = 0;
        this._otherHeight = 0;
        this.refresh();
    }
}
