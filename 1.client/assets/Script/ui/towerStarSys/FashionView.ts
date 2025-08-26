import { BuryingPointMgr, EBuryingPoint } from "../../buryingPoint/BuryingPointMgr";
import { GAME_TYPE } from "../../common/AllEnum";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import GlobalVal from "../../GlobalVal";
import { ActiveInfo } from "../../net/mgr/SysActivityMgr";
import { GS_ActorRechargeConfig_QuickRechargeItem } from "../../net/proto/DMSG_Plaza_Sub_Actor";
import { GS_FashionInfo_FashionItem } from "../../net/proto/DMSG_Plaza_Sub_Fashion";
import { GS_SysActivityNew_SysActivityNewTaskItem } from "../../net/proto/DMSG_Plaza_Sub_SysActivity";
import { GS_TroopsInfo_TroopsInfoItem } from "../../net/proto/DMSG_Plaza_Sub_Troops";
import { ACTIVE_TYPE, GOODS_ID, SYSTEM_ACTIVE_TYPE } from "../../net/socket/handler/MessageEnum";
import { GameEvent } from "../../utils/GameEvent";
import { StringUtils } from "../../utils/StringUtils";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import Dialog from "../../utils/ui/Dialog";
import GroupImage from "../../utils/ui/GroupImage";
import ImageLoader from "../../utils/ui/ImageLoader";
import SkinLoader, { SKIN_ANI_TYPE } from "../activity/SkinLoader";


const { ccclass, property, menu } = cc._decorator;
/**
 * 对话框
 */
@ccclass
@menu('Game/ui/fashion/FashionView')
export class FashionView extends Dialog {
    @property(SkinLoader)
    fashionImg: SkinLoader = null;

    @property(ImageLoader)
    nameImg: ImageLoader = null;

    @property(ImageLoader)
    icon: ImageLoader = null;

    @property(cc.Label)
    priceLabel1: cc.Label = null;

    @property(cc.Node)
    buyNode1: cc.Node = null;

    @property(cc.Label)
    rmdLabel:cc.Label = null;

    @property(GroupImage)
    addPropLabel:GroupImage = null;

    @property(cc.Sprite)
    qualityTypeImg:cc.Sprite = null;

    @property(cc.Sprite)
    qualityTitleImg:cc.Sprite = null;

    @property(cc.Sprite)
    qualityFrameImg1:cc.Sprite = null;
    @property(cc.Sprite)
    qualityFrameImg2:cc.Sprite = null;

    @property(cc.SpriteAtlas)
    spriteAtlas:cc.SpriteAtlas = null;
    
    @property(cc.Node)
    mapNode:cc.Node = null;

    @property(GroupImage)
    yuanjiaLabel:GroupImage = null;

    @property(cc.Label)
    timeLabel:cc.Label = null;

    @property([cc.Node])
    tejiaNodes:cc.Node[] = [];

    private _activeInfo:ActiveInfo;
    private _rechargeCfg:GS_ActorRechargeConfig_QuickRechargeItem;
    private _data: GS_FashionInfo_FashionItem[] = null;
    private _index: number = -1;
    private _curInfo: GS_FashionInfo_FashionItem;
    private _loadList: string[] = [];

    setData(data: GS_FashionInfo_FashionItem[]) {
        if (data) {
            this._data = data;
        } else {
            this._activeInfo = Game.sysActivityMgr.getActivityInfo(ACTIVE_TYPE.DISCOUNT_SKIN);
        }
    }

    beforeShow() {
        if (this._data && this._data.length > 0) {
            this.selectIndex(0);
        } else if (this._activeInfo) {
            this.showByActive();
        }
        this.blackLayer.opacity = 235;
    }

    addEvent() {
        GameEvent.on(EventEnum.FASHION_ACTIVE, this.onFashionActive, this);
        GameEvent.on(EventEnum.FASHION_USE, this.onFashionUse, this);
        GameEvent.on(EventEnum.FASHION_CANCEL, this.onFashionCancel, this);

    }

