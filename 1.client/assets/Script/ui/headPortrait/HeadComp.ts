import { EResPath } from "../../common/EResPath";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { ActorProp } from "../../net/socket/handler/MessageEnum";
import { GameEvent } from "../../utils/GameEvent";
import { Handler } from "../../utils/Handler";
import ImageLoader from "../../utils/ui/ImageLoader";

const { ccclass, property, menu } = cc._decorator;

//头像信息
export interface HeadInfo {
    nfaceid: number;
    nfaceframeid: number;
    szmd5facefile?: string;
    szmd5face?:string;
}

@ccclass
@menu("Game/ui/HeadComp")
export class HeadComp extends cc.Component {

    @property(ImageLoader)
    headIco: ImageLoader = null;

    @property(ImageLoader)
    headFrame: ImageLoader = null;

    @property(cc.SpriteAtlas)
    headAtlas: cc.SpriteAtlas = null;

    @property(cc.Boolean)
    isSelf: boolean = true;

    @property
    isTujianReward: boolean = false;

    private _handler:Handler;
    public _headInfo: HeadInfo = null;
    private _frameAniId:number = -1;
    private _frameEftNode:cc.Node = null;
    private _curFrameId:number = -1;

    @property
    //头像数据
    set headInfo(value:HeadInfo){
        this._headInfo=value;
        this.isSelf?this.showSelf():this.showOther();
    }

    get headInfo(){
        return this._headInfo;
    }

    start() {
        if (this.isSelf) {
            GameEvent.on(EventEnum.PLAYER_PROP_CHANGE + ActorProp.ACTOR_PROP_FACEID, this.onHeadChange, this);
            GameEvent.on(EventEnum.PLAYER_PROP_CHANGE + ActorProp.ACTOR_PROP_FACEFRAMEID, this.onHeadFrameChange, this);
            this.showSelf();
        } else {//显示其他玩家头像
            this.showOther();
        }
    }

    onDestroy() {
        this.removeLoadEft();
        GameEvent.targetOff(this);
    }

    showSelf() {
        let faceid = Game.actorMgr?.getFaceID() || 0;
        let faceFrameID = Game.actorMgr?.getFaceFrameID() || 0;
        this.onHeadChange(faceid);
        this.onHeadFrameChange(faceFrameID);
    }

    showOther() {
        if (!this.headInfo) return;
        if (this.isTujianReward) {
            this.headIco.setSpriteFrame(this.headAtlas.getSpriteFrame("tower_" + this.headInfo.nfaceid));
            this.onHeadFrameChange(this.headInfo.nfaceframeid);
            return;
        }
        //头像
        if (this.headInfo.nfaceid > 0) {
            this.headIco.setSpriteFrame(this.headAtlas.getSpriteFrame("tower_" + this.headInfo.nfaceid));
        } else {
            this.headIco.setFaceFile(this.headInfo.szmd5facefile || this.headInfo.szmd5face);
        }

        //头像框
        this.onHeadFrameChange(this.headInfo.nfaceframeid);
    }

    onHeadChange(value: number) {
        if (value > 0) {
            this.headIco.setSpriteFrame(this.headAtlas.getSpriteFrame("tower_" + value));
        } else {
            this.headIco.setFaceFile(Game.actorMgr?.privateData?.szmd5facefile);
        }
    }

    onHeadFrameChange(value: number) {
        if (!this.headFrame || value == this._curFrameId) return;
        this.removeLoadEft();
        this._curFrameId = value;
        const frameInfo = Game.actorMgr?.getFaceFrameItem(value);
        if (frameInfo && frameInfo.naniid > 0) {
            this._frameAniId = frameInfo.naniid; 
            Game.resMgr.loadRes(EResPath.HEAD_EFT + this._frameAniId , cc.Prefab , Handler.create(this.onEftLoaded , this));
        } else {
            this.headFrame.setSpriteFrame(this.headAtlas.getSpriteFrame("frame_" + value));
        }
    
       
    }

    private onEftLoaded(data:any , path:string) {
        if (data) {
            Game.resMgr.addRef(path);
            const eftNode = cc.instantiate(data);
            this._frameEftNode = eftNode;
            this.headFrame.node.addChild(eftNode);
            this.headFrame.url = '';
            this.headFrame.spriteTarget.spriteFrame = null;
        }
    }

    private removeLoadEft() {
        if (this._frameEftNode) {
            this._frameEftNode.removeFromParent();
            this._frameEftNode = null;
        }
        if (this._frameAniId > 0) {
            Game.resMgr.removeLoad(EResPath.HEAD_EFT + this._frameAniId , Handler.create(this.onEftLoaded , this));
            this._frameAniId = -1;
        }
    }

}