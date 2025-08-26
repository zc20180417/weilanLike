import { PropertyId } from "../common/AllEnum";
import { CooperateBrushConfig, CooperateMissionMainConfig, GameCommonConfig, HeroConfig, MissionBrushConfig, MissionDropConfig, MissionMainConfig, MonsterBoxConfig, PassiveSkillConfig, PropertyConfig, PvpBrushConfig } from "../common/ConfigInterface";
import { EResPath } from "../common/EResPath";
import Debug, { TAG } from "../debug";
import ObjectProperty from "../ld/prop/ObjectProperty";
import ObjectPropertyMini from "../ld/prop/ObjectPropertyMini";
import Creature from "../logic/sceneObjs/Creature";
import SceneObject from "../logic/sceneObjs/SceneObject";
import ResManager from "./res/ResManager";


export default class GameConfigManager {

    private _gameCommonConfigs:Record<string , GameCommonConfig> = null;
    private _missionMainConfigs:Record<string , MissionMainConfig> = null;
    private _missionBrushConfigs:Record<string , MissionBrushConfig> = null;
    private _monsterBoxConfigs: Record<string, MonsterBoxConfig> = null;
    private _missionBrushCfgDic:Record<string , MissionBrushConfig[]> = null;
    private _missionDropCfgDic:Record<string , MissionDropConfig> = null;
    private _heroConfigs:Record<string , HeroConfig> = null;

    private _pvpMainConfigs:Record<string , MissionMainConfig> = null;
    
    private _pvpBrushConfigs:Record<string , PvpBrushConfig> = null;
    private _pvpBrushCfgDic:Record<string , MissionBrushConfig[]> = null;
    
    private _cooperateMainConfigs:Record<string , CooperateMissionMainConfig> = null;
    private _cooperateBrushConfigs:Record<string , CooperateBrushConfig> = null;
    private _cooperateBrushCfgDic:Record<string , CooperateBrushConfig[]> = null;
    private _passiveSkillCfgs:Record<string , PassiveSkillConfig> = null;

    private _maxCooperateWarId: number = 0;
    private _maxWarId: number = 0;
    private _configBase: any = null;
    //属性配置
    private _propertyCfgs: Record<number, PropertyConfig> = null; 
    
    getCfg(resName: string): any {
        return this._configBase[resName];
    }

    public constructor() {
        this._configBase = ResManager.instance.getCfg(EResPath.CFG);
        this._propertyCfgs = this.getCfg(EResPath.PROPERTY_CFG);
        this._gameCommonConfigs = this.getCfg(EResPath.GAME_COMMON);
        this._missionMainConfigs = this.getCfg(EResPath.MISSION_MAIN);
        this._missionBrushConfigs = this.getCfg(EResPath.MISSION_BRUSH);
        this._pvpBrushConfigs = this.getCfg(EResPath.PVP_BRUSH);
        this._monsterBoxConfigs = this.getCfg(EResPath.MONSTER_BOX);
        this._missionDropCfgDic = this.getCfg(EResPath.MONSTER_DROP);
        this._pvpMainConfigs = this.getCfg(EResPath.PVP_MAIN);
        this._heroConfigs = this.getCfg(EResPath.HERO);
        this._cooperateMainConfigs = this.getCfg(EResPath.COOPERATE_MAIN);
        this._cooperateBrushConfigs = this.getCfg(EResPath.COOPERATE_BRUSH);
        this._passiveSkillCfgs = this.getCfg(EResPath.PASSIVE_SKILL);
        this.initMissionBrushCfgDic();
    }

    public getGameCommonConfig(key:string) {
        return this._gameCommonConfigs[key];
    }

    public getHeroConfig(id: number):HeroConfig {
        return this._heroConfigs[id];
    }

    public getPassiveSkillConfig(id: number):PassiveSkillConfig {
        return this._passiveSkillCfgs[id];
    }

    //////////////////////////////////////////

    public getMissionMainConfig(id: number) {
        return this._missionMainConfigs[id];
    }

    public getPvpMainConfig(nowTime:number) {
        let date:Date = new Date(nowTime);
        let day = date.getDay();
        return this._pvpMainConfigs[day] || this._pvpMainConfigs[1];
    }

    public getCooperateMainConfig(id: number) {
        if (id > this._maxCooperateWarId) {
            id = this._maxCooperateWarId;
        }
        return this._cooperateMainConfigs[id];
    }

    public getMissionDropConfig(id: number) {
        return this._missionDropCfgDic[id];
    }

    /**
     * @param warId 战争ID
     * @returns 刷怪表，如果战争ID不存在于配置字典中，则返回undefined
     */
    public getMissionBrushList(warId: number) {
        return this._missionBrushCfgDic[warId];
    }

