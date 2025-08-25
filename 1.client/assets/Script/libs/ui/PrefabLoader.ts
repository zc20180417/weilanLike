import { Handler } from "../../utils/Handler";
import ResManager from "../../utils/res/ResManager";
import { StringUtils } from "../../utils/StringUtils";


const { ccclass, property , menu} = cc._decorator;

@ccclass
@menu('Game/utls/PrefabLoader')
export default class PrefabLoader extends cc.Component {
    @property({
        type: cc.Prefab,
        tooltip: '默认显示预制体'
    })
    defaultPrefab: cc.Prefab = null;

    @property({
        tooltip: '锚点',
    })
    anchor: cc.Vec2 = cc.v2(0.5, 0.5);

    @property({
        tooltip: '缩放',
    })
    scale: cc.Vec2 = cc.v2(1, 1);

    @property
    position: cc.Vec2 = cc.Vec2.ZERO;
    

    private _loadHandler: Handler = null;
    protected _loading: boolean = false;

    protected _url: string = null;
    get url(): string {
        return this._url;
    }

    set url(v: string) {
        if (this._url != v) {
            this.node.removeAllChildren();
            this.tryRemoveLoad();
            this._url = v;
            this.loadPrefab();
        }
    }

    onLoad() {
        if (!this._loading) {
            this.loadPrefab();
        }
    }

    protected loadPrefab() {
        if (!this.url) {
            return;
        }
        this._loading = true;
        if (!this._loadHandler) this._loadHandler = new Handler(this.onPrefabLoaded, this);
        ResManager.instance.loadRes(this._url, cc.Prefab, this._loadHandler);
    }

    public onPrefabLoaded(value: cc.Prefab, path?: string) {
        if (!value) {
            value = this.defaultPrefab;
        } else {
            ResManager.instance.addRef(path);
        }
        if (!value) return;
        let node = cc.instantiate(value);
        node.parent = this.node;
        node.anchorX = node.scaleX > 0 ? this.anchor.x : 1 - this.anchor.x;
        node.anchorY = node.scaleY > 0 ? this.anchor.y : 1 - this.anchor.y;

        node.scaleX *= this.scale.x;
        node.scaleY *= this.scale.y;
        if (this.position.x != 0 || this.position.y != 0) {
            node.setPosition(this.position);
        }
    }

    private tryRemoveLoad() {
        if (StringUtils.isNilOrEmpty(this._url)) return;
        ResManager.instance.removeLoad(this._url, this._loadHandler);
        this._url = "";
        this._loading = false;
    }

    onDestroy() {
        this.tryRemoveLoad();
        this._loadHandler = null;
    }
}
