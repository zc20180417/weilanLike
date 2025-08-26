// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

export enum TaskIconType {
    NORMAL,     //普通
    TIME,       //限时
    ENDLESS,    //无尽
    FREE        //自由
}

@ccclass
export default class JingCaiTaskIcon extends cc.Component {
    @property(cc.SpriteFrame)
    icons: cc.SpriteFrame[] = [];

    @property(cc.Sprite)
    icon: cc.Sprite = null;

    setIconType(type: TaskIconType) {
        this.icon.spriteFrame = this.icons[type];
    }
}
