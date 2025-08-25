

import BaseNetHandler from "../socket/handler/BaseNetHandler";
import { CMD_ROOT, GOODS_ID, GOODS_TYPE, GS_PLAZA_MSGID } from "../socket/handler/MessageEnum";
import { GS_PLAZA_TIPS_MSG, GS_Tips, GS_RewardTips, PLAZA_TIPS_ID, PLAZA_TIPSREWARD, GS_RewardTips_RewardGoods } from "../proto/DMSG_Plaza_Sub_Tips";
import { Handler } from "../../utils/Handler";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import { EventEnum } from "../../common/EventEnum";
import { UiManager } from "../../utils/UiMgr";
import { EResPath } from "../../common/EResPath";
import Game from "../../Game";
import SysMgr from "../../common/SysMgr";
import { GS_GoodsInfoReturn_GoodsInfo } from "../proto/DMSG_Plaza_Sub_Goods";
import { BI_TYPE, MISSION_LEVEL, MISSION_NAME, MISSION_STATE, MISSION_TYPE } from "../../sdk/CKSdkEventListener";
import LoadingTips from "../../ui/tips/LoadingTips";
import { LocalStorageMgr } from "../../utils/LocalStorageMgr";
import { StringUtils } from "../../utils/StringUtils";
import { GameEvent } from "../../utils/GameEvent";



export default class TipsMgr extends BaseNetHandler {

    private _openBoxEft:boolean = true;
    // mallFirstGoods: GS_RewardTips_RewardGoods[] = null;

    private _tempList: GS_RewardTips_RewardGoods[] = [];
    private _tempLen: number = 0;
    constructor() {
        super(CMD_ROOT.CMDROOT_PLAZA_MSG, GS_PLAZA_MSGID.GS_PLAZA_MSGID_TIPS);
        
        let value = LocalStorageMgr.getItem(LocalStorageMgr.OPEN_BOX , false);
        if (value == undefined || (value != 0 && StringUtils.isNilOrEmpty(value))) {
            this._openBoxEft = true;
        } else {
            this._openBoxEft = value == 1;
        }
    }


    get openBoxEft():boolean {
        return this._openBoxEft;
    }

    set openBoxEft(value:boolean) {
        this._openBoxEft = value;
        LocalStorageMgr.setItem(LocalStorageMgr.OPEN_BOX , value ? 1 : 0 , false);
    }

    register() {
        this.registerAnaysis(GS_PLAZA_TIPS_MSG.PLAZA_TIPS_MSG, Handler.create(this.onMessage, this), GS_Tips);
        this.registerAnaysis(GS_PLAZA_TIPS_MSG.PLAZA_TIPS_REWARD, Handler.create(this.onReward, this), GS_RewardTips);

        GameEvent.on(EventEnum.HIDE_DIALOG , this.onHideView , this);
    }

    onMessage(data: GS_Tips) {
        cc.log("消息提示", data);
        if (data.bttype == PLAZA_TIPS_ID.PLAZA_TIPS_ERROR_KICK) {
            Game.reconnectMgr.enterLoginScene();
        }

        SystemTipsMgr.instance.notice(data.szdes);
    }

