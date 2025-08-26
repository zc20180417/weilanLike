
import Game from "../Game";
import { GameEvent } from "../utils/GameEvent";
import { Handler } from "../utils/Handler";
import { EventEnum } from "./EventEnum";

export default class InputMgr {

    constructor(){
        this.init();
    }

    private init(){
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onEscClick, this);
    }

    //-----------------------------------esc-----------------------------------
    public tryExitGame() {

        if (!cc.sys.isNative) {
            GameEvent.emit(EventEnum.ON_ESC_TOUCH);
            return;
        }

        Game.nativeApi.exit();
        //UiManager.showDialog(EResPath.EXIT_GAME_VIEW , new Handler(this.onExitClick , this));
        //AlertDialog.showAlert("喵~，不再多玩一会吗？" , new Handler(this.onExitClick , this) , null , "退出");
        return true;
    }

    private escHandlerDatas:any[] = [
        {p:Number.POSITIVE_INFINITY, func:this.tryExitGame, handler:new Handler(this.tryExitGame, this)},
    ];

    private onExitClick() {
        Game.nativeApi.exit();
    }

    private onEscClick(e){
        if(e.keyCode == cc.macro.KEY.escape || e.keyCode == cc.macro.KEY.back) {
            for(let i=0;i<this.escHandlerDatas.length;i++){
                let d = this.escHandlerDatas[i];
                if(d.handler && d.handler.execute()){
                    break;
                }
            }
        }
    }

    public onEsc(handler:Handler, priority:number){
        if(!handler) return;
        let index = 0;
        for(let i=this.escHandlerDatas.length-1;i>=0;i--){
            let d = this.escHandlerDatas[i];
            if(priority > d.p){
                index = i;
                break;
            }
        }
        this.escHandlerDatas.splice(index, 0, {p:priority, handler:handler});
    }

    public offEsc(handler:Handler){
        for(let i=this.escHandlerDatas.length-1;i>=0;i--){
            let d = this.escHandlerDatas[i];
            if(d.handler == handler){
                this.escHandlerDatas.splice(i, 1);
            }
        }
    }

}