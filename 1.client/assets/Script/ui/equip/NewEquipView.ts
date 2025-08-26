
import { EResPath } from "../../common/EResPath";
import Game from "../../Game";
import TroopsMgr from "../../net/mgr/TroopsMgr";
import RotationParticle from "../../propEffect/RotationParticle";
import { Handler } from "../../utils/Handler";
import { StringUtils } from "../../utils/StringUtils";
import Dialog from "../../utils/ui/Dialog";
import ImageLoader from "../../utils/ui/ImageLoader";
import { FlyEquipUtils } from "./FlyEquipUtils";
import { NewEquipLine } from "./NewEquipLine";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/ui/equip/NewEquipView")
export default class NewEquipView extends Dialog {

    @property(ImageLoader)
    catBody: ImageLoader = null;

    @property(cc.Node)
    lineNode: cc.Node = null;

    @property([cc.Label])
    infoLabels:cc.Label[] = [];

    @property(RotationParticle)
    left: RotationParticle = null;

    @property(RotationParticle)
    right: RotationParticle = null;

    private _handler: Handler;
    private _data: any;
    private _icoNodes: cc.Node[] = [];
    private _dataList:any[] = [];
    private _preNode:cc.Node = null;
    private _towerName:string = '';
    private _indexs:number[] = [];

    setData(data: any) {

        if (this._data) {
            if (this._data.towerid == data.towerid) {
                this._dataList.push(data);
                this.tryShow();
                return;
            } else {

                if (this._preNode) {
                    this.lineNode.removeChild(this._preNode);
                }
                Game.resMgr.removeLoad(EResPath.NEW_EQUIP_LINE + this._data.towerid, this._handler);
                this._dataList = [data];
            }
        } else {
            this._dataList = [data];
        }

        this._data = data;
        //炮塔图标
        //this.icon.url = EResPath.TOWER_IMG + this._currTowerCfg.sz3dpicres;
        let towerCfg = Game.towerMgr.getTroopBaseInfo(data.towerid);
        this.catBody.url = EResPath.TOWER_IMG + Game.towerMgr.get3dpicres(towerCfg.ntroopsid, towerCfg);

        if (!this._handler) {
            this._handler = new Handler(this.onLoadLine, this);
        }
        this._towerName = Game.towerMgr.getTowerName(towerCfg.ntroopsid, towerCfg)
        Game.resMgr.loadRes(EResPath.NEW_EQUIP_LINE + data.towerid, cc.Prefab, this._handler);
    }

    protected beforeShow() {

        if (this.blackLayer) {
            this.blackLayer.color = cc.Color.BLACK;
            this.blackLayer.opacity = 235;
        }

        this.left.node.setPosition(cc.v2(-cc.winSize.width * 0.5, -200));
        this.right.node.setPosition(cc.v2(cc.winSize.width * 0.5, -200));
    }

    afterShow() {

        this.left.resetSystem();
        this.right.resetSystem();
    }

    afterHide() {
        if (this._data && this._handler) {
            Game.resMgr.removeLoad(EResPath.NEW_EQUIP_LINE + this._data.towerid, this._handler);
        }
    }

    hide() {
        super.hide(false);
    }

    protected beforeHide() {
        let towerInfo = Game.towerMgr.getTroopBaseInfo(this._data.towerid);
        if (towerInfo && this._icoNodes.length > 0) {
            FlyEquipUtils.flyEquip(towerInfo, this._indexs, this._icoNodes);
        }
    }

    private onLoadLine(resData: cc.Prefab, path: string) {
        if (path != EResPath.NEW_EQUIP_LINE + this._data.towerid) return;
        Game.resMgr.addRef(path);
        let node = cc.instantiate(resData);
        this.lineNode.addChild(node);
        this._preNode = node;
        this.tryShowLine();
    }

    private tryShow() {
        if (!this._preNode) return;
        this.tryShowLine();
    }

    private tryShowLine() {
        let comp = this._preNode.getComponent(NewEquipLine);
        this._indexs.length = 0;
        
        let len = this._dataList.length;
        for (let i = 0 ; i < len ; i++) {
            this._indexs.push(this._dataList[i].equipIndex);
            let ico = comp.equipIcos[this._dataList[i].equipIndex];
            if (this._icoNodes.indexOf(ico) == -1) {
                this._icoNodes.push(ico);
            }
            this.infoLabels[i].string = StringUtils.format(TroopsMgr.EQUIP_INFO_LIST1[this._dataList[i].equipIndex], this._towerName , Math.floor(this._dataList[i].addProp));
        }
        
        comp.showIndex(this._indexs);
    }

}