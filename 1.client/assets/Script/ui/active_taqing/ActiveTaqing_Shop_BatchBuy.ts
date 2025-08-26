

import Game from "../../Game";
import { MathUtils } from "../../utils/MathUtils";
import { StringUtils } from "../../utils/StringUtils";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import Dialog from "../../utils/ui/Dialog";

const { ccclass, property ,menu } = cc._decorator;

@ccclass
@menu('Game/ui/active-taqing/ActiveTaqing_Shop_BatchBuy')
export class ActiveTaqing_Shop_BatchBuy extends Dialog {


    @property(cc.RichText)
    countLabel:cc.RichText = null;

    @property(cc.Slider)
    slider:cc.Slider = null;


    private _totalCount:number = 0;
    private _maxCount:number = 0;
    private _nid:number = 0;
    private _count:number = 1;
    private _name:string = '';
    private _realTotal:number = 0;
    public setData(data: any) {
        // 子类复写
        this._totalCount = data.totalCount;
        this._maxCount = data.maxCount;
        this._nid = data.nid;
        this._realTotal = Math.min(this._maxCount ,this._totalCount );
        this._name = data.goodsName;
    }


    protected beforeShow(): void {
        this.refreshCount();
    }   

    onAddClick() {
        this._count ++;
        this.refreshCount();
    }

    onDelClick() {
        this._count --;
        this.refreshCount();
    }

    onOkClick() {
        if (this._count > this._maxCount) {
            SystemTipsMgr.instance.notice(this._name + "不足");
        } else {
            Game.festivalActivityMgr.reqBuyExchangeGoods(this._nid , this._count);
            this.hide();
        }
    }

    onCencelClick() {
        this.hide();
    }

    private refreshCount() {
        this._count = MathUtils.clamp(this._count , 1 , this._realTotal);
        this.slider.progress = this._count / this._realTotal;
        if (this._count <= this._maxCount) {
            this.countLabel.string = this._count + '/' + this._realTotal;
        } else {
            this.countLabel.string = StringUtils.fontColor(this._count.toString() , "#FF0000") + "/" + this._realTotal;
        }
    }

    private onSliderChange() {
        cc.log(this.slider.progress);
        this._count = Math.floor(this.slider.progress * this._realTotal);
        this.refreshCount();
    }


}