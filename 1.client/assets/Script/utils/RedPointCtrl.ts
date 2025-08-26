
import { DialogType } from "../common/DialogType";
import { Handler } from "./Handler";
import RedPointComp from "./ui/RedPointComp";
import Game from "../Game";

export class RedPointInfo {
    eventType:string = '';
    target:cc.Node = null;
    px:number = 0;
    py:number = 0;
}


export default class RedPointCtrl {
    private evtDic:any = {};
    private datasDic:any = {};
    private targetDic:any = {};
    private rpNodeDic:any = {};

    private rpPrefab:cc.Prefab = null;

    private static _instance:RedPointCtrl = null;

    static get instance():RedPointCtrl {
        if (!RedPointCtrl._instance) {
            RedPointCtrl._instance = new RedPointCtrl();
        }
        return RedPointCtrl._instance;
    }

    constructor() {
        
    }

    init() {
        Game.resMgr.loadRes(DialogType.RedPoint , null , new Handler(this.onPrefabLoaded , this));
    }

    register(eventType:string,target:cc.Node,px:number = 0,py:number = 0) {
        let infoList:RedPointInfo[] = this.evtDic[eventType];
        if(!infoList) {
            infoList = [];
            this.evtDic[eventType] = infoList;
        } 
        else {
            let len:number = infoList.length;
            for (let i = 0 ; i < len ; i++) {
                if (infoList[i].target == target) {
                    return;
                }
            }
        }

        let rpInfo:RedPointInfo = new RedPointInfo();
        rpInfo.eventType = eventType;
        rpInfo.target = target;
        rpInfo.px = px;
        rpInfo.py = py;
        infoList.push(rpInfo);
        
        let targetInfoList:RedPointInfo[] = this.targetDic[target.uuid];
        if (!targetInfoList) {
            targetInfoList = [];
            this.targetDic[target.uuid] = targetInfoList;
        }
        targetInfoList.push(rpInfo); 

        
    }

    unregisterByTarget(target:cc.Node) {
        let targetInfoList:RedPointInfo[] = this.targetDic[target.uuid];
        if (targetInfoList) {
            let len:number = targetInfoList.length;
            for (let i = targetInfoList.length - 1; i >= 0 ; i--) {
                let rpInfo:RedPointInfo = targetInfoList[i];
                this.unregister(rpInfo.eventType,rpInfo.target);
                targetInfoList.splice(i , 1);
            }
        }

        if (this.rpNodeDic[target.uuid]) {
            this.rpNodeDic[target.uuid] = null;
            delete this.rpNodeDic[target.uuid]; 
        }
    }


    notify(eventType:string,data:any) {
        this.datasDic[eventType] = data;
        if (data) {
            this.showTip(eventType,data);
        }
        else {
            this.hideTip(eventType);
        }
    }

    private showTip(eventType:string,data:any) {
        if (!eventType) return;
        this.datasDic[eventType] = data;

        let infoList:RedPointInfo[] = this.evtDic[eventType];
        if (infoList) {
            let len:number = infoList.length;
            let info:RedPointInfo
            for (let i = 0 ; i < len ; i++) {
                info = infoList[i];
                if (!this.rpNodeDic[info.target.uuid]) {
                    let node:cc.Node = cc.instantiate(this.rpPrefab);
                    node.x = info.px;
                    node.y = info.py;
                    info.target.addChild(node);
                    this.rpNodeDic[info.target.uuid] = node.getComponent(RedPointComp);
                }
                this.rpNodeDic[info.target.uuid].setData(data);
            }
        }
    }

    private hideTip(eventType:string) {
        this.datasDic[eventType] = null;
        let infoList:RedPointInfo[] = this.evtDic[eventType];
        if (infoList) {
            let len:number = infoList.length;
            for (let i = 0 ; i < len ; i++) {
                this.checkShow(infoList[i].target)
            }
        }

        delete this.datasDic[eventType];
    }

    private checkShow(target:cc.Node) {
        let targetInfoList:RedPointInfo[] = this.targetDic[target.uuid];
        if (targetInfoList) {
            let len:number = targetInfoList.length;
            let data:any = null;
            for (let i = targetInfoList.length - 1; i >= 0 ; i--) {
                let rpInfo:RedPointInfo = targetInfoList[i];
                data = this.datasDic[rpInfo.eventType];
                if (data) {
                    break;
                }
            }

            if (data == null && this.rpNodeDic[target.uuid]) {
                this.rpNodeDic[target.uuid].setData(null);
            }
        }
    }


    private onPrefabLoaded() {
        this.rpPrefab = Game.resMgr.getRes(DialogType.RedPoint);
    }   

    private unregister(eventType:string,target:cc.Node) {
        let infoList:RedPointInfo[] = this.evtDic[eventType];
        if (infoList) {
            let len:number = infoList.length;
            for (let i = 0 ; i < len ; i++) {
                if (infoList[i].target == target) {
                    infoList.splice(i , 1);
                    break;
                }
            }

            if (infoList.length == 0) {
                this.evtDic[eventType] = null;
                delete this.evtDic[eventType];
            }
        }
    }
}