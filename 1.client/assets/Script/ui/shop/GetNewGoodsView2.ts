import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GS_RewardTips_RewardGoods } from "../../net/proto/DMSG_Plaza_Sub_Tips";
import RotationParticle from "../../propEffect/RotationParticle";
import { GameEvent } from "../../utils/GameEvent";
import Dialog from "../../utils/ui/Dialog";
import NewGoodsItem from "./NewGoodsItem";
import NewGoodsItem2 from "./NewGoodsView2";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/ui/shop/GetNewGoodsView2")
export default class GetNewGoodsView2 extends Dialog {

    @property(cc.Node)
    container: cc.Node = null;

    @property(cc.Prefab)
    item: cc.Prefab = null;

    @property(cc.Prefab)
    smallItem: cc.Prefab = null;

    @property(RotationParticle)
    left: RotationParticle = null;

    @property(RotationParticle)
    right: RotationParticle = null;

    // @property(cc.Layout)
    // layout:cc.Layout = null;

    @property(cc.Label)
    label:cc.Label = null;

    private _data: any[];
    private _isShow:boolean = false;
    private _hasTowerGoods: boolean = false;
    private isTujianReward: boolean = false;//图鉴奖励
    private _isAfterShow:boolean = false;
    private _itemList:NewGoodsItem2[] = [];
    private _isSmall:boolean = false;
    private _showAni:boolean = true;

    setData(data: any) {
        // cc.log('------setData' , data);
        this._isShow = false;
        this._data = data.list;
        this.isTujianReward = data.isTujianReward;
        this._hasTowerGoods = false;

        if (this.isTujianReward) return;
        this._isSmall = this._data.length >= 30 ? true : false;

        let goodsid = 0;
        for (let i = 0; i < this._data.length; i++) {
            goodsid = (this._data[i] as GS_RewardTips_RewardGoods).sgoodsid;
            if (goodsid == Game.towerMgr.getSharegoodsid() || (goodsid >= 101 && goodsid <= 805)) {
                this._hasTowerGoods = true;
            }
        }
    }

    protected addEvent() {

    }

    private onRefresh(countChange:boolean , list:any) {
        if (list) {
            this._data = list;
        }
        this.refreshShow();
    }

    protected beforeShow() {
        this._isShow = true;
        if (this.blackLayer) {
            this.blackLayer.color = cc.Color.BLACK;
            this.blackLayer.opacity = 235;
        }

        this.left.node.setPosition(cc.v2(-cc.winSize.width * 0.5, -200));
        this.right.node.setPosition(cc.v2(cc.winSize.width * 0.5, -200));

        this.showItemData();
        this.schedule(this.showItemData , 0.2 , 100);
    }

    private _showIndex:number = 0;
    private showItemData() {
        this.setItemData(this._data[this._showIndex] , this._showIndex , true);
        this._showIndex ++;
        if (this._showIndex >= this._data.length) {
            this.showAll();
            this.unschedule(this.showItemData);
        }
    }

    private showAll() {
        this.unschedule(this.showItemData);
        for (let i = this._showIndex ; i < this._data.length ; i++) {
            this.setItemData(this._data[i] , i , true);
        }
        this.showEnd();
    }

    private showEnd() {
        this._showAni = false;
        this.label.string = '点击任意位置关闭';

    }

    private setItemData(data:any , index:number , isShow?:boolean) {
        let t: cc.Node = cc.instantiate(this._isSmall ? this.smallItem : this.item);
        
        if (t.parent == null) {
            this.container.addChild(t);
        }

        let comp = t.getComponent(NewGoodsItem2);
        if (this._isSmall ) {
            comp.setViewInfo(0.8 , -65);
        }
        if (this.isTujianReward && comp && index == 0) {
            comp.isHead = true;
            comp.setData(data, index);
        } else if (comp) {
            comp.setData(data, 0);
        }

        this._itemList[index] = comp;

        if (comp && isShow) {
            comp.show();
        }
    }

    private refreshShow() {
        if (this._isShow) {

            let len = this._data.length;
            for (let i = 0 ; i < len ; i++) {
                let item = this._itemList[i];
                if (!item) {
                    this.setItemData(this._data[i] , i , this._isAfterShow);

                } else {
                    item.setData(this._data[i] , i);
                }
            }
        }
    }


    public hide(ani: boolean = true) {
        if (this._showAni) {
            this.showAll();
            return;
        }
        super.hide(ani);
    }

    afterShow() {
        this.container.children.forEach(element => {

            let comp = element.getComponent(NewGoodsItem2);
            if (comp) {
                comp.show();
            }
        });
        this._isAfterShow = true;
        this.left.resetSystem();
        this.right.resetSystem();
    }

    protected beforeHide(): void {
        this.unschedule(this.showItemData);
    }

    afterHide() {
        if (this._hasTowerGoods) {
            GameEvent.emit(EventEnum.ON_GETED_CARD);
        }

        Game.containerMgr.needCardBag = true;
        Game.containerMgr.checkCardBag();
    }
}