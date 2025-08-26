// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EResPath } from "../common/EResPath";
import Game from "../Game";
import { GameEvent } from "../utils/GameEvent";
import { Handler } from "../utils/Handler";
import { StringUtils } from "../utils/StringUtils";
import RedPointStyle from "./RedPointStyle";

export const EVENT_REDPOINT = {
    YONGBING: "yongbing",
    YONGBING_101: "yongbing-101",
    YONGBING_102: "yongbing-102",
    YONGBING_103: "yongbing-103",
    YONGBING_104: "yongbing-104",
    YONGBING_201: "yongbing-201",
    YONGBING_202: "yongbing-202",
    YONGBING_203: "yongbing-203",
    YONGBING_204: "yongbing-204",
    YONGBING_301: "yongbing-301",
    YONGBING_302: "yongbing-302",
    YONGBING_303: "yongbing-303",
    YONGBING_304: "yongbing-304",
    YONGBING_401: "yongbing-401",
    YONGBING_402: "yongbing-402",
    YONGBING_403: "yongbing-403",
    YONGBING_404: "yongbing-404",
    YONGBING_501: "yongbing-501",
    YONGBING_502: "yongbing-502",
    YONGBING_503: "yongbing-503",
    YONGBING_504: "yongbing-504",
    YONGBING_601: "yongbing-601",
    YONGBING_602: "yongbing-602",
    YONGBING_603: "yongbing-603",
    YONGBING_604: "yongbing-604",
    YONGBING_701: "yongbing-701",
    YONGBING_702: "yongbing-702",
    YONGBING_703: "yongbing-703",
    YONGBING_704: "yongbing-704",
    YONGBING_801: "yongbing-801",
    YONGBING_802: "yongbing-802",
    EMAIL: "email",
    FRIEND: "friend",
    FRIEND_NOTICE: "friend-notice",
    FRIEND_PVP: "friend-pvp",
    TASK: "task",
    TASK_DAILY: "task-daily",
    TASK_DAILY_BOX: "task-daily-box",
    TASK_ACHIEVEMENT: "task-achievement",

    YONGBING_CANACTIVE: "yongbingCanactive",
    SCIENCE: "science",
    SCIENCE_1: "science-1",
    SCIENCE_2: "science-2",
    SCIENCE_3: "science-3",
    SCIENCE_4: "science-4",
    SCIENCE_5: "science-5",
    SCIENCE_6: "science-6",
    SCIENCE_7: "science-7",
    TUJIAN: "tujian",
    TUJIAN_GUAIWU: "tujian-guaiwu",
    TUJIAN_NEWCAT: "tujian-newcat",
    TUJIAN_GUAIWU_11: "tujian-guaiwu-11",
    TUJIAN_GUAIWU_12: "tujian-guaiwu-12",
    TUJIAN_GUAIWU_13: "tujian-guaiwu-13",
    TUJIAN_GUAIWU_14: "tujian-guaiwu-14",
    TUJIAN_GUAIWU_15: "tujian-guaiwu-15",
    TUJIAN_GUAIWU_16: "tujian-guaiwu-16",
    TUJIAN_GUAIWU_18: "tujian-guaiwu-18",
    TUJIAN_GUAIWU_19: "tujian-guaiwu-19",
    TUJIAN_GUAIWU_21: "tujian-guaiwu-21",
    TUJIAN_GUAIWU_22: "tujian-guaiwu-22",
    TUJIAN_GUAIWU_23: "tujian-guaiwu-23",
    TUJIAN_GUAIWU_24: "tujian-guaiwu-24",
    TUJIAN_GUAIWU_25: "tujian-guaiwu-25",
    TUJIAN_GUAIWU_26: "tujian-guaiwu-26",
    TUJIAN_GUAIWU_31: "tujian-guaiwu-31",
    TUJIAN_GUAIWU_32: "tujian-guaiwu-32",
    TUJIAN_GUAIWU_33: "tujian-guaiwu-33",
    TUJIAN_GUAIWU_35: "tujian-guaiwu-35",
    TUJIAN_GUAIWU_42: "tujian-guaiwu-42",
    TUJIAN_GUAIWU_43: "tujian-guaiwu-43",
    TUJIAN_GUAIWU_45: "tujian-guaiwu-45",
    TUJIAN_GUAIWU_81: "tujian-guaiwu-81",
    TUJIAN_GUAIWU_83: "tujian-guaiwu-83",
    TUJIAN_GUAIWU_210: "tujian-guaiwu-210",
    TUJIAN_GUAIWU_220: "tujian-guaiwu-220",
    TUJIAN_GUAIWU_230: "tujian-guaiwu-230",
    TUJIAN_GUAIWU_240: "tujian-guaiwu-240",
    TUJIAN_GUAIWU_250: "tujian-guaiwu-250",
    TUJIAN_GUAIWU_260: "tujian-guaiwu-260",
    TUJIAN_GUAIWU_270: "tujian-guaiwu-270",
    TUJIAN_GUAIWU_280: "tujian-guaiwu-280",
    TUJIAN_GUAIWU_290: "tujian-guaiwu-290",
    TUJIAN_GUAIWU_300: "tujian-guaiwu-300",
    VIP: "vip",
    NOVICE: "novice",
    NOVICE_DAY1: "novice-day1",
    NOVICE_DAY2: "novice-day2",
    NOVICE_DAY3: "novice-day3",
    NOVICE_DAY4: "novice-day4",
    NOVICE_DAY5: "novice-day5",
    NOVICE_DAY6: "novice-day6",
    NOVICE_DAY7: "novice-day7",
    SHOP: "shop",
    SHOP_BOX: "shop-box",
    SHOP_KEY: "shop-key",
    SHOP_NENGLIANG: "shop-nengliang",
    SHOP_NENGLIANG_FREE: "shop-nengliang-free",
    SHOP_BOX_ZHIZHUN: "shop-box-zhizhun",
    SHOP_BOX_PUTONG: "shop-box-putong",
    SHOP_TEHUI: "shop-tehui",
    SHOP_TEHUI_DIAMOND: "shop-tehui-diamond",
    SHOP_TEHUI_NENGLIANG: "shop-tehui-nengliang",
    SHOP_TEHUI_YAOQINGQUAN: "shop-tehui-quan",
    SHOP_KEY_ZHIZUN: "shop-key-zhizun",
    SHOP_KEY_PUTONG: "shop-key-putong",
    SHOP_ZHAOCAI:'shop-zhaocai',
    SHOP_ZHAOCAI_PUTONG:'shop-zhaocai-putong',

    SHOP_DOUBLE_RECHARGE: "shopDoubleRecharge",
    RANK: "rank",
    DOUBLE_RECHARGE: "doubleRecharge",

    ACTIVE_HALL: "activehall",
    ACTIVE_HALL_LEISHEN: "activehall-leishen",
    ACTIVE_HALL_GROWGIFT: "activehall-growgift",
    ACTIVE_HALL_DAYLOGIN: "activehall-daylogin",
    ACTIVE_HALL_DAILY_GIFT: "activehall-dailygift",
    ACTIVE_HALL_DAILY_GIFT_ITEM: "activehall-dailygift-item",

    YUEKA: "yueka",
    BATTLE_PASS: "battlepass",

    CONTINUE_RECHARGE: "activehall-coutinuerecharge",
    WEEK_RECHARGE: "activehall-weekrecharge",
    LOGIN_FUND:"loginfound",
    ZERO_MALL:"activehall-zeromall",
    ON_LINE_TIME:"activehall-onlinetime",
    COOPERATE_ADD_HURT:"cooperateAddHurt",
    FRIENDCHAT: "friendChat",
    FRIENDLIST: "friendList",
    BATTLE_PASS3: "battlepass3",
    BATTLE_PASS4: "battlepass4",
    PVP: "pvp",
    FESTIVAL_ACTIVE:"festivalActive",
    FESTIVAL_ACTIVE_TASK:"festivalActive-task",
    FESTIVAL_ACTIVE_LEICHOU:"festivalActive-leichou",
    FESTIVAL_ACTIVE_LEICHONG:"festivalActive-leichong",
    
    FESTIVAL_ACTIVE_SIGN:"festivalActive-sign",
    FESTIVAL_ACTIVE_SHOP_GIFT:"festivalActive-shop",
    FESTIVAL_ACTIVE_SHOP_GIFT_FREE:"festivalActive-shop-free",
    FESTIVAL_ACTIVE_TASK_ITEM:"festivalActive-task-item",
    FESTIVAL_ACTIVE_SIGN_ITEM:"festivalActive-sign-item",
    FESTIVAL_ACTIVE_LEICHOU_ITEM:"festivalActive-leichou-item",
    FESTIVAL_ACTIVE_LEICHONG_ITEM:"festivalActive-leichong-item",

}

