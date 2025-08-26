
import { ECamp, StrengthSkillType } from "../../../common/AllEnum";
import { SkillBuffConfig } from "../../../common/ConfigInterface";
import { EventEnum } from "../../../common/EventEnum";
import SysMgr from "../../../common/SysMgr";
import Game from "../../../Game";
import GlobalVal from "../../../GlobalVal";
import { EComponentType } from "../../../logic/comps/AllComp";
import SoBindEffectComp from "../../../logic/comps/animation/SoBindEffectComp";
import { RecyclableObj } from "../../../logic/Recyclable/RecyclableObj";
import Creature from "../../../logic/sceneObjs/Creature";
import { Monster } from "../../../logic/sceneObjs/Monster";
import SceneObject from "../../../logic/sceneObjs/SceneObject";
import { Handler } from "../../../utils/Handler";
import { StringUtils } from "../../../utils/StringUtils";
import BuffContainerComp from "./BuffContainerComp";

/**
 * buff基类
 */
export default class BuffBase extends RecyclableObj {
    private _container: BuffContainerComp = null;
    public get container(): BuffContainerComp {
        return this._container;
    }
    public set container(value: BuffContainerComp) {
        this._container = value;
    }

    /**
     * buff 配置
     */
    protected _config: SkillBuffConfig;
    public get config(): SkillBuffConfig {
        return this._config;
    }
    public set config(value: SkillBuffConfig) {
        this._config = value;
    }

    /**
     * buff参数
     */
    private _args: any[] = null;
    get args(): any[] {
        return this._args;
    }
    set args(value: any[]) {
        this._args = value;
    }

    
    /**
     * buff 被施加者
     */
    private _receiver: Creature = null;
    public get receiver(): Creature {
        return this._receiver;
    }
    public set receiver(value: Creature) {
        this._receiver = value;
    }

    private _isEnd: boolean = false;
    get isEnd(): boolean {
        return this._isEnd;
    }
    set isEnd(value: boolean) {
        this._isEnd = value;
    }

    private _damageValue:number = 0;

    
    public get damageValue() : number {
        return this._damageValue;
    }

    public set damageValue(value:number)  {
        this._damageValue = value;
    }

    private _skillUid:number = 0;
    get skillUid(): number {
        return this._skillUid;
    }
    set skillUid(value: number) {
        this._skillUid = value;
    }

    protected _effect: SceneObject = null;
    protected _repeats: number = 0;
    private _endTime: number = 0;
    private _hitTime: number = 0;

    get endTime(): number {
        return this._endTime;
    }

    set endTime(value: number) {
        this._endTime = value;
    }
    /** 
     * buff 激活
     */
    onBuffAwake() {
        this._isEnd = false;
        this.checkCreateBuffEffect();
        this.removeEndTimer();
        const time = this.getBuffTime();
        this.endTime = GlobalVal.now + time;
        if (time > 0) {
            SysMgr.instance.doOnce(Handler.create(this.endTriggerHandler , this), time);
        }
        this._hitTime = 0;
        if (this.config.hitInterval > 0 && this.config.damageCoefficient > 0) {
            SysMgr.instance.doLoop(Handler.create(this.onHitTimer , this), this.config.hitInterval , 0);
        }
        this.onBuffEffect();
    }

    /**
     * 时间叠加
     * @param config 
     * @param args 
     */
    onBuffTimeAdd(config: SkillBuffConfig, ...args: any[]) {
        this.removeEndTimer();
        // console.log('buff time add , pre endTime' , this._endTime , 'new end time' , this._endTime  + config.time);
        const time = this.getBuffTime();
        this.endTime = this._endTime  + time;
        const dy = this._endTime - GlobalVal.now + time;
        SysMgr.instance.doOnce(Handler.create(this.endTriggerHandler , this), dy);
    }


    /**
     * 时间覆盖
     * @param config 
     * @param args 
     */
    onBuffTimeCover(config: SkillBuffConfig, ...args: any[]) {
        this.removeEndTimer();
        // console.log('buff time cover , pre endTime' , this._endTime , 'new end time' , this.receiver.timer.now + config.time);
        const time = this.getBuffTime();
        this.endTime = GlobalVal.now + time;
        SysMgr.instance.doOnce(Handler.create(this.endTriggerHandler , this), time);
    }

    protected getBuffTime():number {
        let strengthBuffTimeRate:number = 0;
        const releaseSkillData = Game.ldSkillMgr.getReleaseSkillData(this._skillUid);
        if (releaseSkillData) {
            const heroBuild = Game.ldNormalGameCtrl.getHeroBuildingCtrl(releaseSkillData.campId).getHeroBuilding(releaseSkillData.heroId);
            if (heroBuild) {
                const skillMainId =   releaseSkillData.skill['skillMainID'] || releaseSkillData.skill.skillID;
                strengthBuffTimeRate = heroBuild.getCommonStrengthPropValue(skillMainId  , StrengthSkillType.SKILL_BUFF_TIME_ADD , releaseSkillData.heroUid);
            }
        }

        return this._config.buffTime * ( 1 + strengthBuffTimeRate * 0.0001);
    }

    /**
     * buff 生效
     */
    onBuffEffect() {

    }

    /**
     * buff 被移除
     */
    onBuffRemove() {
        if (this._effect) {
            this._effect.off(EventEnum.ON_SELF_REMOVE , this.onEffectRemove , this);
            this._effect.dispose();
            this._effect = null;
        }
        this.removeEndTimer();
        this.removeHitTimer();
        this.dispose();
    }

    protected endTriggerHandler() {
        // console.log(this.receiver.timer.now, this._endTime , 'buff 结束');
        this.container.removeBuff(this);
    }

    unRecycle() {
        this._container = null;
        this._config = null;
        this._receiver = null;
        this._args = null;
        this._repeats = 0;
    }

    private checkCreateBuffEffect() {
        if (!StringUtils.isNilOrEmpty(this._config.buffEffect) && !this._effect) {
            let owner = this.container.owner as Creature;
            let comp:SoBindEffectComp = owner.getAddComponent(EComponentType.SO_BIND_EFFECT) as SoBindEffectComp;
            this._effect = comp.playEffect(this._config.buffEffect , true);
            this._effect.once(EventEnum.ON_SELF_REMOVE , this.onEffectRemove , this);
        } 
    }

    private onEffectRemove(so:SceneObject) {
        if (so && this._effect == so) {
            this._effect = null;
        }
    }

    protected onHitTimer() {
        const damageValue = this._damageValue * this._config.damageCoefficient * 0.0001;
        Game.ldSkillMgr.hitOnBuff(this.receiver as Monster , damageValue , this._skillUid , this._config);
    }

    protected removeEndTimer() {
        SysMgr.instance.clearTimer(Handler.create(this.endTriggerHandler, this));
    }
    protected removeHitTimer() {
        SysMgr.instance.clearTimer(Handler.create(this.onHitTimer, this));
    }

    
}