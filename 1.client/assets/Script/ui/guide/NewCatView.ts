// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Dialog from "../../utils/ui/Dialog";
import { TowerUtil } from "../../logic/sceneObjs/TowerUtil";
import Game from "../../Game";
import ImageLoader from "../../utils/ui/ImageLoader";
import { EResPath } from "../../common/EResPath";
import ToIdentificationView from "../addiction/ToIdentificationView";
import GlobalVal from "../../GlobalVal";
import ChiHouDragon from "../../logic/comps/animation/towerDragonBones/ChiHouDragon";

const { ccclass, property } = cc._decorator;

const BG = {
    1: "img_greenRadRect",
    2: "img_blueRadRect",
    3: "img_pinkRadRect",
    4: "img_orangeRadRect"
}

const TITLE_BG = {
    1: "img_greenTag",
    2: "img_blueTag",
    3: "img_pinkTag",
    4: "img_orangeTag"
}

const NEW_ICON = {
    1: "img_greenNew",
    2: "img_blueNew",
    3: "img_pinkNew",
    4: "img_yellowNew"
}

const HENG_TIAO = {
    1: "img_greenHengTiao",
    2: "img_blueHengTiao",
    3: "img_pinkHengTiao",
    4: "img_orangeHengTiao"
}

const LIGHT_CIRCLE = {
    1: "img_greenCircle",
    2: "img_blueCircle",
    3: "img_pinkCircle",
    4: "img_orangeCircle"
}


@ccclass
export default class NewCatView extends Dialog {
    @property(cc.Sprite)
    bg: cc.Sprite = null;

    @property(cc.Sprite)
    titleBg: cc.Sprite = null;

    @property(cc.Sprite)
    newIcon: cc.Sprite = null;

    @property(cc.Label)
    title: cc.Label = null;

    @property(cc.Sprite)
    hengtiao: cc.Sprite = null;

    @property(cc.Node)
    light: cc.Node = null;

    @property(cc.Sprite)
    towerType: cc.Sprite = null;

    @property(cc.Label)
    des: cc.Label = null;

    @property(cc.SpriteAtlas)
    gameUi: cc.SpriteAtlas = null;

    @property(ImageLoader)
    icon: ImageLoader = null;

    @property(cc.Sprite)
    weaponOne: cc.Sprite = null;
    @property(cc.Sprite)
    weaponTwo: cc.Sprite = null;
    @property(cc.Sprite)
    weaponThree: cc.Sprite = null;

    @property(cc.SpriteAtlas)
    weaponAtlas: cc.SpriteAtlas = null;

    private cfgOrId: any;



    setData(cfgOrId: any) {
        this.cfgOrId = cfgOrId;
    }

    onLoad() {
        super.onLoad();

        this.refresh();
    }

    refresh() {
        if (!this.cfgOrId) return;
        let towerId;

        if (typeof this.cfgOrId === "number") {
            towerId = this.cfgOrId;
        } else if (typeof this.cfgOrId === "object") {
            towerId = this.cfgOrId.itemId;
        }

        let towerCfg = Game.towerMgr.getTroopBaseInfo(towerId);
        let type = towerCfg.bttype;
        let quality = towerCfg.btquality;

        //图标
        this.icon.url = EResPath.TOWER_IMG + towerCfg.sz3dpicres;

        let lv1Cfg = Game.towerMgr.getLevelData(towerCfg, 1);
        let lv2Cfg = Game.towerMgr.getLevelData(towerCfg, 2);
        let lv3Cfg = Game.towerMgr.getLevelData(towerCfg, 3);

        let cost = lv1Cfg.ncreategold;

        this.bg.spriteFrame = this.gameUi.getSpriteFrame(BG[quality + 1]);
        this.titleBg.spriteFrame = this.gameUi.getSpriteFrame(TITLE_BG[quality + 1]);
        this.hengtiao.spriteFrame = this.gameUi.getSpriteFrame(HENG_TIAO[quality + 1]);
        this.newIcon.spriteFrame = this.gameUi.getSpriteFrame(NEW_ICON[quality + 1]);

        let children = this.light.children;
        let sp = null;
        if (children) {
            children.forEach((v) => {
                sp = v.getComponent(cc.Sprite);
                sp.spriteFrame = this.gameUi.getSpriteFrame(LIGHT_CIRCLE[quality + 1]);
            });
        }

        this.towerType.spriteFrame = this.gameUi.getSpriteFrame("type_" + type);

        this.title.string = towerCfg.szname;
        this.des.string = towerCfg.szdes1;

        //武器
        this.weaponOne.spriteFrame = this.weaponAtlas.getSpriteFrame(lv1Cfg.szweqponres);
        this.weaponTwo.spriteFrame = this.weaponAtlas.getSpriteFrame(lv2Cfg.szweqponres);
        this.weaponThree.spriteFrame = this.weaponAtlas.getSpriteFrame(lv3Cfg.szweqponres);
    }

    beforeHide() {

        let currSceneName = cc.director.getScene().name;

        switch (currSceneName) {
            case "Map": Game.globalEffect.flyCat(this.icon.node, GlobalVal.flyCatEndPos);
                break;
            case "Hall":
            case "MainScene":
                // Game.towerMgr.clearCacheNewTower();
                break;
        }
    }
}
