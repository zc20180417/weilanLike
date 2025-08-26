
import { Handler } from "../../../utils/Handler";
import { Monster } from "../../sceneObjs/Monster";
import { DragonBonesComp } from "../animation/DragonBonesComp";
import BindSoComp from "./BindSoComp";

const {ccclass, property , menu} = cc._decorator;

@ccclass
@menu("Game/comp/JingjiComp")
export class JingjiComp extends BindSoComp {

    @property
    createAction:string = '';

    @property
    idleAction:string = '';

    @property(DragonBonesComp)
    dbComp:DragonBonesComp = null;

    private _self:Monster;
    private _playEndHandler:Handler;
    private _isOpenEnd:boolean = false;


    onLoad() {
       this._playEndHandler = new Handler(this.onPlayEnd , this); 
    }

    onAdd() {
        this._self = this.owner as Monster;
        this._isOpenEnd = false;
        this.dbComp.aniCompletedHandler = this._playEndHandler;
        this.dbComp.playAction(this.createAction , false);
    }

    onRemove() {
        if (this._self) {
            this.dbComp.aniCompletedHandler = null;
        }
    }

    private onPlayEnd(name:string) {
        if (!this._isOpenEnd ) {
            this._isOpenEnd = true;
            this.dbComp.playAction(this.idleAction , true);
        }
    }
    
}