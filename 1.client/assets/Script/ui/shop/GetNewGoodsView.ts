import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GS_RewardTips_RewardGoods } from "../../net/proto/DMSG_Plaza_Sub_Tips";
import RotationParticle from "../../propEffect/RotationParticle";
import { GameEvent } from "../../utils/GameEvent";
import Dialog from "../../utils/ui/Dialog";
import NewGoodsItem from "./NewGoodsItem";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/ui/shop/GetNewGoodsView")
export default class GetNewGoodsView extends Dialog {

    @property(cc.Node)
    container: cc.Node = null;

    @property(cc.Prefab)
    item: cc.Prefab = null;

    @property(RotationParticle)
    left: RotationParticle = null;

    @property(RotationParticle)
    right: RotationParticle = null;

    private _data: any[];
    private _isShow:boolean = false;
    private _hasTowerGoods: boolean = false;
    private isTujianReward: boolean = false;//图鉴奖励
    private _isAfterShow:boolean = false;
    private _itemList:NewGoodsItem[] = [];
    setData(data: any) {
        // cc.log('------setData' , data);
        this._isShow = false;
        this._data = data.list;
        this.isTujianReward = data.isTujianReward;
        this._hasTowerGoods = false;

        if (this.isTujianReward) return;

        let goodsid = 0;
        for (let i = 0; i < this._data.length; i++) {
            goodsid = (this._data[i] as GS_RewardTips_RewardGoods).sgoodsid;
            if (goodsid == Game.towerMgr.getSharegoodsid() || (goodsid >= 101 && goodsid <= 805)) {
                this._hasTowerGoods = true;
            }
        }
    }

    protected addEvent() {
        GameEvent.on(EventEnum.TIPSREWARD_REFRESH ,this.onRefresh , this);
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

        for (let i = 0; i < this._data.length; i++) {
            this.setItemData(this._data[i] , i);
        }
    }

    private setItemData(data:any , index:number , isShow?:boolean) {
        let t: cc.Node = cc.instantiate(this.item);
        if (t.parent == null) {
            this.container.addChild(t);
        }

        let comp = t.getComponent(NewGoodsItem);

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

    afterShow() {
        this.container.children.forEach(element => {

            let comp = element.getComponent(NewGoodsItem);
            if (comp) {
                comp.show();
            }
        });
        this._isAfterShow = true;
        this.left.resetSystem();
        this.right.resetSystem();
    }

    afterHide() {
        if (this._hasTowerGoods) {
            GameEvent.emit(EventEnum.ON_GETED_CARD);
        }
    }
}