// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:

import Dialog from "./ui/Dialog";
import { Handler } from "./Handler";
import { GameEvent } from "./GameEvent";
import { EventEnum } from "../common/EventEnum";
import { NodePool } from "../logic/sceneObjs/NodePool";
import SysMgr from "../common/SysMgr";
import { NodeUtils } from "./ui/NodeUtils";
import Game from "../Game";

//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

export enum DialogLayer {
    MID, //中间层
    BOTTOM,//最下层
    TOP //最上层
}

export class UiManager {
    public static dialogLayer: cc.Node = null;//中间层ui

    public static bottomLayer: cc.Node = null;//底层ui

    public static topLayer: cc.Node = null;//顶层ui

    // private static blackPrefab: cc.Prefab = null;

    private static layers: Array<cc.Node> = [];

    private static layersLen: number = 0;

    //弹窗栈
    private static viewStack: Array<cc.Node> = [];
    private static topViewStack: Array<cc.Node> = [];
    private static bottomViewStack: Array<cc.Node> = [];

    private static viewDic: any = {};

    private static cacheDialogNode: any = {};
    private static _showViewCount: number = 0;
    private static _handlerDic: any = {};
    private static _isDialogLoading: boolean = false;

    public static get isDialogLoading() {
        return this._isDialogLoading;
    }

    public static set isDialogLoading(value) {
        this._isDialogLoading = value;
        cc.log("uiMgr: isDialogLoading ", value);
    }

    static getShowViewCount(): number {
        return this._showViewCount;
    }

    /**
     * 初始化dialog层，只需初始化一次
     */
    public static init() {
        if (!UiManager.bottomLayer) {
            UiManager.bottomLayer = new cc.Node();
            UiManager.bottomLayer.name = 'bottomLayer';
            Game.fitMgr.addPersistRootNode(UiManager.bottomLayer);
        }

        if (!UiManager.dialogLayer) {
            UiManager.dialogLayer = new cc.Node();
            UiManager.dialogLayer.name = 'dialogLayer';
            Game.fitMgr.addPersistRootNode(UiManager.dialogLayer);
        }

        if (!UiManager.topLayer) {
            UiManager.topLayer = new cc.Node();
            UiManager.topLayer.name = 'topLayer';
            Game.fitMgr.addPersistRootNode(UiManager.topLayer);
        }

        UiManager.layers = [UiManager.dialogLayer, UiManager.bottomLayer, UiManager.topLayer];
        UiManager.layersLen = UiManager.layers.length;
        cc.view.on('canvas-resize', this.onCanvasResize, this);
        GameEvent.on(EventEnum.ON_DIALOG_AFTER_HIDE, this.onDialogAfterHide, this);
    }


    private static onCanvasResize() {
        UiManager.bottomLayer.setPosition(cc.Vec2.ZERO_R);
        UiManager.dialogLayer.setPosition(cc.Vec2.ZERO_R);
        UiManager.topLayer.setPosition(cc.Vec2.ZERO_R);
        Object.values(UiManager.viewDic).forEach((a: Dialog) => {
            if (a) {
                a.onCanvasResize();
            }
        });
    }

    public static dialogLoadComplete(data: any, layerType: DialogLayer, zIndex: number = 0, res: any, path: string) {
        UiManager.isDialogLoading = false;
        delete UiManager._handlerDic[path];
        if (UiManager.checkShowDialog(path, data)) {
            return;
        }
        let dialog: cc.Node = cc.instantiate(res);
        let dialogCom = dialog.getComponent(Dialog);
        let stack: Array<cc.Node> = UiManager.getViewStack(layerType);

        //隐藏底层弹窗
        if (dialogCom.isHideBottomDialog && stack && stack.length > 0) {
            stack[stack.length - 1].active = false;
        }
        dialogCom.path = path;
        dialogCom.setLayerType(layerType);
        dialogCom.setDialogName(UiManager.getName(path));
        stack.push(dialog);

        dialog.zIndex = zIndex;

        UiManager.addToStage(dialog, data, UiManager.getViewLayer(layerType), path);
    }
    /**
     * 显示中间层弹窗
     * @param prefabPath 
     * @param data 
     */
    public static showDialog(prefabPath: string, data?: any) {
        if (UiManager.checkShowDialog(prefabPath, data)) {
            return;
        }
        if (UiManager.cacheDialogNode[prefabPath]) {
            UiManager.cacheDialogNode[prefabPath].zIndex = this.getLayerMaxZIndex(UiManager.dialogLayer) + 1;
            this.addToStage(UiManager.cacheDialogNode[prefabPath], data, UiManager.dialogLayer, prefabPath);
            return;
        }

        if (UiManager._handlerDic[prefabPath]) {
            (UiManager._handlerDic[prefabPath] as Handler).args = [data, DialogLayer.MID, this.getLayerMaxZIndex(UiManager.dialogLayer) + 1];
            return;
        }
        let handler = new Handler(UiManager.dialogLoadComplete, null, data, DialogLayer.MID, this.getLayerMaxZIndex(UiManager.dialogLayer) + 1);
        UiManager._handlerDic[prefabPath] = handler;
        this.isDialogLoading = true;
        Game.resMgr.loadRes(prefabPath, null, handler);
    }

