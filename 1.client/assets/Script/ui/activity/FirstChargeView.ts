import { BuryingPointMgr, EBuryingPoint } from "../../buryingPoint/BuryingPointMgr";
import { EventEnum } from "../../common/EventEnum";
import Dialog from "../../utils/ui/Dialog";
import { FirstRechargeInfo } from "../actor/ActorMgr";
import GoodsItem, { GoodsItemData } from "../newhand_book/GoodsItem";
import { EResPath } from "../../common/EResPath";
import { FIRST_RECHARGE_STATE, GOODS_TYPE } from "../../net/socket/handler/MessageEnum";
import { UiManager } from "../../utils/UiMgr";
import { TujianData, TujianTabIndex } from "../tujian/TuJianView";
import ImageLoader from "../../utils/ui/ImageLoader";
import SkinLoader, { SKIN_ANI_TYPE } from "./SkinLoader";
import { GS_FashionInfo_FashionItem } from "../../net/proto/DMSG_Plaza_Sub_Fashion";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import Game from "../../Game";
import { GS_GoodsInfoReturn_GoodsInfo } from "../../net/proto/DMSG_Plaza_Sub_Goods";
import { GameEvent } from "../../utils/GameEvent";

const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("Game/ui/charge/FristChargeView")
export class FristChargeView extends Dialog {

    @property(cc.Node)
    btnNode: cc.Node = null;

    @property([cc.Toggle])
    toggles:cc.Toggle[] = [];

    @property(ImageLoader)
    towerImg:ImageLoader = null;

    @property(cc.Sprite)
    towerNameBg:cc.Sprite = null;

    @property(cc.Sprite)
    rewardBg:cc.Sprite = null;

    @property(cc.Sprite)
    bg:cc.Sprite = null;

    @property(cc.Label)
    towerNameLabel:cc.Label = null;

    @property([cc.Color])
    goodsNameColors:cc.Color[] = [];

    @property([cc.Color])
    towerNameColors:cc.Color[] = [];

    @property([cc.Color])
    towerNameOutLineColors:cc.Color[] = [];

    @property([cc.SpriteFrame])
    rewardBgSfs:cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    bgSfs:cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    towerNameSfs:cc.SpriteFrame[] = [];

    @property(GoodsItem)
    goodsItems: GoodsItem[] = [];

    @property(SkinLoader)
    skinLoader:SkinLoader = null;

    @property(cc.Sprite)
    titleImg1:cc.Sprite = null;

    @property(cc.Sprite)
    titleImg2:cc.Sprite = null;

    @property([cc.SpriteFrame])
    titleSfs1:cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    titleSfs2:cc.SpriteFrame[] = [];

    @property(cc.Node)
    pifuTipsNode:cc.Node = null;

    @property([cc.Float])
    titleXList1:number[] = [];
    @property([cc.Float])
    titleXList2:number[] = [];
    @property([cc.Float])
    titleYList2:number[] = [];

    @property(cc.Label)
    pirceLabel:cc.Label = null;

    @property(ImageLoader)
    pirceIco:ImageLoader = null;

    private buyBtn: cc.Button = null;
    private toggleNodes:cc.Node[] = [];
    // private 

    private data: FirstRechargeInfo[] = null;
    private _curData:FirstRechargeInfo = null;

    private _towerId:number = 0;
    private _skinId:number = 0;
    private _isSkin:boolean = false;


    private _xList:number[] = [];
    onLoad() {
        const len = this.toggles.length;
        for (let i = 0; i < len; i++) {
            const element = this.toggles[i];
            this.toggleNodes[i] = element.node;
            this._xList[i] = this.toggleNodes[i].x;
        }
    }

    setData() {
      
    }


    protected beforeShow() {
        // if (!this.data) return;
        BuryingPointMgr.post(EBuryingPoint.SHARE_FRIST_RECHARGE_VIEW);
        this.data = Game.actorMgr.getFirstRechargeInfos(); 
        this.initTab();
    }

