import { EResPath } from "../../common/EResPath";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import GlobalVal from "../../GlobalVal";
import HttpControl from "../../net/http/HttpControl";
import { Handler } from "../../utils/Handler";
import { StringUtils } from "../../utils/StringUtils";
import { UiManager } from "../../utils/UiMgr";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import { GameEvent } from "../../utils/GameEvent";
import { md5 } from "../../libs/encrypt/md5";

export enum EShareTarget {
    friend = 0,     //好友
    circle = 1,     //朋友圈
}

export enum EShareTaskState {
    NONE = 1,
    COMPLETE = 2,
    FINISH = 3,
}

export enum EShareRecord {
    SHARE_AWARD = 0,
    INVITATION_AWARD = 1,
    INVITATION_FRIEND = 2,
    FRIEND_CHARGE = 3,
    FRIEND_PASS_WAR = 4
}

export class ShareMgr {


    constructor() {
        GameEvent.on(EventEnum.JAVA_CALL_SAVE_IMG_SUCCESS, this.onSaveImgSuccess, this);
        GameEvent.on(EventEnum.JAVA_CALL_SHARE_SUCCESS, this.onShareSuccess, this);
        GameEvent.on(EventEnum.JAVA_CALL_SHARE_FAIL, this.onShareFail, this);
        GameEvent.on(EventEnum.JAVA_CALL_SHARE_CANCEL, this.onShareCancel, this);

        GameEvent.on(EventEnum.LAST_WAR_ID_CHANGE2, this.onLastWarChange, this);

        this.initShareTask();
    }

    private infos = {
        "0": "邀请%s位新玩家登录游戏",
        "2": "%s位邀请的好友达到20关",
        "1": "%s位邀请的好友任意充值",
    }

    private _target: number;
    private _title: string;
    private _content: string;
    private _url: string;
    private _mediaPath: string;
    private _qrSf: cc.SpriteFrame;
    private _shareNode: cc.Node = null;
    private _config: any;
    private _configDic: any = {};
    private _taskState: any;
    private _phpObj: any;
    private _shareGetAwardState: number = 0;
    private _requestStateTime: number = 0;
    private _requestRecordTime: number = 0;
    private _record: any[] = [];

    testShare() {
        Game.resMgr.loadRes(EResPath.SHARE_VIEW, cc.Prefab, Handler.create(this.onShareViewLoaded, this));
    }

    /**
     * 初始化分享任务配置
     */
    initShareTask() {
        let token = md5(GlobalVal.TOKEN_FLAG);
        let obj = { token: token };
        HttpControl.get(GlobalVal.SHARE_TASK_CONFIG, obj, (suc: boolean, ret: string | any) => {
            if (suc && ret && ret.status == 1) {
                this._config = ret.info;
                this._config.forEach(element => {
                    element.info = StringUtils.format(this.infos[element.task_type], element.task_num);
                    this._configDic[element.task_id] = element;
                });
            }
        }, true);
    }

    /**获取任务状态 */
    requestTaskState() {
        if (this._requestStateTime > 0 && GlobalVal.now < this._requestStateTime) {
            GameEvent.emit(EventEnum.SHARE_TASK_STATE, this._taskState);
            return;
        }
        HttpControl.get(GlobalVal.SHARE_TASK_STATE, this._phpObj, (suc: boolean, ret: string | any) => {
            if (suc && ret && ret.status == 1) {
                this._taskState = ret.info;
                this._shareGetAwardState = ret.shareReward;
                GameEvent.emit(EventEnum.SHARE_TASK_STATE, this._taskState);
                this._requestStateTime = GlobalVal.now + 10000;
            }
        }, true);
    }

    /**获取分享成功奖励 */
    requestShareAward() {
        HttpControl.get(GlobalVal.SHARE_GET_AWARD, this._phpObj, (suc: boolean, ret: string | any) => {
            if (suc && ret) {
                if (ret.status == 1) {
                    cc.log("获取分享成功奖励");
                    //this._taskState = ret.info;
                    GameEvent.emit(EventEnum.SHARE_AWARD_GET, true);
                    SystemTipsMgr.instance.notice("分享奖励邮件已下发，请注意查收");
                } else {
                    SystemTipsMgr.instance.notice(ret.info);
                }
            }
        }, true);
    }

    /**获取分享任务奖励 */
    requestTaskAward(taskID: number) {
        let token = md5(Game.actorMgr.nactordbid + GlobalVal.TOKEN_FLAG + taskID);
        let obj = { user_id: this._phpObj.user_id, token: token, task_id: taskID };
        HttpControl.get(GlobalVal.SHARE_TASK_GET_AWARD, obj, (suc: boolean, ret: string | any) => {
            if (suc && ret && ret.status == 1) {
                let taskState = this.getTaskStateByID(taskID);
                if (taskState) {
                    taskState.task_status = EShareTaskState.FINISH;
                    GameEvent.emit(EventEnum.SHARE_TASK_STATE, this._taskState);
                    SystemTipsMgr.instance.notice("任务奖励邮件已下发，请注意查收");
                }
                cc.log("获取分享任务奖励成功");
            }
        }, true);
    }

