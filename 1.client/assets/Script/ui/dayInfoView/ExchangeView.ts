// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Game from "../../Game";
import GlobalVal from "../../GlobalVal";
import { StringUtils } from "../../utils/StringUtils";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import Dialog from "../../utils/ui/Dialog";
// import TapPageItem from "./TapPageItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ExchangeView extends Dialog {

    @property(cc.EditBox)
    editBox:cc.EditBox=null;

    @property(cc.Node)
    qQunNode:cc.Node = null;


    beforeShow() {
        this.qQunNode.active = !GlobalVal.isChannelSubpackage();
    }

    onEnable(){
        this.editBox.node.on("text-changed",this.textChanged,this);
        // this.editBox.node.on("editing-return",this.textChanged,this);
        // this.editBox.node.on("editing-did-began",this.textChanged,this);
        // this.editBox.node.on("editing-did-ended",this.textChanged,this);
        
    }

    onDisable() {
        this.editBox.node.off("text-changed",this.textChanged,this);
    }

    textChanged() {
        this.editBox.string=this.editBox.string.toUpperCase();
    }

    onOKClick() {
        let str = this.editBox.string;
        if (StringUtils.isNilOrEmpty(str)) {
            SystemTipsMgr.instance.notice("请输入正确的兑换码");
            return;
        }
        Game.exchangeMgr.exchangeBarCode(str);
    }
}
