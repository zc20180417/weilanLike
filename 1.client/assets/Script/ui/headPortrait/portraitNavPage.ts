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
export default class portraitNavPage extends PageView {
 
    @property(List)
    list:List = null;

    /*headPortrait:any = [
        'tower_1_1','tower_1_2','tower_1_3','tower_1_4','tower_2_1','tower_2_2','tower_2_3','tower_2_4',
        'tower_3_1','tower_3_2','tower_3_3','tower_3_4','tower_4_1','tower_4_2','tower_4_3','tower_4_4',
        'tower_5_1','tower_5_2','tower_5_3','tower_5_4','tower_6_1','tower_6_2','tower_6_3','tower_6_4',
        'tower_7_1','tower_7_2','tower_7_3','tower_7_4',
    ];*/
    

    protected doShow() {
        this.list.selectEnable = true;
        let faceConfig = Game.actorMgr.getFaceConfig();
        if (!faceConfig || !faceConfig.data1) return;
        let array = Game.actorMgr.getFaceConfig().data1;
        this.list.array = array;
        let faceId = Game.actorMgr.getFaceID();
        if (this.list.selectedIndex == -1 && faceId != 0) {
            let len = array.length;
            let index = -1;
            for (let i = 0 ; i < len ; i++) {
                if (array[i].nid == faceId) {
                    index = i;
                    break;
                }
            }

            this.list.selectedIndex = index;
        }
    }

  
}
