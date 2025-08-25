// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { QUALITY_BG_COLOR } from "../../common/AllEnum";
import Game from "../../Game";
import GlobalVal from "../../GlobalVal";
import { Handler } from "../../utils/Handler";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import Dialog from "../../utils/ui/Dialog";
import BgScrollAni from "../towerStarSys/bgScrollAni";
import TreatrueLyoutItem from "./treatrueLayoutItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CardBagView extends Dialog {
    @property(cc.Node)
    topLayer: cc.Node = null;

    @property(cc.Node)
    bottomLayer: cc.Node = null;

    @property(cc.Prefab)
    layoutItem: cc.Prefab = null;

    @property(BgScrollAni)
    bgScrollAni: BgScrollAni = null;

    @property(cc.Node)
    btnNode: cc.Node = null;

    @property(cc.Node)
    bgNode:cc.Node=null;

    @property
    isPreView:boolean = false;

    _layerMax: number = 5;

    isTreatrueOpened = false;

    isOpeing = false;

    _data: any = null;

    _currItemIdx: number = -1;

    _isShowedAllItem: boolean = false;

    private _selectedItem: TreatrueLyoutItem = null;
    private _clickHandler: Handler = null;

    private _allTreatrueData:Array<any>=[];
    private _itemIndexMap:Map<number,number>=new Map();

    setData(data:number) {
        this._data = data;
    }

    protected beforeShow(): void {
        this._clickHandler = Handler.create(this.onLayoutItemClick, this);

        let bagCfg=Game.goodsMgr.getGoodsInfo(this._data);
        if(!bagCfg)return;
        this.bgScrollAni.refreshBg(bagCfg.btquality + 1);

        this.bgNode.color = cc.color().fromHEX(QUALITY_BG_COLOR[bagCfg.btquality + 1] || "#fff");

        for (let i = 0,len=bagCfg.lparam.length; i < len; i++) {
            let cfg = Game.goodsMgr.getGoodsInfo(bagCfg.lparam[i]);
            if(cfg){
                this._allTreatrueData.push({ itemCfg: cfg, num: 1 });
                this._itemIndexMap.set(cfg.lgoodsid,i);
            }
        }
        this.showAllItem();
    }

    protected afterHide(): void {
        Handler.dispose(this);
    }

    /**
     * 显示所有物品
     */
    showAllItem() {
        GlobalVal.treatrueArrowAniTime = Date.now();
        let itemData = this._allTreatrueData;
        for (let i = 0; i < itemData.length; i++) {
            this.addItemToTopBottomLayer(itemData[i], 0.06 * i);
        }
        this.btnNode.active=false;
        this.scheduleOnce(() => {
            this.btnNode.active = true;
        }, itemData.length * 0.05);
    }

    addItemToTopBottomLayer(data: any, delay: number = 0): any {
        let item = cc.instantiate(this.layoutItem);
        let com = item.getComponent("treatrueLayoutItem") as TreatrueLyoutItem;
        com.grayHad = true;
        com.setClickHandler(this._clickHandler);
        com.setData(data);
        com.setDelay(delay);
        com.refresh();
        if (this.topLayer.childrenCount >= this._layerMax) {
            this.bottomLayer.addChild(item);
        } else {
            this.topLayer.addChild(item);
        }
        return item;
    }

    reciveClick() {

        if (this.isPreView) {
            this.hide();
            return;
        }

        if(this._data){
            if (this._selectedItem) {
                this._selectedItem.data && Game.goodsMgr.useCardBag(this._data
                    , this._itemIndexMap.get(this._selectedItem.data.itemCfg.lgoodsid));
            } else {
                return SystemTipsMgr.instance.notice("请选择需要领取的奖励");
            }
        }
        this.hide();
    }

    onLayoutItemClick(item: TreatrueLyoutItem) {
        if (this._selectedItem === item) return;
        if (this._selectedItem) this._selectedItem.unSelect();
        this._selectedItem = item;
        item.onSelect();
    }
}
