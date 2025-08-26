import { ECamp, StrengthSkillType } from "../../../common/AllEnum";
import { SkillAmmoDataConfig, SkillTriggerConfig } from "../../../common/ConfigInterface";
import Game from "../../../Game";
import GlobalVal from "../../../GlobalVal";
import { EFrameCompPriority } from "../../../logic/comps/AllComp";
import { FrameComponent } from "../../../logic/comps/FrameComponent";
import { ERecyclableType } from "../../../logic/Recyclable/ERecyclableType";
import SceneObject from "../../../logic/sceneObjs/SceneObject";
import { MathUtils } from "../../../utils/MathUtils";
import { LDSkillBase, ReleaseSkillData } from "../LdSkillManager";





export default class LDMonsterTargetAmmo extends FrameComponent {

    protected _isRun:boolean = false;
    protected _speed:number = 0.1;
    protected _preTime:number = 0;
    protected _skill:LDSkillBase | SkillTriggerConfig;
    protected _ammoDataConfig:SkillAmmoDataConfig;
    protected _self:SceneObject;
    // protected _prePos:cc.Vec2 = cc.Vec2.ZERO;
    protected _rotation:number = 0;
    protected _camp:ECamp;
    protected _releaseSkillData:ReleaseSkillData;
    protected _dirPos:cc.Vec2;
    protected _dis:number = 0;
    protected _startX:number = 0;
    protected _startY:number = 0;
    protected _maxHeight:number = 0;

    constructor() {
        super();
        this.frameRate = 1;
        this.priority = EFrameCompPriority.AMMO;
        this.key = ERecyclableType.LD_DIR_AMMO;
    }

    giveUp() {
        this._skill = null;
        super.giveUp();
    }

    resetData() {
        this._self = null;
        super.resetData();
    }

    moveTo(skill:LDSkillBase | SkillTriggerConfig , ammoCfg:SkillAmmoDataConfig , releaseSkillData:ReleaseSkillData) {
        if (!skill) {
            cc.log("skill is null");
            return;
        }
        
        this.clearData();
        this._releaseSkillData = releaseSkillData;
        this._ammoDataConfig = ammoCfg;
        this._rotation = MathUtils.angle2Radian(this._self.rotation);
        this._startX = (this.owner as SceneObject).x;
        this._startY = (this.owner as SceneObject).y;
        GlobalVal.tempVec2.x = this._startX;
        GlobalVal.tempVec2.y = this._startY;
        GlobalVal.temp3Vec2.x = releaseSkillData.tx;
        GlobalVal.temp3Vec2.y = releaseSkillData.ty;
        this._dis = MathUtils.getDistance(this._startX , this._startY , GlobalVal.temp3Vec2.x , GlobalVal.temp3Vec2.y);
        this._dirPos = GlobalVal.temp3Vec2.sub(GlobalVal.tempVec2).normalize();
        this._skill = skill;
        this._maxHeight = MathUtils.clamp(this._dis * 0.5 , 60 , 300);

        this._speed = ammoCfg.speed * 0.001;
        this._isRun = true;
        this._preTime = GlobalVal.now;      
    }

    setCamp(camp:ECamp) {
        this._camp = camp;
        
    }
    
    added() {
        super.added();
        this._self = this.owner as SceneObject;
    }

    removed() {
        super.removed();
    }

    update() {
        if (!this._isRun) return;
        let now = GlobalVal.now;
        const time:number = now - this._preTime;   
        let moveDis = time * this._speed;
        if (moveDis >= this._dis) {
            this.end();
            return;
        }

        let x = this._startX + this._dirPos.x * moveDis;
        let addY = 0;
        let sin = 0;
        if (this._ammoDataConfig.isParabola == 1) {
            sin = Math.sin(Math.PI * moveDis / this._dis);
            addY = sin * this._maxHeight;
        }
        this._self.scale = 1 + sin * 0.2;
        let y = this._startY + (this._dirPos.y * moveDis) + addY;
        this._self.setPosNow(x , y);
        
    }

    protected onHit() {
        Game.ldSkillMgr.monsterSkillHit(this._releaseSkillData);
    }

    protected end() {
        if (this.owner) {
            this.clearData();
            this.onHit();
            Game.soMgr.removeAmmo(this.owner as SceneObject);
        }
    }

    protected clearData() {
        this._isRun = false;
    }
    
}