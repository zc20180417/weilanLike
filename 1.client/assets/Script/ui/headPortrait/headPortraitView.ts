import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GameEvent } from "../../utils/GameEvent";
import Dialog from "../../utils/ui/Dialog";
import { PageViewCtrl } from "../../utils/ui/PageViewCtrl";
import { HeadComp } from "./HeadComp";

const {ccclass, property,menu} = cc._decorator;

@ccclass
@menu("Game/ui/TrophyView")

export default class headPortraitView extends Dialog {
    @property(cc.Label)
    roleLab: cc.Label = null;

    @property(PageViewCtrl)
    tapView: PageViewCtrl = null;

    @property(HeadComp)
    headComp:HeadComp = null;

    _index: number = 0;

    private _headId = null;
    private _headframeId = null;
    onLoad(){

        this.onRolePower();

    }
    
    protected addEvent() {
        GameEvent.on(EventEnum.HEAD_PORTRAIT , this.headPortrait, this);
        GameEvent.on(EventEnum.HEAD_PORTRAIT_FRAME , this.headPortraitFrame, this);
    }

    private headPortraitFrame(value:any) {
        this._headframeId = value;
        this.headComp.onHeadFrameChange(value);
    }

    private headPortrait(value:any) {
        this._headId = value;
        this.headComp.onHeadChange(value);
    }

    public submit() {
        if (this._headId != Game.actorMgr.getFaceID()) {  
            Game.actorMgr.reqSetFaceID(this._headId);
        }
       
        if(this._headframeId && this._headframeId != Game.actorMgr.getFaceFrameID()){
            Game.actorMgr.reqSetFaceFrameID(this._headframeId);
        }
        
        this.hide();
    }


    private onRolePower() {
        
        this.roleLab.string =  Game.actorMgr.privateData.szname;
    }

    afterShow() {

        let data = {
            pageDatas: [
                null,
                null,
            ],
            navDatas: [
                {},
                {},
            ]
        }
        this.tapView.init(data);
        this.tapView.selectTap(this._index);
    }

    
}
