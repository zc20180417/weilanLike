import { EventEnum } from "../../common/EventEnum";
import SysMgr from "../../common/SysMgr";
import Game from "../../Game";
import { GameEvent } from "../../utils/GameEvent";
import { Handler } from "../../utils/Handler";
import { StringUtils } from "../../utils/StringUtils";
import Dialog from "../../utils/ui/Dialog";
import { UiManager } from "../../utils/UiMgr";
import { SystemGuideCtrl, SystemGuideTriggerType } from "./SystemGuideCtrl";

const { ccclass, property, menu } = cc._decorator;

/**
 * 系统指引
 */
@ccclass
@menu("Game/guide/SystemGuideView")
export class SystemGuideView extends Dialog {

    //@property([cc.Node])
    //maskNodes: cc.Node[] = [];

    @property(cc.Node)
    arrow: cc.Node = null;

    @property(cc.Node)
    labelNode: cc.Node = null;

    @property(cc.Label)
    desLabel: cc.Label = null;

    @property(cc.Node)
    hitEffect: cc.Node = null;

    @property(cc.Node)
    container: cc.Node = null;

    @property(cc.Node)
    maskNode: cc.Node = null;

    @property(cc.Label)
    timeLabel: cc.Label = null;

    @property(cc.BlockInputEvents)
    blockInput: cc.BlockInputEvents = null;

    private _data: any;
    private _anchorPos: cc.Vec2 = cc.Vec2.ZERO;
    private _curArrowNode: cc.Node = null;
    private _simulationClickNode: cc.Node = null;
    private _timer: Handler;
    private _needHide: boolean = true;
    private _preParent: cc.Node = null;
    private _curWorldPos: cc.Vec2 = null;

    private _timeHandler: Handler;
    private _endTime: number = 0;

    start() {
        this.node.setPosition(cc.Vec2.ZERO_R);
    }

    addEvent() {

        GameEvent.on(EventEnum.SYSTEM_GUIDE_REDUCTION_NODE, this.reductionNode, this);
    }

    setData(data: any) {
        this._needHide = false;
        this._data = data;
        if (!this._timer) {
            this._timer = new Handler(this.onTimer, this);
        }
        this.hitEffect.active = false;
        this.arrow.active = false;
        this.labelNode.active = false;
        this.timeLabel.node.active = false;
        SysMgr.instance.clearTimer(this._timer, true);

        SysMgr.instance.clearTimer(this._timeHandler, true);
            

        if (this._data.hideBlock == 1 && this.blockInput) {
            this.blockInput.node.active = false;
            this.maskNode.active = false;
        }

        if (this._data.targgerTime > 0) {
            SysMgr.instance.doOnce(this._timer, this._data.targgerTime, true);
        } else if (!StringUtils.isNilOrEmpty(data.targgerEvt) && data.targgerEvt == 'SHOW_VIEW') {

            if (UiManager.checkDialogShowByName(this._data.targgerEvtParam, true)) {
                this.onShowView(this._data.targgerEvtParam);
            } else {
                GameEvent.on(EventEnum.AFTER_SHOW_DIALOG, this.onShowView, this);
            }


        } else {
            SysMgr.instance.doOnce(this._timer, 300, true);
        }

        if (data.hideMask == 1) {
            this.maskNode.opacity = 0;
        } else {
            this.maskNode.opacity = 150;
        }

        if (!StringUtils.isNilOrEmpty(data.hideEvent)) {
            GameEvent.on(EventEnum[data.hideEvent] as unknown as EventEnum, this.hideMask, this);
        }
    }



    onDestroy() {
        this._anchorPos = null;
        this._timer = null;
    }

    protected beforeHide() {

        SysMgr.instance.clearTimer(this._timeHandler, true);
        SysMgr.instance.clearTimer(this._timer, true);

        if (this._curArrowNode && this._preParent && this._data.noHideView == 0) {
            if (this._data.hideMask != 1) {
                this.reductionNode();
            }
            this._preParent = null;
        }

    }

    private onShowView(viewName: string) {
        if (this._data && this._data.targgerEvtParam == viewName) {
            this.onTimer();
            SysMgr.instance.clearTimer(this._timer, true);
        }
    }

    private onTimer() {

        let posEvtParam = this._data.group == SystemGuideTriggerType.GAME_FAIL_GUIDE_SCIENCE ? Game.systemGuideCtrl.curItem.param : this._data.posEvtParam;
        this._curArrowNode = GameEvent.dispathReturnEvent(this._data.getPosEvt, posEvtParam);

        if (!this._curArrowNode) {
            GameEvent.on(EventEnum.SET_GUIDE_NODE, this.setArrowNode, this);
            return;
        }

        //cc.log("--------------------onTimer");
        this.setArrowNode(this._curArrowNode);
    }

    private setArrowNode(node: cc.Node) {
        this._curArrowNode = node;



        this._simulationClickNode = this._curArrowNode;
        if (this._curArrowNode) {
            let btnComp: cc.Button = this._curArrowNode.getComponent(cc.Button);
            if (!btnComp) {
                btnComp = this._curArrowNode.getComponentInChildren(cc.Button);
                if (btnComp) {
                    this._simulationClickNode = btnComp.node;
                }
            }
        }

        this._preParent = this._curArrowNode.parent;
        if (this._data.hideMask != 1) {
            this._curWorldPos = this._curArrowNode.convertToWorldSpaceAR(cc.Vec2.ZERO_R);
            this._curArrowNode.removeFromParent();
            let nodePos: cc.Vec2 = this.container.convertToNodeSpaceAR(this._curWorldPos);
            this._curArrowNode.setPosition(nodePos);
            this.container.addChild(this._curArrowNode);
        }


        let changeY: number = 0;
        let changeX: number = 0;
        if (this._data.posEvtParam == 'book_eft') {
            changeY = 50;
            changeX = -150;
        }

        this.arrow.scaleX = this._data.arrowScaleX == 1 ? -1 : 1;

        let rect: cc.Rect = this._curArrowNode.getBoundingBoxToWorld();
        this._anchorPos.y = rect.yMin + changeY;
        this._anchorPos.x = (this._data.arrowScaleX == 1 ? rect.xMax : rect.xMin) + changeX;

        this.refrestArrowPos();
        this.refreshLabelPos();
        this.hitEffect.active = true;


        this.hitEffect.width = this._simulationClickNode ? this._simulationClickNode.width : node.width;
        this.hitEffect.height = this._simulationClickNode ? this._simulationClickNode.height : node.height;

        //let pos = this._curArrowNode.getPosition();

        this.hitEffect.setPosition(rect.center.x + changeX, rect.center.y + changeY);


    }