const { ccclass, property } = cc._decorator;

const enum ITEM_STATE {
    NONE,
    REMOVED,
    ADDED,
};

class RedPointItem {
    public redPointNode: RedPointNode = null;
    public target: cc.Node = null;
    public redPointStyle: RedPointStyle = null;
    public state: ITEM_STATE = ITEM_STATE.NONE;
    private tag:string = '';

    constructor(target: cc.Node, redPointNode: RedPointNode , tag:string = null) {
        this.redPointNode = redPointNode;
        this.target = target;
        this.tag = tag;
        this.state = ITEM_STATE.NONE;
    }

    public refresh() {
        //前置节点数量为零才显示当前节点
        if (!this.redPointStyle || !this.redPointStyle.node || !this.redPointStyle.node.isValid) return;
        if (this.redPointNode.preNode && this.redPointNode.preNode.totalRedPointNum != 0) {
            this.redPointStyle.refresh(0);
        } else {
            this.redPointStyle.refresh(StringUtils.isNilOrEmpty(this.tag) ? this.redPointNode.totalRedPointNum : this.redPointNode.getTotalRedPointNum(this.tag));
        }
    }

    public onAdd() {
        Game.redPointSys.debug && cc.log("onAdd", this.redPointNode.cfg.name)
        this.state = ITEM_STATE.ADDED;
        Game.resMgr.loadRes(this.redPointNode.cfg.style, cc.Prefab, Handler.create(this.onLoadCompleted, this));
    }

