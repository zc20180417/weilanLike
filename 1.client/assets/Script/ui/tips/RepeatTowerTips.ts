import Game from "../../Game";
import Dialog from "../../utils/ui/Dialog";

const { ccclass, property ,menu} = cc._decorator;

@ccclass
@menu("Game/ui/tips/RepeatTowerTips")
export class RepeatTowerTips extends Dialog {


    @property(cc.SpriteAtlas)
    towerUi: cc.SpriteAtlas = null;

    @property(cc.Sprite)
    headImg1: cc.Sprite = null;

    @property(cc.Label)
    starLabel1: cc.Label = null;

    @property(cc.Sprite)
    headImg2: cc.Sprite = null;

    @property(cc.Label)
    starLabel2: cc.Label = null;


    private troopsId:number = 0;
    setData(data:any) {
        this.troopsId = data.troopsid2;
        this.headImg1.spriteFrame = this.towerUi.getSpriteFrame(Game.towerMgr.getHeadName(data.troopsid1));
        this.headImg2.spriteFrame = this.towerUi.getSpriteFrame(Game.towerMgr.getHeadName(data.troopsid2));
        this.starLabel1.string = Game.towerMgr.getStar(data.troopsid1).toString();
        this.starLabel2.string = Game.towerMgr.getStar(data.troopsid2).toString();
    }

    onClick() {
        Game.towerMgr.requestActive(this.troopsId);
        this.hide();
    }

}