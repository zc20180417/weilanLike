export class TowerUtil {
    static towerCfg:any;
    static towerStarCfg:any;
    static LEVEL_MAX:number = 3;
    private static BASE_VALUE:number = 1000;
    private static QUALITY_VALUE:number = 10;

    /**通过 */
    static getTowerID(mainID:number , quality:number , level:number):number {
        return mainID * TowerUtil.BASE_VALUE + (quality * TowerUtil.QUALITY_VALUE) + level;
    }

    static getTowerCfg(mainID:number , quality:number , level:number):any {
        let id:number = this.getTowerID(mainID , quality , level);
        return TowerUtil.towerCfg[id];
    }

    static getAllTowerCfg(){
        return TowerUtil.towerCfg;
    }

    static getTowerCfgByID(id:number):any {
        return TowerUtil.towerCfg[id];
    }

    static getTowerMainID(type:number , quality:number):number {
        return type * 100 + quality;
    }

    static getType(towerID:number):number {
        return Math.floor(towerID / TowerUtil.BASE_VALUE);
    }

    static getQualityID(towerID:number):number {
        return Math.floor((towerID % TowerUtil.BASE_VALUE) / TowerUtil.QUALITY_VALUE);
    }

    static getLevelID(towerID:number):number {
        return towerID % TowerUtil.QUALITY_VALUE;
    }

    static BASE_STAR_VALUE:number = 1000;
    static getStarCfg(mainID:number,qualityID:number , starLevel:number):any {
        mainID = mainID * 100 + qualityID;
        let id = mainID * TowerUtil.BASE_STAR_VALUE + starLevel;
        return this.towerStarCfg[id];
    }

    static getTypeByMainID(mainID:number):number {
        return Math.floor(mainID / 100);
    }

    static getQualityByMainID(mainID:number):number {
        return mainID % 10;
    }
}