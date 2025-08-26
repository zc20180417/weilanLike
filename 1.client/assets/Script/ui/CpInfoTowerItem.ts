// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { TowerTypeName } from "../common/AllEnum";
import Game from "../Game";
import { GS_TroopsInfo_TroopsInfoItem } from "../net/proto/DMSG_Plaza_Sub_Troops";
import { Handler } from "../utils/Handler";
import { NodeUtils } from "../utils/ui/NodeUtils";

const { ccclass, property, menu } = cc._decorator;


@ccclass
@menu("Game/ui/cpinfo/CpInfoTowerItem")
export default class CpInfoTowerItem extends cc.Component {

    @property(cc.SpriteAtlas)
    towerUi: cc.SpriteAtlas = null;

    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property([cc.Node])
    lvNodes: cc.Node[] = [];

    @property(cc.Sprite)
    headImg: cc.Sprite = null;

    _towerId: number = null;


    @property(cc.Label)
    typeName: cc.Label = null;

    private _callBack: Handler;
    private _battleLevel: number = 0;

    setTowerMainId(id: number, battleLevel: number) {
        this._towerId = id;
        this._battleLevel = battleLevel;
    }

    setTowerInfo(info: GS_TroopsInfo_TroopsInfoItem, battleLevel: number) {
        this.headImg.spriteFrame = this.towerUi.getSpriteFrame(Game.towerMgr.getFashionHeadName(info.ntroopsid));
        Game.sceneNetMgr.showBatlleLevel(this.lvNodes, battleLevel);
        this.headImg.node.active = true;
        this.icon.spriteFrame = null;
        this.typeName.string = TowerTypeName[info.bttype - 1];
        if (!Game.towerMgr.getActiveByType(info.bttype)) {
            NodeUtils.setNodeGray(this.icon.node , true);
        }
    }

    /**
     * 以静态的形式显示（在关卡信息界面中显示）
     */
    show() {
        Game.sceneNetMgr.showBatlleLevel(this.lvNodes, this._battleLevel);
        this.icon.spriteFrame = this.towerUi.getSpriteFrame("type_" + this._towerId);
        this.typeName.string = TowerTypeName[this._towerId - 1];
        this.headImg.node.active = false;

        
    }

    setClickCallBack(callBack: Handler) {
        this._callBack = callBack;
    }

    onClick() {
        if (this._callBack) {
            this._callBack.executeWith(this.node, this._towerId);
        }
    }
}
