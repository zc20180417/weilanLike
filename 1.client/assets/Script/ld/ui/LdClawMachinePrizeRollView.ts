import { PrizeRollItemData } from "../../common/AllEnum";
import { EventEnum } from "../../common/EventEnum";
import SysMgr from "../../common/SysMgr";
import { GameEvent } from "../../utils/GameEvent";
import { Handler } from "../../utils/Handler";
import Dialog from "../../utils/ui/Dialog";
import { GoodsBox } from "../../utils/ui/GoodsBox";
import ListDynamic from "../../utils/ui/ListDynamic";
import { PrizeRollCol } from "./PrizeRollCol";


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/LD/ui/LdClawMachinePrizeRollView")

export class LdClawMachinePrizeRollView extends Dialog {


    @property(cc.Node)
    hideLabel:cc.Node = null;

    @property(PrizeRollCol)
    rollCol: PrizeRollCol = null;

    @property(GoodsBox)
    goodsBox:GoodsBox = null;

    @property(ListDynamic)
    dynamic:ListDynamic = null;

    private _viewData:{dropList:PrizeRollItemData[] , coin:0 , allDropList:PrizeRollItemData[] , dropGoodsList:PrizeRollItemData[]} = null;
    private _rollColList:PrizeRollCol[] = [];
    private _isRollEnd:boolean = false;

    onLoad(): void {
        super.onLoad();
        this._rollColList = [this.rollCol];
        this.initData();
    }

    private initData() {
        if (!this._viewData || this._rollColList.length == 0) return;
        const dropList = this._viewData.dropList;
        const len = dropList.length;

        for (let i = 0; i < len; ++i) {
            if (i >= this._rollColList.length) {
                const colNode = cc.instantiate(this.rollCol.node);
                this.rollCol.node.parent.addChild(colNode);
                this._rollColList[i] = colNode.getComponent(PrizeRollCol);
            }

            const rollCol = this._rollColList[i];
            rollCol.node.active = true;
            rollCol.setData(this._viewData.allDropList);
        }

        if (this._rollColList.length > len) {
            for (let i = len; i < this._rollColList.length; ++i) {
                this._rollColList[i].node.active = false;
            }
        }
    }

    public setData(data: any): void {
        super.setData(data);
        this._viewData = data;
        this.initData();
    }

    protected beforeShow(): void {
        super.beforeShow();

        this.hideLabel.active = false;
    }

    protected afterShow(): void {
        super.afterShow();
        SysMgr.instance.pauseGame('LdDropBoxComp' , false);
        const len = this._viewData.dropList.length;
        for (let i = 0; i < len; ++i) {
            this._rollColList[i].rollToData(this._viewData.dropList[i] , Handler.create(this.onRollEnd , this));
        }
        this._isRollEnd = false;
        this.blackLayer.on("click", this.onBlackLayerClick, this);
    }

    private _endCount:number = 0;
    private onRollEnd() {
        this._endCount++;
        if (this._endCount >= this._viewData.dropList.length) {
            this.hideLabel.active = true;
            this.goodsBox.node.active = true;
            // this.onCloseBtnClick();
            this._isRollEnd = true;
            this.goodsBox.array = this._viewData.dropGoodsList;
            this.dynamic.play(this.goodsBox.getCells());
        }
    }

    protected afterHide(): void {
        if (this._viewData.coin > 0) {
            GameEvent.emit(EventEnum.ADD_GOLD , this._viewData.coin);
        }
    }

    private onBlackLayerClick() {
        if (this._isRollEnd) {
            this.hide(false);
        } else {
            const len = this._viewData.dropList.length;
            for (let i = 0; i < len; ++i) {
                this._rollColList[i].rollToEnd();
            }
        }
    }



}