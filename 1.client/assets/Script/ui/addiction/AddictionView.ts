// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { BuryingPointMgr, EBuryingPoint } from "../../buryingPoint/BuryingPointMgr";
import { EResPath } from "../../common/EResPath";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GameEvent } from "../../utils/GameEvent";
import { StringUtils } from "../../utils/StringUtils";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import Dialog from "../../utils/ui/Dialog";
import { UiManager } from "../../utils/UiMgr";


const { ccclass, property } = cc._decorator;

@ccclass
export default class AddictionView extends Dialog {

    @property(cc.EditBox)
    nameEdit: cc.EditBox = null;

    @property(cc.EditBox)
    idEdit: cc.EditBox = null;

    @property(cc.Node)
    canotBtn:cc.Node = null;

    @property(cc.Node)
    normalBtn:cc.Node = null;

    private _nameEditd:boolean = false;
    private _idEditd:boolean = false;
    addEvent() {
        BuryingPointMgr.postFristPoint(EBuryingPoint.SHOW_ADDICTTION_VIEW);
        GameEvent.on(EventEnum.CERTIFICATION_SUCCESS, this.onSuccess, this);
    }

    protected beforeShow(): void {
        
    }

    protected afterShow(): void {
        this._nameEditd = false;
        this._idEditd = false;
    }

    private onNameReturn() {
        this._nameEditd = !StringUtils.isNilOrEmpty(this.nameEdit.string);
        this.checkBtnState();
    }

    private onIdReturn() {
        this._idEditd = !StringUtils.isNilOrEmpty(this.idEdit.string) && this.idEdit.string.length == 18;
        this.checkBtnState();
    }

    private checkBtnState() {
        this.canotBtn.active = !this._nameEditd || !this._idEditd;
        this.normalBtn.active = this._nameEditd && this._idEditd;
    }

    onReq() {
        let name: string = this.nameEdit.string;
        let id: string = this.idEdit.string;

        if (StringUtils.isNilOrEmpty(name)) {
            SystemTipsMgr.instance.showSysTip2("请输入姓名");
            return;
        }

        if (StringUtils.isNilOrEmpty(id)) {
            SystemTipsMgr.instance.showSysTip2("请输入身份证号码");
            return;
        }

        if (id.length != 18) {
            SystemTipsMgr.instance.showSysTip2("请输入正确的身份证号码");
            return;
        }
        BuryingPointMgr.postFristPoint(EBuryingPoint.REQ_CERTIFICATION);
        Game.certification.reqCertification(name, id, Game.actorMgr.nactordbid);
    }

    private onSuccess() {
        this.hide();
    }

    public onCloseBtnClick(): void {
        UiManager.showDialog(EResPath.TO_IDENTIFICATION_View );
        this.hide();
    }
}
