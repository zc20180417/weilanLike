import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { EVENT_REDPOINT } from "../../redPoint/RedPointSys";
import { GameEvent } from "../../utils/GameEvent";
import { Handler } from "../../utils/Handler";
import Utils from "../../utils/Utils";
import { GS_GrowGiftBuy, GS_GrowGiftClose, GS_GrowGiftGet, GS_GrowGiftInfo, GS_GrowGiftOrder, GS_GrowGiftPrivate, GS_PLAZA_GROWGIFT_MSG } from "../proto/DMSG_Plaza_Sub_GrowGift";
import BaseNetHandler from "../socket/handler/BaseNetHandler";
import { CMD_ROOT, GS_PLAZA_MSGID } from "../socket/handler/MessageEnum";

/**
 * 基金
 */
export default class GrowGiftMgr extends BaseNetHandler {

    private _growGiftInfo:GS_GrowGiftInfo;
    private _growGiftPrivate:GS_GrowGiftPrivate;

    constructor() {
        super(CMD_ROOT.CMDROOT_PLAZA_MSG, GS_PLAZA_MSGID.GS_PLAZA_MSGID_GROWGIFT);
    }

    register() {
        this.registerAnaysis(GS_PLAZA_GROWGIFT_MSG.PLAZA_GROWGIFT_INFO, Handler.create(this.onGrowGiftInfo, this), GS_GrowGiftInfo);
        this.registerAnaysis(GS_PLAZA_GROWGIFT_MSG.PLAZA_GROWGIFT_PRIVATE, Handler.create(this.onGrowGiftPrivate, this), GS_GrowGiftPrivate);
        this.registerAnaysis(GS_PLAZA_GROWGIFT_MSG.PLAZA_GROWGIFT_ORDER, Handler.create(this.onGrowGiftOrder, this), GS_GrowGiftOrder);
        this.registerAnaysis(GS_PLAZA_GROWGIFT_MSG.PLAZA_GROWGIFT_CLOSE, Handler.create(this.onGrowGiftClose, this), GS_GrowGiftClose);
        GameEvent.on(EventEnum.LAST_WAR_ID_CHANGE2 , this.refreshGrowGiftRedpoints , this);
    }

    //////////////////////////////////////////////////////////////public
    
    getGrowGiftInfo():GS_GrowGiftInfo {
        return this._growGiftInfo;
    }

    getGrowGiftPrivate():GS_GrowGiftPrivate {
        return this._growGiftPrivate;
    }

    get startGetIndex():number {
        return this._startGetIndex;
    }

    //////////////////////////////////////////////////////////////c->s
    /**购买礼包 */
    reqBuyGrowGift() {
        let data:GS_GrowGiftBuy = new GS_GrowGiftBuy();
        this.send(GS_PLAZA_GROWGIFT_MSG.PLAZA_GROWGIFT_BUY , data);
    }

    /**领取奖励 */
    reqGetGrowGiftAward(index:number) {
        let data:GS_GrowGiftGet = new GS_GrowGiftGet();
        data.btindex = index;
        this.send(GS_PLAZA_GROWGIFT_MSG.PLAZA_GROWGIFT_GET , data);
    }

    /////////////////////////////////////////////////////////////s->c
    /**配置 */
    private onGrowGiftInfo(data:GS_GrowGiftInfo) {
        this._growGiftInfo = data;
        this.refreshGrowGiftRedpoints();
    }

    /**私有数据 */
    private onGrowGiftPrivate(data:GS_GrowGiftPrivate) {
        this._growGiftPrivate = data;
        this.refreshGrowGiftRedpoints();
        GameEvent.emit(EventEnum.GROWGIFT_PRIVATE_REFRESH);
    }

    /**订单 */
    private onGrowGiftOrder(data:GS_GrowGiftOrder) {
        Game.mallProto.payOrder(data.szorder);
    }

    /**活动关闭 */
    private onGrowGiftClose(data:GS_GrowGiftClose) {

    }

    private _startGetIndex:number = -1;

    private refreshGrowGiftRedpoints() {
        this._startGetIndex = -1;
        let redpointNum = 0;
        if (this._growGiftInfo && this._growGiftPrivate && this._growGiftPrivate.btbuy == 1) {
            let curWarid:number = Game.sceneNetMgr.getCurWarID();
            for (let i = 0 ; i < this._growGiftInfo.uitemcount ; i++) {
                if (this._growGiftInfo.rewardlist[i].nwarid < curWarid && !Utils.checkBitFlag(this._growGiftPrivate.nflag , i)) {
                    redpointNum = 1;
                    this._startGetIndex = i;
                    break;
                }
            }
        }
        let node = Game.redPointSys.findRedPointNode(EVENT_REDPOINT.ACTIVE_HALL_GROWGIFT);
        if (node) {
            node.setRedPointNum(redpointNum);
        }
    }
}