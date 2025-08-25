
import { FrameComponent } from "../FrameComponent";
import { EFrameCompPriority } from "../AllComp";
import { ERecyclableType } from "../../Recyclable/ERecyclableType";
import Game from "../../../Game";
import { EResPath } from "../../../common/EResPath";
import { Handler } from "../../../utils/Handler";
import GlobalVal from "../../../GlobalVal";
import { EventEnum } from "../../../common/EventEnum";
import { Monster } from "../../sceneObjs/Monster";
import { CacheModel } from "../../../utils/res/ResManager";
import { PropertyId } from "../../../common/AllEnum";
import { CCCBloodBase } from "../../../ld/skill/ccc/CCCBloodBase";
import { SoType } from "../../sceneObjs/SoType";
import { SommonBloodComp } from "../../../ld/skill/ccc/SommonBloodComp";
import { SommonObj } from "../../sceneObjs/SommonObj";
import { MonsterConfig } from "../../../common/ConfigInterface";


export class BloodComp extends FrameComponent {
    private static SCENE_ITEM_OFFSETY: number = 10;

    private _self: Monster;
    private _bloodNode: cc.Node;
    private _loadedHandler: Handler;
    private _isRemoved: boolean = false;
    private _hideTime: number = 0;
    private _offsetY: number = 0;
    private _bloodPath:string = '';
    private _cccBloodComp:CCCBloodBase = null;

    constructor() {
        super();
        this.frameRate = 1;
        this.priority = EFrameCompPriority.WALK;
        this.key = ERecyclableType.BLOOD;
        this._loadedHandler = new Handler(this.onBloodLoaded, this);

    }

    giveUp() {
        this._loadedHandler = null;
        super.giveUp();
    }

    added() {
        super.added();
        this._self = this.owner as Monster;
        this._isRemoved = false;
        this._bloodPath = 'prefabs/' + this._self.cfg.bloodPath;
        this._bloodNode = Game.soMgr.getPoolNode(this._bloodPath);
        this._offsetY = (this._self.cfg as MonsterConfig).bloodOffsetY;
        // this._self.on(EventEnum.ON_HURT, this.refreshBlood, this);
        // this._self.on(EventEnum.ON_ADD_HP, this.refreshBlood, this);
        
        if (!this._bloodNode) {
            Game.resMgr.loadRes(this._bloodPath , cc.Prefab, this._loadedHandler, CacheModel.AUTO);
        } else {
            this.initSprite();
        }

    }

    removed() {
        // if (this._self) {
        //     this._self.off(EventEnum.ON_HURT, this.refreshBlood, this);
        //     this._self.off(EventEnum.ON_ADD_HP, this.refreshBlood, this);
        // }
        this._isRemoved = true;
        this._self = null;
        if (this._bloodNode) {
            Game.soMgr.cacheNode(this._bloodNode, this._bloodPath);
            this._bloodNode = null;
        }
        Game.resMgr.removeLoad(this._bloodPath, this._loadedHandler);
        super.removed();
    }

    resetData() {
        if (!this._isRemoved) {
            cc.log("error !!!!!!!!!!!!!");
        }
        this._self = null;
        this._offsetY = 0;
        this._hideTime = 0;
        if (this._bloodNode) {
            Game.soMgr.cacheNode(this._bloodNode, this._bloodPath);
            this._bloodNode = null;
        }
    }

    update() {
        if (!this._self) {
            cc.log('----update---blood self is null');
            return;
        }

        if (this._self.isDied) {
            this._self.removeComponent(this);
            return;
        }

        if (this._self.mainBody && this._bloodNode) {
            this._bloodNode.opacity = this._self.mainBody.active ? 255 : 0;
        }

        if (this._hideTime != 0 && GlobalVal.now >= this._hideTime) {
            this._self.removeComponent(this);
            return;
        }

        if (this._bloodNode) {
            GlobalVal.tempVec2.x = this._self.centerPos.x;
            GlobalVal.tempVec2.y = this._self.y + this._self.size.height + this._offsetY;
            this._bloodNode.setPosition(GlobalVal.tempVec2.x, GlobalVal.tempVec2.y);
            this.refreshBlood();
        }
    }

    refreshBlood() {
        this.refreshBlood2(this._self.blood, this._self.prop.getPropertyValue(PropertyId.MAX_HP));
    }

    refreshBlood2(blood: number, bloodTotal: number) {
        if (this._cccBloodComp) {
            this._cccBloodComp.refreshBlood(blood / bloodTotal);
        }
    }

    private onBloodLoaded(res: any, path: string) {
        if (this._isRemoved) return;
        let prefab = Game.resMgr.getRes(this._bloodPath);
        if (!prefab)  {
            return;
        }
        Game.resMgr.addRef(path);
        this._bloodNode = cc.instantiate(prefab);
        this.initSprite();
    }

    private initSprite() {
        this._cccBloodComp = this._bloodNode.getComponent(CCCBloodBase);
        if (!this._bloodNode.parent) {
            Game.soMgr.addBlood(this._bloodNode);
        }
        if (SoType.isSommon(this._self)) {
            (this._cccBloodComp as SommonBloodComp).monster = this._self as SommonObj;
        }
        this.refreshBlood();
    }

}