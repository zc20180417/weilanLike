// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Skin extends cc.Component {
    @property(dragonBones.ArmatureDisplay)
    armature: dragonBones.ArmatureDisplay = null;

    @property
    normalScale: number = 0;

    @property({
        tooltip: "商城缩放"
    })
    showScale: number = 0;

    @property({
        tooltip: "商城偏移"
    })
    showOffset: cc.Vec2 = cc.Vec2.ZERO;

    @property({
        tooltip: "图鉴偏移"
    })
    bookOffset: cc.Vec2 = cc.Vec2.ZERO;

    @property({
        tooltip: "图鉴缩放"
    })
    bookScale: number = 0;

    playAni(name: string, times: number) {
        this.armature.playAnimation(name, times);
    }
}
