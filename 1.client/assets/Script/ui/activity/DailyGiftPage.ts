// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { BuryingPointMgr, EBuryingPoint } from "../../buryingPoint/BuryingPointMgr";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { Lang, LangEnum } from "../../lang/Lang";
import { ActiveInfo } from "../../net/mgr/SysActivityMgr";
import { GS_SysActivityPrivate_SysActivityData } from "../../net/proto/DMSG_Plaza_Sub_SysActivity";
import { ACTIVE_TYPE } from "../../net/socket/handler/MessageEnum";
import { GameEvent } from "../../utils/GameEvent";
import { Handler } from "../../utils/Handler";
import { StringUtils } from "../../utils/StringUtils";
import List from "../../utils/ui/List";
import { NodeUtils } from "../../utils/ui/NodeUtils";
import Utils from "../../utils/Utils";
import TapPageItem from "../dayInfoView/TapPageItem";


const { ccclass, property ,menu } = cc._decorator;

@ccclass
@menu("Game/ui/active/DailyGiftPage")
export default class DailyGiftPage extends TapPageItem {

    @property(cc.Node)
    btnNode:cc.Node = null;
    @property(cc.Button)
    btnComp:cc.Button = null;

    @property(cc.RichText)
    btnLabel:cc.RichText = null;

    @property(cc.Label)
    packageLabel:cc.Label = null;

    @property(cc.Label)
    leftLabel:cc.Label = null;

    @property(List)
    list:List = null;

    private _cfg:ActiveInfo = null;
    private _privateData:GS_SysActivityPrivate_SysActivityData = null;
    private _array:any[] = [];
    start () {
        GameEvent.on(EventEnum.NEW_ACTIVE, this.onNewActive , this);
        GameEvent.on(EventEnum.UPDATE_ACTIVE_DATA, this.activeUpdate, this);

        BuryingPointMgr.post(EBuryingPoint.SHOW_DAILY_ACTIVE_VIEW);
    }

    onDestroy() {
        GameEvent.off(EventEnum.NEW_ACTIVE, this.onNewActive , this);
        GameEvent.off(EventEnum.UPDATE_ACTIVE_DATA, this.activeUpdate, this);
        Handler.dispose(this);
    }


    public refresh() {
        this._cfg = Game.sysActivityMgr.getActivityInfo(ACTIVE_TYPE.DAILY_GIFT);
        this._privateData = Game.sysActivityMgr.getPrivateData(ACTIVE_TYPE.DAILY_GIFT);
        let taskList = this._cfg.taskList;

        if (!taskList || taskList.length == 0 || !this._cfg || !this._privateData) return;

        const flag = this._privateData.nmainprogress == 0;
        NodeUtils.setNodeGray(this.btnNode , !flag);
        this.btnComp.enabled = flag;
        if (flag) {
            this.leftLabel.node.active = false;
            this.packageLabel.node.active = true;
            this.btnLabel.node.y = 7.3;
            this.packageLabel.string =  `（购买${this._cfg.item.nextraparam2}天）`;
            let chargeInfo = Game.actorMgr.getChargeConifg(this._cfg.item.nextraparam1);
            if (chargeInfo) {
                this.btnLabel.string = StringUtils.richTextSizeFormat(Lang.getL(LangEnum.RMB) , 44) + StringUtils.richTextSizeFormat(chargeInfo.nneedrmb.toString() , 56);
            } else {
                this.btnNode.active = false;
            }
        } else {
            this.leftLabel.node.active = true;
            this.packageLabel.node.active = false;
            this.btnLabel.string = '已购买';
            this.btnLabel.node.y = 1;
            this.leftLabel.string = `剩余可领：${this._privateData.nmainprogress}天`;
        }

        let dataList:any[] = [];
        let len = taskList.length;
        for (let i = 0; i < len; i++) {
            const element = taskList[i];
            dataList.push({cfg:element , privateData:this._privateData , flag:Utils.checkBitFlag(this._privateData.nflag , element.btindex)});
        }
        this.list.array = dataList;
    }

    

    private onNewActive(nid:number) {
        if (nid == ACTIVE_TYPE.DAILY_GIFT) {
            this.refresh();
        }
        // SysMgr.instance.callLater(Handler.create(this.refresh2 , this) , true);
    }

    private activeUpdate(nid:number) {
        if (nid == ACTIVE_TYPE.DAILY_GIFT) {
            this.refresh();
        }
        // SysMgr.instance.callLater(Handler.create(this.refresh2 , this) , true);
    }

    onBtnClick() {
        if (!this._cfg || !this._privateData) return;
        Game.sysActivityMgr.joinSysActivity(ACTIVE_TYPE.DAILY_GIFT , 255);
    }

}
