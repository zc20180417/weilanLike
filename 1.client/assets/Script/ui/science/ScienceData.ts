import { GameData } from "../../logic/gameData/GameData";

export class ScienceData extends GameData {

    constructor() {
        super();
    }

    /**科技id */
    id:number = 0;
    /**等级 */
    level:number = 0;
    /**配置 */
    cfg:any = null;

    getWriteData():any {
        this.writeData.id = this.id;
        this.writeData.level = this.level;
        return this.writeData;
    }

}