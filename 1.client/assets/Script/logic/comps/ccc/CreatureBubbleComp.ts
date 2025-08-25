import { EResPath } from "../../../common/EResPath";
import { EventEnum } from "../../../common/EventEnum";
import SysMgr from "../../../common/SysMgr";
import Game from "../../../Game";
import GlobalVal from "../../../GlobalVal";
import { GameEvent } from "../../../utils/GameEvent";
import { Handler } from "../../../utils/Handler";
import { MathUtils } from "../../../utils/MathUtils";
import { StringUtils } from "../../../utils/StringUtils";
import { NodeUtils } from "../../../utils/ui/NodeUtils";
import { ERecyclableType } from "../../Recyclable/ERecyclableType";
import Creature from "../../sceneObjs/Creature";
import { EFrameCompPriority } from "../AllComp";
import { FrameComponent } from "../FrameComponent";

export class CreatureBubbleComp extends FrameComponent {
    private _showTime:number = 3500;
    private _self: Creature;
    private _bubbleNode: cc.Node;
    private _loadedHandler: Handler;
    private _label: cc.RichText;
    private _closeBtn:cc.Node = null;


    private _isRemoved: boolean = false;
    private _hideTime: number = 0;
    private _info: string[];
    private _index: number = 0;
    private _isShow: boolean = false;
    private _fadeOutTime:number = 0;
    private _labelHeight:number = 0;
    private _isTips:boolean = false;
    private _offsetY:number = 40;
    constructor() {
        super();
        this.frameRate = 1;
        this.priority = EFrameCompPriority.WALK;
        this.key = ERecyclableType.BUBBLE;
        this._loadedHandler = new Handler(this.onBubbleLoaded, this);
    }

    added() {
        super.added();
        this._self = this.owner as Creature;
        this._isRemoved = false;
        this._bubbleNode = Game.soMgr.getPoolNode(EResPath.BUBBLE);

        GameEvent.on(EventEnum.HIDE_START_GAME, this.onStartShow, this);
        if (!this._bubbleNode) {
            Game.resMgr.loadRes(EResPath.BUBBLE, cc.Prefab, this._loadedHandler);
        } else {
            this.initLabel();
        }
    }

    onStartShow(showTime?:number) {
        if (this._isShow) return;
        this._isShow = true;
        this._showTime = showTime || 3500;
        this.tryShowInfo();
    }

    removed() {
        this._isShow = false;
        this._isRemoved = true;
        this._self = null;
        GameEvent.off(EventEnum.HIDE_START_GAME, this.onStartShow, this);
        if (this._bubbleNode) {
            NodeUtils.to(this._bubbleNode , .3 , {scale:0,opacity:0 } , 'sineIn');
            // Game.soMgr.cacheNode(this._bubbleNode, EResPath.BUBBLE);
            this._bubbleNode = null;
        }
        Game.resMgr.removeLoad(EResPath.BUBBLE, this._loadedHandler);
        super.removed();
    }

    resetData() {
        if (!this._isRemoved) {
            cc.log("error !!!!!!!!!!!!!");
        }
        this._self = null;
        this._hideTime = 0;
        this._info.length = 0;
        this._isShow = false;
        this._index = 0;
        if (this._bubbleNode) {
            Game.soMgr.cacheNode(this._bubbleNode, EResPath.BUBBLE);
            this._bubbleNode = null;
        }
    }

    update() {
        if (!this._self || !this._self.isValid || !this._isShow) {
            cc.log('----update----this._self.isDied');
            return;
        }

        if (this._fadeOutTime != 0 && GlobalVal.now >= this._fadeOutTime) {
            if (this._bubbleNode) {
                this._bubbleNode.opacity = MathUtils.lerp(0 , 255 , 255 * (300 - GlobalVal.now + this._fadeOutTime));
            }
        }

        if (this._hideTime != 0 && GlobalVal.now >= this._hideTime) {
            if (this._index < this._info.length) {
                this.refreshLabel();
            } else {
                this._self.removeComponent(this);
            }
            return;
        }

        if (this._bubbleNode) {
            GlobalVal.tempVec2.x = this._self.centerPos.x + 20;
            GlobalVal.tempVec2.y = this._self.y + (this._self.size.height == 0 ? 40 : this._self.size.height) + this._offsetY;
            if (GlobalVal.tempVec2.y + this._hei > 525) {
                GlobalVal.tempVec2.y = 525 - this._hei;
            }
            this._bubbleNode.setPosition(GlobalVal.tempVec2.x, GlobalVal.tempVec2.y);
        }
    }

    setInfo(strs: string[] , labelHeight:number , isTips:boolean = false) {
        this._info = strs;
        this._labelHeight = labelHeight;
        this._index = 0;
        this._isTips = isTips;
        this._offsetY = isTips ? 40 : 0
        this.tryShowInfo();
    }

    private onBubbleLoaded(res: cc.Prefab, path: string) {
        Game.resMgr.addRef(path);
        if (this._isRemoved) return;
        if (!res) return;
        this._bubbleNode = cc.instantiate(res);
        if (this._isShow) {
            this.tryShowInfo();
        }
    }

    private initLabel() {
        this.update();
        this._label = this._bubbleNode.getComponentInChildren(cc.RichText);
        let closeBtn = this._bubbleNode.getComponentInChildren(cc.Button);
        if (closeBtn) {
            this._closeBtn = closeBtn.node;
            this._closeBtn.on(cc.Node.EventType.TOUCH_START , this.onCloseTouch , this);
            this._closeBtn.active = this._isTips;
        }
        if (this._labelHeight != 0) {
            this._label.lineHeight = this._labelHeight;
        }
    }

    private tryShowInfo() {
        if (this._isShow && this._bubbleNode) {
            if (!this._bubbleNode.parent) {
                Game.soMgr.addBlood(this._bubbleNode);
            }
            this._bubbleNode.scale = 0;
            this._bubbleNode.opacity = 0;
            NodeUtils.to(this._bubbleNode , .3 , {scale:1,opacity:255 } , 'sineIn');
            this.initLabel();
            this.refreshLabel();
        }
    }

    private refreshLabel() {
        this._fadeOutTime = 0;
        if (this._bubbleNode) {
            this._bubbleNode.opacity = 255;
        }

        if (this._info && this._info.length > 0 && !StringUtils.isNilOrEmpty(this._info[0])) {
            if (this._label) {
                this._label.string = this._info[this._index] || "";
                this._index++;
                this._hideTime = GlobalVal.now + this._showTime;
                this._fadeOutTime = this._hideTime - 300;
                // this._label['_forceUpdateRenderData']();

                SysMgr.instance.doFrameOnce(new Handler(this.refreshBgWidth , this) , 1 , true);
                
            }
        } 
    }

    private _hei:number = 0;
    private refreshBgWidth() {
        if (!this._bubbleNode) return;
        let wid = this._label.node.width;
        if (this._label._linesWidth && this._label._linesWidth.length > 0) {
            wid = this._label._linesWidth[0];
        }
        // console.log(this._label._linesWidth[0]);
        const bg:cc.Node = this._bubbleNode.getChildByName('bg');
        bg.width = wid * 0.5 + 25;
        bg.height = this._label.node.height * 0.5 + 23.5;
        this._hei = bg.height;
    }

    private onCloseTouch() {
        GameEvent.emit(EventEnum.CLOSE_GUIDE_MISSION_TIPS);
        // this._self.removeComponent(this);
    }
}