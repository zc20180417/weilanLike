import { Component } from "./Component";
import { Handler } from "../../utils/Handler";
import SysMgr from "../../common/SysMgr";

export class FrameComponent extends Component {
    /** 添加到主体时是否自动刷新*/
    autoStartUpdate:boolean = true;
    /**优先级 */ 
    priority:number = 1;

    /**刷新帧率 */
    private _frameRate:number = 0;
    private _updateFunc:Function;
    get frameRate():number {
        return this._frameRate;
    }

    set frameRate(value:number) {
        this._frameRate = value;
        if (value == 1) {
            this._updateFunc = this.update;
        } else {
            this._updateFunc = this.checkUpdate;
        }
    }

    protected _timerHandler:Handler;
    private _curFrame:number = 0;
    constructor() {
        super();
        this._timerHandler = new Handler(this.onTimer , this);
    }

    /** 组件添加到主体上*/ 
    added() {
        super.added();
        if (this.autoStartUpdate)
            this.registerUpdate();
    }

    /** 组件从主体上移除*/ 
    removed() {
        this.unRegisterUpdate();
        super.removed();
    }

    /**注册刷新 */ 
    registerUpdate() {
        SysMgr.instance.registerUpdate(this._timerHandler,this.priority);
    }

    /**移除刷新 */ 
    unRegisterUpdate() {
        SysMgr.instance.unRegisterUpdate(this._timerHandler);
    }
    
    onTimer() {
        this._curFrame ++;
        this._updateFunc();
    }
    
    /**执行刷新 */
    update() {
    }

    giveUp() {
        this._timerHandler = null;
    }
    
    protected checkUpdate() {
        if (this._curFrame % this._frameRate == 0) {
            this.update();
        }
    }
}

export class LateFrameComponent extends FrameComponent {

    registerUpdate() {
        SysMgr.instance.registerUpdate(this._timerHandler,this.priority ,true);
    }

    unRegisterUpdate() {
        SysMgr.instance.unRegisterUpdate(this._timerHandler , true);
    }
    
}