    private onBuyClick(e: any, param: string) {
        if (this._activeInfo) {
            this.buyClick();
            return;
        }

        if (!this._curInfo) {
            return;
        }

        let index = Number(param);
        let mode = -1;
        if (index == 2 && this._curInfo.ngoodsnum > 0) {
            mode = 2;
        } else if (index == 1 && this._curInfo.nprice > 0) {
            mode = 1;
        }

        if (mode == -1 && this._curInfo.ndiamonds > 0) {
            mode = 0;
        }

        if (mode != -1) {
            Game.fashionMgr.reqBuy(this._curInfo.nid, mode);
        }
    }

    private buyClick() {
        if (!this._activeInfo || !this._activeInfo.item || !this._activeInfo.taskList) return;
        if (!this._rechargeCfg || !this._rechargeCfg.sztitle) return;
        let towerId = this.getTowerId(this._rechargeCfg.sztitle);
        let infos = Game.fashionMgr.getTowerFashionInfos(towerId);
        if (!Game.towerMgr.isTowerUnlock(towerId)) {
            return SystemTipsMgr.instance.notice("需要先激活猫咪才能购买");
        } else if (!infos || Game.fashionMgr.getFashionData(infos[0].nid)) {
            return SystemTipsMgr.instance.notice("您已经购买过此皮肤，无需再次购买");
        }
        let taskList: GS_SysActivityNew_SysActivityNewTaskItem = this._activeInfo.taskList[0];
        Game.sysActivityMgr.joinSysActivity(ACTIVE_TYPE.DISCOUNT_SKIN, taskList ? taskList.btindex : 0);
    }


    private onSelectClick() {
        if (this._curInfo) {
            Game.fashionMgr.reqUse(this._curInfo.nid);
            this.hide();
        }
    }

    private selectIndex(index: number) {
        this._index = index;
        this.showInfo(this._data[index]);
    }

    private showByActive() {
        if (this._activeInfo.item.bttype == SYSTEM_ACTIVE_TYPE.BUY && this._activeInfo.taskList[0]) {
            this._rechargeCfg = Game.actorMgr.getChargeConifg(this._activeInfo.taskList[0].nparam1);
            if (!this._rechargeCfg || !this._rechargeCfg.sztitle) return;
            this.tejiaNodes.forEach(element => {
                element.active = true;
            });
            //名称
            let towerid = this.getTowerId(this._rechargeCfg.sztitle);
            let fastionInfos = Game.fashionMgr.getTowerFashionInfos(towerid);
            let fastionInfo = fastionInfos ? fastionInfos[0] : null;
            if (fastionInfo) {
                this.nameImg.setPicId(fastionInfo.nuinameshowpicid);
                this.addPropLabel.contentStr = '+' + (fastionInfo.nhurtper / 100)+ "%";
            }
            let tower = Game.towerMgr.getTroopBaseInfo(towerid);
            if (tower) {
                this.showTower(tower);
            }

            //骨骼动画
            this.fashionImg.setSkinPath(this._rechargeCfg.sztitle, SKIN_ANI_TYPE.DEFAULT);

            //原价
            this.yuanjiaLabel.contentStr = this._rechargeCfg.noriginalrmb.toString();

            //现价
            this.priceLabel1.string = this._rechargeCfg.nneedrmb.toString();
            this.rmdLabel.string = '¥';
            this.buyNode1.active = true;
            this.onTimer();
            this.schedule(this.onTimer , 1);
        }
    }

    private onTimer() {
        let time = Game.sysActivityMgr.getActiveRestTime(ACTIVE_TYPE.DISCOUNT_SKIN);
        this.timeLabel.string = (time <= 0 ? "00:00:00" : StringUtils.doInverseTime(time));
    }

