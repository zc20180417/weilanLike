
import { PropertyId } from "../../common/AllEnum";
import Game from "../../Game";
import { Component } from "../../logic/comps/Component";
import { ERecyclableType } from "../../logic/Recyclable/ERecyclableType";
import Creature from "../../logic/sceneObjs/Creature";
import ObjectProperty from "./ObjectProperty";


export interface Attribute {
    nid: number;
    svalue: number;
    nformulaid: number;
}

export interface Attribute2 {
    nid: number;
    svalue: number;
    nformulaid: number;
}

export class AttributeData implements Attribute {
    nid: number = 0;
    nformulaid: number = 0;
    svalue: number = null;

    constructor(nid: number, nformulaid: number, value: number) {
        this.nid = nid;
        this.nformulaid = nformulaid;
        this.svalue = value;
    }

    /**set 基于number */
    set value(value: number) {
        this.svalue = value;
    }

    /**get 基于number */
    get value(): number {
        return this.svalue;
    }

    add(value: number) {
        this.svalue += value;
    }

    toString(): string {
        // const propConfig = Game.gameConfigMgr.getPropertyConfig(this.nid);
        // const value = GlobalVal.tempBigNumEx.fromBigNumber(this.svalue).value;
        // if (propConfig.btwanratio) {
        //     return ("基础属性") + '+' + StringUtils.formatToRatioLetter(value);
        // }
        // return (propConfig ? propConfig.name : "") + '+' + StringUtils.formatToLetter(value);
        return '';
    }
}

export default class CreaturePropComp extends Component {
    //配置
    public config: any;
    //血量
    private _hp: ObjectProperty = null;
    get hp(): ObjectProperty {
        return this._hp;
    }
    set hp(value: ObjectProperty) {
        this._hp = value;
    }
    

    constructor() {
        super();
        this.key = ERecyclableType.LD_CREATURE_PROP;
    }


    private _propertys: Record<number, ObjectProperty> = null;

    public bloodOffsetX: number = 0;

    public bloodOffsetY: number = 0;


    added() {
        if (this._propertys) return this.refreshProperty();
        this._propertys = Game.gameConfigMgr.createPropertys(this.owner as Creature);
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

    public initProperty() {
        for (let key in this._propertys) {
            this._propertys[key].initValue = this._propertys[key].value;
        }
    }

    public getProperty(id: PropertyId) {
        return this._propertys[id];
    }

    public getPropertyValue(id: PropertyId):number {
        return this._propertys[id].value;
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
        if (config && property) {
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
        if (config && property) {
            if (config.nparentattrid) {
                property.ratio += value;
            } else {
                property.base = (config.btwanratio ? value * 0.0001 : value);
            }
            if (property.id === PropertyId.MAX_HP) {
                this._hp.base = value;
            }
        }
    }

    public showDebug() {
        
    }
}
