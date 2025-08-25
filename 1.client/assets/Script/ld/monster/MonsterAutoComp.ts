
import { CreatureState, ECamp, ETargetType, GAME_TYPE } from "../../common/AllEnum";
import { MonsterConfig } from "../../common/ConfigInterface";
import { EventEnum } from "../../common/EventEnum";
import Debug, { TAG } from "../../debug";
import Game from "../../Game";
import GlobalVal from "../../GlobalVal";
import { EActType } from "../../logic/actMach/ActMach";
import { EFrameCompPriority, EComponentType } from "../../logic/comps/AllComp";
import { FrameComponent } from "../../logic/comps/FrameComponent";
import Creature from "../../logic/sceneObjs/Creature";
import { Monster } from "../../logic/sceneObjs/Monster";
import { GameEvent } from "../../utils/GameEvent";

import { Rect, MathUtils } from "../../utils/MathUtils";
import { Pos } from "../Pos";
import { LDSkillBase } from "../skill/LdSkillManager";
import { PassiveSkillBase } from "../skill/passive/PassiveSkillBase";
import { PassiveSkillUtil } from "../skill/passive/PassiveSkillUtil";
import { HeroTable } from "../tower/HeroTable";
import MonsterMoveComp from "./MonsterMoveComp";

export default class MonsterAutoComp extends FrameComponent {
    protected _target:any;
    protected _self:Monster;

    protected _rect:Rect;
    protected _skillList:LDSkillBase[] = [];
    protected _curSkill:LDSkillBase;


    protected _range:number = 0;
    protected _rangeToCityWall:number = 0;
    protected _cfg:MonsterConfig = null;
    protected _coolcdDic:any = {};
    protected _skillLen:number = 0;
    private _moveComp:MonsterMoveComp;
    // protected _attackdirect:number = 0;
    private _tauntUid:number = 0;
    private _tauntTarget:Monster;
    private _passiveSkills:PassiveSkillBase[] = [];


    constructor() {
        super();
        this.frameRate = 2;
        this.priority = EFrameCompPriority.AUTO_ATTACK;
        this.compType = EComponentType.LD_MONSTER_AUTO;
    }

    added() {
        super.added();
        this._target = null;
        this._self = this.owner as Monster;
        this._cfg = this._self.cfg;

        const skill:LDSkillBase = Game.ldSkillMgr.getSkillCfg(this._cfg.skillId);
        if (skill) {
            this._skillList = [skill];
        }
        this._skillLen = this._skillList.length;
        for (let i = 0 ; i < this._skillLen ; i++) {
            let temp = this._skillList[i];
            this._range = temp.range;
            this._rangeToCityWall = temp.rangeToCityWall;
            // this.insertCd(temp);
        }
        GameEvent.on(EventEnum.CREATE_HERO_TABLE  , this.onCreateHeroTable , this);
        GameEvent.on(EventEnum.LD_SOMMON_BE_BORN  , this.onSommonBeBorn , this);
        this._moveComp = this._self.getAddComponent(EComponentType.MONSTER_MOVE) as MonsterMoveComp;
        const path:Pos[] = Game.curLdGameCtrl.findMovePath(this._self.x , this._self.y , this._self.halfSize.width , this._self.camp);
        this._moveComp.setMovePath(path);
        this._self.on(EventEnum.LD_TAUNT_BUFF , this.onTaunt , this);
        this.addPassiverSkill();
    
    }

    private addPassiverSkill() {
        let cfg = this._self.cfg;
        if (cfg && cfg.passiverSkillIDs.length > 0) {
            cfg.passiverSkillIDs.forEach(element => {
                //被动技能
                const skillCfg = Game.gameConfigMgr.getPassiveSkillConfig(element);
                if (skillCfg) {
                    const passiveSkill = PassiveSkillUtil.createSkill(skillCfg.passiveType);
                    if (passiveSkill) {
                        passiveSkill.setData(this._self , skillCfg);
                        passiveSkill.onAdd();
                        this._passiveSkills.push(passiveSkill);

                    }
                }
            });
        }

    }