    public getMonsterBoxConfig(id: number) {
        return this._monsterBoxConfigs[id];
    }


    public getPvpBrushList(warId:number) {
        return this._pvpBrushCfgDic[warId]
    }

    public getCooperateBrushList(warId:number) {
        return this._cooperateBrushCfgDic[warId]
    }

    /**
     * 创建全属性
     * @param owner 
     * @returns 
     */
    public createPropertys(owner?: SceneObject) {
        let propertys: Record<number, ObjectProperty> = {};
        let config: PropertyConfig = null;
        for (let id in this._propertyCfgs) {
            config = this._propertyCfgs[id];
            if (config.nparentattrid) {
                if (propertys[config.nparentattrid]) {
                    propertys[id] = propertys[config.nparentattrid];
                } else {
                    propertys[config.nparentattrid] = new ObjectProperty(config.nparentattrid, owner);
                    propertys[id] = propertys[config.nparentattrid];
                }
            } else if (!propertys[id]) {
                propertys[id] = new ObjectProperty(config.id, owner);
                if (config.btwanratio) {
                    propertys[id].isRatio = true;
                }
            }
        }
        return propertys;
    }

    //战斗基础属性
    private _baseBattleProps:number[] = [
        PropertyId.ATTACK,
        PropertyId.HP,
        PropertyId.MAX_HP,
        PropertyId.SPEED,
        PropertyId.CRI_RATE,
        PropertyId.CRI_DAMAGE,
        PropertyId.DEEPENING_DAMAGE,
    ]

    public createBattlePropertys(owner: Creature) {
        let propertys: ObjectPropertyMini[] = [];
        let config: PropertyConfig = null;

        this._baseBattleProps.forEach(element => {
            config = this._propertyCfgs[element];
            this.createBattleProperty(owner , propertys , element);
        });
        return propertys;
    }

    public createBattleProperty(owner:Creature , propertys: ObjectPropertyMini[] , propId:number) {
        let config = this._propertyCfgs[propId];
        if (!config) {
            Debug.warnId(TAG.GAME_CONFIG, 200, propId);
            return null;
        }
        if (config.nparentattrid) {
            if (propertys[config.nparentattrid]) {
                propertys[propId] = propertys[config.nparentattrid];
            } else {
                propertys[config.nparentattrid] = new ObjectPropertyMini(config.nparentattrid, owner);
                propertys[propId] = propertys[config.nparentattrid];
            }
        } else if (!propertys[propId]) {
            propertys[propId] = new ObjectPropertyMini(config.id, owner);
            if (config.btwanratio) {
                propertys[propId].isRatio = true;
            }
        }

        return propertys[propId];
    }

    public getPropertyConfig(id: number) {
        let result = this._propertyCfgs[id];
        if (!result) {
            Debug.warnId(TAG.GAME_CONFIG, 200, id);
        }
        return result;
    }

    public getPropertyName(id: number) {
        let result = this.getPropertyConfig(id);
        return result ? result.name : "";
    }

    public getPropertyConfigs() {
        return this._propertyCfgs;
    }

    public getMaxWarId() { 
        return this._maxWarId;
    }

    private initMissionBrushCfgDic() {
        for (let key in this._missionMainConfigs) {
            let cfg = this._missionMainConfigs[key];
            if (cfg.nwarid > this._maxWarId) {
                this._maxWarId = cfg.nwarid;
            }
        }


        this._missionBrushCfgDic = {};
        for (let key in this._missionBrushConfigs) {
            let cfg = this._missionBrushConfigs[key];
            if (!this._missionBrushCfgDic[cfg.warId]) {
                this._missionBrushCfgDic[cfg.warId] = [];
            }
            this._missionBrushCfgDic[cfg.warId].push(cfg);
        }

        this._pvpBrushCfgDic = {};
        for (let key in this._pvpBrushConfigs) {
            let cfg = this._pvpBrushConfigs[key];
            if (!this._pvpBrushCfgDic[cfg.warId]) {
                this._pvpBrushCfgDic[cfg.warId] = [];
            }
            this._pvpBrushCfgDic[cfg.warId].push(cfg);
        }

        this._maxCooperateWarId = 0;
        for (let key in this._cooperateMainConfigs) {
            let cfg = this._cooperateMainConfigs[key];
            if (cfg.nwarid > this._maxCooperateWarId) {
                this._maxCooperateWarId = cfg.nwarid;
            }
        }

        this._cooperateBrushCfgDic = {};
        for (let key in this._cooperateBrushConfigs) {
            let cfg = this._cooperateBrushConfigs[key];
            if (!this._cooperateBrushCfgDic[cfg.warId]) {
                this._cooperateBrushCfgDic[cfg.warId] = [];
            }
            this._cooperateBrushCfgDic[cfg.warId].push(cfg);
        }

    }

    
}
