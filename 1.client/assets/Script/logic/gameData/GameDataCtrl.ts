import { EMODULE } from "../../common/AllEnum";
import { LocalStorageMgr } from "../../utils/LocalStorageMgr";
import SysMgr from "../../common/SysMgr";
import { Handler } from "../../utils/Handler";

export class GameDataCtrl {

    module:EMODULE;


    read() { }
 
    write() {}


    /**读取该模块数据 */
    protected readData():any {
        return JSON.parse(LocalStorageMgr.getItem(this.module));
    }

    /**保存数据 */
    protected writeData(value:any) {
        LocalStorageMgr.setItem(this.module ,value);
    }

    protected tryWrite() {
        SysMgr.instance.callLater(Handler.create(this.write , this) , true);
    }

}