import { SkillAmmoDataConfig, SkillTriggerConfig } from "../../../common/ConfigInterface";
import Game from "../../../Game";
import GlobalVal from "../../../GlobalVal";
import { EFrameCompPriority } from "../../../logic/comps/AllComp";
import { FrameComponent } from "../../../logic/comps/FrameComponent";
import { ERecyclableType } from "../../../logic/Recyclable/ERecyclableType";
import SceneObject from "../../../logic/sceneObjs/SceneObject";
import { MathUtils } from "../../../utils/MathUtils";
import { StringUtils } from "../../../utils/StringUtils";
import { LDSkillBase, ReleaseSkillData } from "../LdSkillManager";



export default class LdParabolicComp extends FrameComponent {

    protected _isRun:boolean = false;
    protected _speed:number = 0.1;
    protected _preTime:number = 0;
    protected _skill:LDSkillBase | SkillTriggerConfig ;
    protected _releaseSkillData:ReleaseSkillData;
    protected _dirPos:cc.Vec2;
    protected _endPos:cc.Vec2 = cc.Vec2.ZERO;
    protected _startPos:cc.Vec2 = cc.Vec2.ZERO;
    protected _dis:number = 0;
    protected _totalDic:number = 0;
    protected _maxHeight:number = 0;
    protected _self:SceneObject;
    protected _ammoDataConfig:SkillAmmoDataConfig;

    constructor() {
        super();
        this.frameRate = 1;
        this.priority = EFrameCompPriority.PARABOLIC;
        this.key = ERecyclableType.LD_PARABOLIC;
    }

    giveUp() {
        this._skill = null;
        this._dirPos = null;
        this._endPos = null;
        this._startPos = null;
        super.giveUp();
    }

    resetData() {
        this._dirPos = null;
        this._self = null;
        super.resetData();
    }

    moveTo(releaseSkillData:ReleaseSkillData , tox:number , toy:number) {
        if (!releaseSkillData) {
            cc.log("skill is null");
            return;
        }
        
        this.clearData();

        this._endPos.x = tox;
        this._endPos.y = toy;

        this._startPos.x = this._self.x;
        this._startPos.y = this._self.y;


        this._totalDic = this._dis = MathUtils.getDistance(this._self.x , this._self.y , tox , toy);
        this._maxHeight = MathUtils.clamp(this._totalDic * 0.5 , 60 , 300);
        this._dirPos = this._endPos.sub(this._self.pos);
        this._dirPos.normalizeSelf();
        this._releaseSkillData = releaseSkillData;
        this._skill = releaseSkillData.skill;
        this._ammoDataConfig = Game.ldSkillMgr.getAmmoDataConfig(this._skill.ammoID);
        this._speed = this._ammoDataConfig.speed / 1000;
        this._isRun = true;
        this._preTime = GlobalVal.now;
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
        const now = GlobalVal.now;
        const time:number = now - this._preTime;
        let moveDis = time * this._speed;
        
        if (moveDis >= this._totalDic) {
            this.end();
            return;
        }

        let x = this._startPos.x + this._dirPos.x * moveDis;
        let sin = Math.sin(Math.PI * moveDis / this._totalDic);
        let addY:number = sin * this._maxHeight;
        this._self.scale = 1 + sin * 0.2;
        let y = this._startPos.y + (this._dirPos.y * moveDis) + addY;
        this._self.setPosNow(x , y);
    }

    protected checkHit() {
        Game.ldSkillMgr.checkHitCircle(this._endPos , this._skill , this._releaseSkillData);
    }

    protected end() {
        if (this.owner) {
            if (!StringUtils.isNilOrEmpty(this._skill.hitRangeEft)) {
                Game.soMgr.createEffect(this._skill.hitRangeEft , this._endPos.x , this._endPos.y , false);
            }

            this.clearData();
            this.checkHit();
            Game.soMgr.removeAmmo(this.owner as SceneObject);
        }
    }

    protected clearData() {
        this._isRun = false;
    }
    
}