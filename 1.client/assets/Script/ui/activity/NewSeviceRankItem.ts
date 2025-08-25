import { GS_NewSeviceRankingData_RankingItem } from "../../net/proto/DMSG_Plaza_Sub_NewSeviceRanking";
import { StringUtils } from "../../utils/StringUtils";
import BaseItem from "../../utils/ui/BaseItem";
import { HeadComp } from "../headPortrait/HeadComp";

const { ccclass, property ,menu } = cc._decorator;

@ccclass
@menu('Game/ui/active/NewSeviceRankItem')
export class NewSeviceRankItem extends BaseItem {


    @property(HeadComp)
    headComp:HeadComp = null;

    @property(cc.Label)
    rankLabel:cc.Label = null;

    @property(cc.Label)
    nameLabel:cc.Label = null;

    @property(cc.Label)
    warLabel:cc.Label = null;

    @property(cc.Label)
    timeLabel:cc.Label = null;
    
    @property(cc.Node)
    bg:cc.Node = null;

    @property(cc.Label)
    xuweiyidai:cc.Label = null;

    @property(cc.Label)
    timeTitleLabel:cc.Label = null;

    setData(data:any , index?:number) {
        super.setData(data , index);
        if (!data) return;

        let temp = data as GS_NewSeviceRankingData_RankingItem;
        if (temp.nfaceid > 0 || (!Number.isNaN(temp.nactordbid) && temp.nactordbid != undefined )) {
            this.headComp.node.active = true;
            this.headComp.headInfo = temp;
        } else {
            this.headComp.node.active = false;
        }

        if (this.rankLabel) {
            this.rankLabel.string = (index + 4).toString();
        }

        if (Number.isNaN(temp.nactordbid) || temp.nactordbid == undefined) {
            this.nameLabel.string = index == undefined ? "虚位以待" : "";
            this.timeLabel.node.active = false;
            this.warLabel.node.active = false;
            if (this.xuweiyidai) {
                this.xuweiyidai.node.active = true;
                this.timeTitleLabel.node.active = false;
            }



        } else {
            
            if (this.xuweiyidai) {
                this.xuweiyidai.node.active = false;
                this.timeTitleLabel.node.active = true;
            }
            this.timeLabel.node.active = true;
            this.warLabel.node.active = true;
            this.headComp.headInfo = temp;
            this.nameLabel.string = temp.szname;
            this.warLabel.string =  `第${temp.nvalue1}关`;
            this.timeLabel.string = StringUtils.formateTimeTo(temp.nvalue2 , '-' , true);
            

        }

        if (this.bg) {
            this.bg.active = index % 2 == 1;
        }

    }

}