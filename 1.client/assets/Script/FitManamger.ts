import { EventEnum } from "./common/EventEnum";
import { GameEvent } from "./utils/GameEvent";


export default class FitManager {
    private static _instance: FitManager = null;
    public static getInstance(): FitManager {
        return this._instance || (this._instance = new FitManager());
    }

    constructor() {
        cc.director.on(cc.Director.EVENT_AFTER_SCENE_LAUNCH, this.beforeSceneLaunch, this);
    }

    private _rootNode: cc.Node;
    private beforeSceneLaunch(scene: cc.Scene) {
        
        const isLdScene = scene.name == 'LDScene' || scene.name == 'LDPvpScene' || scene.name == 'LDCooperate';
        // let canvas: cc.Canvas;
        // for (const n of scene.children) {
        //     canvas = n.getComponent(cc.Canvas);
        // }
        this.fitCanvas(isLdScene);
        this.checkPersistRootNode();
        this._rootNode.setContentSize(cc.winSize.width, cc.winSize.height);
    }

    public addPersistRootNode(node: cc.Node) {
        this.checkPersistRootNode();
        this._rootNode.addChild(node);
    }

    /*
    public enableFit() {
        let dSize = cc.view.getDesignResolutionSize();
        let fSize = cc.view.getFrameSize();
        return (fSize.width / fSize.height < dSize.width / dSize.height);
    }

    private checkLong(scene: cc.Scene) {
        let fSize = cc.view.getFrameSize();
        if (fSize.width / fSize.height < 2.2) return;

        let canvas: cc.Canvas;
        for (const n of scene.children) {
            canvas = n.getComponent(cc.Canvas);
            if (canvas) {
                let nodeBg = new cc.Node();
                let graphics = nodeBg.addComponent(cc.Graphics);
                graphics.fillColor = cc.Color.BLACK;
                graphics.fillRect(-2000 , -2000 , 4000 , 4000);
                graphics.fill();
                nodeBg.zIndex = -1;
                n.addChild(nodeBg);

                break;
            }
        }
    }
        */


    private checkPersistRootNode() {
        if (!this._rootNode) {
            this._rootNode = new cc.Node("Persist Root");
            cc.game.addPersistRootNode(this._rootNode);
            this._rootNode.setContentSize(cc.winSize);
            this._rootNode.setAnchorPoint(0, 0);
            cc.view.on('canvas-resize', this.onCanvasResize, this);
            // if (this.enableFit()) {
            //     this._rootNode.addComponent(cc.Mask);
            // }
        }
    }

    private onCanvasResize() {
        this._rootNode.setContentSize(cc.winSize);
    }

    public fitCanvas(isLdScene = false) {
        const frameSize =  cc.view.getFrameSize();
        // const canvasSize =  cc.view.getCanvasSize();
        // const visibleSize =  cc.view.getVisibleSize();
        // const designResolutionSize =  cc.view.getDesignResolutionSize();

        // console.log('==========frameSize===========' , frameSize.width , frameSize.height);
        // console.log('==========canvasSize===========' , canvasSize.width , canvasSize.height);
        // console.log('==========visibleSize===========' , visibleSize.width , visibleSize.height);
        // console.log('==========designResolutionSize===========' , designResolutionSize.width , designResolutionSize.height);
        // console.log('==========cc.winsize===========' , cc.winSize.width , cc.winSize.height);

        if (frameSize.width > frameSize.height) {
            //不应该出现的
            cc.view.setDesignResolutionSize(720, isLdScene ? 1440 : 1280, cc.ResolutionPolicy.SHOW_ALL);
        }

        if (isLdScene) {
            let fSize = cc.view.getFrameSize();
            if ((fSize.width / fSize.height) <= 0.5) {
                // cc.log(111);
            } else {
                const canvas = cc.Canvas.instance;
                if (canvas) {
                    canvas.designResolution.height = 1440;
                    canvas.fitHeight = true;
                    canvas.fitWidth = false;
                }
                GameEvent.emit(EventEnum.ON_CANVAS_RESIZE);
            }
        }
    }
}
