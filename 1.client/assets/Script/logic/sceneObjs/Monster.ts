import Creature from "./Creature";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GameEvent } from "../../utils/GameEvent";
import { ERecyclableType } from "../Recyclable/ERecyclableType";
import { Handler } from "../../utils/Handler";
import { MonsterConfig } from "../../common/ConfigInterface";
import ObjectPropertyMini from "../../ld/prop/ObjectPropertyMini";
import CreaturePropMiniComp from "../../ld/prop/CreaturePropMiniComp";
import { PropertyId } from "../../common/AllEnum";
import { EActType } from "../actMach/ActMach";

export class Monster extends Creature {


    

    fly:boolean = false;
   
    /**距离终点距离 （怪物才有） */
    endDis: number = 0;
    /**是否死亡 */
    isDied: boolean = false;
    /**临时值 */
    tempValue: number = 0;

    groupID:number = 0;

    //路径index
    pathIndex:number = -1;

    transformCfg:MonsterConfig;

    coinRatio:number = 1;

    /**pvp机器人标示牛油果的优先打 */
    // niuyouGuo:boolean = false;

    /////////////////////////////////////////////
    //调试用
    private _boIndex: number = 0;
    private _monsterSeq: number = 0;
    private _showDieEft:boolean = false;
    private _dieFunc:Handler = null;
    private _hp:ObjectPropertyMini = null;

    setBoIndex(boIndex: number) {
        this._boIndex = boIndex;
    }

    getBoIndex() {
        return this._boIndex;
    }

    setMonsterSeq(monsterSeq: number) {
        this._monsterSeq = monsterSeq;
    }

    getMonsterSeq() {
        return this._monsterSeq;
    }

    getDebugStr() {
        // let pos: cc.Vec2 = GlobalVal.toMapGridPos(this.pos);
        // return "[" + GlobalVal.totalBlood + "总HP" + this._boIndex + "波 " + this._monsterSeq + "号] " + this._blood + "/" + this.bloodTotal + " (" + pos.x + "," + pos.y + ")";
    }

    getHpDebugStr() {
        // GlobalVal.totalBlood += this.bloodTotal;
        // return "[" + GlobalVal.totalBlood + "总HP" + this._boIndex + "波 " + this._monsterSeq + "号] " + this.bloodTotal + "HP";
    }
    //////////////////////////////////////////

    constructor() {
        super();
        this.key = ERecyclableType.MONSTER;
    }

    setModelUrl(url:string) {
        super.setModelUrl(url);
    }

    dispose() {
        if (!this.m_isValid) {
            //释放过
            cc.error('monster dispose error , isValid is false');
            return;
        }
        GameEvent.emit(EventEnum.ON_OBJ_DIE , this);
        this.isDied = true;
        super.dispose();
    }

    onRecycleUse() {
        super.onRecycleUse();
        this.isDied = false;
    }

    resetData() {
        this.groupID = 0;
        this.transformCfg = null;
        this.fly = false;
        this._showDieEft = false;
        this._dieFunc = null;
        this._boIndex = -1;
        this._hp = null;
        super.resetData();
    }

    set blood(value: number) {
        if (!this._hp) return;
        this._hp.base = value;
    }

    get blood(): number {
        return this._hp?.base || 0;
    }

    get prop():CreaturePropMiniComp {
        return this._prop;
    }

    set prop(value: CreaturePropMiniComp) {
        this._prop = value;
        this._hp = this._prop.hp;
    }

    deleteBlood(value:number) {
        this.prop.hp.add(-value);
        this.emit(EventEnum.PROPERTY_CHANGE , PropertyId.HP , this.prop.hp.value);
    }

    doDie(showDieEft:boolean , skillUid:number) {
        this.isDied = true;
        this._showDieEft = showDieEft;

        //其他组件里处理死亡（可能是个通用的死亡组件？）
        if (this._dieFunc != null) {
            this._dieFunc.executeWith(showDieEft , skillUid);
            return;
        }

        this.changeTo(EActType.DIE , {time:0 , showDieEft:this._showDieEft});

        // Game.soMgr.removeDeadMonster(this , this._showDieEft);
    }



    setAttachGameObject(obj: cc.Node) {
        

        super.setAttachGameObject(obj);
    }

    setDieFunc(dieFunc:Handler) {
        this._dieFunc = dieFunc;
    }

    protected onClick() {
        // if (this._type == ESoType.LUOBO) {
        //     GameEvent.emit(EventEnum.ON_LUOBO_TOUCH, this);
        //     return;
        // }
        GameEvent.emit(EventEnum.ON_ENEMY_TOUCH , this);     
    }

    isCreatePosMonster():boolean {
        return this._boIndex != -1;
    }



}