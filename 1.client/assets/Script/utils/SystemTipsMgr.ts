
import { DialogType } from "../common/DialogType";
import SystemTip from "./ui/SystemTip";
import { EventEnum } from "../common/EventEnum";
import HornTips from "../ui/HornTips";
import { Handler } from "./Handler";
import TopTips from "./ui/TopTips";
import Game from "../Game";
import { UiManager } from "./UiMgr";
import { NodePool } from "../logic/sceneObjs/NodePool";
import { StringUtils } from "./StringUtils";
import TipsBase from "../tips/TipsBase";
import BaseItem from "./ui/BaseItem";
import SystemTip2 from "./SystemTip2";
import { GameEvent } from "./GameEvent";

export default class SystemTipsMgr {
    private static _instance: SystemTipsMgr = null;

    static get instance(): SystemTipsMgr {
        if (SystemTipsMgr._instance == null) {
            SystemTipsMgr._instance = new SystemTipsMgr();
        }
        return SystemTipsMgr._instance;
    }

    private tipsQueue: Array<string> = [];
    private isTipsShowing: boolean = false;
    private maxTips: number = 2;

    private _commentTipsDatas: Array<any> = [];
    private _commentTipsPaths: Array<any> = [];
    private _commentTipsNodes: Array<cc.Node> = [];

    private _loadedPaths: object = {};
    private _sysTipNode2: cc.Node = null;

    constructor() {

        GameEvent.on(EventEnum.SYSTEM_TIPS_HIDE, this.onSystemTipHide, this);
        GameEvent.on(EventEnum.HORN_TIPS_SHOW_END, this.onHornEnd, this);
        GameEvent.on(EventEnum.TOP_TIPS_END, this.onTopTipsEnd, this);
        GameEvent.on(EventEnum.CLEAR_TOP_TIPS, this.onClearTopTips, this);
        GameEvent.on(EventEnum.START_LOAD_SCENE, this.onChangeScene, this);
        GameEvent.on(EventEnum.START_CHANGE_SCENE_WITH_TRANSITION, this.onChangeScene, this);
    }

    /**
     * 切换新场景后清除通用提示
     */
    private onChangeScene() {
        this._commentTipsNodes.forEach((v) => {
            v.isValid && v.destroy();
        });
        this._commentTipsNodes.length = 0;
        this._commentTipsDatas.length = 0;
        this._commentTipsPaths.length = 0;
    }

    /**
     * 一般的文本提示
     * @param info 
     */
    public notice(info: string) {
        if (StringUtils.isNilOrEmpty(info) || this.tipsQueue.length >= this.maxTips || this.tipsQueue.indexOf(info) != -1) return;
        this.tipsQueue.push(info);
        if (this.isTipsShowing) return;
        this.isTipsShowing = true;
        this.startNotice(this.tipsQueue[0]);
    }

    /**
     * 通用提示 
     */
    public showCommentTips(prefabPath: string, data?: any) {
        let len = this._commentTipsNodes.length;
        data = data || null;
        if (len == 0) {
            Game.resMgr.loadRes(prefabPath, cc.Prefab, new Handler(this.onCommentTipsLoaded, this, data));
        } else if (len < 5) {
            let tipsNode = this._commentTipsNodes[this._commentTipsNodes.length - 1];
            let tipsBase = tipsNode.getComponent(TipsBase);
            if (tipsBase.isShowed()) {//最后一个提示显示动画结束后再显示新的提示提示
                Game.resMgr.loadRes(prefabPath, cc.Prefab, new Handler(this.onCommentTipsLoaded, this, data));
            } else {
                this._commentTipsDatas.push(data);
                this._commentTipsPaths.push(prefabPath);
            }
        } else {
            this._commentTipsDatas.push(data);
            this._commentTipsPaths.push(prefabPath);
        }
    }

    /**
     * 通用提示加载结束
     * @param data 
     * @param res 
     * @param path 
     */
    private onCommentTipsLoaded(data: any, res: cc.Prefab, path: string) {
        this.checkLoaded(path);
        let node = cc.instantiate(res);
        let tipsBaseCom: TipsBase = null;
        let baseItem: BaseItem = null;
        UiManager.topLayer.addChild(node);
        baseItem = node.getComponent(BaseItem);
        baseItem.setData(data);
        let boundingBox = node.getBoundingBoxToWorld();
        this._commentTipsNodes.forEach((v) => {
            tipsBaseCom = v.getComponent(TipsBase);
            tipsBaseCom.moveUp(boundingBox.height);
        });
        tipsBaseCom = node.getComponent(TipsBase);
        tipsBaseCom.setSystemTipsMgr(this);
        tipsBaseCom.show();
        this._commentTipsNodes.push(node);
    }

    /**
     * 通用提示显示动画播放结束
     * @param tipsNode 
     */
    public onCommentTipsShow(tipsNode: cc.Node) {
        let index = this._commentTipsNodes.indexOf(tipsNode);
        if (index != -1 && index == this._commentTipsNodes.length - 1) {
            if (this._commentTipsDatas.length > 0) {
                this.showCommentTips(this._commentTipsPaths.shift(), this._commentTipsDatas.shift());
            }
        }
    }

