// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NavItem extends cc.Component {

    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.SpriteFrame)
    on: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    off: cc.SpriteFrame = null;

    @property(cc.Node)
    onNode: cc.Node = null;

    @property(cc.Node)
    offNode: cc.Node = null;

    onSelect() {
        this.icon && (this.icon.spriteFrame = this.on);
        this.onNode && (this.onNode.active = true);
        this.offNode && (this.offNode.active = false);
    }

    onUnselect() {
        this.icon && (this.icon.spriteFrame = this.off);
        this.onNode && (this.onNode.active = false);
        this.offNode && (this.offNode.active = true);
    }
}
