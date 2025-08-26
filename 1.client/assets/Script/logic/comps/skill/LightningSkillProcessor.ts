import { ECamp, StrengthSkillType } from "../../../common/AllEnum";
import { EventEnum } from "../../../common/EventEnum";
import SysMgr from "../../../common/SysMgr";
import Game from "../../../Game";
import GlobalVal from "../../../GlobalVal";
import { BaseSkillProcessor } from "../../../ld/skill/BaseSkillProcessor";
import { ReleaseSkillData } from "../../../ld/skill/LdSkillManager";
import LdLightningComp from "../../../ld/skill/skillComps/LdLightningComp";


import { GameEvent } from "../../../utils/GameEvent";

import { Handler } from "../../../utils/Handler";
import { MathUtils, Rect } from "../../../utils/MathUtils";
import { StringUtils } from "../../../utils/StringUtils";
import { ERecyclableType } from "../../Recyclable/ERecyclableType";
import Creature from "../../sceneObjs/Creature";
import { Monster } from "../../sceneObjs/Monster";
import SceneObject from "../../sceneObjs/SceneObject";
import { EComponentType } from "../AllComp";


export class LightningSkillProcessor extends BaseSkillProcessor {


    /////////////////////////////////////////////////////////
    protected _damageValue:number;
    protected _skillUid:number;
    protected _deleteDamageRate:number = 0;
    protected _target:Creature;
    protected _hitMonsters:number[] = [];
    protected _effectList:SceneObject[] = [];
    protected _compList:LdLightningComp[];
    protected _eftBindData:any = {};
    protected _index:number = 0;
    protected _createHandler:Handler;
    protected _onHitTime:Handler;
    // protected _owner:Creature;
    protected _camp:ECamp;

    protected _rect:Rect;
    protected _hitIndex:number = 0;
    protected _endPos:cc.Vec2 = cc.Vec2.ZERO;
    protected _startX:number = 0;
    protected _startY:number = 0;
    protected _lastTriggerSkillId:number = 0;
    protected _heroId:number = 0;
    protected _newEft:string = '';
    constructor() {     
        super();        
        this.key = ERecyclableType.LIGATURE_PROCESSOR;
    }

    resetData() {
        if (this._createHandler) {
            SysMgr.instance.clearTimer(this._createHandler);
        }
        this._hitIndex = 0;
        this._index = 0;
        this._eftBindData = {};
        if (this._compList) {
            this._compList.length = 0;
        }
        this._hitMonsters.length = 0;
        this._deleteDamageRate = 0;
        this._effectList.length = 0;
        this._target = null;
        this._lastTriggerSkillId = 0;
        this._heroId = 0;
    }


    setData(releaseSkillData:ReleaseSkillData,target:Creature ,selectTarget:boolean = false ) {
        super.setData(releaseSkillData , target);
        this._startX = releaseSkillData.sx;
        this._startY = releaseSkillData.sy;
        this._skill = releaseSkillData.skill;
        this._target = target;
        this._compList = [];
        this._camp = releaseSkillData.campId;
        this._damageValue = releaseSkillData.baseDamage;
        this._skillUid = releaseSkillData.uid;
        this._heroId = releaseSkillData.heroId;
        this._newEft = this._heroBuilding.getNewEft(this._skillMainId);
        this._lastTriggerSkillId = this._heroBuilding.getLastHitTriggerSkillID(this._skillMainId);
        if (selectTarget) {
            this._target = this.trySelectTarget(releaseSkillData.sx , releaseSkillData.sy);
        }

        if (!this._target) {
            this.doSkillEnd();
            return;
        }
        this.createEffect(this._target );
        this._hitMonsters.push(this._target.id);
        GameEvent.on(EventEnum.EXIT_GAME_SCENE , this.onExitGameScene , this);
    }

    /**整体结束 */
    // doSkillEnd() {
    //     GameEvent.off(EventEnum.EXIT_GAME_SCENE , this.onExitGameScene , this);
    //     super.doSkillEnd();
    //     this.dispose();
    // }

    protected onExitGameScene() {
        
        this.doSkillEnd();
    }

    doSkillEnd() {
        this.removeEffect();
        super.doSkillEnd();
    }

    private removeEffect() {
        let len = this._effectList.length;
        for (let i = len - 1 ; i >= 0 ; i--) {
            this._effectList[i].off(EventEnum.ON_SELF_REMOVE , this.onEffectRemoved , this); 
        }
        this._effectList.length = 0;
    }

    /////////////////////////////////////////////////////////////

    protected onCreateTimer() {
        let comp = this._compList[this._index - 1];
        let endPos:cc.Vec2 = comp.getEndPos();
        let target = this.trySelectTarget(endPos.x , endPos.y);
        if (target) {
            this._hitMonsters.push(target.id);
            this.createEffect(target , comp.getEndPosHandler());
        } else {
            this.tryTriggerLastSkill();
        }

    }

