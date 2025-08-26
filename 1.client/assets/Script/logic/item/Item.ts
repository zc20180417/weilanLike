
import { GameData } from "../gameData/GameData";

/**物品类 */
export class Item extends GameData {
    cfg:any;
    /**配置表id */
    id:number = 0;
    /**唯一id */
    guid:number = 0;
    private _count:number = 0;
    constructor(id:number,cfg:any) {
        super();
        this.id = id;
        this.writeData.id = id;
        this.cfg = cfg;
    }

    set count(value:number) {
        if (value > this.cfg.maxCount) {
            value = this.cfg.maxCount;
        }
        this._count = value;
        this.writeData.value = value;
    }

    get count():number {
        return this._count;
    }
}