    /*
    private refreshMaskPos(rect:cc.Rect ) {
        
        let maskNode: cc.Node = this.maskNodes[0];
        maskNode.x = rect.xMax;
        maskNode.y = rect.yMax;

        maskNode = this.maskNodes[1];
        maskNode.x = rect.xMax;
        maskNode.y = rect.yMin;

        maskNode = this.maskNodes[2];
        maskNode.x = rect.xMin;
        maskNode.y = rect.yMin;

        maskNode = this.maskNodes[3];
        maskNode.x = rect.xMin;
        maskNode.y = rect.yMax;
    }
    */

    private refrestArrowPos() {
        this.arrow.active = true;
        this.arrow.x = this._anchorPos.x + (this._data.arrowPoint.length > 0 ? this._data.arrowPoint[0] : 0);
        this.arrow.y = this._anchorPos.y + (this._data.arrowPoint.length > 0 ? this._data.arrowPoint[1] : 0);
    }

    private refreshLabelPos() {
        if (StringUtils.isNilOrEmpty(this._data.des)) {
            this.labelNode.active = false;
            return;
        }

        let des = this._data.des;
        if (Game.systemGuideCtrl.curItem.group == SystemGuideTriggerType.TOWER_CAN_UPGRADE ||
            Game.systemGuideCtrl.curItem.group == SystemGuideTriggerType.TOWER_CAN_ACTIVE ||
            Game.systemGuideCtrl.curItem.group == SystemGuideTriggerType.GAME_FAIL_GUIDE_SKIN ||
            Game.systemGuideCtrl.curItem.group == SystemGuideTriggerType.GAME_FAIL_GUIDE_UPGRADE_TOWER) {
            let troopsInfo = Game.towerMgr.getTroopBaseInfo(Game.systemGuideCtrl.curItem.param);
            if (troopsInfo) {
                des = StringUtils.format(des, Game.towerMgr.getTowerName(troopsInfo.ntroopsid, troopsInfo));
            }
        }
        if (this._data.endTime > 0) {
            this.timeLabel.node.active = this._data.hideMask != 1;
            this._endTime = Math.floor(this._data.endTime / 1000);
            this.onEndTimer();
            if (!this._timeHandler) {
                this._timeHandler = new Handler(this.onEndTimer, this);
            }
            SysMgr.instance.doLoop(this._timeHandler, 1000,0, true);
        }

        this.labelNode.active = true;
        this.desLabel.string = des;
        this.labelNode.anchorX = this._data.labelAnchorX;
        this.labelNode.anchorY = this._data.labelAnchorY;
        this.labelNode.x = this._anchorPos.x + (this._data.labelPoint.length > 0 ? this._data.labelPoint[0] : 0);
        this.labelNode.y = this._anchorPos.y + (this._data.labelPoint.length > 0 ? this._data.labelPoint[1] : 0);
    }

    private onEndTimer() {
        if (this._endTime <= 0) {
            GameEvent.emit(EventEnum.END_SYSTEM_GUIDE);
            return;
        }
        if (this._data.hideMask != 1) {
            this.timeLabel.string = this._endTime + '秒后退出引导';
        }
        this._endTime--;
    }

    private onClick() {
        if (!this._curArrowNode || !this._preParent) {
            return;
        }
        //
        //cc.log("------------onClick:" , this._curArrowNode , this._preParent);
        if (this._curArrowNode && this._preParent && this._data.noHideView == 0) {
            if (this._data.hideMask != 1) {
                this.reductionNode();
            }
            this._preParent = null;
        }

        this._needHide = true;

        GameEvent.emit(EventEnum.SYSTEM_GUIDE_CLICK, this._curArrowNode);
        GameEvent.emit(EventEnum.SYSTEM_GUIDE_CLICK2, this._curArrowNode);
        //模拟点击指引的按钮
        this._simulationClickNode.emit('touchstart', new cc.Event('touchstart', true));
        this._simulationClickNode.emit('touchend', new cc.Event('touchend', true));

        if (this._data.noHideView == 0) {
            this._curArrowNode = null;
        } else {
            this.hitEffect.active = false;
            this.arrow.active = false;
            this.labelNode.active = false;
        }

        if (this._needHide && this._data.noHideView == 0) {
            this.hide();
        }
    }

    private reductionNode() {
        if (this._curArrowNode && this._preParent && this._preParent.isValid) {
            this._curArrowNode.removeFromParent();
            if (!this._curWorldPos) {
                this._curWorldPos = cc.Vec2.ZERO;
            }
            let pos = this._preParent.convertToNodeSpaceAR(this._curWorldPos);
            this._curArrowNode.setPosition(pos);
            this._preParent.addChild(this._curArrowNode);
            this._preParent = null;
        }
    }

    private hideMask() {
        this.reductionNode();
        this.hide();
    }

    onCanvasResize() {

    }
}