// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { TowerTypeName } from "../../common/AllEnum";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TowerTitleItem extends cc.Component {

    @property(cc.Label)
    typeName: cc.Label = null;

    @property(cc.Sprite)
    towerIcon: cc.Sprite = null;

    @property([cc.SpriteFrame])
    towerIcons: [cc.SpriteFrame] = [null];
    // onLoad () {}

    refresh(towerType:number){
        this.typeName.string=TowerTypeName[towerType-1];
        this.towerIcon.spriteFrame=this.towerIcons[towerType-1];
    }

    refreshByTowerName(towerType:number,name:string){
        this.typeName.string=name;
        this.towerIcon.spriteFrame=this.towerIcons[towerType-1];
    }

    // update (dt) {}
}
