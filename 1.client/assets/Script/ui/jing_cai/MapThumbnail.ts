import { EResPath } from "../../common/EResPath";
import Game from "../../Game";
import { Handler } from "../../utils/Handler";
import { LoadResQueue } from "../../utils/res/LoadResQueue";
import { StringUtils } from "../../utils/StringUtils";
import ImageLoader from "../../utils/ui/ImageLoader";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/Logic/MapThumbnail")
export class MapThumbnail extends cc.Component {

    @property(cc.Sprite)
    mapImgBg: cc.Sprite = null;

    @property(cc.Node)
    pathNode: cc.Node = null;

    @property(cc.Node)
    itemNode: cc.Node = null;

    @property(ImageLoader)
    gridImg: ImageLoader = null;

    canEnter: boolean = false;

    private _curMapResObj: any;
    private _batchLoad: LoadResQueue;

    init(data: any) {
        this._curMapResObj = data;
        this.loadMapRes();
    }

    stop() {
        if (this._batchLoad && !this._batchLoad.isComplete) {
            this._batchLoad.stop();
            cc.log('this._batchLoad:', this._batchLoad.isComplete ? 'true' : 'false');
        }
    }

    private loadMapRes() {
        if (StringUtils.isNilOrEmpty(this._curMapResObj.szbgpic) || StringUtils.isNilOrEmpty(this._curMapResObj.szsceneres)) return;
        let batchLoadRes: string[] = [EResPath.MAP_BG_BASE + this._curMapResObj.szbgpic,
        EResPath.MAP_CFG_BASE + this._curMapResObj.szsceneres];
        let resTypes: any[] = [null, null];
        if (!StringUtils.isNilOrEmpty(this._curMapResObj.szpathres)) {
            batchLoadRes.push(EResPath.MAP_PATHS + this._curMapResObj.szpathres);
            resTypes.push(cc.SpriteAtlas);
        }
        this.canEnter = false;
        this._batchLoad = Game.resMgr.batchLoadRes(batchLoadRes,
            resTypes,
            null,
            Handler.create(this.onLoadComplete, this));
    }

    private onLoadComplete(paths: string[]) {
        if (!this._curMapResObj) return;

        let obj = Game.resMgr.getRes(EResPath.MAP_BG_BASE + this._curMapResObj.szbgpic);
        this.mapImgBg.spriteFrame = new cc.SpriteFrame(obj);

        if (!StringUtils.isNilOrEmpty(this._curMapResObj.szpathres)) {
            let atlas = Game.resMgr.getRes(EResPath.MAP_PATHS + this._curMapResObj.szpathres);
            let mapCfg = Game.resMgr.getCfg(EResPath.MAP_CFG_BASE + this._curMapResObj.szsceneres);
            if (mapCfg) {
                this.canEnter = true;
                Game.cpMgr.getMapCtrl().initAStar(mapCfg);
                Game.cpMgr.getMapCtrl().createPath(mapCfg, this.pathNode, atlas, this.itemNode, this.gridImg, this._curMapResObj, this._curMapResObj.btpathtype, this._curMapResObj.szpathres);
            }
        }
    }

}