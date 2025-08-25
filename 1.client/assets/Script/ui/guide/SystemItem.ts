
const { ccclass, property, menu } = cc._decorator;



@ccclass
@menu("Game/ui/guide/SystemItem")
export class SystemItem extends cc.Component {
    @property
    systemid:number = 0;
}