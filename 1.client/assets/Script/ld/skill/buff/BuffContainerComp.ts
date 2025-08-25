
import { BuffCoverType } from "../../../common/AllEnum";
import { SkillBuffConfig } from "../../../common/ConfigInterface";
import Game from "../../../Game";
import { EComponentType } from "../../../logic/comps/AllComp";
import { Component } from "../../../logic/comps/Component";
import Creature from "../../../logic/sceneObjs/Creature";
import BuffBase from "./BuffBase";
import BuffFactory from "./BuffFactory";


/**
 * Buff容器组件
 */
export default class BuffContainerComp extends Component {
    private _buffs: BuffBase[] = [];


    constructor() {
        super();
        this.compType = EComponentType.BUFF;
    }


    added() {
        super.added();
    }

    removed() {
        this.removeAllBuff();
        super.removed();
    }

    addBuff(buffId: number, damageValue:number , skillUid:number, ...args: any[]) {
        let buffConfig = Game.ldSkillMgr.getBuff(buffId);
        if (!buffConfig) return cc.warn("不存在buff id", buffId);
        let bool = this.immuneCheck(buffConfig);
        if (!bool) return;
        bool = this.coverCheck(buffConfig, args);
        if (!bool) return;
        let buff: BuffBase = BuffFactory.getBuff(buffId, this.owner as Creature, damageValue , skillUid , ...args);
        buff.container = this;
        if (buffConfig.buffTime > 0) {
            this._buffs.push(buff);
        }
        buff.onBuffAwake();
    }

    public removeBuff(buff: BuffBase | number) {
        let buffBase:BuffBase;
        if (typeof buff === "number") {
            buffBase = this.getBuffById(buff);
        } else {
            buffBase = buff;
        }
        
        if (!buffBase ) return;
        const index = this._buffs.indexOf(buffBase);
        if (index !== -1) {
            this._buffs.splice(index, 1);
            buffBase.onBuffRemove();
        }
    }

    public removeBuffByType(buffType: number) {
        const len = this._buffs.length;
        for (let i = len - 1; i >= 0; i--) {
            const buffBase: BuffBase = this._buffs[i];
            if (buffBase.config.buffType === buffType) {
                this.removeBuff(buffBase);
            }
        }
    }

    public removeAllBuff() {
        const len = this._buffs.length;
        for (let i = len - 1; i >= 0; i--) {
            this.removeBuff( this._buffs[i]);
        }
    }

    /**
     * 获取指定id buff
     * @param buffId 
     * @returns 
     */
    private getBuffById(buffId: number) {
        const len = this._buffs.length;
        for (let i = len - 1; i >= 0; i--) {
            const buffBase: BuffBase = this._buffs[i];
            if (buffBase.config.buffID === buffId) {
                return buffBase;
            }
        }
        return null;
    }

    /**
     * 免疫检查，是否免疫当前要添加的buff
     * @param config 
     * @returns 
     */
    private immuneCheck(config: SkillBuffConfig) {
        const len = this._buffs.length;
        for (let i = len - 1 ; i >= 0; i--) {
            const buffBase:BuffBase = this._buffs[i];
            if (buffBase.config.immunityTag.indexOf(config.tag) !== -1) {
                return false;
            }
        }
        return true;
    }

    /**
     * 覆盖检查
     * @param buffId 
     * @param args 
     */
    private coverCheck(config: SkillBuffConfig, args: any[]) {
        const len = this._buffs.length;
        for (let i = len - 1 ; i >= 0; i--) {
            const buffBase:BuffBase = this._buffs[i];
            if (buffBase.config.buffType === config.buffType) {
                switch (buffBase.config.coverType) {
                    case BuffCoverType.COVER:
                        if (buffBase.config.priority < config.priority) {
                            this.removeBuff(buffBase);
                        }
                        break;
                    case BuffCoverType.TIME_COVER:
                        buffBase.onBuffTimeCover(config, args);
                        return;
                    case BuffCoverType.TIME_ADD:
                        buffBase.onBuffTimeAdd(config, args);
                        return;
                    case BuffCoverType.EXCLUDE:
                        return
                }
            }
        }
        return true;
    }

    
}
