
import { MissionMainConfig } from "../../common/ConfigInterface";
import { EResPath } from "../../common/EResPath";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import GlobalVal from "../../GlobalVal";
import AStar from "../../logic/map/AStar";
import { GS_SceneOpenWar } from "../../net/proto/DMSG_Plaza_Sub_Scene";
import { GameEvent } from "../../utils/GameEvent";
import { Handler } from "../../utils/Handler";



export class LdMapCtrl {

    //////////////////////////////////当前地图信息
    // gridFrameColor: cc.Color = null;
    // gridFrameAlpha: number = 255;

    protected _curMapCfg: MissionMainConfig;
    protected _curMapID: number = 0;
    //private _curMapUrl:string = "";
    protected _curMapData: any = null;
    protected _row: number = 0;
    protected _col: number = 0;
    protected _mapPos: cc.Vec2 = cc.Vec2.ZERO;
    protected _mapImg: cc.Sprite = null;


    protected _mapGridCraphics: cc.Graphics;

    protected _loaded: boolean = false;
    protected _astar: AStar = AStar.getInstance();

    // protected _curMapResObj: any = {};

    get curMapID(): number {
        return this._curMapID;
    }

    init(gs: cc.Graphics , mapBg: cc.Sprite) {
        this._mapImg = mapBg;
        this._mapGridCraphics = gs;
    }


    ///////////////////////////////////////////////////////
    enterMap() {
        this.removeScene();
        this._loaded = false;
        this._curMapCfg = GlobalVal.curMapCfg;
        this._curMapID = GlobalVal.curMapCfg.nwarid;

        this.initMapInfos();
        this.loadMapInfos();
    }

    exitMap() {
        this.removeScene();
    }

    update() {
        if (!this._loaded) return;
    }





    getMapData(): any {
        return this._curMapData;
    }

    getRow(): number {
        return this._row;
    }

    getCol(): number {
        return this._col;
    }
    ///////////////////////////////////////////////////////
    protected removeScene() {

    }

    private startEnterMap() {

    }



    protected initMapInfos() {
    }

    protected loadMapInfos() {
        let batchLoadRes: string[] = [EResPath.MAP_BG_BASE + this._curMapCfg.szbgpic];
        let resTypes: any[] = [null];
        Game.resMgr.batchLoadRes(batchLoadRes,
            resTypes,
            null,
            Handler.create(this.onLoadComplete, this));
    }

    protected onLoadComplete(paths: string[]) {
        this.startEnterMap();
        let obj = Game.resMgr.getRes(EResPath.MAP_BG_BASE + this._curMapCfg.szbgpic);
        this.setBgImg(this._mapImg, obj);
        this._loaded = true;

        GameEvent.emit(EventEnum.INIT_MAP_COMPLETE);
    }

    protected setBgImg(sp: cc.Sprite, texture: cc.Texture2D) {
        sp.spriteFrame = new cc.SpriteFrame(texture);
    }

    


    
   
    

    









}


