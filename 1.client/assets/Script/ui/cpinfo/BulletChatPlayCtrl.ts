import { EResPath } from "../../common/EResPath";
import { EventEnum } from "../../common/EventEnum";
import SysMgr from "../../common/SysMgr";
import Game from "../../Game";
import { NodePool } from "../../logic/sceneObjs/NodePool";
import { GameEvent } from "../../utils/GameEvent";
import { Handler } from "../../utils/Handler";
import { MathUtils } from "../../utils/MathUtils";
import { StringUtils } from "../../utils/StringUtils";
import { UiManager } from "../../utils/UiMgr";
import { BulletChatItem } from "./BulletChatItem";
import { CpBulletChatData } from "./CpBulletChatData";

export class BulletChatPlayCtrl {

    private _dy:number = 2000;
    /////////////////////////////////////
    private _otherPrefab:cc.Prefab = null;
    private _loadedHandler:Handler = null;
    private _itemMoveEnd:Handler = null;
    private _showNext:Handler = null;

    private _curData:CpBulletChatData;
    private _nodePool:NodePool = new NodePool();
    private _index:number = 0;
    private _showNodeList:cc.Node[] = [];
    private _isShowSelf:boolean = false;
    private _switchNode:cc.Node = null;

    private _loadState:number = -1;

    constructor() {
        this._loadedHandler = new Handler(this.onStartPlay , this);
        this._showNext = new Handler(this.showNext , this);
        this._itemMoveEnd = new Handler(this.onItemMoveEnd , this);
        GameEvent.on(EventEnum.ON_BULLET_CHAT_SWITCH , this.onSwitch , this);
        GameEvent.on(EventEnum.PLAY_BULLET_CHAT , this.tryPlay , this);
        GameEvent.on(EventEnum.STOP_BULLET_CHAT , this.stopPlay , this);
    }

    private tryPlay(id:number) {
        this.startPlay(Game.bulletChatMgr.getWarBulletChat(id));
        if (!this._switchNode) {
            Game.resMgr.loadRes(EResPath.BULLET_CHAT_SWITCH , cc.Prefab , this._loadedHandler);
        } else {
            this.showSwitch();
        }
    }

    private showSwitch() {
        if (!this._switchNode.parent) {
            UiManager.topLayer.addChild(this._switchNode);
            this._switchNode.x = cc.winSize.width - 100;
            this._switchNode.y = cc.winSize.height - 60;
        }
        this._switchNode.active = true;
    }

    private startPlay(data:CpBulletChatData , check:boolean = true) {
        this._curData = data;
        this._index = 0;
        this._isShowSelf = false;

        if (!Game.bulletChatMgr.isOpen && check) {
            return;
        }

        GameEvent.on(EventEnum.ON_WAR_MY_CHAT_RET , this.onSelfChatRet , this);
        GameEvent.on(EventEnum.ON_WAR_BULLET_CHAT_RET , this.onWarChatRetEvt , this);
        if (!this._otherPrefab) {
            this._loadState = 0;
            Game.resMgr.loadRes(EResPath.BULLET_CHAT_ITEM , cc.Prefab , this._loadedHandler );
            return;
        }
        this.onStartPlay(null , null);
    }

    private stopPlay() {
        this.doStop();
        this._curData = null;
        if (this._switchNode && this._switchNode.active) {
            this._switchNode.active = false;
        }
    }

    private doStop() {
        GameEvent.off(EventEnum.ON_WAR_MY_CHAT_RET , this.onSelfChatRet , this);
        GameEvent.off(EventEnum.ON_WAR_BULLET_CHAT_RET , this.onWarChatRetEvt , this);
        SysMgr.instance.clearTimer(this._showNext , true);
        this.removeAll();
    }

    private onStartPlay(res: any , url:string) {
        if (url == EResPath.BULLET_CHAT_SWITCH) {
            this._switchNode = cc.instantiate(res);
            this.showSwitch();
            return;
        }

        if (res) {
            this._otherPrefab = res;
            Game.resMgr.addRef(url);
        }

        if (!this._curData) return;
        if (this._loadState == 1) {
            this.doShowItem(this._curData.selfChat , true);
        } else {
            this.showNext();
        }
    }

