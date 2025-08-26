
import { ECamp } from "../../common/AllEnum";
import { HeroConfig } from "../../common/ConfigInterface";
import Game from "../../Game";
import Dialog from "../../utils/ui/Dialog";
import { GoodsBox } from "../../utils/ui/GoodsBox";
import List from "../../utils/ui/List";



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/LD/ui/LdHeroSkillView")
export class LdHeroSkillView extends Dialog {


    @property(cc.Label)
    nameLabel:cc.Label = null;

    // @property(GoodsBox)
    // box: GoodsBox = null;

    @property(cc.Node)
    bg:cc.Node = null;

    @property(List)
    list:List = null;

    @property
    itemWid:number = 0;

    @property
    itemHei:number = 0;

    private _viewData:{worldPos:cc.Vec2 , heroId:number};
    public setData(data: any): void {
        this._viewData = data;

    }

    protected beforeShow() {
        const heroConfig:HeroConfig = Game.gameConfigMgr.getHeroConfig(this._viewData.heroId)
        this.nameLabel.string = heroConfig?.szname + '的词条';
        this.blackLayer.opacity = 0;
        const selfCamp = Game.curLdGameCtrl.getSelfCamp();
        const heroBuild = Game.curLdGameCtrl.getHeroBuildingCtrl(selfCamp).getHeroBuilding(this._viewData.heroId);
        if (heroBuild) {
            const len = heroBuild.strengthSkillList.length;
            if (len == 1) {
                this.list.node.width = this.itemWid;
                this.list.node.height = this.itemHei;
                this.list.repeatX = 1;
                this.list.repeatY = 1;
            } else if (len <= 3) {
                this.list.node.width = this.itemWid * len + this.list.spaceX * (len - 1);
                this.list.node.height = this.itemHei;
                this.list.repeatX = len;
                this.list.repeatY = 1;
            } else if (len == 4) {
                this.list.node.width = this.itemWid * 2 + this.list.spaceX;
                this.list.node.height = this.itemHei * 2 + this.list.spaceY;
                this.list.repeatX = 2;
                this.list.repeatY = 2;
            } else if (len > 4) {

                const colCount = Math.ceil(len / 3);

                this.list.node.width = this.itemWid * 3 + this.list.spaceX * 2;
                this.list.node.height = this.itemHei * colCount + this.list.spaceY * (colCount - 1);
                this.list.repeatX = 3;
                this.list.repeatY = 0;
            }

            this.bg.width = this.list.node.width + 20;
            this.bg.height = this.list.node.height + 100;
            this.list.node.x = -this.list.node.width * 0.5;

            this.list.array = heroBuild.strengthSkillList; 




        }

        const pos = this.content.parent.convertToNodeSpaceAR(this._viewData.worldPos);

        this.content.x = pos.x - this.bg.width * 0.5 - 50;
        this.content.y = pos.y;

    }

}