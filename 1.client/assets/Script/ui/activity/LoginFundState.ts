import Game from "../../Game";
import { GS_SceneBattlePass2Private_Item } from "../../net/proto/DMSG_Plaza_Sub_BattlePass";
import List from "../../utils/ui/List";

const { ccclass, property ,menu } = cc._decorator;

@ccclass
@menu('Game/ui/active/LoginFundState')
export class LoginFundState extends cc.Component {

    @property(List)
    list:List = null;



    show(data:GS_SceneBattlePass2Private_Item) {
        let passItems = Game.battlePassMgr.getBattlePass2ConfigPassItem(data.nid);
        if (!passItems) return;
        let config = Game.battlePassMgr.getCurBattlePass2ConfigItem();
        let dataList = [];
        for (let i = 0 ; i < passItems.length ; i++) {
            dataList.push({ config: config , itemData:passItems[i] , stateData:  data });
        }

        this.list.array = dataList;
    }

}