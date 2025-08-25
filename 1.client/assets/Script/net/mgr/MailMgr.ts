import BaseNetHandler from "../socket/handler/BaseNetHandler";
import { CMD_ROOT, GS_PLAZA_MSGID } from "../socket/handler/MessageEnum";
import { GS_EmailViewReturn, GS_PLAZA_EMAILL_MSG, GS_EmailViewTextReturn, GS_EmailPickReturn, GS_EmailNew, GS_EmailDelRet, GS_EmailView, GS_EmailViewText, GS_EmailPick, GS_EmailDel, GS_EmailViewReturn_EmailViewItem } from "../proto/DMSG_Plaza_Sub_EMaill";
import { Handler } from "../../utils/Handler";
import { GameEvent } from "../../utils/GameEvent";
import { EventEnum } from "../../common/EventEnum";
import { GS_RewardTips_RewardGoods } from "../proto/DMSG_Plaza_Sub_Tips";
import { EVENT_REDPOINT } from "../../redPoint/RedPointSys";
import Game from "../../Game";
import Debug from "../../debug";

const EMAIL_TAG = "邮件：";

export class MailMgr extends BaseNetHandler {
    private isReqEmail: boolean = false;
    private _txtEmialMap: Map<number, GS_EmailViewReturn_EmailViewItem> = null;//事务邮件
    private _propEmialMap: Map<number, GS_EmailViewReturn_EmailViewItem> = null;//道具邮件
    private _goodsMap: Map<number, Array<any>> = null;//奖励物品

    constructor() {
        super(CMD_ROOT.CMDROOT_PLAZA_MSG, GS_PLAZA_MSGID.GS_PLAZA_MSGID_EMAIL);
        this.isReqEmail = false;
        this._txtEmialMap = new Map();
        this._propEmialMap = new Map();
        this._goodsMap = new Map();
    }

    private clear() {
        this.isReqEmail = false;
        this._txtEmialMap.clear();
        this._propEmialMap.clear();
        this._goodsMap.clear();
    }

    protected onSocketError(): void {
        this.clear();
    }

    protected exitGame() {
        this.clear();
    }

    register() {
        this.registerAnaysis(GS_PLAZA_EMAILL_MSG.PLAZA_EMAIL_VIEWRETURN, Handler.create(this.onEMailReturn, this), GS_EmailViewReturn);
        this.registerAnaysis(GS_PLAZA_EMAILL_MSG.PLAZA_EMAIL_VIEWTEXTRETURN, Handler.create(this.onEMaillTextReturn, this), GS_EmailViewTextReturn);
        this.registerAnaysis(GS_PLAZA_EMAILL_MSG.PLAZA_EMAIL_PICKRETURN, Handler.create(this.onEMaillPickReturn, this), GS_EmailPickReturn);
        this.registerAnaysis(GS_PLAZA_EMAILL_MSG.PLAZA_EMAIL_ADDNEW, Handler.create(this.onEMaillAddNew, this), GS_EmailNew);
        this.registerAnaysis(GS_PLAZA_EMAILL_MSG.PLAZA_EMAIL_DELRET, Handler.create(this.onEMaillDelRet, this), GS_EmailDelRet);
    }

    refreshRedPoint() {
        let emailNum = this.getAllUnreceiveEmailNum();
        let emialNode = Game.redPointSys.findRedPointNode(EVENT_REDPOINT.EMAIL);
        if (emialNode) {
            emialNode.setRedPointNum(emailNum);
        }
    }

    /**请求邮件*/
    reqEMailView() {
        let data: GS_EmailView = new GS_EmailView();
        this.send(GS_PLAZA_EMAILL_MSG.PLAZA_EMAIL_VIEW, data);
    }

    /**请求邮件正文 */
    reqEMailText(emailid: number) {
        let data: GS_EmailViewText = new GS_EmailViewText();
        data.nemailid = emailid;
        this.send(GS_PLAZA_EMAILL_MSG.PLAZA_EMAIL_VIEWTEXT, data);
    }

    /**
     * 提取附件
     * @param emailid 
     */
    reqEmailPick(emailid: number) {
        let data: GS_EmailPick = new GS_EmailPick();
        data.nemailid = emailid;
        this.send(GS_PLAZA_EMAILL_MSG.PLAZA_EMAIL_PICK, data);
    }

