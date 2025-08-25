// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Rain extends cc.Component {
    @property(cc.Node)
    rainArr: cc.Node[] = [];

    @property
    offsetY: number = 87;

    private firstNode: cc.Node = null;

    private lastNode: cc.Node = null;

    private speed: cc.Vec2 = null;

    private originPosArr: Array<any> = [];

    private enablePlay: boolean = false;

    private isPause: boolean = false;
    onLoad() {
        this.speed = cc.v2(500, 1200);

        this.rainArr.forEach((value) => {
            this.originPosArr.push(value.position);
        });
    }

    update(dt) {
        if (!this.enablePlay || this.isPause) return;

        this.node.y -= this.speed.y * dt;
        this.node.x -= this.speed.x * dt;

        let bottomCenterPos = this.node.convertToNodeSpaceAR(cc.v2(cc.winSize.width * 0.5, 0));

        while (this.lastNode.y + this.lastNode.height <= bottomCenterPos.y) {
            let node = this.rainArr.pop();
            node.x = bottomCenterPos.x;
            node.y = this.firstNode.y + this.offsetY;
            this.rainArr.unshift(node);

            this.lastNode = this.rainArr[this.rainArr.length - 1];
            this.firstNode = this.rainArr[0];
        }

    }

    onEnable() {
        this.node.opacity = 0;
    }

    play() {
        this.firstNode = this.rainArr[0];
        this.lastNode = this.rainArr[this.rainArr.length - 1];
        this.rainArr.forEach((value, i) => {
            value.position = this.originPosArr[i];
        });
        this.node.position = cc.Vec3.ZERO;
        this.enablePlay = true;
        cc.tween(this.node).to(0.5, { opacity: 255 })
            .start();
    }

    stop() {
        // this.enablePlay = false;
        cc.tween(this.node).to(0.5, { opacity: 0 })
            .call(() => {
                this.enablePlay = false;
            })
            .start();
    }

    public pause() {
        cc.director.getActionManager().pauseTarget(this.node);
        this.isPause = true;
    }

    public resume() {
        cc.director.getActionManager().resumeTarget(this.node);
        this.isPause = false;
    }

}
