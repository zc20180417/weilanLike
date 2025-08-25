import { BuryingPointMgr, EBuryingPoint } from "../../buryingPoint/BuryingPointMgr";
import { EResPath } from "../../common/EResPath";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GameEvent } from "../../utils/GameEvent";
import { MathUtils } from "../../utils/MathUtils";
import { StringUtils } from "../../utils/StringUtils";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import Dialog from "../../utils/ui/Dialog";
import { NodeUtils } from "../../utils/ui/NodeUtils";
import { UiManager } from "../../utils/UiMgr";

const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("Game/ui/actor/SetNameView")
export class SetNameView extends Dialog {

    @property(cc.Label)
    idLabel:cc.Label = null;

    @property(cc.EditBox)
    nameLabel:cc.EditBox = null;

    @property(cc.Sprite)
    touziSp:cc.Sprite = null;

    @property([cc.SpriteFrame])
    sfs:cc.SpriteFrame[] = [];

    @property(cc.Node)
    startBtn:cc.Node = null;

    @property(cc.Node)
    cardNode:cc.Node = null;

    private _nameCfg = null;
    protected beforeShow() {
        this._nameCfg = Game.actorMgr.nameCfg;
        this.idLabel.string = Game.actorMgr.nactordbid + '';

        let name = Game.actorMgr.privateData.szname;
        if (parseInt(name) > 0) {
            this.nameLabel.string = this.randomName();
        } else {
            this.nameLabel.string = name;
        }

        BuryingPointMgr.postFristPoint(EBuryingPoint.SHOW_SET_NAME_VIEW);
    }
    

    protected addEvent(): void {
        GameEvent.on(EventEnum.PLAYER_NAME_CHANGE, this.onNameChange, this);
    }

    private onNameChange() {
        this.hide();
        BuryingPointMgr.postFristPoint(EBuryingPoint.SET_NAME_SUCCESS);
    }

    onRandomClick() {
        this.nameLabel.string = this.randomName();
        this.touziSp.spriteFrame = MathUtils.randomGetItemByListReal(this.sfs);
    }

    onStartGameClick() {
        let str = this.nameLabel.string;
        if (StringUtils.isNilOrEmpty(str)) {
            SystemTipsMgr.instance.notice("请输入您的游戏昵称");
            return;
        }

        BuryingPointMgr.postFristPoint(EBuryingPoint.REQ_SET_NAME);
        if (str != Game.actorMgr.privateData.szname) {
            Game.actorMgr.modifyName(str);
        } else {
            this.hide();
        }


    }

    onChangeHeadClick() {
        UiManager.showDialog(EResPath.HEAD_PORTRAIT_VIEW);
    }

    private randomName():string {
        let list1 = this._nameCfg[1];
        let list2 = this._nameCfg[2];
        return MathUtils.randomGetItemByListReal(list1) + '的' + MathUtils.randomGetItemByListReal(list2);
    }
    

    protected playShowAni() {
        NodeUtils.to(this.content , 0.5 , {y:0} , "backOut" , this.onMoveEnd , null , this );
    }

    private onMoveEnd() {
        let tween = cc.tween(this.cardNode);

        tween.to(0.4 , {angle:-5});
        tween.to(0.4 , {angle:5});
        tween.to(0.4 , {angle:-2.5});
        tween.to(0.4 , {angle:2.5});
        tween.to(0.4 , {angle:0});

        let self = this;
        tween.call(()=> {
            NodeUtils.to(this.content , 0.5 , {scale:1.2} , "sineIn" , this.onScaleEnd , null , this );
        })

        tween.start();

    }

    private onScaleEnd() {
        this.startBtn.active = true;
    }

    protected playHideAni() {
        this.onHideAniEnd();
    }
}