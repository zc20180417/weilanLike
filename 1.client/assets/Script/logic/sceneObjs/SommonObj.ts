import { ERecyclableType } from "../Recyclable/ERecyclableType";
import { Monster } from "./Monster";

export class SommonObj extends Monster {
    ownerHeroId:number = 0;
    ownerHeroUId:number = 0;
    createTime:number = 0;
    lifeTime:number = 0;


    constructor() {
        super();
        this.key = ERecyclableType.SOMMON;
    }

    resetData() {
        this.ownerHeroId = 0;
        this.ownerHeroUId = 0;
        this.lifeTime = 0;
        this.createTime = 0;
        super.resetData();
    }
}