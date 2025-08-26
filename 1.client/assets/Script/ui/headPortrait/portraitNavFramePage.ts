// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Game from "../../Game";
import List from "../../utils/ui/List";
import { PageView } from "../../utils/ui/PageView";

const {ccclass, property} = cc._decorator;

@ccclass
export default class portraitNavFramePage extends PageView {

    @property(List)
    list:List = null;



    /*headPortraitFrame:any = [
        'frame_1','frame_2','frame_3','frame_4','frame_5','frame_6','frame_7','frame_8','frame_9',
        'frame_10','frame_11','frame_12','frame_13'

    ];
    */

    protected doShow() {
        this.list.selectEnable = true;
        let array = Game.actorMgr.getFaceConfig().data2;
        this.list.array = array;
        let frameId = Game.actorMgr.getFaceFrameID();
        if (this.list.selectedIndex == -1 && frameId != 0) {
            let len = array.length;
            let index = -1;
            for (let i = 0 ; i < len ; i++) {
                if (array[i].nid == frameId) {
                    index = i;
                    break;
                }
            }

            this.list.selectedIndex = index;
        }
    }


}