    private onLoadCompleted(res) {
        if (this.state !== ITEM_STATE.ADDED) return;
        let styleNode: cc.Node = cc.instantiate(res);
        if (styleNode) {
            styleNode.setPosition(cc.v2(this.redPointNode.cfg.x, this.redPointNode.cfg.y));
            this.target.addChild(styleNode);
            this.redPointStyle = styleNode.getComponent(RedPointStyle);
            this.refresh();
        }
    }

    public onRemove() {
        Game.redPointSys.debug && cc.log("onRemove", this.redPointNode.cfg.name);
        this.state = ITEM_STATE.REMOVED;
        if (!this.redPointNode) return;
        this.redPointNode = null;
        this.target = null;
        if (this.redPointStyle && this.redPointStyle.node && this.redPointStyle.node.isValid) {
            this.redPointStyle.node.destroy();
        }
        this.redPointStyle = null;
    }
}

class RedPointNode {
    private redPointItems: RedPointItem[] = [];

    private subPointItems:Map<string , RedPointItem[]> = new Map();
    private subPointNum:Map<string , number> = new Map();

    public totalRedPointNum: number = 0;
    public name: string = null;
    public cfg: any = null;
    public parent: RedPointNode = null;
    public children: RedPointNode[] = [];
    public preNode: RedPointNode = null;//前置节点
    public nextNode: RedPointNode = null;//后置节点

    constructor(name?: string, config?: any) {
        this.name = name || "";
        this.cfg = config || null;

        if (this.cfg && this.cfg.isLeafNode == 1) {
            //注册根节点事件
            this.registerEvent();
        }
    }

    getTotalRedPointNum(tag:string):number {
        return this.subPointNum.get(tag);
    }

    /**
     * 刷新节点状态 
     */
    public refresh() {
        for (let i = this.redPointItems.length - 1; i >= 0; i--) {
            if (this.redPointItems[i]) {
                this.redPointItems[i].refresh();
            }
        }
    }

    /**
     * 刷新节点状态 
     */
    public refreshSub(tag:string) {
        let redPointItems = this.subPointItems.get(tag);
        let len = redPointItems ? redPointItems.length : 0;

        for (let i = len - 1; i >= 0; i--) {
            if (redPointItems[i]) {
                redPointItems[i].refresh();
            }
        }
    }

    /**
     * 注册驱动节点的事件
     */
    public registerEvent() {
        GameEvent.on(this.cfg.name, this.changeRedPointNum, this);
    }

