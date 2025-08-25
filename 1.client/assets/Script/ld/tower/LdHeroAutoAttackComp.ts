import { ECamp, GAME_TYPE, PropertyId } from "../../common/AllEnum";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import GlobalVal from "../../GlobalVal";
import { EActType } from "../../logic/actMach/ActMach";
import { EFrameCompPriority, EComponentType } from "../../logic/comps/AllComp";
import { FrameComponent } from "../../logic/comps/FrameComponent";
import { ERecyclableType } from "../../logic/Recyclable/ERecyclableType";
import Creature from "../../logic/sceneObjs/Creature";
import { Monster } from "../../logic/sceneObjs/Monster";
import { Tower } from "../../logic/sceneObjs/Tower";
import { GS_TroopsInfo_TroopsInfoItem } from "../../net/proto/DMSG_Plaza_Sub_Troops";
import { SKILLTYPE } from "../../net/socket/handler/MessageEnum";
import { GameEvent } from "../../utils/GameEvent";
import { Rect, MathUtils } from "../../utils/MathUtils";
import { LdPvpGameCtrl } from "../LdPvpGameCtrl";
import { NormalGameCtrl } from "../NormalGameCtrl";
import { LDSkillBase } from "../skill/LdSkillManager";
import { HeroBuilding } from "./HeroBuilding";



export default class LdHeroAutoAttackComp extends FrameComponent {

    protected _target:any;
    protected _self:Tower;

    protected _rect:Rect;
    // protected _sortTargetFunc:Function;
    protected _curSkill:LDSkillBase;
    protected _toAngle:number = 0;
    protected _cdRate:number = 1;
    protected _isLightning:boolean = false;
    protected _range:number = 0;
    protected _cfg:GS_TroopsInfo_TroopsInfoItem = null;
    protected _coolcdDic:any = {};
    protected _attackdirect:number = 0;
    protected _preSkillid:number = 0; 
    protected _shootCount:number = 0;
    protected _heroBuilding:HeroBuilding = null;
    private _isLeadingRole:boolean = false;

    constructor() {
        super();
        this.frameRate = 2;
        this.priority = EFrameCompPriority.AUTO_ATTACK;
        this.compType = EComponentType.LD_HERO_AUTO;
        this.key = ERecyclableType.LD_HERO_AUTO;

    }

    set isLeadingRole(value:boolean) {
        this._isLeadingRole = value;
    }

    added() {
        super.added();
        this._target = null;
        this._self = this.owner as Tower;
        this._cfg = this._self.cfg;
        this._isLightning = false;
        this._isLeadingRole = false;
        this.onLevelChange();
        // this.insertCd(this._curSkill);
        this._self.on(EventEnum.LEVEL_CHANGE , this.onLevelChange , this); 
        this._self.on(EventEnum.HERO_POS_INIT , this.refreshRect , this); 
        this._self.on(EventEnum.STATUS_USERSKILL , this.onBuffTriggerSkill , this); 
        this._self.on(EventEnum.LD_ADD_SHOOT_TIMES , this.onAddShootCount , this); 
        GameEvent.on(EventEnum.LD_STRENGTH_SKILL_CHANGE , this.onStrengthenSkill , this); 
    }

    removed() {
        if (this._target) {
            this.onTargetRemove(this._target);
        }
        this._self.off(EventEnum.HERO_POS_INIT , this.refreshRect , this); 
        this._self.off(EventEnum.LEVEL_CHANGE , this.onLevelChange , this); 
        this._self.off(EventEnum.STATUS_USERSKILL , this.onBuffTriggerSkill , this); 
        this._self.off(EventEnum.LD_ADD_SHOOT_TIMES , this.onAddShootCount , this); 
        GameEvent.off(EventEnum.LD_STRENGTH_SKILL_CHANGE , this.onStrengthenSkill , this); 
        super.removed();
    }

    giveUp() {
        this._curSkill = null;
        this._target = null;
    }



    refreshRect() {
        this.initRangeRact();
    }

    resetData() {
        this.onTargetRemove();
        this._cdRate = 1;
        this._range = 0;
        this._curSkill = null;
        this._target = null;
        this._rect = null;
        this._isLightning = false;
    }

    getTarget():Creature {
        return this._target;
    }


    /**
     * 获取射击的次数
     */
    getShootCount(): number {
        return this._shootCount;
    }

    getRange():number {
        return this._range;
    }


    update() {
        //在攻击状态
        if (this._self.isInAct(EActType.ATTACK) || !this._curSkill ) return;
        if (this._curSkill.skillType == SKILLTYPE.SKILLTYPE_SUMMON && this._self.sommonUid > 0) return;
        //在cd状态
        if (this.inCd(this._curSkill.skillID)) return;
        
        this.checkTarget();
        if (this._target) {
            this.releaseTargetSkill(this._curSkill);
        }
    }



    tryInsertCd(skill:LDSkillBase) {
        this.insertCd(skill);
    }

