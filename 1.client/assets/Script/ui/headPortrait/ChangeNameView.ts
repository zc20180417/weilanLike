

import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GameEvent } from "../../utils/GameEvent";

import { StringUtils } from "../../utils/StringUtils";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import Dialog from "../../utils/ui/Dialog";

const {ccclass, property , menu} = cc._decorator;

@ccclass
@menu('Game/ui/headInfo/ChangeNameView')
export default class ChangeNameView extends Dialog {

    @property(cc.EditBox)
    editBox:cc.EditBox=null;

    @property(cc.Label)
    diamondLabel:cc.Label = null;

    
    onEnable(){
        //this.editBox.node.on("text-changed",this.textChanged,this);
        
    }

    onDisable() {
        //this.editBox.node.off("text-changed",this.textChanged,this);
    }

    protected addEvent() {
        GameEvent.once(EventEnum.PLAYER_NAME_CHANGE , this.onNameChange , this);
    }

    onOKClick() {
        let str = this.editBox.string;
        if (StringUtils.isNilOrEmpty(str)) {
            SystemTipsMgr.instance.notice("昵称不能为空");
            return;
        }
        Game.actorMgr.modifyName(str);
    }

    private onNameChange() {
        this.hide();
    }

    onDestroy() {

    }
}
