import { ECamp, StrengthSkillType } from "../../common/AllEnum";
import { SkillAmmoDataConfig, SkillTriggerConfig } from "../../common/ConfigInterface";
import Game from "../../Game";
import GlobalVal from "../../GlobalVal";
import { EFrameCompPriority } from "../../logic/comps/AllComp";
import { FrameComponent } from "../../logic/comps/FrameComponent";
import { ERecyclableType } from "../../logic/Recyclable/ERecyclableType";
import { Monster } from "../../logic/sceneObjs/Monster";
import SceneObject from "../../logic/sceneObjs/SceneObject";
import { MathUtils } from "../../utils/MathUtils";
import { StringUtils } from "../../utils/StringUtils";
import { HeroBuilding } from "../tower/HeroBuilding";
import { LDSkillBase, ReleaseSkillData } from "./LdSkillManager";




export default class LdDirAmmoComp extends FrameComponent {

    protected _isRun:boolean = false;
    protected _speed:number = 0.1;
    protected _preTime:number = 0;
    protected _skill:LDSkillBase | SkillTriggerConfig;
    protected _dirPos:cc.Vec2;
    protected _self:SceneObject;
    protected _count:number = 0;
    protected _hitMonsters:number[] = [];
    protected _prePos:cc.Vec2 = cc.Vec2.ZERO;
    protected _rotation:number = 0;
    protected _moveArea:cc.Rect;
    protected _checkHitArea:cc.Rect;
    protected _camp:ECamp;
    protected _heroBuilding:HeroBuilding;
    protected _skillMainId:number;
    protected _releaseSkillData:ReleaseSkillData;
    protected _ammoDataConfig:SkillAmmoDataConfig;
    protected _totalDis:number = 0;

    constructor() {
        super();
        this.frameRate = 1;
        this.priority = EFrameCompPriority.AMMO;
        this.key = ERecyclableType.LD_DIR_AMMO;
    }

    giveUp() {
        this._skill = null;
        this._dirPos = null;
        super.giveUp();
    }

    resetData() {
        this._hitMonsters = [];
        this._dirPos = null;
        this._self = null;
        this._count = 0;
        super.resetData();
    }

    moveTo(pos:cc.Vec2 , skill:LDSkillBase | SkillTriggerConfig , releaseSkillData:ReleaseSkillData , angle:number) {
        if (!skill) {
            cc.log("skill is null");
            return;
        }
        
        this.clearData();
        this._releaseSkillData = releaseSkillData;
        this._skillMainId = skill['skillMainID'] || skill.skillID;
        this._heroBuilding = Game.curLdGameCtrl.getHeroBuildingCtrl(releaseSkillData.campId).getHeroBuilding(releaseSkillData.heroId);
        this._rotation = MathUtils.angle2Radian(angle);
        this._dirPos = pos;
        this._skill = skill;
        this._ammoDataConfig = Game.ldSkillMgr.getAmmoDataConfig(this._skill.ammoID);

        // if (skill['ammoWidth'] != undefined) {
            this._self.setSize(this._ammoDataConfig.ammoWidth , this._ammoDataConfig.ammoHeight);
        // } else {
        //     this._self.setSize(skill['hitRangeValue1'] , skill['hitRangeValue2']);
        // }
        this.setCamp(releaseSkillData.campId);

        this._speed = this._ammoDataConfig.speed * 0.001;
        this._isRun = true;
        this._preTime = GlobalVal.now;      
    }

    private setCamp(camp:ECamp) {
        this._camp = camp;
        if (Game.curLdGameCtrl) {
            this._moveArea = Game.curLdGameCtrl.getDirAmmoArea(camp);
            this._checkHitArea = Game.curLdGameCtrl.getDirAmmoCheckHitArea(camp);
        }
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
        this._preTime = now;        
        let moveDis = time * this._speed;
        this._totalDis += moveDis;

        if (this._ammoDataConfig.maxDis > 0) {
            if (this._totalDis > this._ammoDataConfig.maxDis * 0.9) {
                this._self.opacity -= 10;
            }


            if (this._totalDis >= this._ammoDataConfig.maxDis) {
                this._isRun = false;
                this.end();
                return;
            }
        }

        this._prePos.x = this._self.x;
        this._prePos.y = this._self.y;

        this._self.setPosNow(this._self.x + this._dirPos.x * moveDis , this._self.y + this._dirPos.y * moveDis);

        if (this._self.x <= this._moveArea.xMin || this._self.y <= this._moveArea.yMin || this._self.x >= this._moveArea.xMax || this._self.y >= this._moveArea.yMax) {
            this._isRun = false;
            this.end();
            return;
        }

        if (this._self.x >= this._checkHitArea.xMin && this._self.x <= this._checkHitArea.xMax && this._self.y >= this._checkHitArea.yMin && this._self.y <= this._checkHitArea.yMax) {
            this.checkHit();
        }
    }

    protected checkHit() {
        const addHitCount = this._heroBuilding?.getCommonStrengthPropValue(this._skillMainId , StrengthSkillType.HIT_TARGET_COUNT , this._releaseSkillData.heroUid) || 0;

        let wid = MathUtils.getDistance(this._prePos.x , this._prePos.y , this._self.x , this._self.y) + this._self.rect.halfWid;

        

        let monsters:Monster[] = Game.ldSkillMgr.getRotationRectMonsters(this._prePos , this._self.rect.height , wid , this._rotation , this._camp);
        let len:number = monsters.length;
        let so:Monster;
        let id:number = 0;
        for (let i = len - 1 ; i >= 0 ; i--) {
            so = monsters[i];
            if (so.isDied) continue;
            id = so.groupID > 0 ? so.groupID : so.id;
            if (this._hitMonsters.indexOf(id) == -1 && this.checkMonster(so)) {
                this._hitMonsters.push(id);
                this.onHit(so);
                this._count ++;
    
                if (this._skill.hitCount != 0 && this._count >= this._skill.hitCount + addHitCount) {
                    this.end();
                    break;
                }
            }
        }
    }

    protected checkMonster(monster:Monster):boolean {
        return !GlobalVal.checkSkillCamp || monster.camp == this._camp;
    }

    protected onHit(target: Monster) {
        let eft = this._heroBuilding?.getHitRangeEft(this._skillMainId) || this._skill.hitRangeEft;
        if (!StringUtils.isNilOrEmpty(eft)) {
            Game.soMgr.createEffect(eft , this._self.x, this._self.y, false);
        }
        this._releaseSkillData.tx = this._self.x;
        this._releaseSkillData.ty = this._self.y;
        Game.ldSkillMgr.onSkillHit(target , this._releaseSkillData);
    }

    protected end() {
        if (this.owner) {
            this.clearData();
            Game.soMgr.removeAmmo(this.owner as SceneObject);
        }
    }

    protected clearData() {
        this._isRun = false;
        this._totalDis = 0;
    }
    
}