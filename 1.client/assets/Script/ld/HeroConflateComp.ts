import { EventEnum } from "../common/EventEnum";
import Game from "../Game";
import { Tower } from "../logic/sceneObjs/Tower";
import { GameEvent } from "../utils/GameEvent";
import { MathUtils } from "../utils/MathUtils";
import { UiManager } from "../utils/UiMgr";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/LD/HeroConflateComp")
export class HeroConflateComp extends cc.Component {

    private _touchTower:Tower = null;
    private _tempTower:Tower = null;
    private _startPos:cc.Vec2;
     
    start(): void {
        GameEvent.on(EventEnum.ON_TOWER_TOUCH_START , this.onTowerTouchStart , this);
        GameEvent.on(EventEnum.ON_TOWER_TOUCH_MOVE , this.onTowerTouchMove , this);
        GameEvent.on(EventEnum.ON_TOWER_TOUCH_END , this.onTowerTouchEnd , this);
    }


    onDestroy(): void {
        GameEvent.off(EventEnum.ON_TOWER_TOUCH_START , this.onTowerTouchStart , this);
        GameEvent.off(EventEnum.ON_TOWER_TOUCH_MOVE , this.onTowerTouchMove , this);
        GameEvent.off(EventEnum.ON_TOWER_TOUCH_END , this.onTowerTouchEnd , this);
    }

    private onTowerTouchStart(tower:Tower , evt:cc.Event.EventTouch) {
        if (!tower.cfg || tower.level == 4 || tower.camp !== Game.curLdGameCtrl.getSelfCamp()) return;
        this._touchTower = tower;
        this._startPos = evt.getLocation();
    }

    private _movePos:cc.Vec2;
    private onTowerTouchMove(tower:Tower , evt:cc.Event.EventTouch) {
        if (!this._touchTower) return;
        this._movePos = evt.getLocation();
        const dic = MathUtils.getDistance(this._startPos.x , this._startPos.y , this._movePos.x , this._movePos.y);
        if (dic < 10) return;
        if (!this._tempTower) {
            this._tempTower = Game.soMgr.createUITower(this._touchTower.cfg.ntroopsid , this._touchTower.level, 0 , 0 , UiManager.topLayer, false) as Tower;
            this._tempTower.opacity = 125;
            GameEvent.emit(EventEnum.START_DRAG_TOWER , this._touchTower);
        }

        let pos = UiManager.topLayer.convertToNodeSpaceAR(this._movePos);
        if (this._tempTower) {
            this._tempTower.setPosNow(pos.x , pos.y);
        }
    }

    private onTowerTouchEnd(tower:Tower , evt:cc.Event.EventTouch) {
        if (this._touchTower && !this._tempTower) {
            //单纯的点击，没有移动或者该英雄已经是4级了
            GameEvent.emit(EventEnum.ON_TOWER_TOUCH  , this._touchTower );
            this._touchTower = null;
            return;
        }

        if (this._tempTower) {
            GameEvent.emit(EventEnum.END_DRAG_TOWER);  
            let startPos = evt && evt['getLocation'] ? evt.getLocation() : this.node.convertToWorldSpaceAR(cc.Vec2.ZERO_R);
            let pos = this.node.convertToNodeSpaceAR(startPos);
            const tower = GameEvent.dispathReturnEvent(EventEnum.CALC_END_DRAG_TOWER , pos.x , pos.y , Game.curLdGameCtrl.getSelfCamp());
            if (tower && tower.id !== this._touchTower.id && tower.cfg.ntroopsid === this._touchTower.cfg.ntroopsid && tower.level === this._touchTower.level) {
                GameEvent.emit(EventEnum.CONFLATE_TOWER , this._touchTower , tower , Game.curLdGameCtrl.getSelfCamp());
            }
        }

        this._touchTower = null;
        if (this._tempTower) {
            // this._tempTower.dispose();
            Game.soMgr.removeUITower(this._tempTower);
        }
        this._tempTower = null;
    }


}