    /**
     * 取消注册事件
     */
    public unregisterEvent() {
        GameEvent.targetOff(this);
    }

    /**
     * 红点数量发生改变
     * @param addOrReduce 
     */
    public changeRedPointNum(num: number) {
        this.totalRedPointNum += num;
        this.totalRedPointNum = this.totalRedPointNum < 0 ? 0 : this.totalRedPointNum;

        this.refresh();

        if (this.parent) {
            this.parent.changeRedPointNum(num);
        }

        if (this.nextNode) {
            this.notifyNextNode();
        }
    }

    /**
     * 红点数量发生改变Sub
     * @param addOrReduce 
     */
    public changeRedPointNumSub(subTag:string , num: number) {
        let temp = this.subPointNum.get(subTag) || 0;
        temp += num;
        temp = temp < 0 ? 0 : temp;
        this.subPointNum.set(subTag , temp);

        this.totalRedPointNum += num;
        this.totalRedPointNum = this.totalRedPointNum < 0 ? 0 : this.totalRedPointNum;

        this.refreshSub(subTag);

        if (this.parent) {
            this.parent.changeRedPointNum(num);
        }

        if (this.nextNode) {
            this.notifyNextNode();
        }
    }

    /**
     * 设置红点数量
     * @param num 
     */
    public setRedPointNum(num: number) {
        num = num < 0 ? 0 : num;
        this.changeRedPointNum(num - this.totalRedPointNum);
    }

    /**
     * 设置红点数量
     * @param num 
     */
    public setRedPointNumSub(tag:string , num: number) {
        num = num < 0 ? 0 : num;
        this.changeRedPointNumSub(tag , num - (this.subPointNum.get(tag) || 0));
    }

    /**
     * 添加节点
     * @param redPointNode 
     */
    public add(redPointNode: RedPointNode) {
        this.children.push(redPointNode);
        redPointNode.parent = this;
    }

    /**
     * 移除节点 
     * @param name 
     */
    public remove(name: string) {
        for (let i = 0, len = this.children.length; i < len; i++) {
            if (this.children[i].name == name) {
                this.children[i].unregisterEvent();
                this.children.splice(i, 1);
                i--;
                break;
            }
        }
    }

    /**
     * 查找节点
     * @param name 
     */
    public find(name: string): RedPointNode {
        for (let i = 0, len = this.children.length; i < len; i++) {
            if (this.children[i].name == name) {
                return this.children[i];
            }
        }
        return null;
    }

    /**
     * 添加redPointItem
     * @param target 
     */
    public addRedPointItem(target: cc.Node) {
        if (!this.preNode && this.cfg.preNodeName !== "") {
            this.preNode = RedPointSys.getInstance().findRedPointNode(this.cfg.preNodeName);
        }

        if (!this.nextNode && this.cfg.nextNodeName !== "") {
            this.nextNode = RedPointSys.getInstance().findRedPointNode(this.cfg.nextNodeName);
        }

        if (this.cfg.style !== "") {
            let item = new RedPointItem(target, this);
            this.redPointItems.push(item);
            item.onAdd();
        }
    }

    /**
     * 添加redPointItemSub
     * @param target 
     */
    public addRedPointItemSub(subTag:string , target: cc.Node) {
        if (!this.preNode && this.cfg.preNodeName !== "") {
            this.preNode = RedPointSys.getInstance().findRedPointNode(this.cfg.preNodeName);
        }

        //不再支持子节点
        if (this.cfg.style !== "") {
            let item = new RedPointItem(target, this , subTag);
            let redPointItems = this.subPointItems.get(subTag);
            if (!redPointItems) {
                redPointItems = [];
                this.subPointItems.set(subTag , redPointItems);
            }
            redPointItems.push(item);
            item.onAdd();
        }
    }

    /**
     * 移除redPointItem
     * @param target 
     */
    public removeRedPointItem(target: cc.Node) {
        for (let i = 0, len = this.redPointItems.length; i < len; i++) {
            if (this.redPointItems[i].target == target) {
                this.redPointItems[i].onRemove();
                this.redPointItems.splice(i, 1);
                i--;
                break;
            }
        }
    }

