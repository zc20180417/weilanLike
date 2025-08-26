import Game from "../../Game";
import { GS_TroopsInfo_TroopsInfoItem } from "../../net/proto/DMSG_Plaza_Sub_Troops";
import { Handler } from "../../utils/Handler";
import { NodeUtils } from "../../utils/ui/NodeUtils";
import CpInfoSelectTowerItem from "./CpInfoSelectTowerItem";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/ui/cpinfo/CpInfoSelectTowerView")
export default class CpInfoSelectTowerView extends cc.Component {

    @property([CpInfoSelectTowerItem])
    towerItems: CpInfoSelectTowerItem[] = [];

    @property(cc.Node)
    towersNode: cc.Node = null;

    @property(cc.Node)
    blackLayer: cc.Node = null;

    private _preParent: cc.Node = null;
    private _towerNode: cc.Node = null;
    private _selectTowerCallBack: Handler = null;
    private _hideCallBack: Handler = null;
    private _selfCallBack: Handler = null;
    private _mainID: number = 0;
    private _curSelectComp: CpInfoSelectTowerItem;
    start() {
        this.blackLayer.setContentSize(cc.winSize);
    }

    setTowerInfos(node: cc.Node, towerItemInfos: GS_TroopsInfo_TroopsInfoItem[], battleValue: number) {
        if (node == this._towerNode) return;
        this.node.active = true;
        this._towerNode = node;
        this._preParent = node.parent;
        this._mainID = towerItemInfos[0].bttype;
        NodeUtils.addToParent(node, this.node);
        if (!this._selfCallBack) {
            this._selfCallBack = new Handler(this.onSelectCallBack, this);
        }
        let fightid = Game.towerMgr.getFightTowerID(this._mainID);
        for (let i = 0, len = this.towerItems.length; i < len; i++) {
            let info = towerItemInfos[i];
            if (!info) {
                this.towerItems[i].setVisiable(false);
                continue;
            } else {
                this.towerItems[i].setVisiable(true);
            }
            let battleNum = Game.towerMgr.getPower(info.ntroopsid, Game.towerMgr.getStar(info.ntroopsid));
            let battleLevel = Game.sceneNetMgr.calcTowerBattleLevel(battleNum, battleValue);
            this.towerItems[i].setTowerInfo(info, battleLevel);
            this.towerItems[i].setClickCallBack(this._selfCallBack);

            if (fightid == info.ntroopsid) {
                if (this._selectTowerCallBack) {
                    this._selectTowerCallBack.executeWith(info, battleLevel);
                }

                this.towerItems[i].selected = true;
                this._curSelectComp = this.towerItems[i];
            }

        }

        this.towersNode.x = node.x;
    }

    onClick() {
        if (this._towerNode && this._preParent) {
            NodeUtils.addToParent(this._towerNode, this._preParent);
            this._preParent = null;
            this._towerNode = null;
        }
        this.node.active = false;

        if (this._hideCallBack) {
            this._hideCallBack.executeWith(this._mainID);
        }
    }



    setSelectTowerCallBack(callBack: Handler, hideCallBack: Handler) {
        this._selectTowerCallBack = callBack;
        this._hideCallBack = hideCallBack;
    }

    get towerNode(): cc.Node {
        return this._towerNode;
    }

    private onSelectCallBack(a: any, b: any, c: any) {
        if (this._selectTowerCallBack) {
            this._selectTowerCallBack.executeWith(a, b);
        }

        if (this._curSelectComp) {
            this._curSelectComp.selected = false;
        }

        c.selected = true;
        this._curSelectComp = c;
    }

}