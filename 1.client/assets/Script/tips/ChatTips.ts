import { EResPath } from "../common/EResPath";
import { EventEnum } from "../common/EventEnum";
import { HeadComp } from "../ui/headPortrait/HeadComp";
import { GameEvent } from "../utils/GameEvent";
import BaseItem from "../utils/ui/BaseItem";
import { UiManager } from "../utils/UiMgr";
import TipsBase from "./TipsBase";

const { ccclass, property ,menu} = cc._decorator;

@ccclass
@menu("Game/ui/tips/ChatTips")
export default class ChatTips extends BaseItem {


    @property(HeadComp)
    headInfo:HeadComp = null;

    @property(cc.Label)
    nameLabel:cc.Label = null;

    @property(cc.Label)
    countLabel:cc.Label = null;

    setData(data:any) {
        super.setData(data);
        if (!data) return;
        this.headInfo.headInfo = data;
        this.nameLabel.string = data.szname;
        this.countLabel.string = '1';

        GameEvent.on(EventEnum.CHAT_REFRESH_NEW_MSG_COUNT , this.refreshCount , this);
    }

    onDestroy() {
        GameEvent.off(EventEnum.CHAT_REFRESH_NEW_MSG_COUNT , this.refreshCount , this);
    }

    private refreshCount(actordbid:number , value:number) {
        if (this._data && this._data.nactordbid == actordbid) {
            if (value > 99) {
                value = 99;
            }
            this.countLabel.string = value.toString();

            if (value == 0) {
                this.doHide();
            }
        }
    }

    private onClick() {
        if (!this._data) return;
        GameEvent.off(EventEnum.CHAT_REFRESH_NEW_MSG_COUNT , this.refreshCount , this);
        UiManager.showDialog(EResPath.CHAT_VIEW , this._data);
        this.doHide();
    }

    private doHide() {
        let tipsBase = this.node.getComponent(TipsBase);
        if (tipsBase) {
            tipsBase.hide();
        }
    }
}
