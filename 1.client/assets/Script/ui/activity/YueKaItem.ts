
import Game from "../../Game";
import GlobalVal from "../../GlobalVal";
import { GS_SignMonthCardConfig, GS_SignWeekCardConfig } from "../../net/proto/DMSG_Plaza_Sub_Sign";
import { ActorProp, ACTOR_OPENFLAG } from "../../net/socket/handler/MessageEnum";
import { StringUtils } from "../../utils/StringUtils";
import BaseItem from "../../utils/ui/BaseItem";
import { NodeUtils } from "../../utils/ui/NodeUtils";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/ui/yueka/YueKaItem")
export class YueKaItem extends BaseItem {

    @property(cc.Label)
    totalDiamonLabel:cc.Label = null;

    @property(cc.Label)
    nowDiamonLabel:cc.Label = null;

    @property(cc.RichText)
    awardTipsLabel:cc.RichText = null;

    @property(cc.Label)
    normalPirceLabel:cc.Label = null;

    @property(cc.Node)
    line:cc.Node = null;

    @property(cc.RichText)
    buyLabel:cc.RichText = null;

    @property(cc.Label)
    awardDiamonLabel:cc.Label = null;

    @property(cc.Node)
    awardDiamonNode:cc.Node = null;

    @property(cc.Node)
    awardDiamon:cc.Node = null;

    @property(cc.Node)
    offNode:cc.Node = null ;

    @property(cc.Color)
    getedColor:cc.Color = null;

    @property(cc.Color)
    normalColor:cc.Color = null;

    @property(cc.Button)
    awardBtn:cc.Button = null;

    private _config:any;
    setData(data:any) {
        super.setData(data);
        if (!data) return;
        if (data.type == 1) {
            this._config = data.config as GS_SignWeekCardConfig;
            this.initWeekView(this._config);
        } else {
            this._config = data.config as GS_SignMonthCardConfig;
            this.initMonthView(this._config);
        }

        this.nowDiamonLabel.string = this._config.sbuygoods.ngoodsnums + '';
    }

    private initMonthView(config:GS_SignMonthCardConfig) {
        this.totalDiamonLabel.string = (config.sbuygoods.ngoodsnums + (config.sdaygoods.ngoodsnums * 30)) + '';
        this.awardTipsLabel.string = `<color=#576f74>每日免费领取</color><color=#de4304> ${config.sdaygoods.ngoodsnums} 钻石</color><color=#576f74>持续</color><color=#de4304> 30 天</color>
<color=#576f74>30天内可以</color><color=#fc9112>获得无限体力<color>`;
        this.initBase(config , Game.signMgr.isBoughtYueKa() , (Game.actorMgr.getProp(ActorProp.ACTOR_PROP_OPENFLAG) & ACTOR_OPENFLAG.OPENFLAG_FIRSTMONTHCARD) == 0 , Game.signMgr.isYueKaSignedToday());
        
    }

    private initWeekView(config:GS_SignWeekCardConfig) {
        this.totalDiamonLabel.string = (config.sbuygoods.ngoodsnums + (config.sdaygoods.ngoodsnums * 7)) + '';
        let zhoukaStr = GlobalVal.closeAwardVideo ? StringUtils.richTextEventFormat('<u>周卡特权</u>' , 'onWeekTeQuanClick') : "自动跳过所有广告";
        let str = `<color=#576f74>每日免费领取</color><color=#de4304> ${config.sdaygoods.ngoodsnums} 钻石</color><color=#576f74>持续</color><color=#de4304> 7 天</color>
        <color=#576f74>7天内可以` + (GlobalVal.closeAwardVideo ? '使用':'') + (`</color><color=#fc9112>` + zhoukaStr + `<color>`);
        this.awardTipsLabel.string = str;

        this.initBase(config , Game.signMgr.isBoughtWeek() , (Game.actorMgr.getProp(ActorProp.ACTOR_PROP_OPENFLAG) & ACTOR_OPENFLAG.OPENFLAG_FIRSTWEEKCARD) == 0 , Game.signMgr.isWeekSignedToday());
    }

    private initBase(config:any , isBuy:boolean , isFristBuy:boolean , isGet:boolean) {
        if (isFristBuy && config.nrmb == config.nfirstrmb) {
            isFristBuy = false;
        }
        if (isBuy) {
            this.offNode.active = false;
            this.line.active = false;
            this.normalPirceLabel.node.active = false;

            if (isGet) {
                NodeUtils.setNodeGray(this.awardBtn.node , true);
                this.awardBtn.enabled = false;
                this.awardDiamonNode.active = false;
                this.awardDiamon.active = false;
                this.buyLabel.node.active = true;
                this.buyLabel.node.color = this.getedColor;
                this.buyLabel.string = `今日已领取`;
            } else {
                this.buyLabel.node.active = false;
                this.awardDiamonNode.active = true;
                this.awardDiamon.active = true;
                this.awardDiamonLabel.string = config.sdaygoods.ngoodsnums + '';
            }

        } else {
            this.awardDiamonNode.active = false;
            this.awardDiamon.active = false;
            this.buyLabel.node.active = true;
            this.buyLabel.node.color = this.normalColor;
            if (!isFristBuy || GlobalVal.setRechargeFree) {
                this.normalPirceLabel.node.active = false;
                this.line.active = false;
                this.offNode.active = false;
                if (GlobalVal.setRechargeFree) {
                    this.buyLabel.string = "领 取";
                } else {
                    this.buyLabel.string = "<size=48>¥</size>" + "<size=60>" + config.nrmb + "</size>" + "<size=48> 购买</size>";
                }

            } else {
                this.normalPirceLabel.node.active = true;
                this.line.active = true;
                this.offNode.active = true;
                this.normalPirceLabel.string = "原价：¥" + config.nrmb;
                this.buyLabel.string = "<size=48>¥</size>" + "<size=60>" + config.nfirstrmb + "</size>" + "<size=48> 购买</size>";
            }
        }
    }

    

    onBtnClick() {
        if (this.data.type == 1) {
            if (!Game.signMgr.isBoughtWeek()) {
                Game.signMgr.reqBuyWeekCard();
            } else {
                Game.signMgr.reqGetWeekCardReward();
            }
        } else {
            if (!Game.signMgr.isBoughtYueKa()) {
                Game.signMgr.reqBuyMonthCard();
            } else {
                Game.signMgr.reqGetRewardMonthCard();
            }
        }
    }


}