    /**
     * 请求分享记录
     */
    requestRecord() {
        if (this._requestRecordTime > 0 && GlobalVal.now < this._requestRecordTime) {
            GameEvent.emit(EventEnum.SHARE_RECORD_GET, this._record);
            return;
        }
        HttpControl.get(GlobalVal.SHARE_RECORD, this._phpObj, (suc: boolean, ret: string | any) => {
            if (suc && ret) {
                this._record = ret;
                GameEvent.emit(EventEnum.SHARE_RECORD_GET, ret);
                this._requestRecordTime = GlobalVal.now + 10000;
            }
        }, true);
    }

    /**
     * 分享文字
     */
    private shareText(target: number, text: string) {
        this.doShare(target, null, text, null, null);
    }

    /**
     * 分享url
     * @param target 
     * @param url 
     * @param title 
     * @param content 
     */
    private shareUrl(target, url, title, content) {
        this.doShare(target, title, content, url, null)
    }

    /**
     * 分享图片
     * @param target --目标(int)
     * @param title --标题(string)
     * @param content --分享资源类型为链接时的文字(string)
     * @param url --分享资源类型为链接时的链接(string)
     */
    shareImg(target: number, title: string, content: string, url: string) {
        if (!cc.sys.isNative) return;

        this._target = target;
        this._title = title;
        this._content = content;
        this._url = url;
        if (StringUtils.isNilOrEmpty(this._mediaPath)) {
            //登录一次只截一次，
            Game.resMgr.loadRes(EResPath.SHARE_VIEW, cc.Prefab, Handler.create(this.onShareViewLoaded, this));
            cc.log("----------------分享截图");
        } else {
            this.doShare(this._target, this._title, this._content, this._url, this._mediaPath);
        }
    }

    onSaveImgSuccess(path: string) {
        this._mediaPath = path;
        this.doShare(this._target, this._title, this._content, this._url, path);
    }

    getQrCodeImg() {
        if (this._qrSf) {
            GameEvent.emit(EventEnum.QRCODE_IMG, this._qrSf);
            //handler.executeWith(this._qrSf);
        } else {
            HttpControl.get(GlobalVal.QRCODE_URL, { id: Game.actorMgr.nactordbid }, (suc: boolean, ret: any) => {
                if (suc) {
                    let img = new Image();
                    img.src = ret.info;
                    let texture: cc.Texture2D = new cc.Texture2D();
                    texture.initWithElement(img);
                    this._qrSf = new cc.SpriteFrame(texture);
                    GameEvent.emit(EventEnum.QRCODE_IMG, this._qrSf);
                }
            }, true);
        }
    }

    /**获取所有任务状态 */
    getTaskState(): any {
        return this._taskState;
    }

    /**获取分享配置 */
    getConfig(): any[] {
        return this._config || [];
    }

    /**获取任务配置 */
    getConfigById(id: number): any {
        return this._configDic[id];
    }

    getTaskStateByID(id: number): any {
        let len = this._taskState.length;
        for (let i = 0; i < len; i++) {
            if (this._taskState[i].task_id == id) {
                return this._taskState[i];
            }
        }
        return null;
    }

    getShareRewardState(): number {
        return this._shareGetAwardState;
    }

    /**
     * 分享
     * @param target --目标(int)
     * @param title --标题(string)
     * @param content --分享资源类型为链接时的文字(string)
     * @param url --分享资源类型为链接时的链接(string)
     * @param mediaPath --分享资源类型为图片时的本地路径(string)
     */
    private doShare(target: number, title: string, content: string, url: string, mediaPath: string) {
        let value = { target: target, title: title || "", content: content || "", url: url || "", mediaPath: mediaPath || "", imageOnly: false };

        Game.nativeApi.share(JSON.stringify(value));
        GameEvent.emit(EventEnum.JAVA_CALL_SHARE_SUCCESS);
    }

    private onShareViewLoaded(res: any, path: string) {
        this._shareNode = cc.instantiate(res);
        this._shareNode.x = -1000;
        UiManager.topLayer.addChild(this._shareNode);
    }

    /**关卡id改变 */
    private onLastWarChange(id: number) {
        if (id == 20) {
            let token = md5(Game.actorMgr.nactordbid + GlobalVal.TOKEN_FLAG);
            let obj = { user_id: this._phpObj.user_id, token: token };
            HttpControl.get(GlobalVal.SHARE_CLEARANCE, obj, (suc: boolean, ret: string | any) => {
                if (suc) {
                    cc.log("通知php过了20关");
                }
            }, true);
        }
    }

    /**
     * 分享成功
     */
    private onShareSuccess() {
        this.hideShareView();
        cc.log("分享成功");
        Game.shareMgr.requestShareAward();
    }

    /**
     * 分享失败
     */
    private onShareFail() {
        this.hideShareView();
        cc.log("分享失败");
    }

    /**
     * 取消分享
     */
    private onShareCancel() {
        this.hideShareView();
        cc.log("取消分享");
    }

    private hideShareView() {
        if (this._shareNode && this._shareNode.parent) {
            this._shareNode.removeFromParent();
            this._shareNode.destroy();
            this._shareNode = null;
        }
    }

    initPhpObj() {
        let token = md5(Game.actorMgr.nactordbid + GlobalVal.TOKEN_FLAG);
        this._phpObj = { user_id: Game.actorMgr.nactordbid, token: token };
    }
}