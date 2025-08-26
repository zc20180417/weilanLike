// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EResPath } from "../../common/EResPath";
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GS_ActorFaceConfig, GS_ActorFaceConfig_FaceFrameItem, GS_ActorFaceConfig_FaceItem } from "../../net/proto/DMSG_Plaza_Sub_Actor";
import { HEAD_FRAME_ACTIVE_TYPE } from "../../net/socket/handler/MessageEnum";
import { GameEvent } from "../../utils/GameEvent";
import { Handler } from "../../utils/Handler";
import BaseItem from "../../utils/ui/BaseItem";
import { NodeUtils } from "../../utils/ui/NodeUtils";


const { ccclass, property } = cc._decorator;

@ccclass
export default class headportrait extends BaseItem {

    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.SpriteAtlas)
    atlas: cc.SpriteAtlas = null;

    @property(cc.Sprite)
    on: cc.Sprite = null;

    @property(cc.Node)
    iock: cc.Node = null;

    private _curData: GS_ActorFaceConfig_FaceItem;

    setData(data: any, index: number) {
        super.setData(data, index);
        if (!data) {
            return;
        }
        this._curData = data;
        this.refresh();
        this.onHeadFrameChange(data)
    }

    public onSelect() {
        this.on.node.active = true;

    }

    public unSelect() {
        this.on.node.active = false;
    }

    public refresh() {
        //cc.log('this._curData' , this._curData );
        //激活方式（0：完美通关章节 1：段位积分 2:通关章节 3:完美通关隐藏关卡数量 4：通关隐藏关卡数量 5:VIP经验值 6:完成任务）
        let flag = false;
        switch (this._curData.btactivetype) {
            case HEAD_FRAME_ACTIVE_TYPE.PERFECT:
                flag = this.checkWarid(this._curData.nactiveparam);
                break;
            case HEAD_FRAME_ACTIVE_TYPE.RANK_SCORE:
                flag = this.rank(this._curData.nactiveparam);
                break;
            case HEAD_FRAME_ACTIVE_TYPE.WAR:
                flag = this.currentChapter(this._curData.nactiveparam);
                break;
            case HEAD_FRAME_ACTIVE_TYPE.PERFECT_HIDE_WAR_COUNT:
                flag = this.perfectHideLevel(this._curData.nactiveparam);
                break;
            case HEAD_FRAME_ACTIVE_TYPE.HIDE_WAR_COUNT:
                flag = this.hideLevel(this._curData.nactiveparam);
                break;
            case HEAD_FRAME_ACTIVE_TYPE.VIP_EXP:
                flag = this.checkVipSocre(this._curData.nactiveparam);
                break;
            case HEAD_FRAME_ACTIVE_TYPE.FINISH_TASK:
                flag = this.checkTask(this._curData.nactiveparam);
                break;
            case HEAD_FRAME_ACTIVE_TYPE.SPECIAL:
                flag = this.checkSpecial(this._curData.nid);
                break;
            default:
                break;
        }

        this.iock.active = !flag;
        NodeUtils.setNodeGray(this.node, !flag);
        this.canSelect = flag;
    }


    //完美通关章节
    private checkWarid(warId: any) {
        return Game.sceneNetMgr.isPerfectFinishWorld(warId);
    }

    //获取段位积分
    private rank(rankId: any) {
        let userRankId = Game.actorMgr.getNrankScore();
        return userRankId >= rankId;
    }

    //获取当前章节
    private currentChapter(currentId: any) {
        let current = Game.sceneNetMgr.getCurWorldID();
        return current - 1 >= currentId;
    }

    //获取完美通关隐藏关卡
    private perfectHideLevel(perfectHideLevelId: any): boolean {
        let userWarNum = Game.sceneNetMgr.getPerfectFinishHidWarCount();
        return userWarNum >= perfectHideLevelId;
    }

    private hideLevel(hideLevelId: any): boolean {
        let userWarNum = Game.sceneNetMgr.getFinishHideWarCount();
        return userWarNum >= hideLevelId;
    }

    private checkVipSocre(value: number): boolean {
        return Game.actorMgr.getVipEx() >= value;
    }

    private checkTask(value: number): boolean {
        return Game.taskMgr.getAchievementTaskFinished(value);
    }

    private checkSpecial(frameId: number): boolean {
        return Game.actorMgr.hasSpecialFaceFrame(frameId);
    }

    private getFrame() {

        //cc.log(this.iock.active);

        if (this.iock.active == false) {
            GameEvent.emit(EventEnum.HEAD_PORTRAIT_FRAME, this.data.nid);
        }
        //Game.actorMgr.reqSetFaceID(this.data.nid);
    }

    private _curFrameId:GS_ActorFaceConfig_FaceFrameItem = null;
    private _frameEftNode:cc.Node = null;
    private _frameAniId:number = 0;
    onHeadFrameChange(frameInfo: GS_ActorFaceConfig_FaceFrameItem) {
        if (!this.icon || frameInfo == this._curFrameId) return;
        this.removeLoadEft();
        this._curFrameId = frameInfo;
        if (frameInfo && frameInfo.naniid > 0) {
            this._frameAniId = frameInfo.naniid;
            Game.resMgr.loadRes(EResPath.HEAD_EFT + frameInfo.naniid , cc.Prefab , Handler.create(this.onEftLoaded , this));
        } else {
            this.icon.spriteFrame = (this.atlas.getSpriteFrame("frame_" + frameInfo.nid));
        }
    
       
    }

    private onEftLoaded(data:any , path:string) {
        if (data) {
            Game.resMgr.addRef(path);
            const eftNode = cc.instantiate(data);
            this._frameEftNode = eftNode;
            this.icon.node.addChild(eftNode);
            this.icon.spriteFrame = null;
        }
    }

    private removeLoadEft() {
        if (this._frameEftNode) {
            this._frameEftNode.removeFromParent();
            this._frameEftNode = null;
        }
        if (this._frameAniId > 0) {
            Game.resMgr.removeLoad(EResPath.HEAD_EFT + this._frameAniId , Handler.create(this.onEftLoaded , this));
            this._frameAniId = -1;
        }
    }
    
    onDestroy() {
        this.removeLoadEft();
    }

}


