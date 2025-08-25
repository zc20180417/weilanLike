// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

export enum RewardIconType {
    QUALITY_1,
    QUALITY_2,
    QUALITY_3,
    QUALITY_4,
    LING_DANG,
}

@ccclass
export default class JingCaiRewardIcon extends cc.Component {
    @property(cc.SpriteFrame)
    icons: cc.SpriteFrame[] = [];

    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.Label)
    des: cc.Label = null;

    setData(type: RewardIconType, value: number) {
        this.icon.spriteFrame = this.icons[type];
        if (type == RewardIconType.LING_DANG) {
            this.des.string = "x" + value;
        } else {
            this.des.string = value + "%";
        }
    }
}
