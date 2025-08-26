
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

import { Rect, MathUtils } from "../../utils/MathUtils";
import { Pos } from "../Pos";
import { LDSkillBase } from "../skill/LdSkillManager";


export default class LDSommonAutoComp extends FrameComponent {
    protected _target:any;
    protected _self:Monster;

    protected _rect:Rect;
    protected _skillList:LDSkillBase[] = [];
    protected _curSkill:LDSkillBase;
    private _curFindTargetType:number = 0;

    protected _range:number = 0;
    protected _cfg:MonsterConfig = null;
    protected _coolcdDic:any = {};
    protected _skillLen:number = 0;
    private _skillRange:number = 0;
    // private _walkComp:LDWalkComp;
    // protected _attackdirect:number = 0;


    constructor() {
        super();
        this.frameRate = 2;
        this.priority = EFrameCompPriority.AUTO_ATTACK;
        this.compType = EComponentType.LD_SOMMON_AUTO;
    }

    added() {
        super.added();
        this._range = 600;
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
            this._curFindTargetType = temp?.findTargetType;
            this._skillRange = temp?.range;
            // this.insertCd(temp);
        }

        // this._moveComp = this._self.getAddComponent(EComponentType.MONSTER_MOVE) as MonsterMoveComp;
        // const path:Pos[] = Game.curLdGameCtrl.findMovePath(this._self.x , this._self.y , this._self.halfSize.width);
        // this._moveComp.setMovePath(path);
    }

   

    removed() {
        if (this._target) {
            this._target.off(EventEnum.ON_SELF_REMOVE , this.onTargetRemoved , this);
            this._target = null;
        }
        this._skillList = [];
        super.removed();
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

    update() {
        //在攻击状态
        if (!this._self.isInAct(EActType.MOVE) && !this._self.isInAct(EActType.IDLE)) {
            this._needFindPath = true;
            return;
        }
        this.checkTarget();
        //在cd状态
        if (!this._curSkill) {
            this._curSkill = this.getSkill();
        }
        // if (!this._curSkill) return;
        this.tryRelease();
    }

    private checkTarget() {
        if (this._target && this._target.isDied) {
            Debug.log(TAG.SKILL ," autoattack error ,target is died");
        }

        if (this._target && !this.checkRemove(this._target)) {
            this._target = null;
        } 

        if (!this._target) {
            const target = Game.soMgr.findTarget(this._self.pos , this._range , this._curFindTargetType, this._self.camp, null);
            this.setTarget(target);
        }
    }

    protected checkRemove(target:Monster):boolean {
        if (target.isDied || !target.isValid ) {
            return false;
        }
        return true;
    }

    protected tryRelease() {
        if (!this._target) return;

        if (!this._curSkill) {
            //技能在CD中,检测是否需要移动到目标位置
            const dis = MathUtils.p2RectDis(this._target.rect, this._self.pos);
            if (dis > this._skillRange) {
                this.moveToTarget();
            }
            return;
        }

        if (this._curSkill.emptyTarget == 0) {
            const dis = MathUtils.p2RectDis(this._target.rect, this._self.pos);
            if (dis > this._curSkill.range) {
                this.moveToTarget();
            } else {
                this.releaseTargetSkill(this._curSkill , this._target , this._target.x , this._target.y);
            }
        } else {
            this.releaseTargetSkill(this._curSkill , null);
        }   
    }


    private _isMoveToTarget:boolean = false;
    private _needFindPath:boolean = false;
    private _lastPos:Pos = Pos.getPos(0 , 0);

    private moveToTarget() {
        if (!this._target) return;
        this._isMoveToTarget = true;
        const gx = Game.curLdGameCtrl.getGridX(this._target.x);
        const gy = Game.curLdGameCtrl.getGridX(this._target.y);
        if (this._needFindPath || this._lastPos.x != gx || this._lastPos.y != gy) {
            const path = Game.curLdGameCtrl.sommonFindMovePath(this._self.x , this._self.y , this._target.x , this._target.y , this._self.camp);
            this._self.changeTo(EActType.MOVE , {path : path });
            this._lastPos.setPos(gx , gy);
            this._needFindPath = false;

        }
    }

    tryInsertCd(skill:LDSkillBase) {
        this.insertCd(skill);

    }
    
    protected endAttackAction() {
        let action = this._self.getCurAction();
        action.end();
    }


    protected releaseTargetSkill(skill:LDSkillBase , target:Monster = null , tx:number = 0 , ty:number = 0) {
        this.tryInsertCd(skill);
        Game.ldSkillMgr.releaseSkill(this._self , target ,tx , ty , this._curSkill);
        this.setTarget(null);
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

            if (this._target) {
                this._target.off(EventEnum.ON_SELF_REMOVE , this.onTargetRemoved , this);
            }


            this._target = target;
            if (target) {
                target.once(EventEnum.ON_SELF_REMOVE , this.onTargetRemoved , this);
            }
        }
    }

    private onTargetRemoved() {
        this._target = null;
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