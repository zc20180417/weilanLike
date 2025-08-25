import { ComponentObject } from "./ComponentObject";
import SysMgr from "../../common/SysMgr";
import { Handler } from "../../utils/Handler";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { MathUtils, Rect, Point } from "../../utils/MathUtils";
import { ERecyclableType } from "../Recyclable/ERecyclableType";
import { ESoType } from "./ESoType";

import BindSoComp from "../comps/ccc/BindSoComp";
import { StringUtils } from "../../utils/StringUtils";
import { Callback } from "../../utils/GameEvent";
import { CacheModel } from "../../utils/res/ResManager";
import { ECamp } from "../../common/AllEnum";
import GlobalVal from "../../GlobalVal";



export default class SceneObject extends ComponentObject {

    static notBindCompDic: any = {};

    protected _mainBody: cc.Node = null;
    protected _pos: cc.Vec2 = cc.Vec2.ZERO;
    protected _halfSize: cc.Size = cc.Size.ZERO;
    protected _type: ESoType = 0;
    protected _anchorX: number = 0.5;
    protected _anchorY:number = 0;

    protected _rectOffsetPoint: Point = new Point;

    private _refreshPosHandler: Handler;
    private _refreshScale: Handler;

    private _loadedHandler: Handler;
    private _url: string;
    private _size: cc.Size = cc.Size.ZERO;
    private _angle: number = 0;
    private _scale: number = 1;
    private _scaleX: number = 1;
    private _scaleY: number = 1;

    protected _rect: Rect;
    private _event: cc.EventTarget;
    private _name: string;
    private _eulerAngles: cc.Vec3 = cc.Vec3.ZERO;
    private _parent: cc.Node;
    // private _refreshRectX: Function;

    activeComp: boolean = true;
    cfgType: number = 0;
    public id: number = 0;
    public needCacheNode: boolean = false;

    offsetX: number = 0;
    offsetY: number = 0;


    protected _visible: boolean = true;
    /**阵营 */
    protected _camp:ECamp = ECamp.BLUE;

     /**阵营 */
     get camp():ECamp {
        return this._camp;
    }

    /**阵营 */
    set camp(value:ECamp) {
        this._camp = value;
        // if (GlobalVal.mirrorSceneObj && this._camp == ECamp.RED) {
        //     this._refreshRealPosFunc = this.refreshRealPosMirror;
        // } else {
        //     this._refreshRealPosFunc = this.refreshRealPos;
        // }
    }

    protected _opacity: number = 255;
    get opacity(): number {
        return this._opacity;
    }

    set opacity(value: number) {
        if (value === this._opacity) return;
        this._opacity = value;
        if (this._mainBody) {
            this._mainBody.opacity = value;
        }
    }

    constructor() {
        super();
        this.init();
        //cc.log("new so");
    }

    protected init() {
        this.key = ERecyclableType.SCENEOBJ;
        this._rect = new Rect();
        this._refreshPosHandler = new Handler(this.refreshPos, this);
        this._refreshScale = new Handler(this.refreshScale, this);
        this._loadedHandler = new Handler(this.onModelLoaded, this);
        this._event = new cc.EventTarget();
        this.setAnchorX(0.5);
    }

    onRecycleUse() {
        this.opacity = 255;
        super.onRecycleUse();
        this.setAnchorX(0.5); //默认居中
        /*
        if (this._renderNode.parent) {
            cc.log("fdsf-------------");
            this._renderNode.removeFromParent();
        }
        */
    }

    resetData() {
        this._pos.x = 0;
        this._pos.y = 0;
        this._scale = 1;
        this._angle = 0;
        this._scaleX = this._scaleY = 1;
        this.needCacheNode = false;
        this.cfgType = 0;
        this.opacity = 255;
        this._anchorY = 0;
        this._anchorX = 0.5;
        this._halfSize.width = this._halfSize.height = 0;
        this._size.width = this._size.height = 0;
        this.offsetX = this.offsetY = 0;
        this.activeComp = true;
        this._rectOffsetPoint.reset();
        this.id = 0;
        this._visible = true;
        super.resetData();
    }


    giveUp() {
        this._mainBody = null;
        this._refreshPosHandler = null;
        this._loadedHandler = null;
        this._event = null;
        this._rect.dispose();
        this._rect = null;
        super.giveUp();
        //cc.log("so giveUp");
    }

    dispose() {
        if (!this.m_isValid) {
            return;
        }

        if (this._mainBody) {
            this.emit(EventEnum.ON_SELF_REMOVE, this);
            SysMgr.instance.clearCallLaterByTarget(this);
        }

        this.tryRemoveLoad();
        this.tryRemoveMainBody();
        
        super.dispose();
    }

    set name(value: string) {
        this._name = value;
    }

    get name(): string {
        return this._name;
    }

    get type(): ESoType {
        return this._type;
    }

    set type(value: ESoType) {
        this._type = value;
    }

    //node
    get renderNode(): cc.Node {
        return this._mainBody;
    }


    get mainBody(): cc.Node {
        return this._mainBody;
    }

