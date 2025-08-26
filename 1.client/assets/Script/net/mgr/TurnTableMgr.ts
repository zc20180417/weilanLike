import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GameEvent } from "../../utils/GameEvent";
import { Handler } from "../../utils/Handler";
import { GS_LargeTurnTableExchange, GS_LargeTurnTableFinish, GS_LargeTurntableInfo, GS_LargeTurntableInfo_RewardItem, GS_LargeTurnTableJoin, GS_LargeTurnTableWriteInfo, GS_PLAZA_LARGETURNTABLE_MSG } from "../proto/DMSG_Plaza_Sub_LargeTurntable";
import BaseNetHandler from "../socket/handler/BaseNetHandler";
import { CMD_ROOT, GS_PLAZA_MSGID } from "../socket/handler/MessageEnum";

/**炮塔数据管理 */
export default class TurnTableMgr extends BaseNetHandler {

    private _info: GS_LargeTurntableInfo;
    constructor() {
        super(CMD_ROOT.CMDROOT_PLAZA_MSG, GS_PLAZA_MSGID.GS_PLAZA_MSGID_LARGETURNTABLE);
    }

    register() {
        this.registerAnaysis(GS_PLAZA_LARGETURNTABLE_MSG.PLAZA_LARGETURNTABLE_INFO, Handler.create(this.onTurnTableInfo, this), GS_LargeTurntableInfo);
        this.registerAnaysis(GS_PLAZA_LARGETURNTABLE_MSG.PLAZA_LARGETURNTABLE_FINISH, Handler.create(this.onTurnTableFinish, this), GS_LargeTurnTableFinish);
        this.registerAnaysis(GS_PLAZA_LARGETURNTABLE_MSG.PLAZA_LARGETURNTABLE_EXCHANGE, Handler.create(this.onExchangeRet, this), GS_LargeTurnTableExchange);
    }

    /**请求转盘开始 */
    jion() {
        let data: GS_LargeTurnTableJoin = new GS_LargeTurnTableJoin();
        this.send(GS_PLAZA_LARGETURNTABLE_MSG.PLAZA_LARGETURNTABLE_JOIN, data);
    }

    /**
     * 提交资料
     * @param nAreaCode //地区编码(唯一性)
     * @param szAddressee //收件人
     * @param szPhone //联系电话
     * @param szAddr //详细地址
     */
    writeInfo(nAreaCode: number, szAddressee: string, szPhone: string, szAddr: string) {
        let data: GS_LargeTurnTableWriteInfo = new GS_LargeTurnTableWriteInfo();
        data.nareacode = nAreaCode;
        data.szaddressee = szAddressee;
        data.szphone = szPhone;
        data.szaddr = szAddr;

        this.send(GS_PLAZA_LARGETURNTABLE_MSG.PLAZA_LARGETURNTABLE_WRITEINFO, data)
    }

    getTurnTableInfo(): GS_LargeTurntableInfo {
        return this._info;
    }

    /**
     * 转盘配置数据
     * @param data 
     */
    private onTurnTableInfo(data: GS_LargeTurntableInfo) {
        cc.log("转盘配置数据", data);
        this._info = data;
    }

    /**转盘结果 */
    private onTurnTableFinish(data: GS_LargeTurnTableFinish) {
        cc.log("转盘结果", data);
        GameEvent.emit(EventEnum.ON_TURNTABLE_RET, data);
    }

    /**
     * 获取转盘物品的下标
     * @param nid 
     */
    public getGoodsIndex(nid: number): number {
        let index = -1;
        if (this._info && this._info.infolist) {
            for (let i = 0, len = this._info.infolist.length; i < len; i++) {
                if (nid == this._info.infolist[i].nid) {
                    index = i;
                    break;
                }
            }
        }
        return index;
    }

    /**
     * 获取物品配置
     * @param nid 
     */
    public getGoodsCfg(nid: number): GS_LargeTurntableInfo_RewardItem {
        let cfg = null;
        if (this._info && this._info.infolist) {
            for (let i = 0, len = this._info.infolist.length; i < len; i++) {
                if (nid == this._info.infolist[i].nid) {
                    cfg = this._info.infolist[i];
                    break;
                }
            }
        }
        return cfg;
    }

    /**
     * 实物兑换成功
     * @param data 
     */
    private onExchangeRet(data: GS_LargeTurnTableExchange) {
        cc.log("实物兑换成功", data);
        GameEvent.emit(EventEnum.TURNTABLE_EXCHANGE_SUCC, data);
    }

    public enableTurn() {
        if (this._info) {
            return this._info.ngoodsnum <= Game.containerMgr.getItemCount(this._info.ngoodsid);
        }
        return false;
    }

    public getCostGoodsId(): number {
        return this._info && this._info.ngoodsid;
    }
}