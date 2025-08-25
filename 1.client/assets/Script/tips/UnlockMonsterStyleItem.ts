// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EResPath } from "../common/EResPath";
import Game from "../Game";
import { UIModelComp } from "../ui/UIModelComp";
import ImageLoader from "../utils/ui/ImageLoader";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UnlockMonsterStyleItem extends cc.Component {
    @property(ImageLoader)
    icon: ImageLoader = null;

    @property(cc.Node)
    newNode: cc.Node = null;

    @property(cc.Node)
    content: cc.Node = null;

    private _data: any = null;

    private _limitX: number = 70;
    private _limitY: number = 70;

    private _uiModel: UIModelComp = null;

    private _newNodeOffset: cc.Vec2 = cc.v2(15, 35);

    public setData(data: any) {
        if (!data) return;
        this._data = data;

        let worldBoundingBox = this.node.getBoundingBoxToWorld();
        let scaleRate = Math.min(this._limitY / worldBoundingBox.height, this._limitX / worldBoundingBox.width);
        this.content.scale = scaleRate;
        this.newNode.x += this._newNodeOffset.x;
        this.newNode.y += worldBoundingBox.height * scaleRate - this._newNodeOffset.y;
        let monsterInfo = Game.monsterManualMgr.getMonsterCfg(data.id);
        if (!monsterInfo) return;

        // this.icon.node.x = data.monsterX;
        // this.icon.node.y = data.monsterY;
        this.icon.node.scaleX = data.monsterScaleX;
        this.icon.node.scaleY = data.monsterScaleY;

        this._uiModel = this.icon.node.getComponent(UIModelComp);

        //对椰仔、鳄梨海盗、罗密*朱特殊处理
        // if (data.id == 24) {
        //     this.icon.node.y -= 30;
        // } else if (data.id == 18 || data.id == 26) {
        //     this.icon.node.y -= 40;
        // }

        if (monsterInfo.nbookspicid > 0) {
            this.icon.setPicId(monsterInfo.nbookspicid);
        } else {
            this._uiModel && this._uiModel.setModelUrl(EResPath.CREATURE_MONSTER + monsterInfo.resName);
        }
    }
}