    private onTaunt(uid:number) {
        this._tauntUid = uid;
        if (uid > 0) {
            this._tauntTarget = Game.soMgr.getSommonByGuid(uid );
            if (this._tauntTarget) {
                this._tauntTarget.once(EventEnum.ON_SELF_REMOVE , this.onTauntTargetRemove , this);
            }
        } else if (this._tauntTarget) {
            this._tauntTarget.off(EventEnum.ON_SELF_REMOVE , this.onTauntTargetRemove , this);
            this._tauntTarget = null;
        }
        this._breakMove = true;
    }

    private onTauntTargetRemove(target:Monster) {
        if (this._tauntTarget === target) {
            this._tauntTarget = null;
        }
    }


    removed() {
        if (this._passiveSkills.length > 0) {
            this._passiveSkills.forEach(element => {
                element.onRemove();
            });
            this._passiveSkills = [];
        }
        
        GameEvent.off(EventEnum.LD_SOMMON_BE_BORN  , this.onSommonBeBorn , this);
        GameEvent.off(EventEnum.CREATE_HERO_TABLE  , this.onCreateHeroTable , this);
        this._self.off(EventEnum.LD_TAUNT_BUFF , this.onTaunt , this);
        if (this._tauntTarget) {
            this._tauntTarget.off(EventEnum.ON_SELF_REMOVE , this.onTauntTargetRemove , this);
            this._tauntTarget = null;

        }
        this._skillList = [];
        super.removed();
    }

    private onSommonBeBorn(obj:Monster) {
        if (obj.camp !== this._self.camp) return;
        const sommonGx = Game.curLdGameCtrl.getGridX(obj.x);
        const sommonGy = Game.curLdGameCtrl.getGridY(obj.y , this._self.camp);
        this.tryDefeat(sommonGx , sommonGy);
    }

    private tryDefeat(gx:number , gy:number) {
        const curGx = Game.curLdGameCtrl.getGridX(this._self.x);
        const curGy = Game.curLdGameCtrl.getGridY(this._self.y , this._self.camp);
        if (gx === curGx && gy === curGy) {
            //向上挤压
            const dy = this._self.camp == ECamp.RED ? -1 : 1;
            const toy = Game.curLdGameCtrl.getGridTop(curGy , this._self.camp) + 5 * dy;
            const dis = toy - this._self.y;
            this._self.changeTo(EActType.DEFEAT , {time: 600 , dis:dis , toy:toy});
            return true;
        } 
        return false;
    }


    private onCreateHeroTable(gx:number , gy:number , campId:ECamp) {
        if (Game.curLdGameCtrl.getGameType() == GAME_TYPE.COOPERATE ||  campId !== this._self.camp) return;
        if (!this.tryDefeat(gx , gy) && this._self.isInAct(EActType.MOVE)) {
            //如果在移动过程中并且创建的塔正好在移动路径上，则下一帧重新寻路
            const nowGx = Game.curLdGameCtrl.getGridX(this._self.x);
            const endGx = this._moveComp.getEndGx();
            const min = Math.min(endGx , nowGx);
            const max = Math.max(endGx , nowGx);
            if (gx >= min && gx <= max) {
                this._breakMove = true;
            }
        }
    }



    giveUp() {
        this._skillList = null;
        this._target = null;
    }

    
    resetData() {
        this._skillList = [];
        this._target = null;
        this._rect = null;
        this._curSkill = null;
    }

    getTarget():Creature {
        return this._target;
    }


    getRange():number {
        return this._range;
    }

    resetTarget(target:any) {
        this.setTarget(target);
    }

    realReleaseSkill(skill:LDSkillBase) {
        
    }

    private _breakMove:boolean = false;