    unRegisterUpdate() {
        super.unRegisterUpdate();

    }

    private onBuffTriggerSkill(skillid:number) {
        
    }

    protected refreshLigature():boolean {
        let inAttack = this._self.isInAct(EActType.ATTACK);

        if (inAttack) {
            let globalTarget = this.getGlobalTarget();
            if (globalTarget && globalTarget != this._target && this.checkNeedAttack(globalTarget)) {
                this.endAttackAction();
                return true;
            }

            if (this._target && this.checkNeedAttack(this._target)) {
                return false;
            }
    
            this.endAttackAction();
        }
        return true;
    }

    protected endAttackAction() {
        let action = this._self.getCurAction();
        action.end();
    }

    protected onGlobalTargetSelect(target:any , camp?:ECamp) {
        if (this._target != target) {
            this.onTargetRemove(this._target)
        }
    }

    protected onGlobalTargetUnSelect(target:any) {
        if (this._target == target) {
            this.onTargetRemove(target)
        }
    }

    protected onStrengthenSkill(heroId:number , campId:ECamp = ECamp.BLUE) {
        if (this._self.cfg.ntroopsid == heroId && this._self.camp == campId) {
            Game.soMgr.createEffect("upgradeLevel", this._self.x, this._self.y, false);

        }
    }

    protected releaseTargetSkill(skill:LDSkillBase) {
        this.tryInsertCd(skill);
        let tx = this._target.x;
        let ty = this._target.y;

        if (skill.skillType == SKILLTYPE.SKILLTYPE_SUMMON) {
            if (Game.curLdGameCtrl.getGameType() == GAME_TYPE.COOPERATE) {
                const centerRoadLeftPos = Game.ldCooperateCtrl.getCenterRoadLeftPos();
                const centerRoadRightPos = Game.ldCooperateCtrl.getCenterRoadRightPos();

                let flag = false;
                if (tx < centerRoadLeftPos.x || tx > centerRoadRightPos.x) {
                    const topY = Game.ldCooperateCtrl.calcHitTopY(tx);
                    if (topY <= this._rect.yMax) {
                        ty = topY;
                        flag = true;
                    }
                }

                if (flag) {
                    ty = MathUtils.randomInt(this._rect.y + 5 , Math.min(ty , this._rect.yMax - 5));
                    tx = MathUtils.randomInt(centerRoadLeftPos.x , centerRoadRightPos.x);

                }

            } else {
                const gridX = Game.curLdGameCtrl.getGridX(tx);
                // const dy = this._self.camp == ECamp.RED ? -1 : 1;
                const minY = Game.curLdGameCtrl.getEmptyGridTopYByGx(gridX , this._self.camp);
                const maxY = this._self.camp == ECamp.RED ? Math.max(ty , this._rect.y) : Math.min(ty , this._rect.yMax);
                ty =  MathUtils.randomInt(Math.min(minY , maxY) , Math.max(minY , maxY)) ;
            }
        }

        if (this._isLeadingRole) {
            tx = this._self.x;
        }

        Game.ldSkillMgr.releaseSkill(this._self , this._target , tx , ty, skill);

        this._shootCount ++;
        this.tryTriggerShootSkill(tx , ty);

    }

    private onAddShootCount() {
        this._shootCount ++;
        this.tryTriggerShootSkill(0 , 0);
    }

    private tryTriggerShootSkill(tx:number , ty:number) {
        if (!this._heroBuilding) return;
        const skill = this._curSkill;
        const releaseTriggerSkillDatas = this._heroBuilding.getReleaseTriggerSkillList(skill.skillMainID || skill.skillID , this._self.id);
        if (releaseTriggerSkillDatas && releaseTriggerSkillDatas.length > 0) {
            const releaseTriggerSkillData = releaseTriggerSkillDatas[0];
            if (this._shootCount >= releaseTriggerSkillData.times) {
                const skillCfg = Game.ldSkillMgr.getSkillCfg(releaseTriggerSkillData.skillId);
                if (!skillCfg) return;
                const attack = this._self.prop.getPropertyValue(PropertyId.ATTACK);
                let releaseData = {
                    heroId: this._self.cfg.ntroopsid,                                                 //英雄ID
                    career:this._self.cfg.bttype || 0,                  //职业

                    heroUid:this._self.id,
                    crirate:this._self.prop.getPropertyValue(PropertyId.CRI_RATE),                    //暴击率
                    criDamage:this._self.prop.getPropertyValue(PropertyId.CRI_DAMAGE),                //暴击率
                    tx:tx,
                    ty:ty,
                    deepeningDamage:this._self.prop.getPropertyValue(PropertyId.DEEPENING_DAMAGE),                //伤害加深
                    campId:this._self.camp,
                }
                Game.ldSkillMgr.onHitTriggerSkill(this._self.x , this._self.y , releaseTriggerSkillData.skillId , releaseData, 0 , attack);
                this._shootCount = 0;
            }           
        }
    }

