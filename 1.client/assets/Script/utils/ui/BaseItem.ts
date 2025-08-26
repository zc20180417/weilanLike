

const { ccclass, property } = cc._decorator;

@ccclass
export default class BaseItem extends cc.Component {
    
    private _inited: boolean = false;
    private _data: any;
    private _selected: boolean = false;
    protected _canSelect: boolean = true;
    protected _initSelect: boolean = true;
    public index = -1;

    protected action: cc.Tween<any> = null;
    protected actionDelay:number = 0;

    setAction(action: cc.Tween<any> , delay:number = 0) {
        this.actionDelay = delay;
        this.action = action;
        if (this._inited) {
            this.doAction(delay);
        }
    }

    start() {
        this.doAction(this.actionDelay);
        this._inited = true;
    }

    /**数据源 */
    public get data(): any {
        return this._data;
    }

    /**数据源 */
    public setData(data: any, index?: number) {
        this.index = index === undefined ? -1 : index;
        this._data = data;
        if (this._data != data) {
            this._initSelect = true;
        }
    }

    /**
     * 刷新
     */
    public refresh() {

    }

    /**宽度 */
    public get itemWidth(): number {
        return this.node.width;
    }

    /**高度 */
    public get itemHeight(): number {
        return this.node.height;
    }

    public onSelect() {
 
    }

    public unSelect() {

    }

    get selected(): boolean { return this._selected };

    set selected(value: boolean) {
        if (!this._initSelect && value == this._selected) return;
        this._selected = value;
        this._initSelect = false;
        if (value) {
            this.onSelect();
        } else {
            this.unSelect();
        }
    }

    set canSelect(value: boolean) {
        this._canSelect = value;
    }

    get canSelect(): boolean {
        return this._canSelect;
    }

    private doAction(delay:number = 0) {
        if (this.action) {
            let tween:cc.Tween = cc.tween(this.node);
            if (delay) {
                tween.delay(delay);
            }

            tween.call(this.realStartAction , this);
            tween.then(this.action);
            tween.call(this.onActionEnd , this);
            tween.start();
        }
    }

    protected onActionEnd() {
        
    }

    protected realStartAction() {

    }
}