    private tryTriggerLastSkill() {
        if (this._lastTriggerSkillId > 0 && this._compList && this._compList.length > 0) {
            let comp = this._compList[this._compList.length - 1];
            let endPos:cc.Vec2 = comp.getEndPos();
            Game.ldSkillMgr.onHitTriggerSkill(endPos.x , endPos.y ,this._lastTriggerSkillId , this._releaseSkillData  , 0 , this._damageValue);
        }
    }

    private trySelectTarget(x : number , y:number) {
        if (!this._rect) {
            this._rect = new Rect();
        }
        GlobalVal.tempVec2.x = x;
        GlobalVal.tempVec2.y = y;
        this._rect.init(x - this._skill.hitRangeValue1 , y - this._skill.hitRangeValue1 , this._skill.hitRangeValue1 * 2 , this._skill.hitRangeValue1 * 2);
        let allMonster:Monster[] = Game.soMgr.getRectMonsters(this._rect , this._camp);
        let targets:any[] = [];
        let len:number = allMonster.length;
        let monster:Monster;
        for (let i = 0 ; i < len ; i++) {
            monster = allMonster[i];
            if (this.checkMonster(monster)) {
                let dis = MathUtils.p2RectDis(monster.rect, GlobalVal.tempVec2);
                if (dis <= this._skill.hitRangeValue1 ) {
                    targets.push({c:monster , d:dis});
                }
            }
        }

        if (targets.length > 0) {
            targets.sort(this.sortMonster);
            return targets[0].c;
        }
    }

    protected checkMonster(monster:Monster):boolean {
        return this._hitMonsters.indexOf(monster.id) == -1;
    }

    protected onHitTimer() {
        let target;
        if (!this._compList) {
            const effect = this._effectList[this._hitIndex];
            target = this._eftBindData[effect.id][0];

        } else {
            let comp = this._compList[this._hitIndex];
            if (comp == null) {
                cc.log('LightningSkillProcessor onHitTimer error !!!!!!!!!!!');
                return;
            } 
            target = comp.getTarget();
        }
        
        if (target) {
            Game.ldSkillMgr.onHit(target  ,this._damageValue , this._skillUid );
        }
        this._hitIndex ++;
    }

    protected createEffect(endTarget:Creature , handler:Handler = null) {
        const eft = StringUtils.isNilOrEmpty(this._newEft) ? this._skill.releaseEffect : this._newEft;
        let startPos = handler ? handler.execute() : {x : this._startX , y : this._startY };
        let effect = Game.soMgr.createEffect(eft , startPos.x , startPos.y , true);
        effect.once(EventEnum.ON_SELF_REMOVE , this.onEffectRemoved , this);
        this._endPos.x = endTarget.centerPos.x;
        this._endPos.y = endTarget.centerPos.y;
        this._effectList.push(effect);
        const comp :LdLightningComp = effect.getAddComponent(EComponentType.LD_LIGHTNING);
        comp.setCamp(this._releaseSkillData.campId);
        this._eftBindData[effect.id] = [ endTarget , handler , this._index];
        comp.setTarget(endTarget , handler , this._skill.hitTime , this._endPos);
        this._compList.push(comp);
        this._index ++;
        this.tryTriggerNext();

        if (this._onHitTime == null) {
            this._onHitTime = new Handler(this.onHitTimer , this);
        }
        SysMgr.instance.doOnce(this._onHitTime , this._skill.hitInterval);
    }

    

    private tryTriggerNext() {
        const skillMainId = this._skill['skillMainID'] || this._skill.skillID;
        const count = this._skill.hitCount + this._heroBuilding.getCommonStrengthPropValue(skillMainId, StrengthSkillType.HIT_TARGET_COUNT , this._releaseSkillData.heroUid);
        if (count > this._index) {
            if (this._createHandler == null) {
                this._createHandler = new Handler(this.onCreateTimer , this);
            }
            SysMgr.instance.doOnce(this._createHandler ,this._skill.hitInterval);
        } else {
            this.tryTriggerLastSkill();
        }
    }


    protected onEffectRemoved(eft:SceneObject) {
        let index = this._effectList.indexOf(eft);
        if (index != -1) {
            let nextEft = this._effectList[index + 1];
            if (nextEft) {
                // let comp = nextEft.mainBody.getComponent(LightningComp);
                // comp.setGetPosHandler(null);

                const comp = nextEft.getAddComponent(EComponentType.LD_LIGHTNING);
                if (comp) {
                    comp.setGetPosHandler(null);
                }
            }

            this._effectList.splice(index , 1);
            if (this._effectList.length == 0) {
                this.doSkillEnd();
            }
        }
    }

    protected sortMonster(a:any , b:any):number {
        if (a.c.inventedBlood <= 0 && b.c.inventedBlood > 0) {
            return 1;
        }

        if (a.c.inventedBlood > 0 && b.c.inventedBlood <= 0) {
            return -1;
        }

        return a.d - b.d;
    }

}