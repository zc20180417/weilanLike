/**
 * 简单的一个不在同一个父节点下的node组合,方便统一显示，隐藏，置灰等
 */

import { NodeUtils } from "./NodeUtils";



 const { ccclass, property, menu } = cc._decorator;

 @ccclass
 @menu("Game/ui/common/CombNode")
export class CombNode extends cc.Component {

    /**
     * 如果有按钮，请拖上来，置灰的时候要禁用按钮组件
     */
    @property(cc.Button)
    btn:cc.Button = null;

    @property([cc.Node])
    nodes:cc.Node[] = [];

    private _parentDic:{[key : string] : cc.Node} = null;
    private _active:boolean = false;
    get active():boolean {
        return this._active;
    }

    set active(value:boolean) {
        this._active = value;
        this.nodes.forEach(element => {
            element.active = value;
        });
    }

    /**
     * 设置是否置灰
     * @param flag true 置灰
     */
    setGray(flag:boolean) {
        this.nodes.forEach(element => {
            NodeUtils.setNodeGray(element , flag);
        });

        if (this.btn) {
            NodeUtils.enabledBtn(this.btn , !flag);
        }
    }

    addToParent(parent:cc.Node) {
        if (!this._parentDic) {
            this._parentDic = {};
        }

        this.nodes.forEach(element => {
            this._parentDic[element.uuid] = element.parent;
            NodeUtils.addToParent(element , parent);
        });
    }

    resetParent() {
        this.nodes.forEach(element => {
            let temp = this._parentDic[element.uuid];
            if (temp) {
                NodeUtils.addToParent(element , temp);
            }
        });
    }
    

}