    update() {
        //在攻击状态
        const inTaunt = this._self.inState(CreatureState.TAUNT);
        if (!this._self.isInAct(EActType.MOVE) && !this._self.isInAct(EActType.IDLE)) {
            this._breakMove = true;
            return;
        }
        if (this._self.inState(CreatureState.DONT_MOVE)) return;       
        if (inTaunt) {
            //嘲讽状态
            this._target = this._tauntTarget;
            if (this._target && !this._target.isDied) {
                this.faceToTarget(this._tauntTarget);
                const dis = MathUtils.getDistance(this._self.x , this._self.y , this._target.x , this._target.y);
                if (dis > this._range) {
                    //移动至目标位置
                    this.tryMoveToTarget(this._target.x , this._target.y);
                    return;
                } else {
                    this._self.changeTo(EActType.IDLE);
                }
            } else if (!this._self.isInAct(EActType.IDLE)) {
                this._self.changeTo(EActType.IDLE);
                return;
            }
        } else {
            //
            this._target =  this._moveComp.getEndTarget();
            const mirror = this._target.camp == ECamp.RED ? -1 : 1;
            const dis = Math.abs(this._self.y - (this._target.rect.y + this._target.rect.height * mirror));
            // console.log("dis" , dis);
            if (dis > this._rangeToCityWall) {
                this._moveComp.goon(this._breakMove);
                this._breakMove = false;
                return;
            } 
        }

        if (this._self.inState(CreatureState.SPRINT)) {
            this._self.emit(EventEnum.LD_SPRINIT_CW , this._target);

            return;
        }


        //在cd状态
        if (!this._curSkill) {
            this._curSkill = this.getSkill();
        }

        if (!this._curSkill || !this._target) return;
        this.tryRelease();
    }

    private tryMoveToTarget(tox:number , toy:number) {
        if (Game.curLdGameCtrl.checkHaveBlock(this._self.x , this._self.y , tox , toy , this._self.camp)) {
            this._self.changeTo(EActType.IDLE);
            return;
        }
        this._moveComp.moveToTargetPos(this._target.x , this._target.y);
    }

    private faceToTarget(target:Creature) {
        if (target) {
            this._self.scaleX = this._self.x < target.x ? 1 : -1;
        }
    }

    protected tryRelease() {
        if (!this._target) return;
        this._range = this._curSkill.range;
        if (this._curSkill.targetType == ETargetType.ENEMY) {
            this.releaseTargetSkill(this._curSkill , this._target as HeroTable);
        } else {
            this.releaseTargetSkill(this._curSkill , null);
        }   
    }

    tryInsertCd(skill:LDSkillBase) {
        this.insertCd(skill);

    }
    
    protected endAttackAction() {
        let action = this._self.getCurAction();
        action.end();
    }


    protected releaseTargetSkill(skill:LDSkillBase , target:HeroTable | Monster = null) {
        this.tryInsertCd(skill);
        Game.ldSkillMgr.monsterReleaseSkill(this._self , target , this._curSkill);
        this._curSkill = null;
    }



    protected checkNeedAttack(target:Monster):boolean {
        if (target.isDied || !target.isValid || !this.checkDis(target)) {
            return false;
        }
        return true;
    }

    protected setTarget(target:any) {
        if (this._target != target) {
            this._target = target;
        }
    }

    protected checkDis(target:Creature):boolean {
        let dis = MathUtils.p2RectDis(target.rect, this._self.pos);
        return dis <= this._range;
    }

    protected insertCd(skill:LDSkillBase) {
        const cd = skill.cd;
        this._coolcdDic[skill.skillID] = { start: GlobalVal.now , baseCd:cd , end: GlobalVal.now + cd }; 
    }

    protected getSkill():LDSkillBase {
        if (!this._skillList || this._skillList.length == 0) return null;
        let index = 0;
        

        for (let i = index ; i < this._skillLen ; i++) {
            if (!this.inCd(this._skillList[i].skillID)) {
                return this._skillList[i];
            }
        }
        return null;
    }

    protected inCd(id:number):boolean {
        if (!this._coolcdDic[id] || GlobalVal.now >= this._coolcdDic[id].end) {
            if (this._coolcdDic[id]) {
                this._coolcdDic[id] = null;
                delete this._coolcdDic[id];
            }
            return false;
        }
        return true;
    }


}