    onReward(data: GS_RewardTips) {
        cc.log("奖励提示", data);
        Game.containerMgr.filterTipsRetCardBag(data);

        if (data.bttype == PLAZA_TIPSREWARD.PLAZA_TIPSREWARD_MALLADD) {
            GameEvent.emit(EventEnum.GET_ADD_REWARD, data);
        } else if (data.bttype == PLAZA_TIPSREWARD.PLAZA_TIPSREWARD_LARGETURNTABLE) {//大转盘奖励
            GameEvent.emit(EventEnum.ON_TURNTABLE_REWARD, data);
        } else if (data.bttype == PLAZA_TIPSREWARD.PLAZA_TIPSREWARD_BOUNTYREWARD) {
            //赏金奖励直接显示
            this.showNewGoodsView(data.goodslist);
        } else if (data.goodslist && data.goodslist.length > 0 && data.ndropboxid > 0) {
            let goodsInfo = Game.goodsMgr.getGoodsInfo(data.ndropboxid);
            let count: number = 0;

            if (goodsInfo && goodsInfo.lgoodstype == GOODS_TYPE.GOODSTYPE_BOX) {
                //（0:宝箱模式 1:红包模式 2:礼包模式）礼包模式不做展示
                if (goodsInfo.lparam[1] == 1) {
                    data.goodslist.forEach(element => {
                        count += element.sgoodsnum;
                    });
                    // UiManager.showDialog(EResPath.OPEN_RED_PACKET_VIEW, count);
                } else if (goodsInfo.lparam[1] == 0) {
                    this.biPostOpenBox(goodsInfo, data);
                    LoadingTips.showLoadingTips(LoadingTips.TREATUR_VIEW);
                    UiManager.showTopDialog(EResPath.TREATUR_VIEW, data);
                } else if (goodsInfo.lparam[1] == 2) {
                    this.showNewGoodsView(data.goodslist);
                }
            }
        } else if (data.bttype == PLAZA_TIPSREWARD.PLAZA_TIPSREWARD_MALLFIRST && data.goodslist.length > 0) {
            // this.mallFirstGoods = data.goodslist;
            // GameEvent.emit(EventEnum.TIPSREWARD_MALLFIRST);
            this.showNewGoodsView(data.goodslist);
        } else if (data.bttype == PLAZA_TIPSREWARD.PLAZA_TIPSREWARD_WARTROOPS) {
            if (data.goodslist && data.goodslist.length > 0) {
                let goodsData = data.goodslist[0];
                let goodsInfo = Game.goodsMgr.getGoodsInfo(goodsData.sgoodsid);
                if (goodsInfo && goodsInfo.lgoodstype == GOODS_TYPE.GOODSTYPE_RES_UPGRADESTAR) {
                    let towerId = goodsInfo.lparam[0];
                    if (!Game.towerMgr.isTowerUnlock(towerId) && Game.towerMgr.enableUnlock(towerId)) {
                        Game.towerMgr.requestActiveNewTower(towerId);
                        GameEvent.emit(EventEnum.GET_REWARD);
                        return;
                    }
                }
                this.showNewGoodsView(data.goodslist);
            }

        } else if (data.goodslist) {
            let notShow: boolean = false;
            if (data.bttype == PLAZA_TIPSREWARD.PLAZA_TIPSREWARD_MALL && data.goodslist.length == 1) {
                let goodsid = data.goodslist[0].sgoodsid;
                let goodsnum = data.goodslist[0].sgoodsnum;
                let goodsInfo = Game.goodsMgr.getGoodsInfo(goodsid);
                if (goodsInfo && goodsInfo.lgoodstype == GOODS_TYPE.GOODSTYPR_CARD_SKILL && goodsnum == 1) {
                    notShow = true;
                    this.insertTempList(goodsid);
                }
            }

            let len = data.goodslist.length;
            let i = 0;
            for (i = len - 1; i >= 0; i--) {
                let goodsid = data.goodslist[i].sgoodsid;
                let goodsInfo = Game.goodsMgr.getGoodsInfo(goodsid);
                if (goodsInfo && goodsInfo.lgoodstype == GOODS_TYPE.GOODSTYPE_CARD_TROOPSEQUIP) {
                    data.goodslist.splice(i, 1);
                }
            }

            this.mergeGoods(data.goodslist);

            if (!notShow && data.goodslist.length > 0) {
                //超能系猫咪第一张卡不显示新物品面板
                let id = data.goodslist[0].sgoodsid;
                if (!(id >= 801 && id <= 804 && Game.towerMgr.enableUnlock(id))) {
                    this.showNewGoodsView(data.goodslist);
                }
            }

        } else if (data.ndiamonds > 0) {
            let diamondGoods: GS_RewardTips_RewardGoods = new GS_RewardTips_RewardGoods();
            diamondGoods.sgoodsid = GOODS_ID.DIAMOND;
            diamondGoods.sgoodsnum = data.ndiamonds;
            this.showNewGoodsView([diamondGoods]);
        }

        // if (data.bttype == PLAZA_TIPSREWARD.PLAZA_TIPSREWARD_FIRSTRECHARGE) {
        //     GameEvent.emit(EventEnum.FIRST_RECHARGE_END);
        // }

        GameEvent.emit(EventEnum.GET_REWARD);
    }

    private insertTempList(goodsid: number) {
        this._tempLen++;
        let len = this._tempList.length;
        let isNew: boolean = true;
        for (let i = 0; i < len; i++) {
            if (this._tempList[i].sgoodsid == goodsid) {
                this._tempList[i].sgoodsnum++;
                isNew = false;
            }
        }

        if (isNew) {
            let item = new GS_RewardTips_RewardGoods();
            item.sgoodsid = goodsid;
            item.sgoodsnum = 1;
            this._tempList.push(item);
        }

        let time = UiManager.checkDialogShow(EResPath.SKILL_SHOP_VIEW) ? 500 : 1;
        SysMgr.instance.clearTimer(Handler.create(this.lateShowNewGoods, this), true);
        SysMgr.instance.doOnce(Handler.create(this.lateShowNewGoods, this), time, true);
    }

    private lateShowNewGoods() {
        if (this._tempLen > 0) {
            this.showNewGoodsView(this._tempList.slice());
            this._tempList = [];
            this._tempLen = 0;
        }
    }

    mergeGoods(goodslist: GS_RewardTips_RewardGoods[]) {
        let tempDic: any = {};
        let len = goodslist.length;
        let i = 0;
        let flag = false;
        for (i = len - 1; i >= 0; i--) {
            let goodsid = goodslist[i].sgoodsid;
            if (!tempDic[goodsid]) {
                tempDic[goodsid] = goodslist[i].sgoodsnum;
            } else {
                tempDic[goodsid] += goodslist[i].sgoodsnum;
                goodslist.splice(i, 1);
                flag = true;
            }
        }

        if (flag) {
            len = goodslist.length;
            for (i = len - 1; i >= 0; i--) {
                goodslist[i].sgoodsnum = tempDic[goodslist[i].sgoodsid];
            }
        }
    }


    private _tempList2:GS_RewardTips_RewardGoods[] = [];
    showNewGoodsView(list:GS_RewardTips_RewardGoods[]) {

        let len = this._tempList2.length;
        if (len > 0) {
            this._tempList2 = this._tempList2.concat(list);
            this.mergeGoods(this._tempList2);
        } else {
            this._tempList2 = list;
        }   

        if (!UiManager.checkDialogShow(EResPath.NEW_GOODS_VIEW)) {
            UiManager.showTopDialog(EResPath.NEW_GOODS_VIEW, { list: this._tempList2 });
        } else {
            GameEvent.emit(EventEnum.TIPSREWARD_REFRESH , len != this._tempList2.length , this._tempList2);
        }

    }

    private onHideView(path:string) {
        if (path == EResPath.NEW_GOODS_VIEW) {
            this._tempList2.length = 0;
        }
    }
    //上报开宝箱
    private biPostOpenBox(goodsInfo: GS_GoodsInfoReturn_GoodsInfo, data: GS_RewardTips) {
        GameEvent.emit(EventEnum.CK_BI_REPORT_EVENT, MISSION_TYPE.OPEN_BOX, MISSION_LEVEL.NORMAL, MISSION_NAME.OPEN_BOX, goodsInfo.szgoodsname);
    }
}
