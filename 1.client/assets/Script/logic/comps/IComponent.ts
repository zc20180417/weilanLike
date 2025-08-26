import { ComponentObject } from "../sceneObjs/ComponentObject";
import { EComponentType } from "./AllComp";

/**组件接口 */
export interface IComponent {
    /**组件持有者 */
    owner:ComponentObject;
    /**组件名称 */
    compType:EComponentType;
    /**添加时响应的函数 */
    added();
    /** 移除时响应的函数 */
    removed();
}