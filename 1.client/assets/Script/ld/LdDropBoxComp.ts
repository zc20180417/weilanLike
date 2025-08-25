import { ECamp } from "../common/AllEnum";
import { EventEnum } from "../common/EventEnum";
import SysMgr from "../common/SysMgr";
import GlobalVal from "../GlobalVal";
import { GameEvent } from "../utils/GameEvent";
import { Handler } from "../utils/Handler";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/LD/LdDropBoxComp")
export class LdDropBoxComp extends cc.Component {

    @property(dragonBones.ArmatureDisplay)
    dragon: dragonBones.ArmatureDisplay = null;

    private _dropsId: number = 0;
    private _clicked: boolean = false;
    private _endHandler:Handler = null;
    private _openTime:number = 0;
    private _campId:ECamp

    show(dropsId:number , endHandler:Handler , campId:ECamp) {
        this._campId = campId;
        this._dropsId = dropsId;
        this.node.active = true;
        this._endHandler = endHandler;
        this.dragon.timeScale = 1;
        this.dragon.playAnimation("idle", 0);
        this._clicked = false;
        this._openTime = GlobalVal.now + 5000;
    }

    protected update(dt: number): void {
        if (this._clicked) return;
        if (GlobalVal.now >= this._openTime) {
            this.onClick();
        }
    }


    private onClick() {
        if (this._clicked) return;
        SysMgr.instance.pauseGame('LdDropBoxComp' , true);
        this._clicked = true;
        this.dragon.timeScale = 1;
    
        this.dragon.armature().animation.gotoAndPlayByTime('idle2', 0.4 , 1);
        this.scheduleOnce(this.onOpenBox , 0.5);
        
    }

    getDropsId() { return this._dropsId; }


    private onOpenBox() {
        this.unschedule(this.onOpenBox);
        if (this._endHandler) {
            this._endHandler.executeWith(this);
        }
        GameEvent.emit(EventEnum.LD_OPEN_DROPS_BOX , this._dropsId , this._campId);
    }


}