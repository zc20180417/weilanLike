import { EResPath } from "../../common/EResPath";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GS_FestivalActivityConfig, GS_FestivalActivityConfig_CombineConfig, GS_FestivalActivityConfig_Material, GS_FestivalActivityPrivate } from "../../net/proto/DMSG_Plaza_Sub_FestivalActivity";
import { GameEvent } from "../../utils/GameEvent";
import ImageLoader from "../../utils/ui/ImageLoader";
import List from "../../utils/ui/List";
import { NodeUtils } from "../../utils/ui/NodeUtils";
import { PageView } from "../../utils/ui/PageView";
import { UiManager } from "../../utils/UiMgr";
import GoodsItem, { GoodsItemData } from "../newhand_book/GoodsItem";

const { ccclass, property ,menu } = cc._decorator;

@ccclass
@menu('Game/ui/active-taqing/ActiveTaqing_HeCheng')
export class ActiveTaqing_HeCheng extends PageView {

    @property(GoodsItem)
    items:GoodsItem[] = [];

    @property(List)
    list:List = null;

    @property(ImageLoader)
    headIco:ImageLoader = null;

    @property(cc.Node)
    getBtnNode:cc.Node = null;

    @property(cc.Label)
    btnLabel:cc.Label = null;

    private _config:GS_FestivalActivityConfig;
    private _data:GS_FestivalActivityPrivate;

    private _materialGoods:number[] = [];

    onClick() {
        Game.festivalActivityMgr.reqCombineRewardGet();
    }

    private onWenClick() {
        UiManager.showDialog(EResPath.ACTIVE_TAQING_HE_CHENG_HELP_TIPS , `活动规则：
    1、通过隐藏副本、对战模式、合作模式可掉落某种粽子材料，日限5个
    2、通过闯关副本boss关卡可掉落某种粽子材料，日限5个
    3、通过闯关副本产出可掉落3种粽子材料，日各限5个
    一共有7种粽子，需要各位玩家自行合成，合成成功即可领取奖励。合成失败的粽子亦能获得奖励！
    注：若合成出粽子后，合成公式会记录在菜谱上
    可合成的粽子有：
    海鲜粽：随机获得一个橙色猫咪碎片
    咸肉粽：随机获得一个紫色猫咪碎片
    红豆粽：可获得钻石*20
    蜜枣粽：可获得急救包*1
    蜜枣红豆沙粽：可获得能量*500
    白米粽：可获得招财券*1
    肉粽：可获得粽叶*5
    如果合成失败的话则扣除合成材料，所以各位玩家需要谨慎合成！
    失败了也不用气馁，可以获得一个咖喱粽哦（能量*200）`);
    }

    protected doShow() {

        GameEvent.on(EventEnum.ITEM_COUNT_CHANGE , this.refreshGoodsCount , this);
        GameEvent.on(EventEnum.ACTIVE_TAQING_HECHENG_SUCCESS , this.onCombineSuccess , this);
        GameEvent.on(EventEnum.ACTIVE_TAQING_HECHENG_REWARD , this.onCombineReward , this);
        this._config = Game.festivalActivityMgr.getConfig();
        this._data = Game.festivalActivityMgr.getData();
        if (!this._config || !this._config.combine || !this._data) return;
        this.refresh();
        
        let goodsinfo = Game.goodsMgr.getGoodsInfo(this._config.combine.ncombinerewardgoodsid);
        this.headIco.setPicId(goodsinfo ? goodsinfo.npacketpicid : 0);
    }

    private refresh() {
        let materials:GS_FestivalActivityConfig_Material[] = this._config.combine.materialitemlist;
        let material:GS_FestivalActivityConfig_Material;
        let len = materials.length;
        this._materialGoods.length = 0;
        for (let i = 0 ; i < len ; i++) {
            material = materials[i];
            if (material.ngoodsid > 0) {
                let goodsData:GoodsItemData = {
                    goodsId:material.ngoodsid,
                    nums:Game.containerMgr.getItemCount(material.ngoodsid),
                }

                this.items[i].setData(goodsData);
                this._materialGoods.push(material.ngoodsid);
            }
        }

        let combineList = [];

        len = this._config.combine.combineconfigitemlist.length;
        let item:GS_FestivalActivityConfig_CombineConfig;
        let flag = true;
        for (let i = 0 ; i < len ; i++) {
            item = this._config.combine.combineconfigitemlist[i];
            let state = Game.festivalActivityMgr.getCombinedState(item.nid);
            if (state.ntimes <= 0) {
                flag = false;
            }
            combineList.push({config:item , state:state});
        }


        NodeUtils.enabledGray(this.getBtnNode.getComponent(cc.Button) , flag && this._data.btcombinegetreward == 0);
        this.btnLabel.string = this._data.btcombinegetreward == 1 ? "已领取" : "领取";


        if (combineList.length > 0) {
            combineList.sort((a,b):number => {
                const aflag = a.state.ntimes > 0;
                const bflag = b.state.ntimes > 0;

                if (aflag != bflag) {
                    if (aflag) {
                        return -1;
                    }
        
                    if (bflag) {
                        return 1;
                    }
                }

                return a.config.nid - b.config.nid;
            })
        }

        this.list.array = combineList;
    }

    protected doHide(): void {
        Game.festivalActivityMgr.clearCombing();
        GameEvent.off(EventEnum.ITEM_COUNT_CHANGE , this.refreshGoodsCount , this);
        GameEvent.off(EventEnum.ACTIVE_TAQING_HECHENG_SUCCESS , this.onCombineSuccess , this);
        GameEvent.off(EventEnum.ACTIVE_TAQING_HECHENG_REWARD , this.onCombineReward , this);
    }

    private onCombineReward() {
        NodeUtils.enabledGray(this.getBtnNode.getComponent(cc.Button) , this._data.btcombinegetreward == 0);
        this.btnLabel.string = this._data.btcombinegetreward == 1 ? "已领取" : "领取";
    }

    private refreshGoodsCount(id:number , count:number) {
        let index = this._materialGoods.indexOf(id);
        if (index != -1) {
            let item = this.items[index];
            let data = item.data;
            data.nums = count;
            item.setData(data);
        }
    }

    private onCombineSuccess() {
        this.refresh();
    }


}