    private onSelfChatRet(warid:number) {
        if (!this._curData || this._curData.warid != warid) return;
        if (!this._otherPrefab) {
            this._loadState = 1;
            Game.resMgr.loadRes(EResPath.BULLET_CHAT_ITEM , cc.Prefab , this._loadedHandler);
            return;
        }
        this.doShowItem(this._curData.selfChat , true);
    }

    private onWarChatRetEvt(warid:number) {
        if (!this._curData || this._curData.warid != warid) return;
        if (!this._otherPrefab) {
            this._loadState = 2;
            Game.resMgr.loadRes(EResPath.BULLET_CHAT_ITEM , cc.Prefab , this._loadedHandler);
            return;
        }
        this.showNext();
    }

    private getNode():cc.Node {
        if (this._nodePool.size() > 0) {
            return this._nodePool.get();
        }

        let node = cc.instantiate(this._otherPrefab);
        Game.resMgr.addRef(EResPath.BULLET_CHAT_ITEM);
        UiManager.topLayer.addChild(node);
        return node;
    }

    private saveNode(node:cc.Node) {
        this._nodePool.put(node);
    }

    private removeAll() {
        let len = this._showNodeList.length;
        for (let i = len - 1 ; i >= 0 ; i--) {
            this._nodePool.put( this._showNodeList[i]);
        }
        this._showNodeList.length = 0;
    }

    private showNext() {
        let showMe:boolean = !this._isShowSelf && !StringUtils.isNilOrEmpty(this._curData.selfChat);
        if (showMe) {
            if (Math.random() < 0.2) {
                this.doShowItem(this._curData.selfChat , true);
                return;
            }
        }
        if (this._curData.list.length >= this._index + 1) {
            let item = this._curData.list[this._index];
            this._index ++;
            let isMe = item.nactordbid == Game.actorMgr.nactordbid;
            if (isMe) {
                if (!this._isShowSelf)
                    this._isShowSelf = true;
                else {
                    this.showNext(); 
                    return;
                }
            }
            this.doShowItem(item.szbulletchat , isMe);
        } else if (showMe) {
            this.doShowItem(this._curData.selfChat , true);
        }
    }

    private doShowItem(str:string , isMe:boolean) {
        if (isMe) {
            this._isShowSelf = true;
        }
        SysMgr.instance.clearTimer(this._showNext , true);
        let node = this.getNode();
        let comp = node.getComponent(BulletChatItem);
        comp.endCallBack = this._itemMoveEnd;
        comp.doShow(str , isMe , this.getY());
        this._showNodeList.push(node);
        SysMgr.instance.doOnce(this._showNext , this._dy , true);
    }

    private onItemMoveEnd(node:cc.Node) {
        let len = this._showNodeList.length;
        for (let i = len - 1 ; i >= 0 ; i--) {
            if (this._showNodeList[i] == node) {
                this._showNodeList.splice(i , 1);
                break;
            }
        }
        this.saveNode(node);
    }

    private onSwitch(value:number) {
        if (!this._curData) return;
        if (value == 1) {
            this.startPlay(this._curData , false);
        } else {
            this.doStop();
        }
    }

    private getY():number {
        let winWidth = cc.winSize.width;
        let exList:number[] = [];

        this._showNodeList.forEach(element => {
            if (element.x + element.width * 0.5 >= winWidth - 50) {
                exList.push(element.y);
            }
        });

        let y = MathUtils.randomInt(560 , 660);
        let len = exList.length;
        let i = 0;
        if (exList.length > 0) {
            let flag = true;

            let count:number = 0;
            while (flag) {
                flag = false;
                count ++;
                if (count >= 20) {
                    flag = false;
                    break;
                }
                for (i = 0; i < len; i++) {
                    const element = exList[i];
                    if (Math.abs(element - y) <= 30) {
                        flag = true;
                        break;
                    }
                }

                if (flag) {
                    y = MathUtils.randomInt(560 , 660);
                }
            }
        }

        return y;
    }

}