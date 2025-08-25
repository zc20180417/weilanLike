import Game from "../../Game";
import Dialog from "../../utils/ui/Dialog";

const {ccclass, property , menu} = cc._decorator;

@ccclass
@menu("Game/ui/shop/BeginBuffItem")
export class BeginBuffItem extends cc.Component {

    @property(cc.Sprite)
    bg:cc.Sprite = null;

    @property(cc.Sprite)
    ico:cc.Sprite = null;

    @property(cc.Label)
    label:cc.Label = null;

    @property(cc.SpriteAtlas)
    atlas:cc.SpriteAtlas = null;

    private _father:Dialog;
    private _data:any;
    setData(data:any , view:Dialog) {
        this._data = data;
        this._father = view;
        this.ico.spriteFrame = this.atlas.getSpriteFrame("buff_type_" + data.type);
        this.bg.spriteFrame = this.atlas.getSpriteFrame('buff_quality_' + data.quality);
        this.label.string = data.info;
    }

    onClick() {
        Game.cpMgr.getBeginBuffCtrl().selectBuff(this._data);
        this._father.hide();
    }

}