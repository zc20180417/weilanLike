// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import {  TOWER_TXT_COLOR } from "../../common/AllEnum";
import GlobalVal from "../../GlobalVal";
import { StringUtils } from "../../utils/StringUtils";
import Dialog from "../../utils/ui/Dialog";
import { GAME_FAILD_TIPS_TYPE } from "./GameFailTipsView";

const { ccclass, property } = cc._decorator;

export enum RichTextTipsType {
    CARD,           //卡片
    LING_DANG,      //铃铛
    HU_DIE_JIE,     //蝴蝶结
    GAME_FIAL,      //游戏失败
    ENERGY,     //能量
    CPINFO,     //关卡详情
    EQUIP,      //装备
    BOX_1,      //普通宝箱
    BOX_2,      //精致宝箱
    BOX_3,      //高档宝箱
    BOX_4,      //至尊宝箱
    WEEK,
}


function gameFialTips(...args): string {
    let type = args[0];
    let tipsStr = "";
    if (type == GAME_FAILD_TIPS_TYPE.LING_ENOUGH) {
        tipsStr = StringUtils.richTextColorFormat("您有大量", "#995124")
            + StringUtils.richTextColorFormat("铃铛", "#ea5718")
            + StringUtils.richTextColorFormat("未用，建议前往", "#995124")
            + StringUtils.richTextEventFormat(StringUtils.richTextColorFormat("<u>天赋界面</u>", "#ea5718"), "clickScience")
            + StringUtils.richTextColorFormat("使用以提升猫咪能力", "#995124");
    } else if (type == GAME_FAILD_TIPS_TYPE.DIAMOND_ENOUGH) {
        tipsStr = StringUtils.richTextColorFormat("提升", "#995124")
            + StringUtils.richTextColorFormat("猫咪等级", "#ea5718")
            + StringUtils.richTextColorFormat("可以更轻松的过关，使用钻石开", "#995124")
            + StringUtils.richTextEventFormat(StringUtils.richTextColorFormat("<u>宝箱</u>", "#ea5718"), "clickGameFailShopBox")
            + StringUtils.richTextColorFormat("购买卡片升级猫咪", "#995124");
    }
    return tipsStr;
}

function cardTips(): string {
    let des = "1.在";
    des += StringUtils.richTextEventFormat(StringUtils.richTextColorFormat("<u>商店-宝箱</u>", "#ea5718"), "clickShopBox");
    des += "中，使用钻石获得卡片\n";
    des += "2.在";
    des += StringUtils.richTextEventFormat(StringUtils.richTextColorFormat("<u>合作模式-兑换商店</u>", "#ea5718"), "clickCooperationShop");
    des += "中，使用合作点兑换\n";
    return des;
}

function lingdangTips(): string {
    let des = "1.在";
    des += StringUtils.richTextEventFormat(StringUtils.richTextColorFormat("<u>合作模式</u>", "#ea5718"), "clickCooperation");
    des += "中每过10关可以获得\n";
    des += "2.";
    des += StringUtils.richTextEventFormat(StringUtils.richTextColorFormat("<u>活动大厅</u>", "#ea5718"), "clickActiveHall");
    des += "中的活动中获得\n";
    des += "3.完成游戏";
    des += StringUtils.richTextEventFormat(StringUtils.richTextColorFormat("<u>成就</u>", "#ea5718"), "clickAchievement");
    des += "获得大量铃铛\n";
    return des;
}

function energyTips(): string {
    let des = "1.抽取";
    let order: number = 2;
    des += StringUtils.richTextEventFormat(StringUtils.richTextColorFormat("<u>商店-宝箱</u>", "#ea5718"), "clickShopBox");
    des += "能获得大量的能量\n";

    if (GlobalVal.openRecharge) {
        des += "2.在";
        des += StringUtils.richTextEventFormat(StringUtils.richTextColorFormat("<u>商店-特惠</u>", "#ea5718"), "clickShopTehui");
        des += "免费领取今日分能量\n";
        order = 3;
    }
    des += order + ".在";
    des += StringUtils.richTextEventFormat(StringUtils.richTextColorFormat("<u>商店-能量</u>", "#ea5718"), "clickShopEnergy");
    des += "使用钻石兑换能量\n";
    return des;
}

function cpinfoTips(): string {
    let des = "";
    des += StringUtils.richTextColorFormat("猫咪的战斗力差很多，建议", "#995124")
        + StringUtils.richTextEventFormat(StringUtils.richTextColorFormat("<u>升级天赋</u>", "#ea5718"), "clickScience")
        + StringUtils.richTextColorFormat("或者", "#995124")
        + StringUtils.richTextEventFormat(StringUtils.richTextColorFormat("<u>猫咪升星</u>", "#ea5718"), "clickTowerStar")
        + StringUtils.richTextColorFormat("后再来挑战", "#995124");
    return des;
}