    protected checkRemove(target:Monster) {
        if (!this.checkNeedAttack(target)) {
            this.onTargetRemove(target);
        }
    }

    protected checkRemoveFormList(target:Monster) {
        if (!this.checkNeedAttack(target) || !this.checkAngle(target)) {
            this.onTargetRemove(target);
        }
    }

    protected checkNeedAttack(target:Monster):boolean {
        if (target.isDied || !target.isValid  || !this.checkDis(target)) {
            return false;
        }
        return true;
    }

    protected setTarget(target:any) {
        if (this._target != target) {
            this.onTargetRemove();
            if (target ) {
                target.once(EventEnum.ON_SELF_REMOVE , this.onTargetRemove2 , this);
            }
            this._target = target;
        }
    }

    protected onTargetRemove2(target:any) {
        this.onTargetRemove(target);
    }

    protected onTargetRemove(target?:Creature) {
        target = target || this._target;
        if (target && target.isValid) {
            target.off(EventEnum.ON_SELF_REMOVE , this.onTargetRemove2 , this);
        }
        if (this._target == target) {
            this._target = null;
        }
    }

    protected checkDis(target:Creature):boolean {
        let dis = MathUtils.p2RectDis(target.rect, this._self.pos);
        return dis <= this._range;
    }

    protected checkAngle(target:Creature):boolean {
        return true;
    }

    protected insertCd(skill:LDSkillBase) {
        let cd = skill.cd * this._cdRate;
        this._coolcdDic[skill.skillID] = { start: GlobalVal.now , baseCd:cd , end: GlobalVal.now + cd }; 
    }

    protected checkCanAutoAttack(monster:Monster) {
        if (!monster.cfg) return false;
        return this.checkDis(monster);
    }

    protected faceToTarget() {
        if (!this._self.animationComp || this._attackdirect == 0) {
            return;
        }
        if (!this._target) {
            return;
        }
        this.toTargetAngle();
    }

    protected checkTurnTarget(target:Creature) {

    }

    protected checkTarget() {
        if (!this._curSkill || !this._self.animationComp) {
            return;
        }
        this.checkOneTarget();
        if (!this._target) {
            return;
        }

        this.toTargetAngle();
    }

    protected toTargetAngle() {
        //旋转角度
        let targetPos = this._target.centerPos; 
        let angle = MathUtils.getAngle(this._self.x , this._self.y , targetPos.x , targetPos.y);
        this._self.animationComp.setAngle(angle);
    }

    protected checkOneTarget() {

        if (this._target && this._target.isDied) {
            cc.log("autoattack error ,target is died");
        }

        if (this._target) {
            this.checkRemove(this._target);
        } 

        if (!this._target) {
            const target = this._curSkill.rangeType == 0 ? 
                        Game.soMgr.findTarget(this._self.pos , this._range , this._curSkill.findTargetType, this._self.camp , null) : 
                        Game.soMgr.findTargetByRect(this._rect , this._curSkill.findTargetType, this._self.camp , null);

            this.setTarget(target);
        }
    }

   
    protected initRangeRact() {
        if (!this._rect) {
            this._rect = new Rect();
        }

        let range:number = this._range;
        if (this._curSkill.rangeType == 0) {
            this._rect.init(this._self.x - range , this._self.y - range , range * 2 , range * 2);
        } else {
            const rect = Game.curLdGameCtrl.getSelfArea();
            if (this._self.camp == ECamp.RED) {
                this._rect.init(rect.x , LdPvpGameCtrl.TOTAL_HEIGHT - range , rect.width , range);
            } else {

                this._rect.init(rect.x , rect.y , rect.width , range);
            }
        }

        // if (this._rect.x != this._self.x - this._range) {
        //     this._rect.init(this._self.x - this._range , this._self.y - this._range , this._range * 2 , this._range * 2);
        // }
    }

    protected getSkill():LDSkillBase {
        if (!this._curSkill || this.inCd(this._curSkill.skillID)) return null;
        return this._curSkill;
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

    protected sortEndPos(a:Monster , b:Monster):number {
        return a.endDis - b.endDis;
    }

    protected onLevelChange() {
        this._curSkill = Game.ldSkillMgr.getSkillCfg(this._self.cfg.ntroopsid * 10 + this._self.level);
        this._heroBuilding = Game.curLdGameCtrl.getHeroBuildingCtrl(this._self.camp).getHeroBuilding(this._self.cfg.ntroopsid);
        this._isLightning = this._curSkill.skillType == SKILLTYPE.SKILLTYPE_LIGHTNING;
        this._range = this._curSkill.range;
    }

    getDefaultSkill():LDSkillBase {
        return this._curSkill;
    }


    protected getAngle(target:Creature):number {
        if (target && target.isValid) {
            let targetPos = target.centerPos; 
            return MathUtils.getAngle(this._self.x , this._self.y , targetPos.x , targetPos.y);
        }
        return this._toAngle;
    }

    protected getGlobalTarget():Monster {
        return null;
    }

} 