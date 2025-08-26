import { EMODULE } from "../../common/AllEnum";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { BulletChatData } from "../../ui/cpinfo/BulletChatData";
import { BulletChatPlayCtrl } from "../../ui/cpinfo/BulletChatPlayCtrl";
import { CpBulletChatData } from "../../ui/cpinfo/CpBulletChatData";
import { GameEvent } from "../../utils/GameEvent";
import { Handler } from "../../utils/Handler";
import { LocalStorageMgr } from "../../utils/LocalStorageMgr";
import { StringUtils } from "../../utils/StringUtils";
import { GS_PLAZA_SCENE_MSG, GS_SceneGetWarBulletChat, GS_SceneGetWarMyBulletChat, GS_SceneRetSetWarMyBulletChat, GS_SceneSetWarMyBulletChat, GS_SceneWarBulletChat, GS_SceneWarMyBulletChat } from "../proto/DMSG_Plaza_Sub_Scene";
import BaseNetHandler from "../socket/handler/BaseNetHandler";
import { CMD_ROOT, GS_PLAZA_MSGID } from "../socket/handler/MessageEnum";

/**弹幕 */
export class BulletChatMgr extends BaseNetHandler {

    constructor() {
        super(CMD_ROOT.CMDROOT_PLAZA_MSG, GS_PLAZA_MSGID.GS_PLAZA_MSGID_SCENE);
        this._ctrl = new BulletChatPlayCtrl();
    }
    
    //private _tempSendChat:any = {};
    private _setChatStates:any = {};
    private _isOpen:boolean = true;
    private _tempRequstData:GS_SceneGetWarBulletChat;
    private _ctrl:BulletChatPlayCtrl;

    register() {
        this.registerAnaysis(GS_PLAZA_SCENE_MSG.PLAZA_SCENE_RETSETWARMYBULLETCHAT, Handler.create(this.onRetBulletChat, this), GS_SceneRetSetWarMyBulletChat);
        this.registerAnaysis(GS_PLAZA_SCENE_MSG.PLAZA_SCENE_WARBULLETCHAT, Handler.create(this.onWarBulletChat, this), GS_SceneWarBulletChat);
        this.registerAnaysis(GS_PLAZA_SCENE_MSG.PLAZA_SCENE_WARMYBULLETCHAT, Handler.create(this.onWarMyBulletChat, this), GS_SceneWarMyBulletChat);
        GameEvent.on(EventEnum.ON_BULLET_CHAT_SWITCH , this.onSwitch , this);
    }

     /**请求发送留言 */
     reqSendBulletChat(warid:number , msg:string) {
        let data:GS_SceneSetWarMyBulletChat = new GS_SceneSetWarMyBulletChat();
        data.nwarid = warid;
        data.szbulletchat = StringUtils.filterCensorWords(msg);
        //this._tempSendChat[data.nwarid] = msg;
        this.send(GS_PLAZA_SCENE_MSG.PLAZA_SCENE_SETWARMYBULLETCHAT , data);
    }

    /**请求获得自己的留言 */
    reqGetMyBulletChat(warid:number) {
        let data:GS_SceneGetWarMyBulletChat = new GS_SceneGetWarMyBulletChat();
        data.nwarid = warid;
        this.send(GS_PLAZA_SCENE_MSG.PLAZA_SCENE_GETWARMYBULLETCHAT , data);
    }

    /**请求获得关卡的所有留言 */
    reqGetWarBulletChat(warid:number) {
        let data:GS_SceneGetWarBulletChat = new GS_SceneGetWarBulletChat();
        data.nwarid = warid;
        data.nindexes = this.calcWarChatIndex(warid);
        if (this._isOpen) {
            this._tempRequstData = null;
            this.send(GS_PLAZA_SCENE_MSG.PLAZA_SCENE_GETWARBULLETCHAT , data);
        } else {
            this._tempRequstData = data;
        }
    }
    

