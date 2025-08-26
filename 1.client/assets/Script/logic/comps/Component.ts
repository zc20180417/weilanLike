import { IComponent } from "./IComponent";
import { RecyclableObj } from "../Recyclable/RecyclableObj";
import { ComponentObject } from "../sceneObjs/ComponentObject";
import { EComponentType } from "./AllComp";

export class Component extends RecyclableObj implements IComponent {
    /** 组件的拥有者 */
    protected m_Owner:ComponentObject = null;
    /** 组件名字 */
    private m_Type:EComponentType;

    /** 组件的拥有者 */
    set owner(value:ComponentObject) {
        this.m_Owner = value;
    }
    
    get owner():ComponentObject {
        return this.m_Owner; 
    } 

    /** 组件的拥有者 */
    set compType(value:EComponentType) {
        this.m_Type = value;
    }
    
    get compType():EComponentType {
        return this.m_Type; 
    } 

    /** 组件添加到主体上 */
    added() {
    }

    /** 组件从主体上移除 */
    removed() {
    }

    /** 重置数据 */
    resetData() {
        this.m_Owner = null;
        this.m_Type = null;
        super.resetData();
    }

    /** 丢弃 */
    giveUp() {
        this.m_Owner = null;
        super.giveUp();
    }
}