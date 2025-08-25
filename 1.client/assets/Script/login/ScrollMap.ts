/**滚图组件 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("游戏脚本/login/ScrollMap")
export class ScrollMap extends cc.Component {

    @property([cc.Node])
    nodeList:cc.Node[] = [];

    @property
    speed:number = 0;

    private _curNode:cc.Node;
    private _curWidth:number = 0;
    //private _outX:number = 0;

    start() {
        this.changeFrist();
    }

    update() {

        this.nodeList.forEach(element => {
            element.x -= this.speed;
        });

        
        /*if (this._curNode.x <= -this._curWidth) {
            this.changeLast();
        }
        */
        if (this._curNode.x >= 0) {
            this.changeLast();
        }
    }

    private changeLast() {
        /*let node:cc.Node = this.nodeList.shift();
        let lastNode = this.nodeList[this.nodeList.length - 1];
        node.x = lastNode.x - lastNode.width;
        this.nodeList.push(node);
        this.changeFrist();
        */
        let node:cc.Node = this.nodeList.pop();
        let lastNode = this.nodeList[0];
        node.x = lastNode.x - node.width;
        this.nodeList.unshift(node);
        this.changeFrist();
    }

    private changeFrist() {
        this._curNode = this.nodeList[0];
        this._curWidth = this._curNode.width;
        //this._outX = this._curWidth * 0.5 + cc.winSize.width * 0.5;
    }
}