    /**
     * 显示底层弹窗
     * @param prefabPath 
     * @param data 
     */
    public static showBottomDialog(prefabPath: string, data?: any) {
        if (UiManager.checkShowDialog(prefabPath, data)) {
            return;
        }
        if (UiManager.cacheDialogNode[prefabPath]) {
            UiManager.cacheDialogNode[prefabPath].zIndex = this.getLayerMaxZIndex(UiManager.bottomLayer) + 1;
            this.addToStage(UiManager.cacheDialogNode[prefabPath], data, UiManager.bottomLayer, prefabPath);
            return;
        }

        if (UiManager._handlerDic[prefabPath]) {
            (UiManager._handlerDic[prefabPath] as Handler).args = [data, DialogLayer.BOTTOM, this.getLayerMaxZIndex(UiManager.bottomLayer) + 1];
            return;
        }
        let handler = new Handler(UiManager.dialogLoadComplete, null, data, DialogLayer.BOTTOM, this.getLayerMaxZIndex(UiManager.bottomLayer) + 1);
        UiManager._handlerDic[prefabPath] = handler;
        this.isDialogLoading = true;
        Game.resMgr.loadRes(prefabPath, null, handler);
    }

    /**
     * 显示顶层弹窗
     * @param prefabPath 
     * @param data 
     */
    public static showTopDialog(prefabPath: string, data?: any) {
        if (UiManager.checkShowDialog(prefabPath, data)) {
            return;
        }
        if (UiManager.cacheDialogNode[prefabPath]) {
            UiManager.cacheDialogNode[prefabPath].zIndex = this.getLayerMaxZIndex(UiManager.topLayer) + 1;
            this.addToStage(UiManager.cacheDialogNode[prefabPath], data, UiManager.topLayer, prefabPath);
            return;
        }

        if (UiManager._handlerDic[prefabPath]) {
            (UiManager._handlerDic[prefabPath] as Handler).args = [data, DialogLayer.TOP, this.getLayerMaxZIndex(UiManager.topLayer) + 1];
            return;
        }
        let handler = new Handler(UiManager.dialogLoadComplete, null, data, DialogLayer.TOP, this.getLayerMaxZIndex(UiManager.topLayer) + 1);
        UiManager._handlerDic[prefabPath] = handler;
        this.isDialogLoading = true;
        Game.resMgr.loadRes(prefabPath, null, handler);
    }

    /**
     * 指定显示顺序显示顶层弹窗
     * @param prefabPath 
     * @param data 
     */
    public static showDialogWithZIndex(prefabPath: string, zIndex: number = 0, data?: any) {
        if (UiManager.checkShowDialog(prefabPath, data)) {
            return;
        }
        if (UiManager.cacheDialogNode[prefabPath]) {
            UiManager.cacheDialogNode[prefabPath].zIndex = this.getLayerMaxZIndex(UiManager.topLayer) + 1;
            this.addToStage(UiManager.cacheDialogNode[prefabPath], data, UiManager.topLayer, prefabPath);
            return;
        }
        let index = this.getLayerMaxZIndex(UiManager.topLayer) + 1 + zIndex;
        if (UiManager._handlerDic[prefabPath]) {
            (UiManager._handlerDic[prefabPath] as Handler).args = [data, DialogLayer.TOP, index];
            return;
        }
        let handler = new Handler(UiManager.dialogLoadComplete, null, data, DialogLayer.TOP, index);
        UiManager._handlerDic[prefabPath] = handler;
        this.isDialogLoading = true;
        Game.resMgr.loadRes(prefabPath, null, handler);
    }

    /**
     * 关闭弹窗
     * @param dialog 
     * @param ani 
     */
    public static hideDialog(dialog: Dialog | string, ani: boolean = true) {
        if (dialog === null || dialog === undefined) return;
        if (typeof (dialog) === "object") {
            dialog.hide(ani);
        } else {
            let dia = this.viewDic[this.getName(dialog)];
            if (dia) {
                dia.hide(ani);
            } else {
                Game.resMgr.removeLoad(dialog, this._handlerDic[dialog]);
            }
        }
    }


