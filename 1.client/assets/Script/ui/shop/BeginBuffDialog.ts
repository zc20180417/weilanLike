import { BuryingPointMgr, EBuryingPoint } from "../../buryingPoint/BuryingPointMgr";
import { EventEnum } from "../../common/EventEnum";
import SysMgr from "../../common/SysMgr";
import Game from "../../Game";
import { EBeginBuff } from "../../logic/BeginBuffCtrl";
import { GameEvent } from "../../utils/GameEvent";
import { Handler } from "../../utils/Handler";
import Dialog from "../../utils/ui/Dialog";
import { NodeUtils } from "../../utils/ui/NodeUtils";
const {ccclass, property , menu} = cc._decorator;

@ccclass
@menu("Game/ui/shop/BeginBuffDialog")
export class BeginBuffDialog extends Dialog {

    @property(cc.Label)
    label:cc.Label = null;

    @property(cc.Label)
    label2:cc.Label = null;

    @property(cc.Label)
    buffInfoLabel:cc.Label = null;

    //@property(dragonBones.ArmatureDisplay)
    //guantou:dragonBones.ArmatureDisplay = null;

    @property(cc.Node)
    item:cc.Node = null;

    @property(cc.Node)
    btnNode:cc.Node = null;

    private static MAX_TIME:number = 6;
    private _endTime = 0;
    private _onTimer:Handler = new Handler(this.onTimer , this);
    private _buffData:any;
    private _selected:boolean = false;


    onLoad() {
        //this.guantou.on(dragonBones.EventObject.COMPLETE, this.dragonEventHandler, this);
        //this.guantou.on(dragonBones.EventObject.LOOP_COMPLETE, this.dragonEventHandler, this);
    }

    setData(data:any) {
        if (!data) return;
        this._buffData = {type:EBeginBuff.ADD_INIT_COIN , quality:1 , value:data , info:`开局金币+${data}`};
        this.buffInfoLabel.string = this._buffData.info;
    }

    protected addEvent(): void {

        GameEvent.on(EventEnum.FINISHLOSTFV , this.onFinishLostFv , this);
    }

    afterShow() {
        BuryingPointMgr.postWar(EBuryingPoint.BEGIN_BUFF_VIEW);
        this._endTime = BeginBuffDialog.MAX_TIME;
        SysMgr.instance.doLoop(this._onTimer , 1000 ,0, true);
        this.onTimer();
    }

    afterHide() {
        SysMgr.instance.clearTimer(this._onTimer , true);
    }

    onNotSelectClick() {
        this._selected = false;
        this.hide();
        GameEvent.emit(EventEnum.SELECT_BEGIN_BUFF , null);
    }

    onSelect() {
        Game.sceneNetMgr.reqLostFv();
    }

    private onFinishLostFv() {
        Game.cpMgr.getBeginBuffCtrl().selectBuff(this._buffData);
        Game.sceneNetMgr.reqLostAddAttackPer();
        BuryingPointMgr.postWar(EBuryingPoint.BEGIN_BUFF_USE);
        this.label.node.active = false;
        this.label2.node.active = false;
        this.btnNode.active = false;
        this.blackLayer.active = false;
        this._selected = true;
        let p = GameEvent.dispathReturnEvent("get_buff_item_pos");
        p = this.item.parent.convertToNodeSpaceAR(p);
        NodeUtils.to(this.item , 0.5 , {x:p.x , y:p.y , scaleX:0.2 , scaleY:0.25} , "sineIn" , this.hide , false , this);
    }

    protected beforeHide() {
        GameEvent.emit(EventEnum.BUFF_ITEM_MOVE_END , this._selected);
    }

    private onTimer() {
        if (this._endTime <= 0) {
            this.onNotSelectClick();
            return;
        }
        this._endTime --;
        this.label.string =  this._endTime + '';
    }

    protected dragonEventHandler(event: any) {
        if (event.type == dragonBones.EventObject.COMPLETE) {
            
        } else if (event.type == dragonBones.EventObject.LOOP_COMPLETE) {
            this.hide(false);
            GameEvent.emit(EventEnum.OPEN_GUANTOU , this.item.convertToWorldSpaceAR(cc.Vec2.ZERO_R));
        }

    }
}