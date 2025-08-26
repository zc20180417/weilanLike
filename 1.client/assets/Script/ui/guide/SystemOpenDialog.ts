import { GLOBAL_FUNC } from "../../common/AllEnum";
import Game from "../../Game";
import { GameEvent, Reply } from "../../utils/GameEvent";
import Dialog from "../../utils/ui/Dialog";
import { SystemItem } from "./SystemItem";

const { ccclass, property, menu } = cc._decorator;



@ccclass
@menu("Game/ui/guide/SystemOpenDialog")
export default class SystemOpenDialog extends Dialog {

    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.Node)
    layerNode:cc.Node = null;

    @property(cc.Node)
    normalNode:cc.Node = null;

    @property([SystemItem])
    systemItems: SystemItem[] = [];

    private _curData: any;
    private _curShowNode: cc.Node;

    private onClick() {
        if (!this._curData) return;
        // switch (this._curData.id) {
        //     case GLOBAL_FUNC.CAT_HOUSE:
        //         Game.catHouseMgr.enterHouse();
        //         break;
        //     case GLOBAL_FUNC.YONGBING:
        //         UiManager.showDialog(EResPath.TOWER_STAR_MAIN_VIEW);
        //         break;
        //     case GLOBAL_FUNC.MALL:
        //         UiManager.showDialog(EResPath.SHOP_VIEW);
        //         break;
        //     case GLOBAL_FUNC.TUJIAN:
        //         UiManager.showDialog(EResPath.TUJIAN_VIEW);
        //         break;
        //     case GLOBAL_FUNC.TASK:
        //         UiManager.showDialog(EResPath.TASK_VIEW);
        //         break;
        //     case GLOBAL_FUNC.SCIENCE:
        //         UiManager.showDialog(EResPath.SCIENCE_VIEW);
        //         break;
        //     case GLOBAL_FUNC.REDPACKET:
        //         UiManager.showDialog(EResPath.RED_PACKET_EXCHANGE_VIEW);
        //         break;
        //     case GLOBAL_FUNC.SIGN:
        //         UiManager.showDialog(EResPath.ACTIVE_HALL_VIEW, ACTIVE_HALL_TAP_INDEX.SIGN);
        //         break;
        //     case GLOBAL_FUNC.PVP:
        //         UiManager.showDialog(EResPath.PVP_MATCH_VIEW);
        //         break;
        //     case GLOBAL_FUNC.COOPERATE:
        //         UiManager.showDialog(EResPath.COOPERATE_VIEW);
        //         break;

        //     default:
        //         break;
        // }
        this.hide();
    }

    setData(data: any) {
        this._curData = data;
    }

    beforeShow() {
        this.blackLayer.opacity = 235;
        if (this._curData.id == GLOBAL_FUNC.CAT_HOUSE && this._curData.layer) {
            let cathouseInfo = Game.catHouseMgr.getFloorInfo(this._curData.layer);
            if (cathouseInfo) {
                this.nameLabel.string = cathouseInfo.szname;
            }
            this.layerNode.active = true;
            this.normalNode.active = false;
        } else {
            this.nameLabel.string = this._curData.name;
        }

        let len = this.systemItems.length;
        for (let i = 0; i < len; i++) {
            if (this.systemItems[i].systemid == this._curData.id) {
                this._curShowNode = this.systemItems[i].node;
                this._curShowNode.active = true;
                return;
            }
        }
    }

    protected addEvent() {
        GameEvent.onReturn("get_system_open_btn", this.getBtn, this);
    }

    protected beforeHide() {
        GameEvent.offReturn("get_system_open_btn", this.getBtn, this);
    }

    private getBtn(reply:Reply ,str: string): cc.Node {
        return reply(this._curShowNode);
    }

}



