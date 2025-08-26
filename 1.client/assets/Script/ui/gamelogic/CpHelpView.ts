import { BuryingPointMgr, EBuryingPoint } from "../../buryingPoint/BuryingPointMgr";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { ActorProp } from "../../net/socket/handler/MessageEnum";
import { GameEvent } from "../../utils/GameEvent";
import Dialog from "../../utils/ui/Dialog";
import { NodeUtils } from "../../utils/ui/NodeUtils";
import Utils from "../../utils/Utils";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/ui/CpHelpView")
export default class CpHelpView extends Dialog {


    private infos = [
        { name: '雷神之击:',
          info:'攻击怪物时，施放高额伤害的雷电,雷电命中怪物后，可弹射距离目标，最近的五个敌方目标，每次弹射伤害减弱30%',
          actionName:"show",
        },
        { name: '激光射线:',
          info:'施放激光射线持续不断地攻击目标，激光射线照射的时间越长伤害越高，最高可造成800%伤害，瞬间融化目标。',
          actionName:"show",
        },
        { name: '橡胶回旋:',
          info:'挥出巨大橡胶拳头，对前方一条直线上碰到的所有敌方目标造成伤害，并有概率将其击飞',
          actionName:"animation",
        },

        { name: '无影醉棍:',
          info:'挥舞手中的长棍对身前小面积的地方目标进行攻击，附带群体减速效果，更有点石成金绝技，可将怪物变成产出钱币的黄金雕像',
          actionName:"animation",
        }
    ];

    @property([cc.Node])
    heroBtns:cc.Node[] = [];

    @property([cc.Node])
    helpdNodec:cc.Node[] = [];

    //@property([cc.Node])
    //shadows:cc.Node[] = [];

    @property([dragonBones.ArmatureDisplay])
    dragons:dragonBones.ArmatureDisplay[] = [];

    @property(cc.Label)
    tipLabel:cc.Label = null;

    @property(cc.Node)
    replayBtn:cc.Node = null;

    @property(cc.Node)
    needHelpBtn:cc.Node = null;

    @property(cc.Node)
    inviteBtn:cc.Node = null;

    @property(cc.Label)
    nameLabel:cc.Label = null;

    @property(cc.Label)
    infoLabel:cc.Label = null;

    @property(cc.Color)
    color:cc.Color = cc.Color.BLACK;

    private _state:number = 0;
    private _selectIndex:number = -1;
    private _indexs:number[] = [];

    private _pxs:number[] = [];


    private _addCollision = false;
    start() {
        if (!cc.director.getCollisionManager().enabled) {
            cc.director.getCollisionManager().enabled = true;
            this._addCollision = true;
        }
        this._pxs.push(this.heroBtns[0].x);
        this._pxs.push(this.heroBtns[2].x);
        this._pxs.push(this.heroBtns[3].x);

        this.infos[0]['y'] = this.heroBtns[0].y;
        this.infos[1]['y'] = this.heroBtns[1].y;
        this.infos[2]['y'] = this.heroBtns[2].y;
        this.infos[3]['y'] = this.heroBtns[3].y;

    }

    protected beforeHide(): void {
        if (this._addCollision) {
            cc.director.getCollisionManager().enabled = false;
        }
    }

    protected beforeShow(): void {
        let value = Game.actorMgr.getProp(ActorProp.ACTOR_PROP_CLIENTOPENFLAG);
        for (let i = 1 ; i < 5 ; i++) {
            this.setHeroState(i , Utils.checkBitFlag(value , i - 1));
        }
    }


    onReplayClick() {
        if (this.checkCanReStart()) {
            BuryingPointMgr.postWar(EBuryingPoint.TOUCH_AGIN_WAR);
            Game.cpMgr.reStart(true);
        } else {
            GameEvent.emit(EventEnum.DO_EXIT_MAP, true);
            BuryingPointMgr.postWar(EBuryingPoint.TOUCH_WAR_FAIL_BACK);
        }
        this.hide();
    }

    private checkCanReStart(): boolean {
        if (!Game.curGameCtrl || !Game.curGameCtrl.curMissonData) return false
        return Game.actorMgr.getStrength() >= Game.curGameCtrl.curMissonData.uopenneedstrength;
    }

    onNeedHelpClick() {
        this._state = 1;
        this.replayBtn.active = this.needHelpBtn.active = this.tipLabel.node.active = false;
        this.infoLabel.node.active = this.nameLabel.node.active = this.inviteBtn.active = true;
        this.defaultSelect();
       
    }

    onHelpClick() {
        if (this.checkCanReStart()) {
            BuryingPointMgr.postWar(EBuryingPoint.TOUCH_AGIN_WAR);
            Game.cpMgr.reStart(true);
            Game.cpMgr.helpTowerId = 800 + this._selectIndex + 1;
        } else {
            GameEvent.emit(EventEnum.DO_EXIT_MAP, true);
            BuryingPointMgr.postWar(EBuryingPoint.TOUCH_WAR_FAIL_BACK);
        }
        this.hide();
    }


    onHideClick() {
        GameEvent.emit(EventEnum.DO_EXIT_MAP, true);
        BuryingPointMgr.postWar(EBuryingPoint.TOUCH_WAR_FAIL_BACK);
        this.hide();
    }

    onHeroClick(e:any , id:number) {
        cc.log('----------id:' , id);
        if (this._state == 0) return;
        this.selectIndex(id);
    }

    private setHeroState(index:number , state:boolean) {
        
        this.helpdNodec[index - 1].active = state;
        if (state) {
            let heroNode = this.heroBtns[index - 1];
            NodeUtils.setNodeGray(heroNode , true);
            heroNode.getComponent(cc.Button).enabled = false;
        } else {
            this._indexs.push(index);
        }
    }

    private defaultSelect() {
        let len = this._indexs.length;
        for (let i = 0 ; i < len ; i++) {
            this.heroBtns[this._indexs[i] - 1].color = this.color;
        }
        this.selectIndex(this._indexs[0]);
    }

    private selectIndex(index:number) {
        if (this._selectIndex == index - 1) return;
        if (this._selectIndex != -1) {
            this.heroBtns[this._selectIndex].active = true;
            //this.shadows[this._selectIndex].active = true;
            this.dragons[this._selectIndex].node.active = false;
        }

        this._selectIndex = index - 1;
        this.heroBtns[this._selectIndex].active = false;
        //this.shadows[this._selectIndex].active = false;
        this.dragons[this._selectIndex].node.active = true;
        let info = this.infos[this._selectIndex];
        this.dragons[this._selectIndex].playAnimation(info.actionName , 0);
        this.nameLabel.string = info.name;
        this.infoLabel.string = info.info;
        this.resetPos();
    }

    private resetPos() {
        let len = this.heroBtns.length;
        let index = 0;
        for (let i = 0; i < len; i++) {
            const element = this.heroBtns[i];
            if (element.active) {
                element.x = this._pxs[index];
                index ++;
            }
        }
    }


}