    protected afterHide(): void {
        GameEvent.targetOff(this);
    }

    private buy() {
        if (this._curData) {

            if (this._curData.item.btbuytype == 1 && !Game.containerMgr.isEnough(this._curData.item.nneedgoodsid , this._curData.item.nneedgoodsnum )) {
                const goodsInfo = Game.goodsMgr.getGoodsInfo(this._curData.item.nneedgoodsid);
                SystemTipsMgr.instance.notice((goodsInfo ? goodsInfo.szgoodsname:"") + "不足");
                return;
            }

            if (this._isSkin) {
                const fashion = Game.fashionMgr.getFashionInfo(this._skinId);
                if (!fashion) {
                    SystemTipsMgr.instance.notice('数据出错');
                    return;
                }

                if (Game.fashionMgr.getFashionData(this._skinId)) {
                    SystemTipsMgr.instance.notice("您已拥有此皮肤，无需再次购买");
                    return;
                }

                if (!Game.towerMgr.isTowerUnlock(fashion.ntroopsid)) {
                    let towerInfo = Game.towerMgr.getTroopBaseInfo(fashion.ntroopsid);
                    if (towerInfo) {
                        SystemTipsMgr.instance.notice('需要先激活此皮肤所属猫咪' + towerInfo.szname);
                    }
                    return;
                }
            }

            Game.actorMgr.reqFirstRecharge(this._curData.item.btflag);
        }
    }

    protected addEvent(): void {
        GameEvent.on(EventEnum.ON_FIRST_RECHARGE_RECIVED, this.onFirstRechargeRecived, this);
        GameEvent.on(EventEnum.FIRST_RECHARGE_END, this.hide, this);
        this.buyBtn = this.btnNode.getComponent(cc.Button);
        this.buyBtn.node.on("click", this.buy, this);
        let len = this.toggles.length;
        for (let i = 0; i < len; i++) {
            const element = this.toggles[i];
            element.node.on("toggle", this.onTogValueChanged, this);
        }
    }

    private _selectTog:cc.Node = null;
    private onTogValueChanged(e:any) {
        if(this._selectTog == e.node) return;

        this._selectTog = e.node;
        let index = this.toggleNodes.indexOf(e.node);
        if(index >= 0) {
            this.onSelectIndex(index); 
        }
    }

    private _index:number = -1;
    private onSelectIndex(index:number) {
        this.toggles[index].isChecked = true;
        this._curData = this.data[index];
        this._index = index;
        this.refreshView();
    }

    private onFirstRechargeRecived(flag: number, index: number) {
        this.initTab();
    }

    private onClick() {
        if (this._towerId > 0) {
            let towerInfo = Game.towerMgr.getTroopBaseInfo(this._towerId);
            if (towerInfo) {
                let data: TujianData = {
                    tabIndex: TujianTabIndex.CAT,
                    subTabIndex: towerInfo.btquality,
                    towerId: this._towerId,
                    isSkin:this._isSkin
                }
                UiManager.showDialog(EResPath.TUJIAN_VIEW, data);
            }
        }
    }

    private initTab() {
        let infos = this.data;
        let selectIndex = -1;
        let index = 0;
        for (let i = 0, len = infos.length; i < len; i++) {
            if (Game.actorMgr.getFirstRechargeState(infos[i].item.btflag, 0) !== FIRST_RECHARGE_STATE.BUY) {
                this.toggles[i].node.active = false;
            } else  {
                this.toggles[i].node.x = this._xList[index];
                index ++;
                if (selectIndex == -1) {
                    selectIndex = i;
                }
            }
        }

        this.onSelectIndex(selectIndex);
    }