    /**
     * 关闭所有弹窗
     */
    static hideAll() {
        Object.values(UiManager.viewDic).forEach((a: Dialog) => {
            if (a) {
                a.hide();
            }
        });
    }

    /**
     * 在面板隐藏前由面板自动调用
     * @param dialog 
     */
    public static onDialogBeforeHide(dialog: Dialog) {
        if (!dialog) return;
        //弹窗隐藏时显示底层弹窗
        if (dialog.isHideBottomDialog) {
            let layerType: DialogLayer = dialog.getLayerType();
            let stack: Array<cc.Node> = UiManager.getViewStack(layerType);
            if (stack && stack.length > 1) {
                stack[stack.length - 2].active = true;
            }
        }
    }

    private static _maskNode: cc.Node = null;
    /**
     * 显示遮罩
     */
    public static showMask() {
        if (!this._maskNode) {
            this._maskNode = new cc.Node();
            this._maskNode.x = cc.winSize.width / 2;
            this._maskNode.y = cc.winSize.height / 2;
            this._maskNode.width = cc.winSize.width;
            this._maskNode.height = cc.winSize.height;
            this._maskNode.addComponent(cc.BlockInputEvents);
        }

        if (!this._maskNode.parent) {
            this.topLayer.addChild(this._maskNode);
        }
    }

    public static hideMask() {
        if (this._maskNode && this._maskNode.parent) {
            this._maskNode.removeFromParent();
        }
    }

    /**
     * 显示到同级的最顶层
     */
    private static toTop(dialog: Dialog) {
        if (dialog && dialog.node.parent) {
            let maxZIndex = this.getLayerMaxZIndex(dialog.node.parent);
            // dialog.node.parent.children.forEach(element => {
            //     if (element.zIndex > maxZIndex) {
            //         maxZIndex = element.zIndex;
            //     }
            // });
            if (dialog.node.zIndex != maxZIndex || (maxZIndex == 0 && dialog.node.parent.children.length > 1)) {
                dialog.node.zIndex = maxZIndex + 1;
            }
        }
    }
    /**
     * 当面板执行移除时
     * @param name 
     */
    public static onDialogRemove(dialog: Dialog) {
        if (!dialog) return;

        let layerType: DialogLayer = dialog.getLayerType();
        let stack: Array<cc.Node> = UiManager.getViewStack(layerType);
        let name = dialog.getDialogName();

        UiManager.viewDic[name] = null;
        delete UiManager.viewDic[name];

        if (stack) {
            let index = stack.indexOf(dialog.node);
            if (index != -1) {
                stack.splice(index, 1);
            }
        }
        this._showViewCount--;

        GameEvent.emit(EventEnum.ON_DIALOG_HIDE, name);
    }

    private static onDialogAfterHide(path:string) {
        Game.resMgr.decRef(path);
    }

    static removeAll() {
        Object.values(UiManager.viewDic).forEach((a: Dialog) => {
            if (a) {
                a.hide(false);
            }
        });

        UiManager.viewStack = [];
        UiManager.bottomViewStack = [];
        UiManager.viewDic = {};
    }


    private static addToStage(node: cc.Node, data: any, layer: cc.Node, path: string) {
        node.x = cc.winSize.width / 2;
        node.y = cc.winSize.height / 2;

        let dialogCom: Dialog = node.getComponent(Dialog);
        dialogCom.baseData = data;
        dialogCom.setData(data);

        layer.addChild(node);

        GameEvent.emit(EventEnum.SHOW_DIALOG, path);
        dialogCom.show();

        if (!dialogCom.autoDestory) {
            UiManager.cacheDialogNode[path] = node;
        }
        Game.resMgr.addRef(path);
        let viewName = UiManager.getName(path);
        UiManager.viewDic[viewName] = dialogCom;
        this._showViewCount++;
    }

    /**
     * 检测弹窗是否存在，如果存在将其显示到顶层
     * @param prefabPath 
     * @param data 
     */
    static checkShowDialog(prefabPath: string, data?: any) {
        let dialog: Dialog = UiManager.getDialog(prefabPath);
        if (dialog) {
            if (dialog.baseData != data) {
                dialog.baseData = data;
                dialog.setData(data);
            }
            UiManager.toTop(dialog);
            return true;
        }
        return false;
    }

    static checkDialogShow(prefabPath: string) {
        let dialog: Dialog = UiManager.getDialog(prefabPath);
        return dialog ? true : false;
    }


    static checkDialogShowByName(viewName: string, toTop: boolean = false) {
        let dialog: Dialog = UiManager.getDialog(viewName);
        if (dialog && dialog.isShowAniEnd && toTop) {
            UiManager.toTop(dialog);
            return true;
        }
        return false;
    }


