import SysMgr from "../../common/SysMgr";
import Game from "../../Game";
import { GS_ChatFriend } from "../../net/proto/DMSG_Plaza_Sub_Chat";
import { Handler } from "../../utils/Handler";
import BaseItem from "../../utils/ui/BaseItem";

const { ccclass, property ,menu} = cc._decorator;

@ccclass
@menu("Game/ui/Chat/ChatList")
export class ChatList extends cc.Component {
    @property({
        type: cc.ScrollView,
        tooltip: "scrollView",
    })
    scrollView: cc.ScrollView = null


    @property({
        type: cc.Integer,
        tooltip: "Y方向单元格间距",
    })
    spaceY: number = 0;

    @property({
        type: cc.Node,
        tooltip: "单元格node",
    })
    itemOther: cc.Node = null;

    @property({
        type: cc.Node,
        tooltip: "单元格node",
    })
    itemSelf: cc.Node = null;

    //////////////////////////ui相关
    /**内容节点 */
    private content: cc.Node;
    /**列表显示区域宽高 */
    private contentSize: cc.Size;
    private contentInitPos: cc.Vec2 = cc.Vec2.ZERO;
    /**临时的一个单元 */
    private tempCell: cc.Node;
    private cellHeight: number;
    private tempComponent: BaseItem;
    private cells: Array<cc.Node> = [];
    private cellDic: any = {};
    ///////////////////////////数据相关

    private _length: number;
    private _array: Array<any>;


    private _maxScrollValue: number = 0;
    private _maxShowItemCount:number = 0;
    private _lastIndex = 0;
    private _itemYDic:{[key:string]:number } = {};
    ///////////////////////////逻辑相关

    start() {

    }

    onLoad() {
        this.content = this.scrollView.content;
        this.contentSize = this.content.parent.getContentSize();
        this.contentInitPos.x = this.content.position.x;
        this.contentInitPos.y = this.content.position.y;
        this.scrollView.node.on("scrolling", this.onScrolling, this);
        this.scrollView.node.on("scroll-ended", this.onScrollEnd, this);       
        if (this.array.length > 0) {
            this.refresh();
        }

        if (this.itemOther) {
            this.itemOther.removeFromParent();
        }

        if (this.itemSelf) {
            this.itemSelf.removeFromParent();
        }
    }

    onDestroy() {
        this.disposeCells();
    }

