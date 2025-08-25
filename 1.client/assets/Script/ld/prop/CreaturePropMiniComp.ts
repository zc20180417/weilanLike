
import { PropertyId } from "../../common/AllEnum";
import Game from "../../Game";
import { Component } from "../../logic/comps/Component";
import { ERecyclableType } from "../../logic/Recyclable/ERecyclableType";
import Creature from "../../logic/sceneObjs/Creature";
import ObjectPropertyMini from "./ObjectPropertyMini";



export default class CreaturePropMiniComp extends Component {
    //配置
    public config: any;
    //血量
    private _hp: ObjectPropertyMini = null;
    get hp(): ObjectPropertyMini {
        return this._hp;
    }
    set hp(value: ObjectPropertyMini) {
        this._hp = value;
    }
    
    

    constructor() {
        super();
        this.key = ERecyclableType.LD_CREATURE_PROP;
    }


    private _propertys:  ObjectPropertyMini[];

    public bloodOffsetX: number = 0;

    public bloodOffsetY: number = 0;


    added() {
        if (this._propertys) return this.refreshProperty();
        this._propertys = Game.gameConfigMgr.createBattlePropertys(this.owner as Creature);
        this._hp = this.getProperty(PropertyId.HP);
    }

    removed() {
        for (let key in this._propertys) {
            this._propertys[key].clear();
        }
    }

    private refreshProperty() {
        for (let key in this._propertys) {
            this._propertys[key].owner = this.owner as Creature;
        }
    }

    public getProperty(id: PropertyId) {
        return this._propertys[id] || null;
    }

    public getPropertyValue(id: PropertyId):number {
        const prop = this._propertys[id];
        return prop ? prop.value : 0;
    }

    
    /**
     * 更新属性值
     * @param id 
     * @param value 
     * @param isAddition 
     */
    public addPropertyValue(id: number, value: number, isAddition = false) {
        let config = Game.gameConfigMgr.getPropertyConfig(id);
        let property = this._propertys[id];
        if (!config) return;
        if (!property) {
            property = Game.gameConfigMgr.createBattleProperty(this.owner as Creature , this._propertys , id);
        }
        if (property) {
            let before = property.value;
            if (config.nparentattrid) {
                property.ratio += value;
            } else {
                isAddition ? property.addition += (config.btwanratio ? value * 0.0001 : value) :
                    property.base += (config.btwanratio ? value * 0.0001 : value);
            }
            if (property.id === PropertyId.MAX_HP) {
                this._hp.base = Math.min(this._hp.value + property.value - before, property.value);
            } 
        }
    }

    /**
     * 更新属性值万分比
     * @param id 
     * @param value 差值
     */
    public addPropertyRatioValue(id: number, value: number) {
        if (this._propertys[id]) {
            this._propertys[id].ratio += value;
        }
    }

    
    public setPropertyBase(id: number, value: number) {
        let config = Game.gameConfigMgr.getPropertyConfig(id);
        let property = this.getProperty(id);

        if (!config) return;
        if (!property) {
            property = Game.gameConfigMgr.createBattleProperty(this.owner as Creature , this._propertys , id);
        }

        if (property) {
            if (config.nparentattrid) {
                property.ratio += value;
            } else {
                property.base = (config.btwanratio ? value * 0.0001 : value);
            }
            if (property.id === PropertyId.MAX_HP) {
                this._hp.base = property.value;
            }
        }
    }

    public showDebug() {
        
    }
}
