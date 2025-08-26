import { PrizeRollItemData } from "../../common/AllEnum";
import Game from "../../Game";
import { HeadComp } from "../../ui/headPortrait/HeadComp";
import BaseItem from "../../utils/ui/BaseItem";


const { ccclass, property , menu } = cc._decorator;

@ccclass
@menu("Game/LD/ui/LdDropGoodsItem")
export class LdDropGoodsItem extends BaseItem {

     @property(cc.Node)
    bg: cc.Node = null;



    @property(cc.Node)
    coinNode: cc.Node = null;

    @property(HeadComp)
    headComp:HeadComp = null;

    @property(cc.Label)
    titleLabel:cc.Label = null;

    @property(cc.Label)
    desLabel:cc.Label = null;



    public setData(data: PrizeRollItemData, index?: number): void {
        if (!data) return;

        if (data.type == 1) {
            this.coinNode.active = true;
            this.headComp.node.active = false;
            this.titleLabel.string = data.coinTitle;
            this.desLabel.string = `获得${data.count}金币`;
        } else {
            this.coinNode.active = false;
            this.headComp.node.active = true;

            const headInfo = {
                nfaceid: data.itemID,
                nfaceframeid: 0,
            }

            this.headComp.headInfo = headInfo;

            const skill = Game.ldSkillMgr.getStrengthSkill(data.skillId);
            if (skill) {
                this.titleLabel.string = skill.skillName;
                this.desLabel.string = skill.des;
            }

        }

    }

}