    set x(value: number) {
        this._pos.x = value;
        SysMgr.instance.callLater(this._refreshPosHandler);
    }

    get x(): number {
        return this._pos.x;
    }

    set y(value: number) {
        this._pos.y = value;
        SysMgr.instance.callLater(this._refreshPosHandler);
    }

    get y(): number {
        return this._pos.y;
    }

    set pos(value: cc.Vec2) {
        this._pos.set(value);
        SysMgr.instance.callLater(this._refreshPosHandler);
    }

    /**尽量少调用，以防外部更改 */
    get pos(): cc.Vec2 {
        return this._pos;
    }

    setPos(x: number, y: number) {
        this._pos.x = x;
        this._pos.y = y;
        SysMgr.instance.callLater(this._refreshPosHandler);
    }

    setPosNow(x: number, y: number) {
        this._pos.x = x;
        this._pos.y = y;
        this.refreshPos();
    }

    set scale(value: number) {
        this._scale = value;
        //this._scaleX = this._scaleY = value;
        this.refreshScale();
        //SysMgr.instance.callLater(this._refreshScale);
    }

    set scaleX(value: number) {
        this._scaleX = value;
        SysMgr.instance.callLater(this._refreshScale);
    }

    set scaleY(value: number) {
        this._scaleY = value;
        SysMgr.instance.callLater(this._refreshScale);
    }

    get scale(): number {
        return this._scale;
    }

    get scaleX(): number {
        return this._scaleX;
    }

    get scaleY(): number {
        return this._scaleY;
    }

    set rotation(value: number) {
        this._angle = value;
        //SysMgr.instance.callLater(this._refreshAngle);
        if (this._mainBody) {
            this._mainBody.angle = value;
        }
    }

    set rotationX(value: number) {
        this._eulerAngles.x = value;
        if (this._mainBody) {
            this._mainBody.eulerAngles.x = value;
        }
    }

    set rotationY(value: number) {
        this._eulerAngles.y = value;
        if (this._mainBody) {
            this._mainBody.eulerAngles.y = value;
        }
    }
    get rotation(): number {
        return this._angle;
    }

    get rotationX(): number {
        return this._eulerAngles.x;
    }

    get rotationY(): number {
        return this._eulerAngles.y;
    }

    get size(): cc.Size {
        return this._size;
    }

    get halfSize(): cc.Size {
        return this._halfSize;
    }

    setSize(width: number, height: number) {
        let wid: number = Math.floor(width );
        let hei: number = Math.floor(height );
        this._rect.width = this._size.width = wid;
        this._rect.height = this._size.height = hei;
        wid *= 0.5;
        hei *= 0.5;
        this._rect.halfWid = this._halfSize.width = wid;
        this._rect.halfHei = this._halfSize.height = hei;
        this._rect.refreshSize();
        this.refreshOffsetPos();
    }




    get rect(): Rect {
        return this._rect;
    }

    get centerPos(): cc.Vec2 {
        return this._pos;
    }

    get event(): cc.EventTarget {
        return this._event;
    }

    set visible(value: boolean) {
        this._visible = value;

        if (this._mainBody) {
            this._mainBody.active = value;
        }
    }

    get visible(): boolean {
        return this._visible;
    }

    faceToPos(toPos: cc.Vec2) {
        this.rotation = MathUtils.getAngle(this.x, this.y, toPos.x, toPos.y);
    }

    private grap: cc.Graphics;
    setAttachGameObject(obj: cc.Node) {
        if (!this._parent || !obj.isValid) {
            return;
        }
        this._mainBody = obj;
        this.refreshPos();
        this.refreshAngle();
        this.refreshScale();

        if (this._mainBody.parent && this._parent != this._mainBody.parent) {
            this._mainBody.removeFromParent();
        }

        if (!this._mainBody.parent) {
            this._parent.addChild(this._mainBody);
        }
        
        this._mainBody.opacity = this._opacity;
        if (this.activeComp && !SceneObject.notBindCompDic[this._url]) {
            //cc.log('-------------check bind so comps:' , this._url);
            let bindSoComps = this._mainBody.getComponentsInChildren(BindSoComp);
            if (bindSoComps && bindSoComps.length > 0) {
                bindSoComps.forEach(element => {
                    element.owner = this;
                    element.onAdd();
                });
            } else {
                SceneObject.notBindCompDic[this._url] = true;
            }
        }
        this._mainBody.active = this._visible;
        try {
            this._event.emit(EventEnum.MAIN_BODY_ATTACHED as unknown as string, this);
        } catch (error) {
            cc.log('error ! sceneObject setAttachGameObject');
        }
    }

    setModelUrl(url: string) {
        if (url == null || url.indexOf("null") != -1) {
            cc.log(1);
        }
        if (url == this._url) {
            this._event.emit(EventEnum.MAIN_BODY_ATTACHED as unknown as string, this);
            return;
        }
        //cc.log("set url:" + url);
        this.tryRemoveMainBody();
        this.tryRemoveLoad();

        this._url = url;
        let node: cc.Node = Game.soMgr.getPoolNode(url);
        if (node) {
            this.setAttachGameObject(node);
        } else {
            Game.resMgr.loadRes(url, cc.Prefab, this._loadedHandler, CacheModel.AUTO);
        }
    }

