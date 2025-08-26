import { ERecyclableType } from "./ERecyclableType";

/**回收接口 */
export interface IRecyclable {
    key:ERecyclableType;
    /**回收前重置数据 */
    resetData();
    /**不回收，释放 */
    giveUp();
    /**回收使用 */
    onRecycleUse();
    /**销毁 */
    dispose();
    /**回收自己 */
    recycleSelf();
}