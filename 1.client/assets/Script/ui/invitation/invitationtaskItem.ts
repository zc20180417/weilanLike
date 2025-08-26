// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Game from "../../Game";
import { GS_GoodsInfoReturn_GoodsInfo } from "../../net/proto/DMSG_Plaza_Sub_Goods";
import { GameEvent } from "../../utils/GameEvent";
import BaseItem from "../../utils/ui/BaseItem";
import ImageLoader from "../../utils/ui/ImageLoader";
import { EShareTaskState } from "../share/ShareMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class invitationtaskItem extends BaseItem {

    @property(cc.Label)
    reward: cc.Label = null;

    @property(cc.Label)
    des: cc.Label = null;

    @property(ImageLoader)
    imageBigDiamond:ImageLoader = null;

    @property(cc.Sprite)
    imageSprite: cc.Sprite = null;

    @property(cc.Node)
    yilingqu: cc.Node = null;

    @property(cc.Node)
    lingquGet: cc.Node = null;

    @property(cc.Node)
    canNotGet: cc.Node = null;

    @property(cc.Label)
    currValue: cc.Label = null;

    @property(cc.Label)
    maxValue: cc.Label = null;

    @property(cc.Material)
    normalMat: cc.Material = null;

    @property(cc.Material)
    grayMat: cc.Material = null;
    
    _eventAdded: boolean = false;

    private _config:any;
    public setData(data: any, index?:number){
        super.setData(data,index);
        this.addEvent();
        this.refresh();
    }

    addEvent(){
        if(this._eventAdded) return;
        if(this.data){
            this._eventAdded = true;
        }
    }

    onEnable(){
        this.addEvent();
    }

    onDisable(){
        GameEvent.targetOffAll(this);
        this._eventAdded = false;
    }

    onGetClick() {
        if (!this.data.task_id || !this._config) return;
        if (this.data.task_status == EShareTaskState.COMPLETE || 
            (this.data.task_status == EShareTaskState.NONE &&  this.data.enter_degree == this._config.task_num)) {
                Game.shareMgr.requestTaskAward(this.data.task_id);
        }
    }

    public refresh(){
        if(!this.data) return;
        this._config = Game.shareMgr.getConfigById(this.data.task_id);
        if (!this._config) return;
        let rewardItemCfg:GS_GoodsInfoReturn_GoodsInfo = Game.goodsMgr.getGoodsInfo(this._config.goods_id);
        //let taskListCfg = Game.taskMgr.getTaskListCfg(this.data.stasklistid);

        //描述
        this.des.string = this._config.info;

        //进度
        let curValue = this.data.enter_degree || 0;
        let maxValue = this._config.task_num;
        this.currValue.string = curValue.toString();
        this.maxValue.string = "/" + maxValue;
        
        //奖励图片
        this.imageBigDiamond.setPicId(rewardItemCfg.npacketpicid);
        //奖励
        this.reward.string = (this._config.goods_num) + '';

        //领取状态
        this.refreshRewardState();
    }

    private refreshRewardState() {
        let curValue = this.data ? Number(this.data.enter_degree) || 0 : 0;
        let maxValue = Number(this._config.task_num);

        if(Number(this.data.task_status) == EShareTaskState.FINISH) {
            this.yilingqu.active = true;
            this.lingquGet.active = false;
            this.canNotGet.active = false;
            this.imageSprite.setMaterial(0,this.normalMat);
        }else if (curValue < maxValue) {//不可领取
            this.yilingqu.active = false;
            this.lingquGet.active = false;
            this.canNotGet.active = true;
            this.imageSprite.setMaterial(0, this.normalMat);
        } else {//可以领取
            this.yilingqu.active = false;
            this.lingquGet.active = true;
            this.canNotGet.active = false;
            this.imageSprite.setMaterial(0, this.normalMat);
        }
    }
}