    once(type: EventEnum | string, callback: Callback , target?:any) {
        this._event.once(type as unknown as string , callback , target);
    }

    on(type: EventEnum | string, callback: Callback , target?:any) {
        return this._event.on(type as unknown as string, callback , target);
    }

    off(type: EventEnum | string , callback: Callback , target?:any): void {
        if (!this._event) {
            cc.log("error ! sceneObject off event");
            return;
        }
        this._event.off(type as unknown as string , callback , target);
    }

    targetOff(target: any): void {
        this._event.targetOff(target);
    }

    emit(type: EventEnum | string , arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any): void {
        this._event.emit(type as unknown as string , arg1, arg2, arg3, arg4, arg5);
    }

    addTo(parent: cc.Node) {
        this._parent = parent;
        if (this._mainBody) {
            this._mainBody.parent = parent;
        }
    }

    getParent():cc.Node {
        return this._parent;
    }

    setAnchorX(value: number) {
        this._anchorX = value;
        this.refreshOffsetPos();
    }

    setAnchorY(value:number) {
        this._anchorY = value;
        this.refreshOffsetPos();
    }

    protected refreshOffsetPos() {
        if (this._anchorY != 0) {
            this._rectOffsetPoint.y = -this.size.height * this._anchorY;
        } else {
            this._rectOffsetPoint.y = 0;
        }
        if (this._anchorX != 0) {
            this._rectOffsetPoint.x = -this.size.width * this._anchorX;
        } else {
            this._rectOffsetPoint.x = 0;
        }
    }

    protected tryRemoveMainBody() {
        if (this._mainBody) {
            if (this._mainBody.isValid) {
                if (this.activeComp && !SceneObject.notBindCompDic[this._url]) {
                    let bindSoComps = this._mainBody.getComponentsInChildren(BindSoComp);
                    if (bindSoComps && bindSoComps.length > 0) {
                        bindSoComps.forEach(element => {
                            element.onRemove();
                            element.owner = null;
                        });
                    }
                }
                if (this.needCacheNode) {
                    Game.soMgr.cacheNode(this._mainBody, this._url);
                } else {
                    this._mainBody.destroy();
                }
            }
            this._mainBody = null;
        }
        this._url = "";
    }

    private onModelLoaded(res: any, path: string) {
        Game.resMgr.addRef(path);
        if (!this.isValid) {
            cc.log("onModelLoaded error , isValid:");
            return;
        }
        let prefab = Game.resMgr.getRes(this._url);
        if (!prefab) return;
        let obj: cc.Node = cc.instantiate(prefab);
        this.setAttachGameObject(obj);
    }

    private tryRemoveLoad() {
        if (StringUtils.isNilOrEmpty(this._url) || this._mainBody) {
            return;
        }
        Game.resMgr.removeLoad(this._url, this._loadedHandler);
    }

    protected refreshPos() {
        this._rect.y = this._pos.y + this._rectOffsetPoint.y;
        this._rect.x = this._pos.x + this._rectOffsetPoint.x;
        this._rect.refresh();
        if (this._mainBody && this._mainBody.isValid) {
            this._mainBody.setPosition(this._pos);
            // this._refreshRealPosFunc.call(this);
        } else {
            // cc.log('_mainBody isValid is false');
        }
        // this.drawRect();
    }

    // private _refreshRealPosFunc:Function;
    // private _mirrorPos:cc.Vec2 = new cc.Vec2();

    // //上下镜像
    // protected refreshRealPosMirror() {
    //     this._mirrorPos.x = this._pos.x;
    //     this._mirrorPos.y = 2040 - this._pos.y;
    //     this._mainBody.setPosition(this._mirrorPos);
    // }

    // protected refreshRealPos() {
    //     this._mainBody.setPosition(this._pos);
    // }


    private refreshAngle() {
        if (this._mainBody) {
            this._mainBody.angle = this._angle;
        }
    }

    private refreshScale() {
        if (this._mainBody) {
            this._mainBody.setScale(this._scaleX * this._scale, this._scaleY * this._scale);
        }
    }

    protected drawRect() {
        /*
        if (this.renderNode) {
            let comp: cc.Graphics = this.renderNode.getComponent(cc.Graphics);
            if (!comp) {
                comp = this.renderNode.addComponent(cc.Graphics);
                comp.fillColor = cc.Color.RED;
            }
            comp.clear();
            // comp.fillRect(this._rect.x , this._rect.y , this._rect.width , this._rect.height);

            if (this._anchorX == 0)
                comp.fillRect(this.rect.x - this.pos.x, this._rectOffsetPoint.y, this.size.width, this.size.height);
            else
                comp.fillRect(0, 0, this.size.width, this.size.height);
        }*/

        if (Game.ldSkillMgr.graph) {
            Game.ldSkillMgr.graph.fillRect(this._rect.x , this._rect.y , this._rect.width , this._rect.height);
        }
    }
}