function hudiejieTips(): string {
    let des = "1.";
    // des += StringUtils.richTextEventFormat(StringUtils.richTextColorFormat("<u>好友列表</u>", "#ea5718"), "clickFriendAndToCathouse")
    //     + StringUtils.richTextColorFormat("-进入好友猫咪公寓：每日可以拾取少量蝴蝶结\n", "#995124")
    des +=   
         StringUtils.richTextEventFormat(StringUtils.richTextColorFormat("<u>对战商店</u>", "#ea5718"), "clickPvpShop")
        + StringUtils.richTextColorFormat("：对战商店：在对战模式中胜负和排名可获得蝴蝶结\n", "#995124")
        + "2."
        + StringUtils.richTextEventFormat(StringUtils.richTextColorFormat("<u>每日关卡</u>", "#ea5718"), "clickDailyCheckpoint")
        + StringUtils.richTextColorFormat("中某些关卡可获得蝴蝶结，点击打开每日关卡\n", "#995124");
    return des;
}

function equipTips(): string {
    let des = "装备获取途径：";
    des += StringUtils.richTextEventFormat(StringUtils.richTextColorFormat("<u>合作商店</u>", "#ea5718"), "clickCooperationShop")
    return des;
}

function boxTips1():string {
    let des = "卡片总数：5\n";
    des += StringUtils.fontColor("绿卡概率：95.00%"  , TOWER_TXT_COLOR['1']) + '\n';
    des += StringUtils.fontColor("蓝卡概率：5.00%"  , TOWER_TXT_COLOR['2']);

    return des;
}
function boxTips2():string {
    let des = "卡片总数：7\n";
    des += StringUtils.fontColor("绿卡概率：57.14%"  , TOWER_TXT_COLOR['1']) + '\n';
    des += StringUtils.fontColor("蓝卡概率：42.14%"  , TOWER_TXT_COLOR['2']) + '\n';
    des += StringUtils.fontColor("紫卡概率：0.71%"  , TOWER_TXT_COLOR['3']) + '\n';

    return des;
}
function boxTips3():string {
    let des = "卡片总数：10\n";
    des += StringUtils.fontColor("绿卡概率：70.00%"  , TOWER_TXT_COLOR['1']) + '\n';
    des += StringUtils.fontColor("蓝卡概率：27.50%"  , TOWER_TXT_COLOR['2']) + '\n';
    des += StringUtils.fontColor("紫卡概率：2.50%"  , TOWER_TXT_COLOR['3']) + '\n';

    return des;
}
function boxTips4():string {
    let des = "卡片总数：15\n";
    des += StringUtils.fontColor("绿卡概率：66.67%"  , TOWER_TXT_COLOR['1']) + '\n';
    des += StringUtils.fontColor("蓝卡概率：20.00%"  , TOWER_TXT_COLOR['2']) + '\n';
    des += StringUtils.fontColor("紫卡概率：12.50%"  , TOWER_TXT_COLOR['3']) + '\n';
    des += StringUtils.fontColor("橙卡概率：0.83%"  , TOWER_TXT_COLOR['4']) + '\n';

    return des;
}
function zhouKaTips(): string {
    let des = '1.每次关卡失败可免费复活一次\n';
    des += '2.每日可领取商店的周卡福利\n';
    des += '3.每日可在体力购买界面可免费领取5次免费体力';
    return des;
}

export function getRichtextTips(type: RichTextTipsType, ...args): string {
    let des = "";
    switch (type) {
        case RichTextTipsType.CARD: des = cardTips(); break;
        case RichTextTipsType.LING_DANG: des = lingdangTips(); break;
        case RichTextTipsType.HU_DIE_JIE: des = hudiejieTips(); break;
        case RichTextTipsType.GAME_FIAL: des = gameFialTips(...args); break;
        case RichTextTipsType.ENERGY: des = energyTips(); break;
        case RichTextTipsType.EQUIP: des = equipTips(); break;
        case RichTextTipsType.BOX_1: des = boxTips1(); break;
        case RichTextTipsType.BOX_2: des = boxTips2(); break;
        case RichTextTipsType.BOX_3: des = boxTips3(); break;
        case RichTextTipsType.BOX_4: des = boxTips4(); break;
        case RichTextTipsType.WEEK: des = zhouKaTips(); break;
    }
    return des;
}

export interface RichTextTipsData {
    title: string;
    des: string;
}

@ccclass
export default class RichTextTipsView extends Dialog {
    @property(cc.RichText)
    des: cc.RichText = null;

    @property(cc.Label)
    title: cc.Label = null;

    private data: RichTextTipsData = null;
    public setData(data: any): void {
        this.data = data;
    }

    protected afterShow(): void {
        this.des.string = this.data.des;
        this.title.string = this.data.title;
    }
}
