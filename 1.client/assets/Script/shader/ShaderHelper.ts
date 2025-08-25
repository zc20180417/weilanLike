// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class ShaderHelper extends cc.Component {

    protected mat: cc.Material = null;

    protected sp: cc.Sprite = null;

    onLoad() {
        this.sp = this.node.getComponent(cc.Sprite);
        this.mat = this.sp.getMaterial(0);
    }

}