    /**
     * 移除redPointItem
     * @param target 
     */
    public removeRedPointItemSub(subTag:string , target: cc.Node) {
        let redPointItems = this.subPointItems.get(subTag);
        let len = redPointItems ? redPointItems.length : 0;
        for (let i = len - 1 ; i >= 0 ; i--) {
            if (redPointItems[i].target == target) {
                redPointItems[i].onRemove();
                redPointItems.splice(i, 1);
                break;
            }
        }
    }

    /**
     * 通知后直置节点
     */
    public notifyNextNode() {
        this.nextNode.refresh();
    }
}

export default class RedPointSys {

    private redPointCfg: any = null;//红点配置表
    private rootNode: RedPointNode = null;//根节点

    public debug: boolean = false;
    private static instance: RedPointSys = null;
    public static getInstance(): RedPointSys {
        return this.instance ? this.instance : this.instance = new RedPointSys();
    }

    /**
     * 初始化红点树
     */
    public init() {

        this.redPointCfg = Game.gameConfigMgr.getCfg(EResPath.RED_POINT_CFG);

        this.rootNode = new RedPointNode("root");
        for (let k in this.redPointCfg) {
            let cfg = this.redPointCfg[k];
            let nameArr = cfg.name.split("-");
            let tempNode = this.rootNode;
            for (let i = 0; i < nameArr.length; i++) {
                let node = tempNode.find(nameArr[i]);
                if (!node) {
                    node = new RedPointNode(nameArr[i], cfg);
                    tempNode.add(node);
                }
                tempNode = node;
            }
        }


    }

    /**
     * 注册红点
     * @param name 
     * @param target 
     */
    public registerRedPoint(name: string, target: cc.Node) {
        // this.debug && console.time("注册红点");
        let redPointNode = this.findRedPointNode(name);
        if (redPointNode) {
            this.debug && cc.log("添加红点：", name);
            redPointNode.addRedPointItem(target);
        } else {
            cc.log("红点" + name + " 不存在！");
        }
        // this.debug && console.timeEnd("注册红点");
    }

    /**
     * 注册红点sub
     * @param name 
     * @param target 
     */
    public registerRedPointSub(name: string, subTag:string , target: cc.Node) {
        // this.debug && console.time("注册红点");
        let redPointNode = this.findRedPointNode(name);
        if (redPointNode) {
            this.debug && cc.log("添加红点：", name);
            redPointNode.addRedPointItemSub(subTag , target);
        } else {
            cc.log("红点" + name + " 不存在！");
        }
        // this.debug && console.timeEnd("注册红点");
    }

    /**
     * 移除红点
     * @param name 
     * @param target 
     */
    public unregisterRedPoint(name: string, target: cc.Node) {
        // this.debug && console.time("取消红点");
        let redPointNode = this.findRedPointNode(name);
        if (redPointNode) {
            this.debug && cc.log("移除红点：", name);
            redPointNode.removeRedPointItem(target);
        } else {
            cc.log("红点 " + name + " 不存在！");
        }
        // this.debug && console.timeEnd("取消红点");
    }

    /**
     * 移除红点sub
     * @param name 
     * @param target 
     */
    public unregisterRedPointSub(name: string, subTag:string , target: cc.Node) {
        // this.debug && console.time("取消红点");
        let redPointNode = this.findRedPointNode(name);
        if (redPointNode) {
            this.debug && cc.log("移除红点：", name);
            redPointNode.removeRedPointItemSub(subTag, target);
        } else {
            cc.log("红点 " + name + " 不存在！");
        }
        // this.debug && console.timeEnd("取消红点");
    }

    /**
     * 查找redPointNode
     * @param name 
     */
    public findRedPointNode(name): RedPointNode {
        let nameArr = name.split("-");
        let tempNode = this.rootNode;
        let redPointNode = null;
        let i = 0, len = nameArr.length;
        while (tempNode && i < len) {
            let node = tempNode.find(nameArr[i]);
            if (i == len - 1 && node) {
                redPointNode = node;
            }
            tempNode = node;
            i++;
        }
        return redPointNode;
    }


    public setRedPointNum(event: string, num: number) {
        let redpoint = Game.redPointSys.findRedPointNode(event);
        redpoint && redpoint.setRedPointNum(num);
    }

    public setRedPointNumSub(event: string, tag:string , num: number) {
        let redpoint = Game.redPointSys.findRedPointNode(event);
        redpoint && redpoint.setRedPointNumSub(tag , num);
    }
}