    /**滚动的时候通过 content 位置来计算显示区域的第一个单元格的index，如果跟之前不一致则刷新单元格 */
    private onScrolling(evt: any) {
        //console.log("onScrolling" , this.scorllProgress)
        let startIndex = -1;
        let moveValue: number = 0;
        
        moveValue = this.content.position.y - this.contentInitPos.y;
        if (moveValue < 0) moveValue = 0;
        if (moveValue > this._maxScrollValue) moveValue = this._maxScrollValue;

        moveValue += this.scrollView.node.height;

        let itemNode:cc.Node;
        for (let i = this._length - 1 ; i >= 0 ; i--) {
            itemNode = this.cellDic[i];
            if (!itemNode || (-itemNode.y) <= moveValue) {
                this._lastIndex = i;
                this.refresh();
                break;
            }
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

        this.initList();
        this.setContentHeight(this._length * this.cellHeight);

        if (this._length > 0) {
            this._lastIndex = this._length - 1;
            this.refresh();
            this.scrollView.scrollToBottom(0);
        }
    }

    addNew(data:any) {
        if (this._array.indexOf(data) == -1) {
            this._array.push(data);
        }
        this._length = this._array.length;
        let itemComp = this.initItem(this._array[this._length - 1] , this._length - 1);
        itemComp.node.y = -this.content.height;
        this.setContentHeight(this.content.height + itemComp.itemHeight);

        if (this._lastIndex > this._length - this._maxShowItemCount) {
            this._lastIndex = this._length - 1;
            this.refresh();

            if (this.content.height > this.scrollView.node.height) {
                this.scrollView.scrollToBottom(0);
            }

        }
    }

    private setContentHeight(value:number) {
        this.content.height = value;
        this._maxScrollValue = value - this.scrollView.node.height;
    }

    /**初始化 repeatX repeatY等数据 */
    private initList() {
        //确定render宽高
        if (this.tempCell == null) {
            let initItem = this.itemOther;
            this.tempCell = cc.instantiate(initItem) as cc.Node;
            this.tempComponent = this.tempCell.getComponent(BaseItem);
        }

        if (!this.cellHeight) {
            this.cellHeight = this.tempComponent.itemHeight;
        }
        
        if (!isNaN(this.contentSize.height)) {
            this._maxShowItemCount = Math.ceil(this.contentSize.height / (this.cellHeight + this.spaceY)) + 1;
        }
    }

    /**
     * 自检一下，以免被外部环境把cell释放了导致报错
     */
    private checkCells() {
        let len = this.cells.length;
        let i = 0;
        let change:boolean = false;
        for (i = len - 1 ; i >= 0 ; i--) {
            if (!this.cells[i] || !this.cells[i].isValid) {
                this.cells.splice(i, 1);
                change = true;
            }
        }

        if (change) {
            this.cellDic = {};
            len = this.cells.length;
            for (i = 0 ; i < len ; i++) {
                this.cellDic[i] = this.cells[i];
            }
        }
    }

    private addCell(cell: cc.Node , index:number) {
        this.cellDic[index] = cell;
        this.cells.push(cell);
        cell.active = true;

        this.content.addChild(cell);
    }

    private _preShowIndex:number = -1;
    public refresh() {
        let min = Math.max(0 , this._lastIndex - this._maxShowItemCount);
        let addHeight:number = 0;
        let dy:number = 0;
        for (let i = this._lastIndex ; i >= min ; i--) {
            if (!this.cellDic[i]) {
                let data = this._array[i] as GS_ChatFriend;
                let itemComp = this.initItem(data , i);
                dy = itemComp.itemHeight - this.cellHeight;
                if (dy > 0) {
                    addHeight += dy;
                }
            } else {
                this.cellDic[i].active = true;
            }
        }

        //重设整体大小与子节点位置
        let itemNode:cc.Node;
        if (addHeight > 0 ) {
            this.setContentHeight(this.content.height + addHeight)
            if (this._lastIndex < this._length - 1) {
                for (let i = this._lastIndex ; i < this._length ; i++) {
                    itemNode = this.cellDic[i];
                    if (itemNode) {
                        itemNode.y -= addHeight;
                    }
                }
            }

            let tempY = - min * this.cellHeight;
            for (let i = min ; i <= this._lastIndex ; i++) {
                itemNode = this.cellDic[i];
                if (itemNode) {
                    itemNode.y = tempY;
                }
                tempY -= this._itemYDic[i];
            }

            this.content.y += addHeight;
        }

        

        //显示区域外的隐藏
        if (this._preShowIndex != -1 && this._preShowIndex != this._lastIndex) {
            let min2 = Math.max(0 , this._preShowIndex - this._maxShowItemCount);
            for (let i = this._preShowIndex ; i >= min2 ; i--) {
                if (i > this._lastIndex || i < min) {
                    let item = this.cellDic[i];
                    if (item) {
                        item.active = false;
                    }
                }
            }
        }

        this._preShowIndex =  this._lastIndex;  
    }


    private initItem(data:any , index:number) {
        let temp = data.nrecvactordbid == Game.actorMgr.nactordbid ? this.itemOther : this.itemSelf;
        let itemNode = cc.instantiate(temp);
        this.addCell(itemNode , index);
        let itemComp = itemNode.getComponent(BaseItem);
        itemComp.setData(data , index);
        this._itemYDic[index] = itemComp.itemHeight;

        itemNode.y = - index * this.cellHeight;
        return itemComp;
    }


    public disposeCells() {
        while (this.cells.length) {
            let cell: cc.Node = this.cells.pop();
            cell.stopAllActions();
            cell.removeFromParent();
        }
        this.cellDic = {};
    }

    

    /**X方向单元格数量*/
    public getRepeatX(): number {
        return 1;
    }

    /**Y方向单元格数量*/
    public getRepeatY(): number {
        return 0;
    }


    public getContent(): cc.Node {
        return this.content;
    }

    

}