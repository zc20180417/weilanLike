import { StringUtils } from "../utils/StringUtils";

export enum PropEnum {
    PLAYER_PROP_MONEY_CASH,
    PLAYER_PROP_IMAGE_INDEX,
}

export default class PlayerData {
    /**用户guid */
    guid:number = 0;

    /**名字 */
    name:string = "";

    /**性别 */
    sex:number;

    /**头像 */
    figureUrl:string;

    phone:string = "";

    getProp(propID:number):any {
        return this._prop[propID] || 0;
    }

    setProp(propID:number , value:any) {
        this._prop[propID] = value;
    }
    
    getCash():number {
        return this.getProp(PropEnum.PLAYER_PROP_MONEY_CASH);
    }

    getGold():number {
        return this.getProp(PropEnum.PLAYER_PROP_MONEY_CASH);
    }
    
    //头像索引
    getImageIndex():number {
        return this.getProp(PropEnum.PLAYER_PROP_IMAGE_INDEX);
    }

    getShortName():string {
        return StringUtils.getShowName(this.name);
    }

    getFigureUrl():string{
        return this.figureUrl;
    }

    get isGuest():boolean{
        return StringUtils.isNilOrEmpty(this.phone);
    }

    private _prop:object = {};
}