import { EventEnum } from "../../common/EventEnum";
import { Component } from "../../logic/comps/Component";
import Creature from "../../logic/sceneObjs/Creature";



const _v1 = cc.v3();
const _v2 = cc.v3();

export class DragComp extends Component {
    static EventType = {
        ON_DRAG_START: "on-drag-start",
        ON_DRAG_MOVE: "on-drag-move",
        ON_DRAG_END: "on-drag-end",
        ON_DRAG: "on-drag"
    }



    private _isMove: boolean = false;
    public _enableDrag: boolean = true;
    private _enableTouch: boolean = true;
    private _self:Creature;
    private _onTouch:boolean = false;

    /** 组件添加到主体上 */
    added() {
        this._self = this.m_Owner as Creature;
        if (this._self.mainBody) {
            this.enableTouch(true);
        } else {
            this._self.on(EventEnum.MAIN_BODY_ATTACHED , this.onMainBodyAttached , this);
        }
    }

    /** 组件从主体上移除 */
    removed() {
        this._self.off(EventEnum.MAIN_BODY_ATTACHED , this.onMainBodyAttached , this);
    }

    /** 重置数据 */
    resetData() {

        super.resetData();
    }

    /** 丢弃 */
    giveUp() {
        super.giveUp();
    }


    onLoad() {
        this._enableTouch = true;
    }

    onEnable() {
        this.enableTouch(this._enableTouch);
    }

    onDisable() {
        this.enableTouch(false);
    }

    private onTouchStart(event: cc.Event.EventTouch) {
        if (!this._enableDrag) return;
      
        // this.node.emit(Drag.EventType.ON_DRAG_START, this);
    }

    private onTouchMove(event: cc.Event.EventTouch) {
        if (!this._enableDrag) return;

        // _v1.add(this._offset);
        // this.node.setPosition(_v1);
        // this._isMove = true;
        // this.node.emit(Drag.EventType.ON_DRAG_MOVE, this);
    }

    private onTouchEnd(event: cc.Event.EventTouch) {
        if (!this._enableDrag) return;

        // this.node.emit(Drag.EventType.ON_DRAG_END, this);
    }


    private enableTouch(enable: boolean) {
        this._enableTouch = enable;
        if (enable) {
            this._self.mainBody.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this, true);
            this._self.mainBody.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this, true);
            this._self.mainBody.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this, true);
            this._self.mainBody.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this, true);
        } else {
            this._self.mainBody.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this, true);
            this._self.mainBody.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this, true);
            this._self.mainBody.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this, true);
            this._self.mainBody.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this, true);
        }
    }

    private onMainBodyAttached() {
        this.enableTouch(true);
    }
}