    /**
     * 通用提示隐藏动画播放结束
     * @param tipsNode 
     */
    public onCommentTipsHide(tipsNode: cc.Node) {
        let index = this._commentTipsNodes.indexOf(tipsNode);
        let boundingBox = tipsNode.getBoundingBoxToWorld();
        let tipsBaseCom: TipsBase;
        for (let i = 0; i < index; i++) {
            tipsBaseCom = this._commentTipsNodes[i].getComponent(TipsBase);
            tipsBaseCom.moveDown(boundingBox.height);
        }
        if (index != -1) {
            this._commentTipsNodes.splice(index, 1);
            tipsNode.destroy();
        }
        if (this._commentTipsDatas.length > 0) {
            this.showCommentTips(this._commentTipsPaths.shift(), this._commentTipsDatas.shift());
        }
    }

    public showHorn(info: string) {
        this.hornInfoList.push(info);
        this.tryShowHorn();
    }

    public showTopTips(info: string) {
        this.topTipsList.push(info);
        this.tryShowTopTips();
    }

    showSysTip2(info: string) {
        this.sysInfo = info;
        if (!this._sysTipNode2) {
            Game.resMgr.loadRes(DialogType.SYSTEM_TIPS2, null, new Handler(this.onTips2LoadComplete, this, info));
        } else {
            this.doShowTips2();
        }
    }

    private systemTipPool: NodePool = new NodePool();

    private systemNodeList: SystemTip[] = [];
    private totalSystemLen: number = 3;
    private hornInfoList: string[] = [];
    private hornIsShow: boolean = false;
    private hornTips: HornTips = null;

    private topTipsList: string[] = [];
    private topTips: TopTips = null;
    private topIsShow: boolean = false;
    private sysInfo: string = '';

    private onSystemTipHide(tip: SystemTip) {
        this.systemTipPool.put(tip.node);
        this.tipsQueue.shift();
        if (this.tipsQueue.length > 0) {
            this.startNotice(this.tipsQueue[0]);
        } else {
            this.isTipsShowing = false;
        }
    }

    private tryShowHorn() {
        if (this.hornIsShow) return;
        let info = this.hornInfoList.shift();
        this.doShowHorn(info);
    }

    private doShowHorn(info: string) {
        this.hornIsShow = true;
        if (this.hornTips == null) {
            Game.resMgr.loadRes(DialogType.HornTip, null, new Handler(this.onLoadComplete, this, info));
            return;
        }
        this.hornTips.show(info);
    }


    private onLoadComplete(info: string) {
        this.checkLoaded(DialogType.HornTip);
        let node: cc.Node = cc.instantiate(Game.resMgr.getRes(DialogType.HornTip));
        node.opacity = 0;
        node.x = cc.winSize.width / 2;
        node.y = cc.winSize.height / 2 + 250;
        UiManager.topLayer.addChild(node);
        this.hornTips = node.getComponent(HornTips);
        this.doShowHorn(info);
    }

    private onTips2LoadComplete() {
        this._sysTipNode2 = cc.instantiate(Game.resMgr.getRes(DialogType.SYSTEM_TIPS2));
        UiManager.topLayer.addChild(this._sysTipNode2);

        this.doShowTips2();
    }

    private doShowTips2() {
        this._sysTipNode2.x = cc.winSize.width / 2;
        this._sysTipNode2.y = 250;
        let comp: SystemTip2 = this._sysTipNode2.getComponent(SystemTip2);
        comp.show(this.sysInfo);
    }

    private onHornEnd() {
        this.hornIsShow = false;
        if (this.hornInfoList.length < 1) {
            this.hornTips.hide();
        } else {
            this.tryShowHorn();
        }
    }


    private tryShowTopTips() {
        if (this.topIsShow) return;
        let info = this.topTipsList.shift();
        this.doShowTopTips(info);
    }
    private doShowTopTips(info: string) {
        this.topIsShow = true;
        if (this.topTips == null) {
            Game.resMgr.loadRes(DialogType.TopTips, null, new Handler(this.onTopTipsLoadEnd, this, info));
            return;
        }
        this.topTips.show(info);

    }
    private onTopTipsLoadEnd(info: string) {
        this.checkLoaded(DialogType.TopTips);
        let node = cc.instantiate(Game.resMgr.getRes(DialogType.TopTips));
        node.x = cc.winSize.width / 2;
        node.y = cc.winSize.height / 2;
        UiManager.topLayer.addChild(node);

        this.topTips = node.getComponent(TopTips);
        this.topTips.show(info);
    }

    private onTopTipsEnd() {
        this.topIsShow = false;
        if (this.topTipsList.length > 0) {
            this.tryShowTopTips();
        }
    }

    private onClearTopTips() {
        this.topTipsList = [];
    }

    private startNotice(info: string) {
        if (this.systemTipPool.size() > 0) {
            this.doShowSystemTip(this.systemTipPool.get(), info);
        } else {
            Game.resMgr.loadRes(DialogType.SystemTip, cc.Prefab, new Handler(this.onSystemTipLoaded, this, info));
        }
    }

    private onSystemTipLoaded(info: string, data: any, path: string) {
        this.checkLoaded(path);
        let node: cc.Node = cc.instantiate(data);
        node.zIndex = 1000;
        UiManager.topLayer.addChild(node);
        this.doShowSystemTip(node, info);
    }

    private doShowSystemTip(node: cc.Node, info: string) {
        if (!node || !node.parent) {
            node.zIndex = 1000;
            UiManager.topLayer.addChild(node);
        }
        let localPos = node.parent.convertToNodeSpaceAR(cc.v2(0, cc.winSize.height - 150));
        node.setPosition(cc.winSize.width / 2, localPos.y);
        (node.getComponent(SystemTip) as SystemTip).show(info);
    }

    private checkLoaded(path: string) {
        if (!this._loadedPaths[path]) {
            this._loadedPaths[path] = true;
            Game.resMgr.addRef(path);
        }
    }
}