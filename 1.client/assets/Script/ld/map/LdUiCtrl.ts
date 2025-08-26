import { ECamp } from "../../common/AllEnum";
import { EResPath } from "../../common/EResPath";
import { EventEnum } from "../../common/EventEnum";
import SysMgr from "../../common/SysMgr";
import Game from "../../Game";
import GlobalVal from "../../GlobalVal";
import { EComponentType } from "../../logic/comps/AllComp";
import { NodePool } from "../../logic/sceneObjs/NodePool";
import { Tower } from "../../logic/sceneObjs/Tower";
import { HeadComp } from "../../ui/headPortrait/HeadComp";
import { GameEvent, Reply } from "../../utils/GameEvent";
import { Handler } from "../../utils/Handler";
import { StringUtils } from "../../utils/StringUtils";
import TweenNum from "../../utils/TweenNum";
import { UiManager } from "../../utils/UiMgr";
import { NormalGameCtrl } from "../NormalGameCtrl";
import { LDSkillBase } from "../skill/LdSkillManager";
import LdHeroAutoAttackComp from "../tower/LdHeroAutoAttackComp";
import { FlyCoinComp } from "../ui/FlyCoinComp";
import { LdHeroHead } from "../ui/LdHeroHead";

const { ccclass, property ,menu} = cc._decorator;

@ccclass
@menu("Game/LD/LdUiCtrl")
export default class LdUiCtrl extends cc.Component {

    @property(cc.Label)
    timeLabel:cc.Label = null;

    @property(cc.Node)
    coinNode:cc.Node = null;

    @property(cc.Node)
    flyCoinNode:cc.Node = null;

    @property(cc.Label)
    coinLabel:cc.Label = null;

    @property(cc.Label)
    bloodLabel:cc.Label = null;

    @property(cc.ProgressBar)
    bloodProgress:cc.ProgressBar = null;

    @property(cc.Label)
    callLabel:cc.Label = null;

    @property(cc.Label)
    callCoinLabel:cc.Label = null;

    @property(cc.Label)
    strengthCoinLabel:cc.Label = null;

    @property(cc.Node)
    pauseNode: cc.Node = null;

    @property(cc.Node)
    resumeNode: cc.Node = null;

   

    @property(cc.Label)
    mapNameLabel:cc.Label = null;

    @property(cc.Label)
    boIndexLabel:cc.Label = null;



    @property(cc.Node)
    heroAtkRangeNode:cc.Node = null;

    @property(HeadComp)
    monsterHead:HeadComp = null;

    @property(cc.Node)
    heroHeadContainer:cc.Node = null;

    @property(LdHeroHead)
    heroHead:LdHeroHead = null;

    @property(cc.Graphics)
    heroAtkRangeGs:cc.Graphics = null;

    @property(cc.Toggle)
    floatTogger:cc.Toggle = null;

    @property(cc.Toggle)
    hurtTogger:cc.Toggle = null;

    @property(cc.Toggle)
    speedTogger:cc.Toggle = null;

    @property(cc.Label)
    speedLabel:cc.Label = null;




    protected _coinPool:NodePool = new NodePool();
    protected _startTime:number = 0;
    protected _heroHeads:LdHeroHead[] = [];
    protected _activeHeros:number[] = [];
    protected gameCtrl:NormalGameCtrl;
    protected _selfECampID:ECamp;

    protected start(): void {
        this._activeHeros.length = 0;
        this._startTime = 0;
        this._heroHeads.push(this.heroHead);
        this.gameCtrl = Game.curLdGameCtrl as NormalGameCtrl;
        this._coinPool.put(this.flyCoinNode);
        GameEvent.on(EventEnum.INIT_MAP_DATA_END , this.onInitMapData , this);
        GameEvent.on(EventEnum.LD_COIN_CHANGE , this.onCoinChange , this);
        GameEvent.on(EventEnum.CALL_HERO_SUCCESS , this.onCallHeroSuccess , this);
        GameEvent.on(EventEnum.LD_TRY_STRENGTH_SKILL , this.onStrengthSkillChange , this);
        GameEvent.on(EventEnum.MAP_BO_CHANGE , this.onMapBoChange , this);
        GameEvent.on(EventEnum.ON_TOWER_TOUCH , this.onTowerTouch , this);
        GameEvent.on(EventEnum.START_DRAG_TOWER , this.onTowerTouch , this);
        GameEvent.on(EventEnum.END_DRAG_TOWER , this.onTowerEndDrag , this);
        GameEvent.on(EventEnum.TOUCH_EMPTY_POS , this.onTouchEmptyPos , this);
        GameEvent.on(EventEnum.LD_MAP_HP_CHANGE , this.onMapHpChange , this);
        GameEvent.on(EventEnum.LD_STRENGTH_SKILL_CHANGE , this.onActiveStrengthSkill , this);
        GameEvent.on(EventEnum.GAME_PAUSE , this.onGamePause , this);
        GameEvent.on(EventEnum.LD_START_GAME , this.onGameStart , this);
        GameEvent.on(EventEnum.FLOAT_GOLD , this.onFloatGold , this);


        this.hurtTogger.node.on('toggle' , this.onHurtTogger , this);
        this.floatTogger.node.on('toggle' , this.onFloatTogger , this);
        this.speedTogger.node.on('toggle' , this.onSpeedTogger , this);

        this.floatTogger.isChecked = true;
        this.hurtTogger.isChecked = false;
        this.speedTogger.isChecked = false;

        this.schedule(this.doRefreshTimeLabel , 0.2);

    }



