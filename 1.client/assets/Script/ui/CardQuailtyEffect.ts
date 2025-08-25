import { EResPath } from "../common/EResPath";
import Game from "../Game";
import { Handler } from "../utils/Handler";
import { CacheModel } from "../utils/res/ResManager";


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/ui/CardQuailtyEffect")
export default class CardQuailtyEffect extends cc.Component {

    private _cardEffectIndex:number = 0;
    private _loadEftHandler:Handler;

    showCardEffect(quality:number) {

        let index = 0;
        if (quality == 2) {
            index = 3;
        } else if (quality > 2) {
            index = 4;
        }

        if (this._cardEffectIndex == index) return;
        if (this._cardEffectIndex > 0 && this._loadEftHandler) {
            Game.resMgr.removeLoad(EResPath.CARD_EFT + this._cardEffectIndex , this._loadEftHandler);
        }
        if (this.node.childrenCount > 0) {
            this.node.removeAllChildren();
        }
        this._cardEffectIndex = index;

        if (index == 0) {
            return;
        }

        if (!this._loadEftHandler) {
            this._loadEftHandler = new Handler(this.onLoadedEft , this);
        }
        Game.resMgr.loadRes(EResPath.CARD_EFT + index , cc.Prefab , this._loadEftHandler , CacheModel.AUTO );
    }

    private onLoadedEft(res:any , prefabPath: string) {
        if (res) {
            let eft = cc.instantiate(res);
            if (eft) {
                this.node.addChild(eft);
            }
        }
    }
}