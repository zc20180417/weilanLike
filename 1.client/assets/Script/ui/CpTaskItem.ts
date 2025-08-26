
import BaseItem from "../utils/ui/BaseItem";
import { GS_SceneOpenWar_WarTaskData } from "../net/proto/DMSG_Plaza_Sub_Scene";
import ImageLoader from "../utils/ui/ImageLoader";
import Game from "../Game";
import { UiManager } from "../utils/UiMgr";
import { EResPath } from "../common/EResPath";
import { DiaAndRedPacketTipsViewData } from "./tips/DiaAndRedPacketTipsView";
import { StringUtils } from "../utils/StringUtils";


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/ui/CpTaskItem")
export class CpTaskItem extends BaseItem {

    @property(cc.Label)
    descText: cc.Label = null;

    @property(cc.Label)
    progressText: cc.Label = null;

    @property(cc.Label)
    diamondText: cc.Label = null;

    @property(cc.Label)
    timeText: cc.Label = null;

    @property(cc.Sprite)
    stateSprite: cc.Sprite = null;

    @property(cc.SpriteFrame)
    succSprite: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    failSprite: cc.SpriteFrame = null;

    @property(ImageLoader)
    ico: ImageLoader = null;

    @property(cc.SpriteAtlas)
    atlas: cc.SpriteAtlas = null;

    @property(cc.Node)
    desText: cc.Node = null;

    @property(cc.LabelOutline)
    progress: cc.LabelOutline = null;

    @property(cc.LabelOutline)
    time: cc.LabelOutline = null;

    @property(cc.Sprite)
    bg: cc.Sprite = null;

    @property(ImageLoader)
    awardIco: ImageLoader = null;

    @property(cc.Node)
    diaNode: cc.Node = null;

    setData(data: any, index?: number) {
        super.setData(data, index);
        //任务描述
        if (!data) return;
        
    }

    setState(state: boolean) {
        this.stateSprite.spriteFrame = state ? this.succSprite : this.failSprite;
    }

    //隐藏时间和进度label
    hideText() {
        this.progressText.node.active = false;
        this.timeText.node.active = false;
    }

    update(dt: number) {
        if (this.data && this.timeText && this.data.getTime() > 0) {//更新时间
            this.timeText.string = "限时：" + this.data.getTimeStr();
        }
    }

    public clickDiamond(event?: any) {
        if (!event) {
            event = { target: this.diaNode };
        }
        let str = "";
        let tempStr;
        str += StringUtils.richTextSizeFormat(StringUtils.richTextColorFormat("钻石：", "#995124"), 24);
        tempStr = "\n       完成每一个关卡任务都将获得一定数量的钻石，钻石可以用于";
        str += StringUtils.richTextSizeFormat(StringUtils.richTextColorFormat(tempStr, "#a75f49"), 20);
        tempStr = "商城中购买技能、宝箱等游戏道具，是获取猫咪的主要资源";
        str += StringUtils.richTextSizeFormat(StringUtils.richTextColorFormat(tempStr, "#fd4801"), 20);
        let data: DiaAndRedPacketTipsViewData = {
            node: event.target,
            tips: str
        };
        UiManager.showDialog(EResPath.DIAANDREDPACKET_TIPS_VIEW, data);
    }
}