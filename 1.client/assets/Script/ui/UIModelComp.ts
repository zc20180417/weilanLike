import Game from "../Game";
import { EActionName } from "../logic/comps/animation/AnimationComp";
import { BaseAnimation } from "../utils/effect/BaseAnimation";
import { Handler } from "../utils/Handler";
import { StringUtils } from "../utils/StringUtils";
import { NodeUtils } from "../utils/ui/NodeUtils";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/ui/UIModelComp")
export class UIModelComp extends cc.Component {

    private _loadedHandler: Handler;
    private _mainBody: cc.Node = null;
    private _url: string = '';
    private _color: cc.Color = null;

    private limitWid: number = 90;

    private _bodyAnchorY = 0.5;
    private _bodyAnchorX = 0.5;

    private enableLimitWid: boolean = true;

    protected _playEndHandler: Handler;
    protected _loopCompleteHandler: Handler = null;
    protected _aniCom: BaseAnimation = null;
    protected _currPlayTimes: number = 0;

    private tipsData: any = null;

    public setTipsData(data: any) {
        this.tipsData = data;
    }

    public setBodyAnchorY(anchorY: number) {
        this._bodyAnchorY = anchorY;
    }

    public setBodyAnchorX(anchorX: number) {
        this._bodyAnchorX = anchorX;
    }

    onDestroy() {
        this.tryRemoveLoad();
        //this.tryRemoveMainBody();
    }

    reset() {
        this.tryRemoveMainBody();
        this.tryRemoveLoad();
        this._url = '';
        this.node.removeAllChildren();
    }

    setModelUrl(url: string) {
        if (this._url == url && !StringUtils.isNilOrEmpty(url)) {
            return;
        }
        this.tryRemoveMainBody();
        this.tryRemoveLoad();

        this._url = url;
        let node: cc.Node = Game.soMgr.getPoolNode(url);
        if (node) {
            this.setAttachGameObject(node);
        } else {
            if (!this._loadedHandler) {
                this._loadedHandler = new Handler(this.onModelLoaded, this);
            }
            Game.resMgr.loadRes(url, cc.Prefab, this._loadedHandler);
        }
    }

    setAttachGameObject(obj: cc.Node) {
        this._mainBody = obj;

        if (this._mainBody.parent) {
            this._mainBody.removeFromParent();
        }

        this._mainBody.x = this._mainBody.y = 0;
        this.node.addChild(this._mainBody);
        

        obj.anchorY = this._bodyAnchorY;
        obj.anchorX = this._bodyAnchorX;

        if (this._bodyAnchorX != 0.5 && obj.childrenCount > 0) {
            obj.children[0].x = obj.width * 0.5;
        }

        if (!this.tipsData) {
            let max: number = Math.max(obj.width, obj.height);
            if (max > this.limitWid) {
                this._mainBody.scale = this.limitWid / max;
            }
        }

        this.node.width = obj.width * this.node.scale * this._mainBody.scale;
        this.node.height = obj.height * this.node.scale * this._mainBody.scale;

        let animationComp: BaseAnimation = this._aniCom = this._mainBody.getComponent(BaseAnimation);
        if (!this.tipsData) {
            if (animationComp) {
                animationComp.playAction(EActionName.SHOW);
            }
        } else {
            if (!this._playEndHandler) this._playEndHandler = Handler.create(this.playEndHandler, this);
            if (!this._loopCompleteHandler) this._loopCompleteHandler = Handler.create(this.loopCompleteHandler, this);
            if (animationComp) {
                animationComp.playEndHandler = this._playEndHandler;
                animationComp.loopCompleteHandler = this._loopCompleteHandler;
                this._aniCom.playAction(this.tipsData.bossIdleName, true);
                //设置定时器每隔一段时间播放一次boss间隔动画
                this.schedule(this.playBossIntervalAni, this.tipsData.bossAniInterval * 0.001, cc.macro.REPEAT_FOREVER);
            }
        }

        let btn: cc.Button = this._mainBody.getComponent(cc.Button);
        if (btn) {
            this._mainBody.removeComponent(btn);
        }
        this.setDragonColor(this._color);
    }


    private tryRemoveLoad() {
        if (StringUtils.isNilOrEmpty(this._url)) {
            return;
        }
        Game.resMgr.removeLoad(this._url, this._loadedHandler);
        // if (this._loadedHandler) {
        //     this._loadedHandler = null;
        // }
    }

    protected tryRemoveMainBody() {
        if (this._mainBody) {
            this._mainBody.destroy();
            this._mainBody = null;
        }
    }

    private onModelLoaded(res: any, path: string) {
        Game.resMgr.addRef(path);
        this._loadedHandler = null;
        let prefab = Game.resMgr.getRes(this._url);
        if (!prefab) return;
        let obj: cc.Node = cc.instantiate(prefab);
        this.setAttachGameObject(obj);
    }

    /**
     * 改变骨骼颜色
     * @param color 
     */
    public setDragonColor(color: cc.Color) {
        if (!color) return;
        this._color = color;
        if (this._mainBody) {
            NodeUtils.setColor(this._mainBody, color);
            //this._mainBody.color = color;
        }
    }

    playEndHandler(event) {
        if (event.animationState.name == this.tipsData.bossActionName) {
            //播放bossidle动作
            this._aniCom.playAction(this.tipsData.bossIdleName, true);
        }
    }

    loopCompleteHandler(event) {
        if (event.animationState.name == this.tipsData.bossActionName && this._currPlayTimes++ >= this.tipsData.bossActionRepeats) {
            //播放bossidle动作
            this._currPlayTimes = 0;
            this._aniCom.playAction(this.tipsData.bossIdleName, true);
        }
    }


    playBossIntervalAni() {
        this._aniCom.playAction(this.tipsData.bossActionName, true);
    }
}