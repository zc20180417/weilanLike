import Dialog from "./Dialog";
import { Handler } from "../Handler";
import { DialogType } from "../../common/DialogType";
import { UiManager } from "../UiMgr";

const {ccclass, property , menu} = cc._decorator;

@ccclass
@menu("Game/ui/AlertDialog")
export default class AlertDialog extends Dialog {

    public static TYPE_OK:number = 1;

    @property({
        type: cc.Node,
    })
    btnOk: cc.Node = null;

    @property(cc.Node)
    btnCancel:cc.Node = null;

    @property({
        type: cc.Label,
    })
    contentLable: cc.Label = null;

    /*
    @property(cc.Label)
    okLabel:cc.Label = null;

    @property(cc.Label)
    titleLabel:cc.Label = null;
    */

    private type:number = 0;
    private data:any;
    private onBtnClick(evt:any , param:string) {
        let index = Number(param);
        if (this.data[index]) {
            (this.data[index] as Handler).execute();
        }
        this.hide();
    }

    public setData(data: any) {
        this.data = data;
        this.contentLable.string = data[0];
        
        if (data[3] == 2) {
            this.btnCancel.active = false;
            this.btnOk.x = 0;
        }
        //this.okLabel.string = data[3];
        //this.titleLabel.string = data[4];
    }

    /**
     * @param content 内容
     * @param okCallback 确定按钮回调
     * @param cancelCallback 取消按钮回调
     */
    public static showAlert(content: string,  
                            okCallback?:Handler , 
                            cancelCallback?:Handler , 
                            type:number = 1) {
        let data = [content, okCallback, cancelCallback,type]
        UiManager.showDialog(DialogType.AlertDialog ,data);
    }
    

}