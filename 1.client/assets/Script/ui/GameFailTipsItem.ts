// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { GameFailTipsItemType } from "../common/AllEnum";
import { Handler } from "../utils/Handler";
import BaseItem from "../utils/ui/BaseItem";

const { ccclass, property } = cc._decorator;

const TIPS = [
    "升星猫咪增加更多属性",
    "购买宝箱获得更强猫咪",
    "升级天赋增强猫咪",
    "购买猫咪装备增强属性",
    "获取猫咪皮肤可升第4级",
    "尝试不同的猫咪阵容搭配",
    "加入Q群交流技巧",
    "通过活动获得钢铁喵",
    "通过活动获得熊喵和资源"
];

@ccclass
export default class GameFailTipsItem extends BaseItem {
    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.Label)
    des: cc.Label = null;

    @property(cc.SpriteFrame)
    icons: cc.SpriteFrame[] = [];

    public clickHandler: Handler = null;

    public setData(data: any, index?: number): void {
        super.setData(data, index);
        this.refresh();
    }

    private refresh() {
        let type = this.getType(this.data);
        this.icon.spriteFrame = this.icons[type];
        this.des.string = TIPS[type];
    }

    private getType(type: GameFailTipsItemType) {
        switch (type) {
            case GameFailTipsItemType.EQUIP2:
                type = GameFailTipsItemType.EQUIP;
                break;
            case GameFailTipsItemType.SCIENCE2:
                type = GameFailTipsItemType.SCIENCE;
                break;
            case GameFailTipsItemType.UPGRADE2:
                type = GameFailTipsItemType.UPGRADE;
                break;
        }
        return type;
    }

    onClick() {
        this.clickHandler && this.clickHandler.executeWith(this.data);
    }
}