    /**
     * 删除邮件
     * @param emailid 
     */
    reqEmailDel(emailid: number) {
        let data: GS_EmailDel = new GS_EmailDel();
        data.nemailid = emailid;
        this.send(GS_PLAZA_EMAILL_MSG.PLAZA_EMAIL_DEL, data);
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * 邮件返回
     * @param data 
     */
    private onEMailReturn(data: GS_EmailViewReturn) {
        Debug.log(EMAIL_TAG, "邮件返回", data);
        this._txtEmialMap.clear();
        this._goodsMap.clear();
        this._propEmialMap.clear();
        if (data.uviewcount > 0) {
            let emailItem: GS_EmailViewReturn_EmailViewItem = null;
            let goodsIndex: number = 0;
            for (let i = 0; i < data.uviewcount; i++) {
                emailItem = data.data1[i];
                if (emailItem.btgoodslistcount > 0) {//道具邮件
                    this._propEmialMap.set(emailItem.nemaillid, emailItem);
                    let goods = [];
                    for (let j = 0; j < emailItem.btgoodslistcount; j++) {
                        goods.push(data.data2[goodsIndex++]);
                    }
                    this._goodsMap.set(emailItem.nemaillid, goods);
                } else {//事务邮件
                    this._txtEmialMap.set(emailItem.nemaillid, emailItem);
                }
            }
        }
        this.isReqEmail = true;
        this.refreshRedPoint();
        GameEvent.emit(EventEnum.ON_EMAIL_RETURN);
    }

    private onEMaillTextReturn(data: GS_EmailViewTextReturn) {
        Debug.log(EMAIL_TAG, "邮件正文返回", data);
        //如果是事务邮件返回就将其删除
        this._txtEmialMap.delete(data.nemailid);
        GameEvent.emit(EVENT_REDPOINT.EMAIL, -1);
        GameEvent.emit(EventEnum.ON_EMAIL_TEXT_RETURN, data);
    }

    private onEMaillPickReturn(data: GS_EmailPickReturn) {
        Debug.log(EMAIL_TAG, "提取邮件附件", data);
        Game.containerMgr.filterEmailRetCardBag(data);
        //道具邮件才有附件
        if (data.goodlist && data.goodlist.length > 0) {
            let list: GS_RewardTips_RewardGoods[] = [], item;
            for (let i = 0; i < data.goodlist.length; i++) {
                //一般物品
                item = new GS_RewardTips_RewardGoods();
                item.sgoodsnum = data.goodlist[i].ngoodsnum;
                item.sgoodsid = data.goodlist[i].ngoodsid;
                list.push(item);
            }
            if (list.length > 0) {
                Game.tipsMgr.showNewGoodsView(list);
                // UiManager.showTopDialog(EResPath.NEW_GOODS_VIEW, { list: list });
            }
        }
        this._propEmialMap.delete(data.nemailid);
        this._goodsMap.delete(data.nemailid);
        GameEvent.emit(EVENT_REDPOINT.EMAIL, -1);
        GameEvent.emit(EventEnum.ON_EMAIL_RECEIVE, data);
    }

    private onEMaillAddNew(data: GS_EmailNew) {
        Debug.log(EMAIL_TAG, "新邮件", data);
        let item: GS_EmailViewReturn_EmailViewItem = new GS_EmailViewReturn_EmailViewItem();
        item.nemaillid = data.nemaillid;
        item.btstate = data.btstate;
        item.bttype = data.bttype;
        item.nsendtime = data.nsendtime;
        item.sztitle = data.sztitle;
        item.nstrength = data.nstrength;
        item.btgoodslistcount = data.goodlist ? data.goodlist.length : 0;

        if (data.goodlist) {
            this._propEmialMap.set(data.nemaillid, item);
            this._goodsMap.set(data.nemaillid, data.goodlist);
        } else {
            this._txtEmialMap.set(data.nemaillid, item);
        }
        GameEvent.emit(EVENT_REDPOINT.EMAIL, 1);
    }

    private onEMaillDelRet(data: GS_EmailDelRet) {

    }

    /**
     * 获取所有未领取邮件
     */
    public getAllUnreceiveEmail(): Array<any> {
        let txtEmails = Array.from(this._txtEmialMap.values());
        let propEmails = Array.from(this._propEmialMap.values());
        return propEmails.concat(txtEmails);
    }

    private getAllUnreceiveEmailNum(): number {
        return this._txtEmialMap.size + this._propEmialMap.size;
    }

    /**
     * 获取道具邮件奖励
     * @param emailId 
     * @returns 
     */
    public getPropEmailGoods(emailId: number): Array<any> {
        return this._goodsMap.get(emailId);
    }

    public isReqestEmail(): boolean {
        return this.isReqEmail;
    }
    /**
     * 获取邮件视图信息
     * @param emailId 
     * @returns 
     */
    public getEmailItem(emailId: number): GS_EmailViewReturn_EmailViewItem {
        let emailItem: GS_EmailViewReturn_EmailViewItem;
        emailItem = this._txtEmialMap.get(emailId) || this._propEmialMap.get(emailId);
        return emailItem;
    }
}