    private onHurtTogger() {
        if (this.hurtTogger.isChecked) {
            UiManager.showDialog(EResPath.LD_HURT_VIEW);
        } else {
            UiManager.hideDialog(EResPath.LD_HURT_VIEW);
        }
    }
    
    private onFloatTogger() {
        GlobalVal.isShowFloat = this.floatTogger.isChecked;
    }


    protected doRefreshTimeLabel() {
        if (this._startTime > 0) {
            const time = GlobalVal.now - this._startTime;
            this.timeLabel.string = StringUtils.doInverseTime(Math.floor(time * 0.001));
        }
    }

    protected onGameStart() {
        this._startTime = GlobalVal.now;
    }

    protected _fromPos:cc.Vec2 = cc.Vec2.ZERO;
    protected _toPos:cc.Vec2 = cc.Vec2.ZERO;
    protected onFloatGold(x:number , y:number , value:number , campId:ECamp = ECamp.BLUE) {
        if (campId !== this._selfECampID) {
            // cc.log('红色方掉落了金币');
            this.otherCampFloatGlod(value , campId);
            return;
        }

        this._fromPos.x = x; this._fromPos.y = y;
        let worldPos = Game.soMgr.getMonsterWorldPos(this._fromPos);
        let localPos = this.flyCoinNode.parent.convertToNodeSpaceAR(worldPos , this._fromPos);

        const flyNode = this.getFlyCoin(localPos.x , localPos.y);
        this.coinNode.convertToWorldSpaceAR(cc.Vec2.ZERO_R , this._fromPos);
        const toPos = this.flyCoinNode.parent.convertToNodeSpaceAR(this._fromPos , this._toPos);

        const flyComp:FlyCoinComp = flyNode.getComponent(FlyCoinComp);
        flyComp.setData(toPos , value , Handler.create(this.onCoinFlyEnd , this));
        
    }

    protected otherCampFloatGlod(value:number , campId:ECamp) {

    }

    protected onCoinFlyEnd(flyComp:FlyCoinComp) {
        GameEvent.emit(EventEnum.ADD_GOLD , flyComp.coinValue , this._selfECampID);
        this.putFlyCoin(flyComp.node);
    }


    protected onInitMapData() {
        this._selfECampID = this.gameCtrl.getSelfCamp();
        this.coinLabel.string = this.gameCtrl.getSelfCoin().toString();
        this.onCallHeroSuccess(this._selfECampID);
        this.onStrengthSkillChange(this._selfECampID);
        this.mapNameLabel && (this.mapNameLabel.string = this.gameCtrl.curMissonData.nwarid + "." + this.gameCtrl.curMissonData.szname);
        
    }

    protected onMapBoChange(index:number , max:number) {
        if (this.boIndexLabel) {
            this.boIndexLabel.string = index + '/' + max;
        }
    }

    protected onCoinChange(value:number , campId:ECamp) {
        if (campId !== this._selfECampID) return;
        const curValue = parseInt(this.coinLabel.string);
        // 
        TweenNum.to(curValue , value , 0.08 , Handler.create(this.onRefreshCoinLabel , this) ,'coinTween');

        this.coinLabel.node.stopAllActions();
        cc.tween(this.coinLabel.node).to(0.08 , {scale:1.5}).to(0.07 , {scale:1}).start();

        this.refreshCallLabelColor();
        this.refreshStrengthSkillLabelColor();
    }

    protected onRefreshCoinLabel(value:number) {
        this.coinLabel.string = value.toString();
    }


    protected onCallHeroSuccess(campId:ECamp) {
        if (campId !== this._selfECampID) return;
        if (this.gameCtrl.createTableCallTimes > 0) {
            this.callLabel.string = this.gameCtrl.curCallTimes + '/' + this.gameCtrl.createTableCallTimes;
        } else {
            this.callLabel.string = '';
        }
        const coin = this.gameCtrl.callConsumeCoin;
        this.callCoinLabel.string = coin == 0 ? '免费' : StringUtils.formatNum(coin);
        this.refreshCallLabelColor();
    }

    protected onStrengthSkillChange(campId:ECamp) {
        if (campId !== this._selfECampID) return;
        const coin = this.gameCtrl.strengthenSkillCoin;
        this.strengthCoinLabel.string = coin == 0 ? '免费' : StringUtils.formatNum(coin);
        this.refreshStrengthSkillLabelColor();
    }

    protected onDestroy(): void {
        TweenNum.kill('coinTween');
        GameEvent.targetOff(this);

    }


