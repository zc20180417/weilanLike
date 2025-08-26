import Game from "../../Game";
import { GS_SceneBattlePass4Private_Item } from "../../net/proto/DMSG_Plaza_Sub_BattlePass";
import List from "../../utils/ui/List";

const { ccclass, property ,menu } = cc._decorator;

@ccclass
@menu('Game/ui/active/BattlePass4State')
export class BattlePass4State extends cc.Component {

    @property(List)
    list:List = null;



    show(data:GS_SceneBattlePass4Private_Item) {
        let config = Game.battlePassMgr.getBattlePassConfog4();
        if (!config) return;
        let passItems = config.passItems;
        let dataList = [];
        for (let i = 0 ; i < passItems.length ; i++) {
            dataList.push({ config: config , itemData:passItems[i] , stateData: data });
        }

        this.list.array = dataList;
    }

}