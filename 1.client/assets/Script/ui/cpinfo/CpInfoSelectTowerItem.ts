// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { QUALITY_COLOR } from "../../common/AllEnum";
import Game from "../../Game";
import { GS_TroopsInfo_TroopsInfoItem } from "../../net/proto/DMSG_Plaza_Sub_Troops";
import { Handler } from "../../utils/Handler";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import { MatUtils } from "../../utils/ui/MatUtils";
import { NodeUtils } from "../../utils/ui/NodeUtils";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/ui/cpinfo/CpInfoSelectTowerItem")
export default class CpInfoSelectTowerItem extends cc.Component {

    @property(cc.SpriteAtlas)
    towerUi: cc.SpriteAtlas = null;

    @property(cc.Sprite)
    headImg: cc.Sprite = null;

    @property(cc.Label)
    starLabel: cc.Label = null;

    @property([cc.Node])
    lvNodes: cc.Node[] = [];

    @property(cc.Node)
    selectImg: cc.Node = null;

    @property(cc.Node)
    starBg: cc.Node = null;

    private _towerId: number = null;
    private _handler: Handler = null;
    private _towerInfo: GS_TroopsInfo_TroopsInfoItem;
    private _battleLevel: number = 0;
    private _isNormal: boolean = true;

    setTowerInfo(info: GS_TroopsInfo_TroopsInfoItem, battleLevel: number) {
        this._towerId = info.ntroopsid;
        this._towerInfo = info;
        this._battleLevel = battleLevel;

        this.headImg.spriteFrame = this.towerUi.getSpriteFrame(Game.towerMgr.getHeadName(info.ntroopsid));

        let isNormal = Game.towerMgr.isTowerUnlock(this._towerId);
        if (isNormal != this._isNormal) {
            this._isNormal = isNormal;

            if (isNormal) {
                MatUtils.setSpriteNormal(this.headImg);
            } else {
                MatUtils.setSpriteGray(this.headImg);
            }
        }
        this.selected = false;
        if (this.selectImg) {
            this.selectImg.color = cc.Color.BLACK.fromHEX(QUALITY_COLOR[(info.btquality + 1)] || QUALITY_COLOR["1"]);
        }
        this.starLabel.string = isNormal ? Game.towerMgr.getStar(info.ntroopsid) + '' : "0";
        Game.sceneNetMgr.showBatlleLevel(this.lvNodes, isNormal ? battleLevel : 0);
    }


    onClick() {
        if (!this._isNormal) {
            SystemTipsMgr.instance.notice("该猫咪尚未激活");
            return;
        }
        if (this._handler) {
            this._handler.executeWith(this._towerInfo, this._battleLevel, this);
        }
    }

    setClickCallBack(func: Handler) {
        this._handler = func;
    }

    set selected(value: boolean) {
        if (!this.selectImg) return;
        this.selectImg.active = value;

        if (value) {
            this.selectImg.opacity = 100;
            this.fadeIn();
        } else {
            this.selectImg.stopAllActions();
        }
    }


    private fadeOut() {
        NodeUtils.fadeTo(this.selectImg, 1.0, 100, this.fadeIn, this);
    }

    private fadeIn() {
        NodeUtils.fadeTo(this.selectImg, 1.0, 255, this.fadeOut, this);
    }
    // update (dt) {}
    public setVisiable(visiable: boolean) {
        this.headImg.node.active = visiable;
        this.starLabel.node.active = visiable;
        this.selectImg.active = visiable;
        this.starBg.active = visiable;
        this.lvNodes.forEach((v) => {
            v.active = visiable;
        });
    }
}
