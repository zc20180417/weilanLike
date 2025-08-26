import { RecyclableObj } from "../Recyclable/RecyclableObj";
import { EComponentType, AllComp } from "../comps/AllComp";
import { Component } from "../comps/Component";
import { ERecyclableType } from "../Recyclable/ERecyclableType";
import { ObjPool } from "../Recyclable/ObjPool";
import { IComponent } from "../comps/IComponent";

export class ComponentObject extends RecyclableObj {

    /**组件字典 */
    private m_ComponentDic:any = {};

    private m_CompList:IComponent[] = [];
    /** 是否可用（被Release后将不可用）*/
    protected m_isValid:boolean = true;

    get isValid():boolean { return this.m_isValid; } 
    /** 释放回收*/ 
    dispose() {
        this.m_isValid = false;
        this.removeAllComps();
        super.dispose();
    }

    /** 回收使用*/ 
    onRecycleUse() {
        super.onRecycleUse();
        this.m_isValid = true;
    }

    /**重置数据 */ 
    resetData() {
        if (this.m_ComponentDic == null) return;
        this.removeAllComps();
        super.resetData();
    }

    /**丢弃 */ 
    giveUp() {
        this.m_ComponentDic = null;
        super.giveUp();
    }

    /**通过组件类型来获取组件 */
    getComponent(compType:EComponentType):any {
        if (!compType) return null;
        return this.m_ComponentDic[compType] as IComponent;
    }
    
    /**获取添加组件，如没有，则添加 */
    getAddComponent(compType:EComponentType):any {
        let comp = this.getComponent(compType);
        if (comp == null)
            comp = this.addComponentByType(compType);
        return comp;
    }
    
    /**根据类型添加组件 */
    addComponentByType(compType:EComponentType):IComponent {
        let comp:IComponent = this.getComponent(compType);
        if (comp != null)
            return comp;
        let c = AllComp.instance.getCompClass(compType);
        comp = ObjPool.instance.getObj(c) as Component;
        comp.compType = compType;
        return this.addComponent(comp);
    }

    /**添加组件 */
    addComponent(comp:IComponent):IComponent {
        if (!this.m_isValid) {
            cc.log("error m_isValid is false");
            return;
        }
        let tempComp = this.getComponent(comp.compType);
        if (tempComp != null) {
            cc.log("重复添加组件：" + comp.compType);
            return tempComp;
        }
        this.m_ComponentDic[comp.compType] = comp;
        this.m_CompList.push(comp);
        comp.owner = this;
        comp.added();
        return comp;
    }
    
    /**通过类型删除组件 */
    removeComponentByType(compType:EComponentType) {
        this.removeComponent(this.m_ComponentDic[compType]);
    }
    
    /**根据对象删除组件 */
    removeComponent(comp:IComponent) {
        if (comp == null || comp.owner != this) {
            //cc.log("dsafdf");
            return;
        }
        this.m_ComponentDic[comp.compType] = null;
        this.removeCompFromList(comp);
        comp.removed();
        comp.owner = null;
        if ((comp as Component).key != ERecyclableType.NONE)
            ObjPool.instance.recycleObj(comp as Component);
        comp = null;
    }
    
    /**移除所有组件 */
    private removeAllComps() {
        let len:number = this.m_CompList.length;
        for (let i = len - 1 ; i >= 0 ; i--) {
            this.removeComponent(this.m_CompList[i]);
        }
        this.m_ComponentDic = [];
    }

    private removeCompFromList(comp:IComponent) {
        let len:number = this.m_CompList.length;
        for (let i = len - 1 ; i >= 0 ; i--) {
            if (this.m_CompList[i] == comp) {
                this.m_CompList.splice(i , 1);
                break;
            }
        }
    }
}