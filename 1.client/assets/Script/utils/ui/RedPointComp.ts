const {ccclass, property,menu} = cc._decorator;

/**
 * 列表类
 */
@ccclass
@menu("Game/utls/RedPointComp")
export default class RedPointComp extends cc.Component {

    @property(cc.Label)
    label:cc.Label = null;

    setData(data:any) {
        if (!data) {
            this.node.active = false;
            return;
        }

        this.node.active = true;
        if (typeof data === 'number' || typeof data === 'string') {
            //this.label.node.active = true;
            //this.label.string = data.toString();
        } 
    }

}