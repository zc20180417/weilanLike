
import { EventEnum } from '../../common/EventEnum';
import { GameEvent } from '../GameEvent';

import { Handler } from './../Handler';
import List from "./List";

const { ccclass, property ,menu} = cc._decorator;

@ccclass
@menu("Game/utls/ComBox")
export class ComBox extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;
    @property(cc.Node)
    btn : cc.Node = null;

    @property(List)
    list: List = null;

    data: any = null;

    private values:any[] = [];
    private _rootParent:cc.Node = null;
    private _clickHideParent:cc.Node = null;
    private _listInitPos:cc.Vec2 = cc.Vec2.ZERO;
    private _listParnetInitNode:cc.Node;
    private _clickHandler:Handler = new Handler(this.onSelect , this);

    onLoad() {

        this.list.setClickHandler(this._clickHandler);
        this.btn.on("click" , this.onComBoxClick , this);
        if (this._rootParent == null) {
            this.rootParent = this.node.parent ? this.node.parent : this.node;
        } 
        
        if (this._clickHideParent == null) {
            this.clickHideParent = this.node.parent;
        }
        this._listInitPos.x = this.list.node.x;
        this._listInitPos.y = this.list.node.y;
        this._listParnetInitNode = this.list.node.parent;
        GameEvent.on(EventEnum.COMBOX_SHOW , this.onComBoxShow , this);
    }

    onDestroy () {
        GameEvent.off(EventEnum.COMBOX_SHOW , this.onComBoxShow , this);
    }

    /**设置某个当前选中的数据 */
    public setCurSelectData(data:any) {
        this.data = data;
        this.label.string = data.text;
        GameEvent.emit(EventEnum.COMBOX_SELECT , this.node);
    }

    /**设置某个当前选中的数据 */
    public setCurSelectDataByValue(value:any) {
        this.values.forEach(element => {
            if (element.value == value) {
                this.setCurSelectData(element);
            }
        });
    }

    /**设置某个当前选中的数据 */
    public setCurSelectDataByProperty(propertyValue:any , propertyName:string) {
        this.values.forEach(element => {
            if (element.value[propertyName] == propertyValue) {
                this.setCurSelectData(element);
            }
        });
    }


    /**接收点击事件的父容器被点击 */
    private onClick(evt:any) {
        this.hideList();
    }

    /**选中某条数据 */
    private onSelect(data:any , index:number) {
        this.setCurSelectData(data);
        this.hideList();
    }

    /**当该组件的按钮被点击 */
    private onComBoxClick(evt:any) {
        this.list.scrollView.node.active = !this.list.scrollView.node.active;
        if (this.list.scrollView.node.active == true) {
            this.list.array = this.values;

            this.calcListPos();
            GameEvent.emit(EventEnum.COMBOX_SHOW , this.node);
        }
    }

    get dataSource():any[] {
        return this.values;
    }

    /**设置下拉列表显示数据 */
    set dataSource(datas:any[]) {
        this.values = datas;
        if (datas && datas.length > 0) {
            this.setCurSelectData(datas[0]);
        }
    }

    /**设置下拉列表显示的父容器(显示层级往上靠，避免被同层级下面的节点盖住) */
    set rootParent(parent:cc.Node) {
        this._rootParent = parent;
    }

    /**设置接收点击事件的父容器（点击该节点，关闭所有已显示的其他下拉列表） */
    set clickHideParent(parent:cc.Node) {
        if (this._clickHideParent) {
            this._clickHideParent.off(cc.Node.EventType.TOUCH_START , this.onClick , this);
        }
        this._clickHideParent = parent;
        this._clickHideParent.on(cc.Node.EventType.TOUCH_START , this.onClick , this);
    }

    /**计算下list的显示位置，要显示在最顶层，不然容易被下面的节点盖住 */
    private calcListPos() {
        let worldPos:cc.Vec2 = this._listParnetInitNode.convertToWorldSpaceAR(this._listInitPos);
        let nodePos:cc.Vec2 = this._rootParent.convertToNodeSpaceAR(worldPos);
        this.list.node.removeFromParent();
        this.list.node.setPosition(nodePos);
        this._rootParent.addChild(this.list.node);
    }

    /**其他下拉列表显示 */
    private onComBoxShow(evt:cc.Node) {
        if (evt != this.node) {
            this.hideList();
        }
    }

    /**收起下拉列表 */
    private hideList() {
        if (this.list.scrollView.node.active == true) {
            this.list.scrollView.node.active = false;
        }
    }

}