    private refreshView() {
        this.pifuTipsNode.active = this._index == 1;
        this.bg.spriteFrame = this.bgSfs[this._index];
        this.rewardBg.spriteFrame = this.rewardBgSfs[this._index];
        this.titleImg1.spriteFrame = this.titleSfs1[this._index];
        this.titleImg2.spriteFrame = this.titleSfs2[this._index];
        this.titleImg1.node.x = this.titleXList1[this._index];
        this.titleImg2.node.x = this.titleXList2[this._index];
        this.titleImg2.node.y = this.titleYList2[this._index];
        this.towerNameBg.spriteFrame = this.towerNameSfs[this._index];
        this.towerNameLabel.node.color = this.towerNameColors[this._index];
        this.towerNameLabel.node.getComponent(cc.LabelOutline).color = this.towerNameOutLineColors[this._index];
        this.goodsItems.forEach(element => {
            element.des.node.color = this.goodsNameColors[this._index];
        });


        // let rmbLabel = this.btnNode.children[0].getComponent(cc.Label);
        if (this._curData.item.btbuytype == 1) { 
            this.pirceLabel.string = this._curData.item.nneedgoodsnum.toString();
            const goods:GS_GoodsInfoReturn_GoodsInfo = Game.goodsMgr.getGoodsInfo(this._curData.item.nneedgoodsid);
            if (goods) {
                this.pirceIco.setPicId(goods.npacketpicid);
            }

            const isEnough = Game.containerMgr.isEnough(this._curData.item.nneedgoodsid , this._curData.item.nneedgoodsnum );
            this.pirceLabel.node.color = isEnough ? cc.Color.WHITE : cc.Color.RED;

        } else {
            this.pirceLabel.string = this._curData.item.nrmb + "元";
        }


        // let goodsChildren = this.goodsNode.children;
        // for (let v of goodsChildren) {
        //     this.goodsItems.push(v.getComponent(GoodsItem));
        // }

        //奖励物品
        this._towerId = 0;
        this._skinId = 0;
        this._isSkin = false;
        if (this._curData.goodsItem.length) {
            for (let i = 0, len = this.goodsItems.length; i < len; i++) {
                let goodsItem = this._curData.goodsItem[0];
                let goodsItemData: GoodsItemData = {
                    goodsId: goodsItem.ngoodsids[i],
                    nums: goodsItem.ngoodsnums[i],
                    prefix: "x"
                }

                let goodsInfo = Game.goodsMgr.getGoodsInfo(goodsItemData.goodsId);
                if (goodsInfo ) {
                    if (goodsInfo.lgoodstype == GOODS_TYPE.GOODSTYPE_RES_UPGRADESTAR) {
                        this._towerId = goodsInfo.lparam[0];
                    } else if (goodsInfo.lgoodstype == GOODS_TYPE.GOODSTYPE_RES_SKIN) {
                        this._towerId = goodsInfo.lparam[0];
                        this._skinId = goodsInfo.lparam[1];
                        this._isSkin = true;
                    }
                }

                this.goodsItems[i].setData(goodsItemData, i);
            }
        }

        if (this._isSkin) {
            this.towerImg.node.active = false;
            let fashion:GS_FashionInfo_FashionItem = Game.fashionMgr.getFashionInfo(this._skinId);
            if (fashion) {
                this.skinLoader.node.active = true;
                this.skinLoader.setSkinPath(fashion.szskeletonres, SKIN_ANI_TYPE.DEFAULT, (succ) => {
                    if (!succ) {
                        // this.icon.setPicId(item.nuishowpicid);
                    }
                });

                this.towerNameLabel.string = fashion.szname;
            }
        } else if (this._towerId > 0) {
            this.skinLoader.node.active = false;
            this.towerImg.node.active = true;
            let towerInfo = Game.towerMgr.getTroopBaseInfo(this._towerId);
            if (towerInfo) {
                this.towerNameLabel.string = towerInfo.szname;
                this.towerImg.url = EResPath.TOWER_IMG + towerInfo.sz3dpicres;
            }
        }
    }
}