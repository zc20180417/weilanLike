import Dialog from "./Dialog";
import { Handler } from "../Handler";
import { GameEvent } from "../GameEvent";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SelectAlertDialog extends Dialog {

    public static TYPE_OK:number = 1;


    @property({
        type: cc.Node,
    })
    btnOk: cc.Node = null;
    @property({
        type: cc.Node,
    })
    btnCancel: cc.Node = null;

    @property({
        type: cc.Label,
    })
    labelContent: cc.Label = null;

    @property(cc.Label)
    labelOK:cc.Label = null;
    @property(cc.Label)
    labelCancel:cc.Label = null;

    @property(cc.Label)
    labelCd:cc.Label = null;

    panelTime:number;

    private type:number = 0;
    private data:any;
    private btnOkX:number = 0;

    onLoad(){
        super.onLoad();
        //GameEvent.on(EventEnum.ON_GAME_SHOW, this.onGameShow, this);
        this.btnOkX = this.btnOk.x;
    }

    private onGameShow(delta:number){
        if(this.panelTime > 0){
            this._updateCloseCd(delta);
        }
    }

    private onOKClick(evt:any) {
        let index:number = 2;
        if (this.data[index]) {
            (this.data[index] as Handler).execute();
        }
        this.hide();
    }
    private onCancelClick(evt:any){
        let index:number = 3;
        if (this.data[index]) {
            (this.data[index] as Handler).execute();
        }
        this.hide();
    }

    public setData(data: any) {
        this.data = data;

        if(data[0]){
            //选择
            this.btnCancel.active = true;
            this.btnOk.x = this.btnOkX;

            this.panelTime = data[6];
            this.labelCd.string = Math.floor(this.panelTime).toString();
            this.schedule(this._updateCloseCd, 0.2);
        }else{
            //不能选择
            this.btnCancel.active = false;
            this.labelCd.string = "";
            this.btnOk.x = 0;
        }

        this.labelContent.string = data[1];
        this.btnOk.on("click", this.onOKClick, this);
        this.btnCancel.on("click", this.onCancelClick, this);

        this.labelOK.string = data[4];
        this.labelCancel.string = data[5];
    }

    private _updateCloseCd(dt){
        this.panelTime -= dt;
        if(this.panelTime <= 0){
            this.panelTime = 0;
            this.unschedule(this._updateCloseCd);
            this.onCancelClick(null);
        }
        this.labelCd.string = Math.floor(this.panelTime).toString();
    }

    /**
     * @param content 内容
     * @param okCallback 确定按钮回调
     * @param cancelCallback 取消按钮回调
     */
    public static showSelectAlert(content: string,  
                            okCallback?:Handler , 
                            cancelCallback?:Handler , 
                            okStr:string = "确定",
                            cancelStr:string = "取消",
                            panelTime:number = 10) {
        let data = [true, content, okCallback, cancelCallback, okStr, cancelStr, panelTime]
        //Dialog.show(DialogType.SelectAlertDialog ,null ,data)
    }
    
    public static showAlert(content:string, okCallback?:Handler, okStr:string = "确定"){
        let data = [false, content, okCallback, null, okStr, null, 100];
        //Dialog.show(DialogType.SelectAlertDialog, null, data);
    }
}