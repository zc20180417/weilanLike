import { ECamp, EDir } from "../../../common/AllEnum";
import Game from "../../../Game";
import GlobalVal from "../../../GlobalVal";
import { EActType } from "../../../logic/actMach/ActMach";
import { EFrameCompPriority, EComponentType } from "../../../logic/comps/AllComp";
import { FrameComponent } from "../../../logic/comps/FrameComponent";
import { ERecyclableType } from "../../../logic/Recyclable/ERecyclableType";
import Creature from "../../../logic/sceneObjs/Creature";
import { MathUtils } from "../../../utils/MathUtils";
import { LdPvpGameCtrl } from "../../LdPvpGameCtrl";
import { LDSkillBase, ReleaseSkillData } from "../LdSkillManager";

export class ChargeSkillComp extends FrameComponent {

    private _skill:LDSkillBase;
    private _releaseSkillData:ReleaseSkillData;
    private _dir:cc.Vec2;
    private _startTime:number;
    private _startX:number;
    private _startY:number;
    private _self:Creature;
    constructor() {
        super();
        this.frameRate = 1;
        this.priority = EFrameCompPriority.AUTO_ATTACK;
        this.compType = EComponentType.LD_CHARGE;
        this.key = ERecyclableType.LD_CHARGE;
    }

    added(): void {
        super.added();
        this._self = this.owner as Creature;
    }


    removed(): void {
        this._skill = null;
        this._releaseSkillData = null;
        this._dir = null;
        super.removed();
    }

    private _dis:number = 0;
    startCharge(skill:LDSkillBase , dir:cc.Vec2 , releaseSkillData:ReleaseSkillData) {
        this._skill = skill;
        this._dir = dir;
        this._releaseSkillData = releaseSkillData;
        this._startTime = GlobalVal.now;
        this._startX = this._self.x;
        this._startY = this._self.y;
        this._dis =  this._self.camp == ECamp.RED ? Math.abs(Math.min((LdPvpGameCtrl.TOTAL_HEIGHT - skill.range) - this._self.y , 0)) :  Math.max(skill.range - this._self.y , 0);

        (this.owner as Creature).setDir(EDir.TOP);
    }

    update(): void {
        const time = GlobalVal.now - this._startTime;
        if (time >= this._skill.actionTime) {
            this.owner.removeComponent(this);
            return;
        }

        const dis = this._dis * MathUtils.quadOut(time / this._skill.actionTime);

        this._self.x = this._startX + dis * this._dir.x;
        this._self.y = this._startY + dis * this._dir.y;

        this._releaseSkillData.sx = this._self.x;
        this._releaseSkillData.sy = this._self.y;
        this._releaseSkillData.tx = this._self.x;
        this._releaseSkillData.ty = this._self.y + this._dir.y;

        GlobalVal.tempVec2.x = this._self.x;
        GlobalVal.tempVec2.y = this._self.y;

        const angle = MathUtils.getAngle(0 , 0 ,  0 ,  this._dir.y);

        const targets = Game.ldSkillMgr.getRotationRectMonsters(GlobalVal.tempVec2, 
            this._releaseSkillData.skill.hitRangeValue1, 
            this._releaseSkillData.skill.hitRangeValue2, MathUtils.angle2Radian(angle) , this._self.camp);
        if (targets && targets.length > 0) {
            targets.forEach(element => {
                element.changeTo(EActType.HIT , 300);
                element.y = this._self.y + this._self.halfSize.height * this._dir.y;

            });
        }


    }






}