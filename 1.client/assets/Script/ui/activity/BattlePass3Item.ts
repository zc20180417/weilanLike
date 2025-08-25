import Game from "../../Game";
import { GS_SceneBattlePass3Config_PassItem } from "../../net/proto/DMSG_Plaza_Sub_BattlePass";
import { StringUtils } from "../../utils/StringUtils";
import BaseItem from "../../utils/ui/BaseItem";
import { NodeUtils } from "../../utils/ui/NodeUtils";
import Utils from "../../utils/Utils";
import GoodsItem, { GoodsItemData } from "../newhand_book/GoodsItem";

const { ccclass, property ,menu } = cc._decorator;

@ccclass
@menu('Game/ui/active/BattlePass3Item')
export class BattlePass3Item extends BaseItem {


    @property(cc.Label)
    titleLabel:cc.Label = null;

    @property(cc.RichText)
    progressLabel:cc.RichText = null;

    @property(cc.Node)
    getBtn:cc.Node = null;

    @property(cc.Node)
    getedBtn:cc.Node = null;

    @property(cc.Label)
    getBtnLabel:cc.Label = null;

    @property(GoodsItem)
    goodsItem1:GoodsItem = null;

    @property(GoodsItem)
    goodsItem2:GoodsItem = null;

    @property(GoodsItem)
    goodsItem3:GoodsItem = null;

    public setData(data:any , index?:number) {
        super.setData(data , index);
        if (!this.data) return;
        let itemData = data.itemData as GS_SceneBattlePass3Config_PassItem;
        if (itemData.nwarid > 0) {
            this.titleLabel.string = `通关第${itemData.nwarid}关`;
        }

        let progressValue = Game.sceneNetMgr.getLastWarID();
        this.progressLabel.string = `（${StringUtils.fontColor(progressValue + "" , "#d33441" )}/${itemData.nwarid}）`;
        let geted = Utils.checkBitFlag(data.stateData.nflag1 , index);
        let geted2 = Utils.checkBitFlag(data.stateData.nflag2 , index);
        let geted3 = Utils.checkBitFlag(data.stateData.nflag3 , index);
        let goodsData1:GoodsItemData = {
            goodsId:itemData.ngoodsid1,
            nums:itemData.ngoodsnum1,
            showGou:geted,
            gray:geted,
            prefix:"x",
        }

        this.goodsItem1.setData(goodsData1);
        
        let goodsData2:GoodsItemData = {
            goodsId:itemData.ngoodsid2,
            nums:itemData.ngoodsnum2,
            showGou:geted2,
            prefix:"x",
            gray:geted2 || data.stateData.btmode < 1,
        }

        this.goodsItem2.setData(goodsData2);

        if (this.goodsItem3) {
            let goodsData3:GoodsItemData = {
                goodsId:itemData.ngoodsid3,
                nums:itemData.ngoodsnum3,
                showGou:geted3,
                prefix:"x",
                gray:geted3 || data.stateData.btmode < 2,
            }
    
            this.goodsItem3.setData(goodsData3);
        }

        if (progressValue < itemData.nwarid) {
            this.getedBtn.active = false;
            this.getBtn.active = true;
            NodeUtils.enabled(this.getBtn.getComponent(cc.Button) , false);
        } else {

            let state = 0;
            switch (data.stateData.btmode) {
                case 2:
                    if (geted && geted2 && geted3) {
                        state = 1;
                    } else if (geted || geted2 || geted3) {
                        state = 2;
                    }
                    break;
                case 1:
                    if (geted && geted2) {
                        state = 1;
                    } else if (geted || geted2) {
                        state = 2;
                    }
                    break;
                case 0:
                    if (geted) {
                        state = 1;
                    }
                    break;
            
                default:
                    break;
            }
            
            if (state == 0 || state == 2) {
                this.getedBtn.active = false;
                this.getBtn.active = true;
                this.getBtnLabel.string = state == 0 ? "领取" : "继续领取";
                this.getBtnLabel.fontSize = state == 0 ? 44 : 36;
                NodeUtils.enabled(this.getBtn.getComponent(cc.Button) , true);
            } else  {
                this.getedBtn.active = true;
                this.getBtn.active = false;
            }
        }
    }

    onClick() {
        if (!this.data) return;
        // let dtime = this.data.config.nendtime - (GlobalVal.getServerTime() * 0.001);
        // if (dtime <= 0) {
        //     SystemTipsMgr.instance.notice('活动已结束');
        // }
        Game.battlePassMgr.reqBattlePass3GetReward(this.data.config.baseItem.nid , this.index);
    }

}