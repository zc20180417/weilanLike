// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GS_ActorFaceConfig, GS_ActorFaceConfig_FaceItem } from "../../net/proto/DMSG_Plaza_Sub_Actor";
import { HEAD_ACTIVE_TYPE } from "../../net/socket/handler/MessageEnum";
import { GameEvent } from "../../utils/GameEvent";
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

          let lconMane = 'tower_' + data.nid;
          this.icon.spriteFrame = this.atlas.getSpriteFrame(lconMane);
     }

     public onSelect() {
          this.on.node.active = true;

     }

     public unSelect() {
          this.on.node.active = false;
     }

     public refresh() {
          //cc.log('this._curData' , this._curData );
          let flag = false;
          switch (this._curData.btactivetype) {
               case HEAD_ACTIVE_TYPE.WAR_ACTIVE:
                    flag = this.checkWarid(this._curData.nactiveparam);
                    break;
               case HEAD_ACTIVE_TYPE.TOWER_ACTIVE:
                    flag = this.activation(this._curData.nactiveparam);
                    break;
               case HEAD_ACTIVE_TYPE.PERFECT_ACTIVE:
                    break;
               case HEAD_ACTIVE_TYPE.MONSTER_ACTIVE:
                    flag = this.checkMonster(this._curData.nactiveparam);
                    break;
               case HEAD_ACTIVE_TYPE.SKIN_ACTIVE:
                    flag = this.checkSkin(this._curData.nactiveparam);
                    break;
               case HEAD_ACTIVE_TYPE.TESHU_ACTIVE:
                    flag = this.checkTeshu(this._curData.nid);
                    break;
               default:
                    break;
          }
          this.iock.active = !flag;
          NodeUtils.setNodeGray(this.node, !flag);
          this.canSelect = flag;
     }

     private checkWarid(warId: any) {
          let userWarId = Game.sceneNetMgr.getLastWarID();
          return userWarId >= warId;
     }

     private activation(KittyId: any) {
          return Game.towerMgr.isTowerUnlock(KittyId);
     }

     private checkMonster(monsterId: number): boolean {
          return Game.monsterManualMgr.isMonsterUnlock(monsterId) && Game.monsterManualMgr.isMonsterGetedRewrad(monsterId);
     }

     private checkSkin(skinID: number): boolean {
          return !!Game.fashionMgr.getFashionData(skinID);
     }

     private checkTeshu(faceid: number): boolean {
          return !!Game.actorMgr.hasSpecialFace(faceid);
     }

     private getReward() {
          //Game.actorMgr.reqSetFaceID(this.data.nid);
          if (this.iock.active == false) {
               GameEvent.emit(EventEnum.HEAD_PORTRAIT, this.data.nid);
          }
     }
}


