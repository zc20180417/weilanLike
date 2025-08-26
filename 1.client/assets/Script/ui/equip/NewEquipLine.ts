const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/ui/equip/NewEquipLine")
export class NewEquipLine extends cc.Component {

    @property([cc.Node])
    nodeList:cc.Node[] = [];

    @property([cc.Node])
    equipIcos:cc.Node[] = [];


    showIndex(indexs:number[]) {
        indexs.forEach(element => {
            if (this.nodeList[element]) {
                this.nodeList[element].active = true;
            }
        });
        
    }


}