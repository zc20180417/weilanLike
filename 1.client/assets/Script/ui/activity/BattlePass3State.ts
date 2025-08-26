import Game from "../../Game";
import { GS_SceneBattlePass3Private_Item } from "../../net/proto/DMSG_Plaza_Sub_BattlePass";
import List from "../../utils/ui/List";

const { ccclass, property ,menu } = cc._decorator;

@ccclass
@menu('Game/ui/active/BattlePass3State')
export class BattlePass3State extends cc.Component {

    @property(List)
    list:List = null;



    show(data:GS_SceneBattlePass3Private_Item) {
        let configs = Game.battlePassMgr.getBattlePassConfog3();
        if (!configs || configs.length == 0) return;
        let config = configs[0];
        let passItems = config.passItems;
        let dataList = [];
        for (let i = 0 ; i < passItems.length ; i++) {
            dataList.push({ config: config , itemData:passItems[i] , stateData: data });
        }

        this.list.array = dataList;
    }

}