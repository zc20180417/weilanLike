import { SciencePro } from './../science/SciencePro';
import { EResPath } from "../../common/EResPath";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GS_StrengConfig_StrengItem } from "../../net/proto/DMSG_Plaza_Sub_Streng";
import { GS_TroopsInfo_TroopsInfoItem } from "../../net/proto/DMSG_Plaza_Sub_Troops";
import { Handler } from "../../utils/Handler";
import ImageLoader from "../../utils/ui/ImageLoader";
import SkinLoader, { SKIN_ANI_TYPE } from "../activity/SkinLoader";
import { EquipLineType, TjEquipLine } from "../equip/TjEquipLine";
import Navigation from "../guide/Navigation";
import BookScienceItem from "./BookScienceItem";
import BookWeaponItem from "./BookWeaponItem";
// import TjEquipTips from "./TjEquipTips";
import BaseItem from '../../utils/ui/BaseItem';
import { StringUtils } from '../../utils/StringUtils';
// import UnlockMonsterTips from '../../tips/UnlockMonsterTips';
import { UiManager } from '../../utils/UiMgr';
import { GameEvent } from '../../utils/GameEvent';

const { ccclass, property } = cc._decorator;
@ccclass
export default class CatInfo extends BaseItem {
    @property(cc.Label)
    charactName: cc.Label = null;

    @property(ImageLoader)
    icon: ImageLoader = null;

    @property(cc.Label)
    hurtPer: cc.Label = null;

    @property(cc.Label)
    attackRange: cc.Label = null;

    @property(cc.Label)
    ctrl: cc.Label = null;

    @property(cc.Label)
    speed: cc.Label = null;

    @property(cc.Label)
    dot: cc.Label = null;

    @property(cc.Label)
    buildCost: cc.Label = null;

    @property(cc.Prefab)
    bookScienceItemPrefab: cc.Prefab = null;

    @property(cc.Node)
    bookScienceNode: cc.Node = null;

    @property(Navigation)
    nav: Navigation = null;

    @property(cc.Node)
    equipNode: cc.Node = null;

    // @property(cc.Node)
    // maskNode: cc.Node = null;

    // @property(TjEquipTips)
    // tipsView: TjEquipTips = null;

    @property(BookWeaponItem)
    bookWeaponItems: BookWeaponItem[] = [];

    @property(SkinLoader)
    skinLoader: SkinLoader = null;

    @property(cc.SpriteAtlas)
    equipAtlas: cc.SpriteAtlas = null;

    private _bookScienceItems: BookScienceItem[] = [];

    private _currTowerCfg: GS_TroopsInfo_TroopsInfoItem = null;
    private isInit: boolean = false;

    private _equipNodes: any = {};
    private _curEquipNode: cc.Node = null;
    private _loadEquipLineHandler: Handler = null;
    //private 
    private _loadPaths: string[] = [];
    private _currWeaponIndex: number = -1;
    private _weaponSelectedHandler: Handler = null;
    private _sciencePro: SciencePro;

    protected onEnable(): void {
        GameEvent.on(EventEnum.ON_TJ_EQUIP_CLICK, this.onEquipClick, this);
    }

    protected onDisable() {
        GameEvent.targetOff(this);
    }

    // onMaskClick() {
    //     this.hideEquipTips();
    // }

    onDestroy() {
        this._currTowerCfg = null;

        for (let v of this._loadPaths) {
            Game.resMgr.removeLoad(v, this._loadEquipLineHandler);
        }
        Handler.dispose(this);
    }

