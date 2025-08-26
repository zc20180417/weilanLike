import { ECamp } from "../../common/AllEnum";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { ERecyclableType } from "../../logic/Recyclable/ERecyclableType";
import SceneObject from "../../logic/sceneObjs/SceneObject";
import { Tower } from "../../logic/sceneObjs/Tower";
import { GameEvent } from "../../utils/GameEvent";
import { NodeUtils } from "../../utils/ui/NodeUtils";


export class HeroTable extends SceneObject {

    gx:number = 0;
    gy:number = 0;

    private _hero:Tower;
    private _light:cc.Node;

    private _heroColor:cc.Color = new cc.Color(255, 255, 255 , 255);
    // private 
    /**阵营 */
    protected _camp:ECamp = ECamp.BLUE;

    constructor() {
        super();
        this.key = ERecyclableType.HERO_TABLE;
        this.addEvent();
    }

    get hero():Tower {
        return this._hero;
    }

    set hero(value:Tower) {
        if (this._hero) {
            this._hero.off(EventEnum.MAIN_BODY_ATTACHED , this.onTowerMainBodyAttached, this);
        }

        this._hero = value;
        if (this._hero) {
            this._hero.on(EventEnum.MAIN_BODY_ATTACHED , this.onTowerMainBodyAttached, this);
        }
    }

    removeTower() {
        if (this._hero) {
            const tempHero = this._hero;
            this.hero = null;
            Game.soMgr.removeTower(tempHero);
        }
    }

    onRecycleUse() {
        this.addEvent();
        super.onRecycleUse();
    }

    private addEvent() {
        GameEvent.on(EventEnum.START_DRAG_TOWER , this.onStartDragTower, this);
        GameEvent.on(EventEnum.END_DRAG_TOWER , this.onEndDragTower, this);
    }

    private removeEvent() {
        GameEvent.off(EventEnum.START_DRAG_TOWER , this.onStartDragTower, this);
        GameEvent.off(EventEnum.END_DRAG_TOWER , this.onEndDragTower, this);
    }

    resetData() {
        this.gx = this.gy = 0;
        this.hero = null;
        this.removeEvent();
        super.resetData();
    }

    giveUp() {
        super.giveUp();
    }

    dispose() {
        super.dispose();
    }

    setAttachGameObject(obj: cc.Node) {
        super.setAttachGameObject(obj);
        this._light = obj.getChildByName("light");
    }

    tryRemoveMainBody() {
        if (this._mainBody) {
            this._mainBody.targetOff(this);
        }
        super.tryRemoveMainBody();
    }

    /**阵营 */
    get camp():ECamp {
        return this._camp;
    }

    /**阵营 */
    set camp(value:ECamp) {
        this._camp = value;
    }

    protected refreshPos() {
        super.refreshPos();
        //this.drawRect();
    }

    private onStartDragTower(tower:Tower) {
        if (this.hero == tower || this.hero == null || tower.camp !== this._camp) return;
        if (this.hero.cfg.ntroopsid == tower.cfg.ntroopsid && this.hero.level == tower.level) {
            this._light.active = true;
            this.heroColor = cc.Color.WHITE;
        } else {
            this._light.active = false;
            this.heroColor = cc.Color.GRAY;
        }
    }

    private onEndDragTower() {
        this._light.active = false;
        this.heroColor = cc.Color.WHITE;
    }

    private onTowerMainBodyAttached() {
        NodeUtils.setColor(this.hero.mainBody, this._heroColor);
    }

    set heroColor(color:cc.Color) {
        this._heroColor = color;
        if (this._hero && this._hero.mainBody) {
            this.onTowerMainBodyAttached();
        }

    }


        
}