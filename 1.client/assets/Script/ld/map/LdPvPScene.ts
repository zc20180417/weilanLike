import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GameEvent } from "../../utils/GameEvent";
import { LdMapCtrl } from "./LdMapCtrl";

const { ccclass, property ,menu} = cc._decorator;

@ccclass
@menu("Game/LD/LdPvPScene")
export default class LdPvPScene extends cc.Component {

    @property(cc.Graphics)
    gridGs:cc.Graphics = null;

    @property(cc.Node)
    monsterNode:cc.Node = null;

    @property(cc.Node)
    sommonNode:cc.Node = null;

    @property(cc.Node)
    gridNode:cc.Node = null;

    @property(cc.Node)
    gridRedNode:cc.Node = null;

    @property(cc.Node)
    mapUINode:cc.Node = null;

    @property(cc.Node)
    effectBottomNode:cc.Node = null;

    @property(cc.Node)
    effectTopNode:cc.Node = null;

    @property(cc.Node)
    heroNode:cc.Node = null;

    @property(cc.Sprite)
    bg:cc.Sprite = null;

    @property(cc.Node)
    mapContainer:cc.Node = null;

    private _mapCtrl:LdMapCtrl = null;
    private _minY:number = -500;
    private _maxY:number = 0;

    protected onLoad(): void {
        // this.fitScene();
    }

    protected start(): void {
        if (CC_DEBUG) {
            for (let i = 0 ; i < 10; i++) {
                this.gridGs.moveTo(i * 88 + 49 , 0);
                this.gridGs.lineTo(i * 88 + 49 , 3000);
            }
    
            for (let i = 0 ; i < 30; i++) {
                this.gridGs.moveTo(0 , 88 * i);
                this.gridGs.lineTo(720 , 88 * i);
            }
        }
        this._dragHeroing = false;
        this.gridGs.stroke();
        Game.ldSkillMgr.graph = this.gridGs;
        Game.soMgr.setContainer(this.monsterNode , this.heroNode , this.effectTopNode , 
                                this.mapUINode , this.sommonNode , this.effectBottomNode , this.gridNode , this.gridRedNode);
        Game.mapCtrl = Game.curLdGameCtrl.getMapCtrl();
        this._mapCtrl = Game.mapCtrl;
        this._mapCtrl.init(this.gridGs , this.bg);
        this._mapCtrl.enterMap();


        this.mapContainer.on(cc.Node.EventType.TOUCH_START , this.onMapTouch , this);
        this.mapContainer.on(cc.Node.EventType.TOUCH_MOVE , this.onTouchMove , this);
        this.mapContainer.on(cc.Node.EventType.TOUCH_END , this.onTouchEnd , this);
        this.mapContainer.on(cc.Node.EventType.TOUCH_CANCEL , this.onTouchEnd , this);

         
        this.onCanvasResize();
        GameEvent.on(EventEnum.ON_CANVAS_RESIZE , this.onCanvasResize , this);
        GameEvent.on(EventEnum.START_DRAG_TOWER , this.onStartDragTower, this);
        GameEvent.on(EventEnum.END_DRAG_TOWER , this.onEndDragTower, this);
    }

    protected onDestroy(): void {
        GameEvent.off(EventEnum.ON_CANVAS_RESIZE , this.onCanvasResize , this);
        GameEvent.off(EventEnum.START_DRAG_TOWER , this.onStartDragTower, this);
        GameEvent.off(EventEnum.END_DRAG_TOWER , this.onEndDragTower, this);
    }

     onEnable() {
        if (cc.sys.isNative) {
            jsb["Device"].setKeepScreenOn(true);
        }

    }
    onDisable() {
        Game.soundMgr.stopMusic();
        if (cc.sys.isNative) {
            jsb["Device"].setKeepScreenOn(false);
        }
    }

    // 新增成员变量，记录拖拽起始点和容器初始位置
    private _dragStartPos: cc.Vec2 = null;
    private _mapStartPos: cc.Vec2 = null;

    /**
     * 触摸开始事件处理
     * 记录起始触摸点和当前mapContainer位置
     */
    private onMapTouch(event: cc.Event.EventTouch) {
        this._dragStartPos = event.getLocation();
        this._mapStartPos = cc.v2(this.mapContainer.position.x, this.mapContainer.position.y);
    }

    /**
     * 触摸移动事件处理
     * 根据触摸移动距离，更新mapContainer的y坐标，实现上下拖拽
     */
    private onTouchMove(event: cc.Event.EventTouch) {
        if (!this._dragStartPos || !this._mapStartPos || this._dragHeroing) return;

        const touchPos = event.getLocation();
        const deltaY = touchPos.y - this._dragStartPos.y;

        // 只允许上下拖拽，x坐标保持不变
        let newY = this._mapStartPos.y + deltaY;

        // 可选：限制拖拽范围，避免拖出边界
        newY = Math.min(this._maxY, Math.max(this._minY, newY));
        this.mapContainer.y = newY;
    }

    /**
     * 触摸结束或取消事件处理
     * 清理拖拽状态
     */
    private onTouchEnd(event: cc.Event.EventTouch) {
        this._dragStartPos = null;
        this._mapStartPos = null;
    }

    private onCanvasResize() {
        this._maxY = -cc.winSize.height * 0.5;
        this._minY =  cc.winSize.height - this.mapContainer.height - cc.winSize.height * 0.5;
    }

    private _dragHeroing:boolean = false;
    private onStartDragTower() {
        this._dragHeroing = true;
    }

    private onEndDragTower() {
        this._dragHeroing = false;
    }

}