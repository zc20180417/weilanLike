// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class RedLineBase extends cc.Component {
    /**
     * 隐藏红点和激光
     */
    protected hide() {

    }

    /**
     * 显示红点和激光
     */
    protected show() {

    }

    public startAim(){

    }

    public stopAim() {
        
    }

    /**
     * 瞄准目标
     */
    aimAt(selfPos: cc.Vec2, angle: number,length:number) {

    }


    pause() {

    }

    resume() {

    }
}
