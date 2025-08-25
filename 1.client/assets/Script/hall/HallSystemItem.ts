const {ccclass, property , menu} = cc._decorator;

@ccclass
@menu("Game/Hall/HallSystemItem")
export class HallSystemItem extends cc.Component {


    @property(cc.Node)
    nameNode:cc.Node = null;

    @property(cc.Label)
    openTipsLabel:cc.Label = null;


    show(flag:boolean , level:number) {
        this.nameNode.active = flag;
        this.openTipsLabel.node.active = !flag;
        if (!flag) {

            if (level != -1) {
                this.openTipsLabel.string = `通关 ${level} 关开启`;
            } else {
                this.openTipsLabel.string = `敬请期待`;
            }
        }
    }

} 