    public refresh(): void {
        if (!this.data) return;
        if (!this.isInit) {
            this.isInit = true;

            this._weaponSelectedHandler = Handler.create(this.onWeaponSelected, this);

            for (let v of this.bookWeaponItems) {
                v.setClickHandler(this._weaponSelectedHandler);
            }
        }

        this._currTowerCfg = Game.towerMgr.getTroopBaseInfo(this.data);
        this._sciencePro = Game.strengMgr.getScienceProData(this.data);
        if (this._curEquipNode) {
            this._curEquipNode.active = false;
            this._curEquipNode = null;
        }

        let node: cc.Node = this._equipNodes[this.data];
        if (node) {
            node.active = true;
            this._curEquipNode = node;
        } else {
            if (!this._loadEquipLineHandler) {
                this._loadEquipLineHandler = new Handler(this.onLineLoaded, this);
            }
            this._loadPaths.push(EResPath.TJ_EQUIP_LINE + this.data);
            Game.resMgr.loadRes(EResPath.TJ_EQUIP_LINE + this.data, cc.Prefab, this._loadEquipLineHandler);
        }

        this._currWeaponIndex = -1;

        //名称
        this.charactName.string = this._currTowerCfg.szname;
        // Game.towerMgr.getTowerName(this._currTowerCfg.ntroopsid, this._currTowerCfg);

        //炮塔图标
        this.icon.url = EResPath.TOWER_IMG + this._currTowerCfg.sz3dpicres;
        //  Game.towerMgr.get3dpicres(this._currTowerCfg.ntroopsid, this._currTowerCfg);

        // this.maskNode.setContentSize(cc.winSize);

        let lv1Cfg = Game.towerMgr.getLevelData(this._currTowerCfg, 1);
        let lv2Cfg = Game.towerMgr.getLevelData(this._currTowerCfg, 2);
        let lv3Cfg = Game.towerMgr.getLevelData(this._currTowerCfg, 3);

        //武器
        this.bookWeaponItems[0].setData(lv1Cfg.szweqponres, 0);
        this.bookWeaponItems[0].refresh();
        this.bookWeaponItems[1].setData(lv2Cfg.szweqponres, 1);
        this.bookWeaponItems[1].refresh();
        this.bookWeaponItems[2].setData(lv3Cfg.szweqponres, 2);
        this.bookWeaponItems[2].refresh();

        //是否有皮肤
        let haveFashion = !!Game.fashionMgr.getTowerFashionInfos(this._currTowerCfg.ntroopsid);
        this.bookWeaponItems[3].node.active = !!haveFashion;
        if (haveFashion) {
            let lv4Cfg = Game.towerMgr.getLevelData(this._currTowerCfg, 4);
            this.bookWeaponItems[3].setData(lv4Cfg.szweqponres, 3);
            this.bookWeaponItems[3].refresh();
        }

        //选中第一个武器
        this.bookWeaponItems[0].onClick();

        //天赋
        let bookScienceCfg = Game.towerMgr.getBookTowerCfg(this._currTowerCfg.ntroopsid);
        if (bookScienceCfg) {
            let scienceInfo: GS_StrengConfig_StrengItem;
            let node: cc.Node;
            let item: BookScienceItem;
            for (let i = 0, len = bookScienceCfg.science.length; i < len; i++) {
                scienceInfo = Game.strengMgr.getStrengItem(bookScienceCfg.science[i]);
                if (scienceInfo) {
                    if (this._bookScienceItems[i]) {
                        this._bookScienceItems[i].node.active = true;
                        this._bookScienceItems[i].setData(scienceInfo, i);
                        this._bookScienceItems[i].refresh();
                    } else {
                        node = cc.instantiate(this.bookScienceItemPrefab);
                        item = node.getComponent(BookScienceItem);
                        node.parent = this.bookScienceNode;
                        this._bookScienceItems.push(item);
                        item.setData(scienceInfo, i);
                        item.refresh();
                    }
                }
            }

            //隐藏多余的天赋
            for (let i = bookScienceCfg.science.length; i < this._bookScienceItems.length; i++) {
                this._bookScienceItems[i].node.active = false;
            }
        } else {
            for (let v of this._bookScienceItems) {
                v.node.active = false;
            }
        }
    }

    private onLineLoaded(resData: cc.Prefab, path: string) {
        Game.resMgr.addRef(path);
        if (!this._currTowerCfg || path != EResPath.TJ_EQUIP_LINE + this._currTowerCfg.ntroopsid) return;
        let node = cc.instantiate(resData);
        this._curEquipNode = node;
        this.equipNode.addChild(node);
        this._equipNodes[this._currTowerCfg.ntroopsid] = node;

        let tjEquipLine: TjEquipLine = node.getComponent(TjEquipLine);
        if (tjEquipLine) {
            tjEquipLine.setTowerInfo(this._currTowerCfg, EquipLineType.BOOK);
        }
    }

    private onEquipClick(equipId: number, index: number, equipNode: cc.Node) {
        if (!this._currTowerCfg) return;
        let equipInfo = Game.towerMgr.getEquipItem(equipId);
        // let id = Game.towerMgr.getEquipIndex(this._currTowerCfg.ntroopsid, equipId);
        let icoData = {
            title: equipInfo ? equipInfo.szname : "null",
            spriteFrame: this.equipAtlas.getSpriteFrame(this._currTowerCfg.ntroopsid + "_0" + (index + 1)),
            node: equipNode,
            index: index
        };
        UiManager.showDialog(EResPath.EQUIP_TIPS_VIEW, icoData);
    }

