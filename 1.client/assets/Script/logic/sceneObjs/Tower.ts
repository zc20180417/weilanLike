import Creature from "./Creature";
import { GameEvent } from "../../utils/GameEvent";
import { EventEnum } from "../../common/EventEnum";
import { ERecyclableType } from "../Recyclable/ERecyclableType";



export class Tower extends Creature {

    /**当前等级 */
    level:number = 0;

    gx:number = 0;
    gy:number = 0;

    sommonUid:number = 0;

    /**是否是玩家自己创建的 */
    isCreated:boolean = false;

    /**等待服务器返回释放技能 */
    waitServerRelease:boolean = false;

    
    constructor() {
        super();
        this.key = ERecyclableType.TOWER;
    }


    resetData() {

        this.removeMainBodyEvt();

        this.gx = 0;
        this.gy = 0;
        this.isCreated = false;
        this.level = 1;
        // this._levelData = null;
        this.waitServerRelease = false;
        this.sommonUid = 0;
        super.resetData();
    }

    protected onClick() {
        GameEvent.emit(EventEnum.ON_TOWER_TOUCH, this);
    }


    /**
     * 限制角度
     */
    get limitAttackAngle():number {
        return  0;
    }

    setAttachGameObject(obj:cc.Node) {
        obj.removeComponent(cc.Button);
        super.setAttachGameObject(obj);

        if (this.cfg) {
            this._mainBody.on("click", this.onClick, this);
            this._mainBody.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
            this._mainBody.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
            this._mainBody.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
            this._mainBody.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        }
        GameEvent.emit(EventEnum.ON_TOWER_LOADED , this);
    }

    private removeMainBodyEvt() {
        if (!this._mainBody) return;
        this._mainBody.off("click", this.onClick, this);
        this._mainBody.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this._mainBody.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this._mainBody.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this._mainBody.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    private onTouchStart(evt: cc.Event.EventTouch) {
        // cc.log("onTouchStart" , this.id);
        GameEvent.emit(EventEnum.ON_TOWER_TOUCH_START, this , evt);
    }

    private onTouchMove(evt: cc.Event.EventTouch) {
        // cc.log("onTouchMove" , this.id);
        GameEvent.emit(EventEnum.ON_TOWER_TOUCH_MOVE, this , evt);
    }

    private onTouchEnd(evt: cc.Event.EventTouch) {
        // cc.log("onTouchEnd" , this.id);
        GameEvent.emit(EventEnum.ON_TOWER_TOUCH_END, this , evt);
    }
}