    protected onCallClick() {
        GameEvent.emit(EventEnum.TRY_CALL_TOWER , this._selfECampID);
    }

    protected onStrengthClick() {
        GameEvent.emit(EventEnum.TRY_STRENGTHEN , this._selfECampID);
    }

    protected onPauseClick() {
        // GameEvent.emit(EventEnum.DO_EXIT_MAP);
        UiManager.showDialog(EResPath.LD_GAME_PAUSE_VIEW);
    }

    protected onGamePause() {
        // const isPause = SysMgr.instance.pause;
        // let aniCom = this.clockNode.getComponent(cc.Animation);
        // if (isPause) {
        //     aniCom.pause();
        // } else {
        //     aniCom.resume();
        // }
    }

    protected _speedUp = false;
    protected onSpeedTogger() {
        // SysMgr.instance.warSpeed = SysMgr.instance.warSpeed == 1 ? 2 : 1;
        this._speedUp = this.speedTogger.isChecked;
        if (this._speedUp) {
            SysMgr.instance.warSpeed = 2;
            this.speedLabel.string = '2倍速';
        }
        else {
            SysMgr.instance.warSpeed = 1;
            this.speedLabel.string = '1倍速';

        }
    }

    protected refreshCallLabelColor() {
        const coin = this.gameCtrl.getSelfCoin();
        let bool = coin  >= this.gameCtrl.callConsumeCoin;
        this.callCoinLabel.node.color = bool ? cc.Color.WHITE : cc.Color.RED;
    }

    protected refreshStrengthSkillLabelColor() {
        const coin = this.gameCtrl.getSelfCoin();
        let bool = coin  >= this.gameCtrl.strengthenSkillCoin;
        this.strengthCoinLabel.node.color = bool ? cc.Color.WHITE : cc.Color.RED;
    }


    protected _showRangeTower:Tower;

    protected onTowerTouch(tower:Tower) {
        if (this._showRangeTower == tower) {
            this.onTowerEndDrag();
            return;
        }
        this.onTowerStartDrag(tower);
        //显示英雄介绍
    }

    protected onTowerStartDrag(tower: Tower) {
        this._showRangeTower = tower;
        this.heroAtkRangeGs.clear();
        const atkComp = tower.getComponent(EComponentType.LD_HERO_AUTO) as LdHeroAutoAttackComp;
        const skill:LDSkillBase = atkComp.getDefaultSkill();
        const range = skill ? skill.range : 100;
        /*
        this.heroAtkRangeNode.zIndex = -10000;
        this.heroAtkRangeNode.active = true;
        this.heroAtkRangeNode.setPosition(tower.x , tower.y);
        this.heroAtkRangeNode.height = this.heroAtkRangeNode.width = range * 2;
        */
        if (skill.rangeType == 0 ) {
            this.heroAtkRangeGs.circle(tower.x , tower.y , range);
            this.heroAtkRangeGs.fill();
            this.heroAtkRangeGs.stroke();
        } else if (skill.rangeType == 1) {
            const rect = Game.curLdGameCtrl.getSelfArea();
            this.heroAtkRangeGs.roundRect(rect.x + 5 , rect.y , rect.width - 10 , range , 10);
            this.heroAtkRangeGs.fill();
            this.heroAtkRangeGs.stroke();
        }
    }


    protected onTowerEndDrag() {
        // this.heroAtkRangeNode.active = false;
        this.heroAtkRangeGs.clear();
        this._showRangeTower = null;
    }

    protected onTouchEmptyPos() {
        this.onTowerEndDrag();
        //再隐藏英雄介绍UI
    }


    protected onMapHpChange(value:number , max:number) {
        value = Math.max(value , 0);
        this.bloodLabel.string = value.toString();
        this.bloodProgress.progress = value / max;
    }
     
    protected onMonsterHeadClick() {

    }

    protected onActiveStrengthSkill(heroId:number , campId:ECamp) {
        if (campId !== this._selfECampID) return;
        if (this._activeHeros.includes(heroId)) return;
        this._activeHeros.push(heroId);
        if (this._activeHeros.length > this._heroHeads.length) {
            let temp = cc.instantiate(this.heroHead.node);
            temp.parent = this.heroHead.node.parent;
            this._heroHeads.push(temp.getComponent(LdHeroHead));
        }
        const comp = this._heroHeads[this._activeHeros.length - 1];
        comp.node.active = true;
        comp.setData(heroId);
    }

    ////////////////////////////////////////////////////
    protected getFlyCoin(x:number , y:number) {
        let coinNode ;
        if (this._coinPool.size() > 0) {
            coinNode = this._coinPool.get();
        } else {
            coinNode = cc.instantiate(this.flyCoinNode) as cc.Node;
            coinNode.active = true;
            coinNode.parent = this.flyCoinNode.parent;
        }
        coinNode.setPosition(x , y);
        return coinNode;
    }

    protected putFlyCoin(coinNode:cc.Node) {
        this._coinPool.put(coinNode);
    }

}