    // private hideEquipTips() {
    //     // this.tipsView.hide();
    //     // this.maskNode.active = false;
    // }

    onWeaponSelected(index: number) {
        if (index == this._currWeaponIndex) return;
        if (this.bookWeaponItems[this._currWeaponIndex]) {
            this.bookWeaponItems[this._currWeaponIndex].unSelect();
        }
        this._currWeaponIndex = index;
        if (this.bookWeaponItems[this._currWeaponIndex]) {
            this.bookWeaponItems[this._currWeaponIndex].onSelect();
        }
        let addhurt = 0;
        let delCd = 0;
        let addRange = 0;
        for (let i = 1; i <= 3; i++) {
            let equipid = this._currTowerCfg['nequipid' + i];
            let equipInfo = Game.towerMgr.getEquipItem(equipid);
            if (equipInfo) {
                let equipData = Game.towerMgr.getEquipData(equipid);
                if (equipData) {
                    switch (equipInfo.btproptype) {
                        case 0:
                            addhurt += equipData.naddprop / 10000;
                            break;
                        case 1:
                            delCd += (equipData.naddprop / 10000);
                            break;
                        case 2:
                            addRange += (equipData.naddprop / 10000);
                            break;
                    }
                }
            }
        }

        //武器属性
        if (this._currTowerCfg) {
            let weaponCfg = Game.towerMgr.getBookWeaponCfg(this._currTowerCfg.ntroopsid + "_" + (index + 1));
            if (weaponCfg) {


                let delCost = 0;

                if (this._sciencePro) {
                    addRange += this._sciencePro.addAttackDis;
                    delCd += this._sciencePro.attackToSpeed;
                    delCd += this._sciencePro.addAttackSpeed;
                    delCost += this._sciencePro.reduceGold;

                    if (index >= 2) {
                        addRange += this._sciencePro.rangeDistSelfValue;
                        delCd += this._sciencePro.rangeAttackSpeedSelfValue;
                        addhurt += (this._sciencePro.rangeDeepenHurtSelfValue / 10000);
                    }
                }


                // 伤害系数
                this.hurtPer.string = Math.round(weaponCfg.hurtPer * (1 + addhurt)) + "%";

                //攻击范围
                this.attackRange.string = Math.round(weaponCfg.attackRange * (1 + addRange)) + '';

                //减速效果
                this.ctrl.string = weaponCfg.ctrl + "%";

                //攻击间隔
                this.speed.string = (weaponCfg.attackSpeed * (1 - delCd)).toFixed(2) + "秒";

                //持续伤害
                this.dot.string = (weaponCfg.dot * (1 + addhurt)) + '%';

                //升级消耗
                this.buildCost.string = Math.floor(weaponCfg.buildcost * (1 - delCost)) + '';
            }
        }

        this.equipNode.active = index !== 3;
        this.icon.node.active = this.equipNode.active;
        this.skinLoader.node.active = !this.equipNode.active;

        if (index == 3) {
            let fastionInfos = Game.fashionMgr.getTowerFashionInfos(this._currTowerCfg.ntroopsid);
            if (fastionInfos) {
                this.skinLoader.setSkinPath(fastionInfos[0].szskeletonres, SKIN_ANI_TYPE.BOOK);
                this.charactName.string = fastionInfos[0].szname;
            }
        } else {
            this.charactName.string = this._currTowerCfg.szname;
        }
    }

    private hide() {
        this.node.active = false;
        GameEvent.emit(EventEnum.HIDE_CAT_INFO);
    }

    private onClickQuestion() {
        if (!this._currTowerCfg) return;
        let str = "";
        str += StringUtils.richTextSizeFormat(StringUtils.richTextColorFormat("攻击方式:\n", "#995124"), 28);
        str += StringUtils.richTextSizeFormat(StringUtils.richTextColorFormat(this._currTowerCfg.szdes1, "#a75f49"), 22);
        str += StringUtils.richTextSizeFormat(StringUtils.richTextColorFormat("\n故事背景:\n", "#995124"), 28);
        str += StringUtils.richTextSizeFormat(StringUtils.richTextColorFormat(this._currTowerCfg.szdes2, "#a75f49"), 22);
        UiManager.showDialog(EResPath.QUESTION_TIPS_VIEW, str);
    }
}
