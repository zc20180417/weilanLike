
const { ccclass, property, menu, executeInEditMode } = cc._decorator;

export enum VerticalAnchor {
    Bottom = 0,
    Center,
    Top,
}

export enum HorizontalAnchor {
    Left = 0,
    Center,
    Right,
    NONE,
}

@ccclass
@menu("effect/组图")
@executeInEditMode
export default class GroupImage extends cc.Component {

    @property(cc.SpriteAtlas)
    private atlas: cc.SpriteAtlas = null;

    @property
    private _prefix: String = "";
    @property
    get prefix() {
        return this._prefix;
    }

    set prefix(v) {
        if (this._prefix == v)
            return;
        this._prefix = v;
        this.calContents();
        this.reposition();
    }

    @property
    private _contentStr: String = "";
    @property
    get contentStr() {
        return this._contentStr;
    }

    set contentStr(v) {
        if (v === "" || v === null || v === undefined) {
            this._contentStr = "";
            this._nodes.length = 0;
            return;
        }
        if (this._contentStr == v)
            return;
        this._contentStr = v;
        this.calContents();
        this.reposition();
    }


    @property
    private _vAnchor: VerticalAnchor = VerticalAnchor.Center;
    @property({ type: cc.Enum(VerticalAnchor) })
    get vAnchor() {
        return this._vAnchor;
    }

    set vAnchor(v) {
        if (this._vAnchor == v)
            return;
        this._vAnchor = v;
        this.reposition();
    }

    @property
    private _hAnchor: HorizontalAnchor = HorizontalAnchor.Center;
    @property({ type: cc.Enum(HorizontalAnchor) })
    get hAnchor() {
        return this._hAnchor;
    }

    set hAnchor(v) {
        if (this._hAnchor == v)
            return;
        this._hAnchor = v;
        this.reposition();
    }

    @property
    private _padding: number = 0;
    @property
    get padding() {
        return this._padding;
    }

    set padding(v) {
        if (this._padding == v)
            return;
        this._padding = v;
        this.reposition();
    }

    @property
    private _itemWid: number = 0;
    @property
    get itemWid() {
        return this._itemWid;
    }

    set itemWid(v) {
        if (this._itemWid == v)
            return;
        this._itemWid = v;
        this.reposition();
    }

    private _contentsNum: number;
    private _skins: Array<string> = new Array<string>();
    private _totalWidth: number;
    private _maxHeight: number;

    //当前显示的节点
    private _nodes: Array<cc.Node> = new Array<cc.Node>();
    //缓存的节点
    private _pool: Array<cc.Node> = new Array<cc.Node>();

    private _color: cc.Color = cc.Color.WHITE;

    protected onLoad() {
        this.calContents();
        this.reposition();
    }


    protected calContents(): void {
        if (!this.atlas || !this._contentStr || !this._prefix) {
            this._contentsNum = 0;
            return;
        }

        //第一次计算需要将当前节点上的子节点移除
        if (this._nodes.length == 0 && this.node.children.length != 0) {
            this._nodes = Array.from(this.node.children);
        }

        for (let i: number = 0, len = this._nodes.length; i < len; i++) {
            this.recoveryNode(this._nodes[i]);
            this._nodes[i] = null;
        }

        this._contentsNum = this._contentStr.length;
        for (let i: number = 0; i < this._contentsNum; i++) {
            this._skins[i] = this._prefix + this._contentStr.charAt(i);
        }

        this._totalWidth = 0;
        this._maxHeight = 0;
        for (let i: number = 0; i < this._contentsNum; i++) {
            let node: cc.Node = this.getNode();
            this._nodes[i] = node;
            let img: cc.Sprite = node.getComponent(cc.Sprite);
            img.spriteFrame = this.atlas.getSpriteFrame(this._skins[i]);

            this._totalWidth += this.itemWid > 0 ? this.itemWid : node.width;
            if (node.height >= this._maxHeight)
                this._maxHeight = node.height;
        }
        this._totalWidth += (this._contentsNum - 1) * this._padding;
    }

    protected reposition(): void {
        if (this._contentsNum == 0) return;
        let leftX: number = 0;
        switch (this._hAnchor) {
            case HorizontalAnchor.Left:
                break;
            case HorizontalAnchor.Center:
                leftX = -this._totalWidth / 2;
                break;
            case HorizontalAnchor.Right:
                leftX = -this._totalWidth;
                break;
        }
        let curTotalWidth: number = 0;
        for (let i: number = 0; i < this._contentsNum; i++) {
            let node: cc.Node = this._nodes[i];
            node.x = leftX + curTotalWidth + (this.itemWid > 0 ? (this.itemWid - node.width) * 0.5 : 0);
            switch (this._vAnchor) {
                case VerticalAnchor.Bottom:
                    node.setAnchorPoint(0, 0);
                    break;
                case VerticalAnchor.Center:
                    node.setAnchorPoint(0, 0.5);
                    break;
                case VerticalAnchor.Top:
                    node.setAnchorPoint(0, 1);
                    break;
            }
            curTotalWidth += this.itemWid > 0 ? this.itemWid : node.width + this._padding;
        }
    }

    public clearContent(): void {
        for (let i: number = 0, len = this._nodes.length; i < len; i++) {
            this.recoveryNode(this._nodes[i]);
            this._nodes[i] = null;
        }
    }

    protected getNode(): cc.Node {
        let node: cc.Node = null;
        node = this._pool.pop();
        if (!node) {
            node = new cc.Node();
            node.setAnchorPoint(0, 0);
            let sprite: cc.Sprite = node.addComponent(cc.Sprite);
            node.parent = this.node;
            node.color = this._color;
        }
        node.active = true;
        return node;
    }

    protected recoveryNode(node: cc.Node): void {
        if (node) {
            node.active = false;
            this._pool.push(node);
        }
    }

    set color(value: cc.Color) {
        this._color = value;
        for (let i: number = 0, len = this._nodes.length; i < len; i++) {
            if (this._nodes[i]) {
                this._nodes[i].color = value;
            }
        }
    }
}