    /**
     * 获取正在显示的弹窗
     * @param prefabPath 
     */
    public static getDialog(prefabPath: string): Dialog {
        let dialogCom = UiManager.viewDic[UiManager.getName(prefabPath)];
        return dialogCom;
    }

    public static getName(path: string): string {
        let name = path.split("/").pop();
        return name;
    }

    /**
     * @param ico 
     * @param toNode 
     */
    static flyIco(ico: cc.Node, toNode: cc.Node, count: number = 1) {
        if (count > 5) count = 5;
        let sp = ico.getComponent(cc.Sprite);
        if (!sp) return;
        let sf = sp.spriteFrame;
        let createWorldPos: cc.Vec2 = ico.convertToWorldSpaceAR(cc.Vec2.ZERO_R);
        let createNodePos: cc.Vec2 = this.topLayer.convertToNodeSpaceAR(createWorldPos);

        let toWorldPos: cc.Vec2 = toNode.convertToWorldSpaceAR(cc.Vec2.ZERO_R);
        let toNodePos: cc.Vec2 = this.topLayer.convertToNodeSpaceAR(toWorldPos);

        if (toNode.anchorX != 0.5) {
            toNodePos.x += (toNode.width * (0.5 - toNode.anchorX));
        }

        if (toNode.anchorY != 0.5) {
            toNodePos.y += (toNode.height * (0.5 - toNode.anchorY));
        }

        for (let i = 0; i < count; i++) {
            let node: cc.Node = this.getFreeNode();
            node.active = false;
            node.width = ico.width;
            node.height = ico.height;
            node.scale = ico.scale;
            node.getComponent(cc.Sprite).spriteFrame = sf;

            node.x = createNodePos.x;
            node.y = createNodePos.y;

            SysMgr.instance.doOnce(new Handler(this.addFlyIco, this, node, toNodePos, toNode), i * 100, true);
        }

    }

    private static freeNodes: NodePool = new NodePool();
    private static getFreeNode(): cc.Node {
        if (this.freeNodes.size() > 0) {
            return this.freeNodes.get();
        }

        let node: cc.Node = new cc.Node();
        node.addComponent(cc.Sprite);
        return node;
    }

    private static putFreeNode(node: cc.Node) {
        this.freeNodes.put(node);
    }

    private static addFlyIco(node: cc.Node, toPos: cc.Vec2, toNode: cc.Node) {
        node.active = true;
        node.scale = 1;
        node.opacity = 255;
        if (!node.parent) {
            this.topLayer.addChild(node);
        }

        this.startFlyIco(node, toPos, toNode);
    }

    private static startFlyIco(node: cc.Node, toPos: cc.Vec2, toNode: cc.Node) {
        let curPos: cc.Vec2 = node.getPosition();
        let midPos: cc.Vec2 = cc.v2(curPos.x + (toPos.x - curPos.x) * 0.33, curPos.y);
        NodeUtils.bezierTo(node, 0.8, curPos, midPos, toPos, this.flyIcoEnd, [node, toNode], this);
        NodeUtils.to(node, 0.4, { scale: 0.75 }, "sineIn", null, null, null, 0.4, false);
    }

    private static flyIcoEnd(params: cc.Node[]) {
        this.putFreeNode(params[0]);
        let toNode: cc.Node = params[1];

        let tween = cc.tween(toNode);
        tween.to(0.05, { angle: 1 });
        tween.to(0.05, { angle: 0 });
        tween.start();

    }

    private static getViewStack(layerType: DialogLayer): Array<cc.Node> {
        let stack: Array<cc.Node> = null;
        switch (layerType) {
            case DialogLayer.TOP:
                stack = UiManager.topViewStack;
                break;
            case DialogLayer.MID:
                stack = UiManager.viewStack;
                break;
            case DialogLayer.BOTTOM:
                stack = UiManager.bottomViewStack;
                break;
        }
        return stack;
    }

    private static getViewLayer(layerType: DialogLayer): cc.Node {
        let layer: cc.Node = null;
        switch (layerType) {
            case DialogLayer.TOP:
                layer = UiManager.topLayer;
                break;
            case DialogLayer.MID:
                layer = UiManager.dialogLayer;
                break;
            case DialogLayer.BOTTOM:
                layer = UiManager.bottomLayer;
                break;
        }
        return layer;
    }

    private static getLayerMaxZIndex(layer: cc.Node) {
        let maxZIndex = 0;
        layer.children.forEach(element => {
            if (element.zIndex > maxZIndex) {
                maxZIndex = element.zIndex;
            }
        });
        return 0;
    }
}
