import { NewSeviceRankType } from "../../common/AllEnum";
import Game from "../../Game";
import Dialog from "../../utils/ui/Dialog";
import List from "../../utils/ui/List";

const { ccclass, property ,menu } = cc._decorator;

@ccclass
@menu('Game/ui/active/NewSeviceRankRewardTipsView')
export default class NewSeviceRankRewardTipsView extends Dialog {
    @property(List)
    list: List = null;

    beforeShow() {
        let config = Game.newSevicerankMgr.getRankConfig(NewSeviceRankType.COMMON_WAR);
        this.list.array = config ? config.rewards : [];
    }
}