    private showInfo(item: GS_FashionInfo_FashionItem) {
        this._curInfo = item;

        this.fashionImg.setSkinPath(item.szskeletonres, SKIN_ANI_TYPE.DEFAULT, (succ) => {
            if (!succ) {
                this.icon.setPicId(item.nuishowpicid);
            }
        });

        let tower = Game.towerMgr.getTroopBaseInfo(item.ntroopsid);
        if (tower) {
            this.showTower(tower);
        }

        this.addPropLabel.contentStr = '+' + (item.nhurtper / 100)+ "%";
        this.nameImg.setPicId(item.nuinameshowpicid);
        let priavteData = Game.fashionMgr.getFashionData(item.nid);
        if (!priavteData) {

            let count = 1;
            if (item.nprice > 0 && GlobalVal.openRecharge) {
                this.buyNode1.active = true;
                this.rmdLabel.string = '¥';
                this.priceLabel1.string = item.nprice.toString();
                count++;
            }

            if (item.ndiamonds > 0) {
                this['buyNode' + count].active = true;
                this['priceLabel' + count].string = item.ndiamonds.toString();

                let goodsInfo = Game.goodsMgr.getGoodsInfo(GOODS_ID.DIAMOND);
                if (goodsInfo) {
                    this['goodsIco' + count].node.active = true;
                    this['goodsIco' + count].setPicId(goodsInfo.npacketpicid);
                }

                count++;
            }
            BuryingPointMgr.post(EBuryingPoint.SHARE_XIAO_CHOU_SKIN_VIEW);
        } else if (priavteData.btuse == 0) {
            this.buyNode1.active  = false;
        } else {
            this.buyNode1.active  = false;
        }
    }

    private showTower(tower:GS_TroopsInfo_TroopsInfoItem) {
        this.showTowerTest(tower);
        const quatity = tower.btquality + 1;
        this.qualityTypeImg.spriteFrame = this.spriteAtlas.getSpriteFrame('img_fashion_' + quatity);
        this.qualityTitleImg.spriteFrame = this.spriteAtlas.getSpriteFrame('img_biaoqian_' + quatity);
        this.qualityFrameImg1.spriteFrame = this.spriteAtlas.getSpriteFrame('img_kuang_' + quatity);
        this.qualityFrameImg2.spriteFrame = this.spriteAtlas.getSpriteFrame('img_kuang_' + quatity);
    }


    protected afterHide(): void {
        Game.soMgr.clearAll();
    }

    onDestroy() {
        this._loadList.length = 0;
    }

    private onFashionActive(nid: number) {
        this.hide();
        return;
        if (this._curInfo && this._curInfo.nid == nid) {
            this.showInfo(this._curInfo);
        }
    }

    private onFashionUse(nid: number) {
        if (this._curInfo && this._curInfo.nid == nid) {
            this.showInfo(this._curInfo);
        }
    }

    private onFashionCancel(nid: number) {
        if (this._curInfo && this._curInfo.nid == nid) {
            this.showInfo(this._curInfo);
        }
    }

    ////////////////////////////////////////////////////////////

    private showTowerTest(tower:GS_TroopsInfo_TroopsInfoItem) {
        Game.soMgr.initQuadTree(GAME_TYPE.NORMAL);
        Game.soMgr.setGameType(GAME_TYPE.NORMAL);
        const container1 = this.mapNode.getChildByName('creature');
        const container2 = this.mapNode.getChildByName('effect');
        Game.soMgr.setContainer(container1 , container1 ,container2 ,container1 , container1, container1,container1);
        const so1 =  Game.soMgr.createUITower(tower.ntroopsid,4,2,1,container1,true);
        const so2 = Game.soMgr.createUITower(tower.ntroopsid,3,0,1,container1,false);
        let monster = Game.soMgr.createMonster(330 ,100000000,1);
        monster.x = 400;
        monster.y = 75;
        monster.scaleX = -1;

        so1.addTo(container1);
        so2.addTo(container1);
        monster.addTo(container1);
    }

    private getTowerId(skinName: string) {
        let arr = skinName.split("_");//skin_1_1_1
        return parseInt(arr[1] + "0" + arr[2]);
    }


}