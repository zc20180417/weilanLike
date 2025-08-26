// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property
    verticals: number = 0;

    @property
    spaceX: number = 0;

    @property
    spaceY: number = 0;

    update(dt) {
        let nodes = this.node.children;
        let activeCount: number = 0;
        let lastActiveNode: cc.Node;
        for (let i = 0, len = nodes.length; i < len; i++) {
            if (activeCount >= this.verticals) {//x
                if (nodes[i].active) {
                    activeCount++;
                    if (lastActiveNode) {
                        nodes[i].x = lastActiveNode.x + lastActiveNode.width * (1 - lastActiveNode.anchorX) + this.spaceX +
                            nodes[i].width * nodes[i].anchorX;
                        nodes[i].y = lastActiveNode.y;
                    } else {
                        nodes[i].x = lastActiveNode.anchorX * lastActiveNode.width;
                        nodes[i].y = 0;
                    }
                    lastActiveNode = nodes[i];
                }
            } else {//y
                if (nodes[i].active) {
                    activeCount++;
                    if (lastActiveNode) {
                        nodes[i].y = lastActiveNode.y - lastActiveNode.height * lastActiveNode.anchorY - this.spaceX -
                            nodes[i].height * (1 - nodes[i].anchorY);
                        nodes[i].x = lastActiveNode.x;
                    } else {
                        nodes[i].y = -(1 - nodes[i].anchorY) * nodes[i].height;
                        nodes[i].x = 0;
                    }
                    lastActiveNode = nodes[i];
                }
            }
        }
    }
}