    /**自己的留言返回 */
    private onRetBulletChat(data:GS_SceneRetSetWarMyBulletChat) {
        let temp:CpBulletChatData = this.getWarBulletChat(data.nwarid);
        if (temp) {
            temp.selfChat = data.szbulletchat;
            temp.maxIndex += 1;
            this.writeWarBulletChat(data.nwarid , temp);
        }
        this.setSendChatState(data.nwarid , true);
        GameEvent.emit(EventEnum.ON_WAR_MY_CHAT_RET , data.nwarid);
    }

    /**某个关卡的留言信息*/
    private onWarBulletChat(data:GS_SceneWarBulletChat) {
        let temp:CpBulletChatData = this.getWarBulletChat(data.nwarid);
        if (data.items) {
            let len = data.items.length;
            let maxIndex:number = 0;
            for (let i = 0; i < len; i++) {
                const element = data.items[i];
                if (element.nindexes > temp.maxIndex) {
                    let item = new BulletChatData();
                    item.nactordbid = element.nactordbid;
                    item.nindexes = element.nindexes;
                    item.szbulletchat = element.szbulletchat;

                    temp.list.push(item);

                    if (element.nindexes > maxIndex) {
                        maxIndex = element.nindexes;
                    }
                }
                temp.maxIndex = maxIndex;
            }

            this.writeWarBulletChat(data.nwarid , temp);
            GameEvent.emit(EventEnum.ON_WAR_BULLET_CHAT_RET , data.nwarid);
        }
    }

    /**某关卡自己的留言 */
    private onWarMyBulletChat(data:GS_SceneWarMyBulletChat) {
        let temp:CpBulletChatData = this.getWarBulletChat(data.nwarid);
        temp.selfChat = data.szbulletchat;
        this.writeWarBulletChat(data.nwarid , temp);

        let warDetails = Game.sceneNetMgr.getWarDetails(data.nwarid);
        if (warDetails) {
            warDetails.btsetbulletchat = 1;
        }

        GameEvent.emit(EventEnum.ON_WAR_MY_CHAT_RET , data.nwarid);
    }




    ////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////弹幕相关

    getWarBulletChat(warid:number):CpBulletChatData {
        let data:CpBulletChatData;
        if (!this._readBulletChatState[warid]) {
            this._warBulletChatDic[warid] = this.readWarBulletChat(warid);
        }

        data = this._warBulletChatDic[warid];
        if (!data) {
            data = new CpBulletChatData();
            data.warid = warid;
            this._warBulletChatDic[warid] = data;
        }

        return data;
    }

    setSendChatState(warid:number , flag:boolean) {
        this._setChatStates[warid] = flag;
    }

    getSendChatState(warid:number):boolean {
        return this._setChatStates[warid];
    }

    read() {
        let value = LocalStorageMgr.getItem(EMODULE.WAR_BULLET_CHAT + 'open');
        this._isOpen = value && value == 1 ? false : true;
    }

    get isOpen():boolean {
        return this._isOpen;
    }

    private onSwitch(value:number) {
        this._isOpen = Boolean(value);
        let saveValue = value == 1 ? 0 :  1;
        LocalStorageMgr.setItem(EMODULE.WAR_BULLET_CHAT + 'open' , saveValue);
        if (value == 1 && this._tempRequstData) {
            this.send(GS_PLAZA_SCENE_MSG.PLAZA_SCENE_GETWARBULLETCHAT , this._tempRequstData);
            this._tempRequstData = null;
        }
    }

    private _warBulletChatDic:{[key:string] : CpBulletChatData } = {};
    private _readBulletChatState:any = {};

    /**读取弹幕的本地缓存 */
    private readWarBulletChat(warid:number) {
        this._readBulletChatState[warid] = true;
        let str = LocalStorageMgr.getItem(EMODULE.WAR_BULLET_CHAT + warid);
        if (!StringUtils.isNilOrEmpty(str)) {
            return JSON.parse(str);
        }
        return null;
    }

    /**将弹幕数据写入本地缓存 */
    private writeWarBulletChat(warid:number , obj:any) {
        LocalStorageMgr.setItem(EMODULE.WAR_BULLET_CHAT + warid , obj);
    }

    private calcWarChatIndex(warid:number):number {
        let data = this._warBulletChatDic[warid];
        if (data ) {
           return data.maxIndex;
        }
        return 0;
    }


}