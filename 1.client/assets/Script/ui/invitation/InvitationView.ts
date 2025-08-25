
import Dialog from "../../utils/ui/Dialog";
import { PageViewCtrl } from "../../utils/ui/PageViewCtrl";

const { ccclass, property } = cc._decorator;
@ccclass
export default class InvitationView extends Dialog {
   @property(PageViewCtrl)
   tapView: PageViewCtrl = null;



   _index: number = 0;

   onLoad() {
        
    }

    afterShow() {
        let data = {
            pageDatas: [
                {},
                {},
            
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