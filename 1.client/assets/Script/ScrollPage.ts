// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Handler } from "./utils/Handler";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ScrollPage extends cc.Component {

    _touchMoved: boolean = false;

    public scrollLeftHandler: Handler = null;

    public scrollRightHandler: Handler = null;

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this, true);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this, true);
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this, true);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancelled, this, true);
    }
    onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this, true);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this, true);
        this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this, true);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancelled, this, true);
    }

    _onTouchBegan(event, captureListeners) {
        let touch = event.touch;
        this._touchMoved = false;
        this._stopPropagationIfTargetIsMe(event);
    }

    _onTouchMoved(event, captureListeners) {

        let touch = event.touch;

        let deltaMove = touch.getLocation().sub(touch.getStartLocation());

        //FIXME: touch move delta should be calculated by DPI.
        if (deltaMove.mag() > 100) {
            if (!this._touchMoved) {
                // TRANSITION_CHAPTER_6
                // Simulate touch cancel for target node
                let cancelEvent = new cc.Event.EventTouch(event.getTouches(), event.bubbles);
                cancelEvent.type = cc.Node.EventType.TOUCH_CANCEL;
                cancelEvent.touch = event.touch;
                cancelEvent["simulate"] = true;
                event.target.dispatchEvent(cancelEvent);
                this._touchMoved = true;
            }
        }
        this._stopPropagationIfTargetIsMe(event);
    }

    _onTouchEnded(event, captureListeners) {
        let touch = event.touch;
        if (this._touchMoved) {
            this._handleReleaseLogic(touch);
            event.stopPropagation();
        } else {
            this._stopPropagationIfTargetIsMe(event);
        }
    }

    _onTouchCancelled(event, captureListeners) {
        let touch = event.touch;

        if (!event["simulate"] && this._touchMoved) {
            this._handleReleaseLogic(touch);
        }
        this._stopPropagationIfTargetIsMe(event);
    }

    _stopPropagationIfTargetIsMe(event) {
        if (event.eventPhase === cc.Event.AT_TARGET && event.target === this.node) {
            event.stopPropagation();
        }
    }

    _handleReleaseLogic(touch) {
        let deltaMove = touch.getLocation().sub(touch.getStartLocation());
        if (deltaMove.x > 0) {
            // cc.log("right")
            this.scrollRightHandler && this.scrollRightHandler.execute();
        } else if (deltaMove.x < 0) {
            this.scrollLeftHandler && this.scrollLeftHandler.execute();
            // cc.log("left")
        }
    }
}
