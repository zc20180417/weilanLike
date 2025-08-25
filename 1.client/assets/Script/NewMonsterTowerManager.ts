// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:

import { EMODULE } from "./common/AllEnum";
import { MonsterConfig } from "./common/ConfigInterface";
import { EResPath } from "./common/EResPath";
import { EventEnum } from "./common/EventEnum";
import Game from "./Game";
import GlobalVal from "./GlobalVal";
import { GameDataCtrl } from "./logic/gameData/GameDataCtrl";
import { Monster } from "./logic/sceneObjs/Monster";
import { Tower } from "./logic/sceneObjs/Tower";
import { GS_TroopsInfo_TroopsInfoItem } from "./net/proto/DMSG_Plaza_Sub_Troops";
import NewMonsterCatTips from "./tips/NewMonsterCatTips";
import { GameEvent } from "./utils/GameEvent";
import { Handler } from "./utils/Handler";
import ResManager from "./utils/res/ResManager";
import SoundManager from "./utils/SoundManaget";
import { UiManager } from "./utils/UiMgr";

//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
export default class NewMonsterTowerManager extends GameDataCtrl {
    private static _instance: NewMonsterTowerManager = null;
    public static getInstance(): NewMonsterTowerManager {
        return this._instance || (this._instance = new NewMonsterTowerManager());
    }

    private _cacheData: any;
    private _config: any;
    private _currWarTips = [];
    private sortConfig: Map<number, Array<any>>;
    private _layoutNode: cc.Node;
    private _tipsDatas = [];
    private constructor() {
        super();
        this.module = EMODULE.NEW_MONSTER_TOWER_TIPS;
        this._cacheData = this.readData() || {};

        this._config = Game.gameConfigMgr.getCfg(EResPath.NEW_MONSTER_TOWER_CFG);
        this.sortConfig = new Map();
        let arr: Array<any>;
        for (let key in this._config) {
            arr = this.sortConfig.get(this._config[key].warid);
            if (!arr) this.sortConfig.set(this._config[key].warid, arr = []);
            arr.push(this._config[key]);
        }

        GameEvent.on(EventEnum.INIT_MAP_DATA_END, this.onInitMapDataEnd, this);
        GameEvent.on(EventEnum.EXIT_GAME_SCENE, this.onExitGameScene, this);
    }

    private onInitMapDataEnd() {
        let warTips = GlobalVal.curMapCfg ? this.sortConfig.get(GlobalVal.curMapCfg.nwarid) : null;
        if (warTips) {
            for (let v of warTips) {
                if (!this._cacheData[v.id]) {
                    this._currWarTips.push(v);
                }
            }
        }

        if (!this._currWarTips.length) return;
        GameEvent.on(EventEnum.CREATE_TOWER_ALL, this.onCreateTower, this);
        GameEvent.on(EventEnum.CREATE_MONSTER, this.onCreateMonster, this);
    }

    private onExitGameScene() {
        this._currWarTips.length = 0;
        this._tipsDatas.length = 0;
        if (this._layoutNode && this._layoutNode.isValid) {
            this._layoutNode.destroy();
        }
        this._layoutNode = null;
        this.writeData(this._cacheData);
        GameEvent.off(EventEnum.CREATE_TOWER_ALL, this.onCreateTower, this);
        GameEvent.off(EventEnum.CREATE_MONSTER, this.onCreateMonster, this);
    }

    private onCreateMonster(so: Monster) {
        this.onTargetCreate((so.cfg as MonsterConfig).id);
    }

    private onCreateTower(x: number, y: number, so: Tower) {
        this.onTargetCreate((so.cfg as GS_TroopsInfo_TroopsInfoItem).ntroopsid);
    }

    private onTargetCreate(monsterTowerId: number) {
        let config = this.getTipsConfig(monsterTowerId);
        if (config) {
            //显示提示
            this.showTips(config);

            this._cacheData[config.id] = true;
            //移除提示数据
            this._currWarTips.splice(this._currWarTips.indexOf(config), 1);
        }
    }

    private getTipsConfig(targetId: number): any {
        for (let v of this._currWarTips) {
            if (v.targetId === targetId) {
                return v;
            }
        }
        return null;
    }

    public showTips(config?: any) {
        this.checkLayoutNode();
        config && this._tipsDatas.push(config);
        ResManager.instance.loadRes(EResPath.NEW_MOSNTER_TOWER_TIPS, cc.Prefab, Handler.create(this.onTipsResLoaded, this));
    }

    private onTipsResLoaded(res, path) {
        if (this._layoutNode.children.length >= 3) return;
        if (!this._tipsDatas.length) return;
        let node: cc.Node = cc.instantiate(res);
        this._layoutNode.addChild(node);
        node.x = cc.winSize.width * 0.5 - 100;
        let tipsCom: NewMonsterCatTips = node.getComponent(NewMonsterCatTips);
        tipsCom.setData(this._tipsDatas.shift());
        tipsCom.show();
        SoundManager.instance.playSound(EResPath.NEW_MONSTER_TOWER);
    }

    public onTipsShow(tips: NewMonsterCatTips) {

    }

    public onTipsHide(tips: NewMonsterCatTips) {
        tips.node.removeFromParent(true);
        this.showTips();
    }

    private checkLayoutNode() {
        if (this._layoutNode) return;
        this._layoutNode = new cc.Node();
        UiManager.dialogLayer.addChild(this._layoutNode);
        let layout = this._layoutNode.addComponent(cc.Layout);
        layout.type = cc.Layout.Type.VERTICAL;
        layout.resizeMode = cc.Layout.ResizeMode.CONTAINER;
        layout.spacingY = 10;
        layout.affectedByScale = true;
        this._layoutNode.anchorY = 1;
        this._layoutNode.x = cc.winSize.width * 0.5;
        this._layoutNode.y = cc.winSize.height - 100;
    }
}
