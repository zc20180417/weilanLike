// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import { EResPath } from "../../common/EResPath";
import Game from "../../Game";
import OutLine from "../../shader/OutLine";
import { Handler } from "../../utils/Handler";
import ResManager from "../../utils/res/ResManager";
import { SDFUtils } from "../../utils/SDFUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Tower3DPic extends cc.Component {

    @property(cc.Vec2)
    towerStarItemOffet: cc.Vec2 = cc.Vec2.ZERO;

    @property(cc.Material)
    outlineMat: cc.Material = null;

    private _isShowOutline: boolean = false;

    private _enableClick: boolean = true;
    get enableClick(): boolean {
        return this._enableClick;
    }
    set enableClick(value: boolean) {
        this._enableClick = value;
        let node = this.node.getChildByName("tower_1_1");
        let button = node.getComponent(cc.Button);
        button.interactable = value;
    }

    private _clickHandler: Handler = null;
    get clickHandler(): Handler {
        return this._clickHandler;
    }
    set clickHandler(value: Handler) {
        this._clickHandler = value;
    }

    private _outlineColor: cc.Color = cc.Color.WHITE;
    get outlineColor(): cc.Color {
        return this._outlineColor;
    }
    set outlineColor(value: cc.Color) {
        this._outlineColor = value;
    }

    private outlineNode: cc.Node = null;
    getOffset(): cc.Vec2 {
        return this.towerStarItemOffet;
    }

    onClick() {
        this._clickHandler && this._clickHandler.execute();
    }

    setColor(color: cc.Color) {
        let node = this.node.getChildByName("tower_1_1");
        node.color = color;
    }

    public showOutLine() {
        if (this._isShowOutline) return;
        this._isShowOutline = true;

        if (!this.outlineNode) {
            Game.resMgr.loadRes(EResPath.TOWER_SDF + this.node.name, cc.SpriteFrame, Handler.create(this.onTowerSDFLoaded, this));
        } else {
            this.outlineNode.active = true;
        }
    }

    private onTowerSDFLoaded(asset, path) {
        Game.resMgr.addRef(path);
        let tower = this.node.getChildByName("tower_1_1");
        this.outlineNode = new cc.Node();
        this.outlineNode.parent = this.node;
        this.outlineNode.zIndex = -1;
        this.outlineNode.x = tower.x + (0.5 - tower.anchorX) * tower.width;
        this.outlineNode.y = tower.y + (0.5 - tower.anchorY) * tower.height;

        let sprite = this.outlineNode.addComponent(cc.Sprite);
        sprite.spriteFrame = asset;
        sprite.setMaterial(0, this.outlineMat);

        this.outlineNode.addComponent(OutLine);
        this.outlineNode.color = this._outlineColor;

        this.outlineNode.active = this._isShowOutline;
    }

    public hideOutLine() {
        if (!this._isShowOutline) return;
        this._isShowOutline = false;
        this.outlineNode && (this.outlineNode.active = false);
    }

    protected onDestroy(): void {
        Game.resMgr.removeLoad(EResPath.TOWER_SDF + this.node.name, Handler.create(this.onTowerSDFLoaded, this));
        Handler.dispose(this);
    }
}
