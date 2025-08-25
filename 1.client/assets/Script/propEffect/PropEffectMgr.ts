// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EResPath } from "../common/EResPath";
import { EventEnum } from "../common/EventEnum";
import SysMgr from "../common/SysMgr";
import Game from "../Game";
import { GameEvent, Reply } from "../utils/GameEvent";
import { Handler } from "../utils/Handler";
import { CacheModel } from "../utils/res/ResManager";
import PropEffectBase from "./PropEffectBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PropEffectMgr extends cc.Component {

    private _effectDic:any = {};
    private _onLoaded:Handler = null;
    private _pathToSkillId:any = {};

    onLoad() {
        this._onLoaded = new Handler(this.onLoaded , this);
        GameEvent.onReturn('get_prop_effect_node' , this.getNode , this);
        GameEvent.on(EventEnum.RELEASE_MAGIC_SKILL, this.onMagicSkillRelease, this);
    }

    onMagicSkillRelease(skillId: number) {
        let effect: PropEffectBase = this._effectDic[skillId];
        //cc.log('---------onMagicSkillRelease-- true' , skillId);
        SysMgr.instance.pauseGame('magicSkill_' + skillId , true);
        if (effect) {
            effect.node.active = true;
            effect.play();
        } else {
            let prefabPath:string = EResPath['MAGIC_SKILL_EFFECT_' + skillId];
            this._pathToSkillId[prefabPath] = skillId;
            Game.resMgr.loadRes(prefabPath , cc.Prefab , this._onLoaded,CacheModel.AUTO);
        }
    }

    private onLoaded(res:cc.Prefab , path:string) {
        let skillid = this._pathToSkillId[path]; 
        let node = cc.instantiate(res);
        let effect: PropEffectBase = node.getComponent(PropEffectBase);
        this.node.addChild(node);
        effect.startNode = GameEvent.dispathReturnEvent("MagicSkillItem_" + skillid);
        effect.setSkillId(skillid);
        effect.play();
        this._effectDic[skillid] = effect;
    }

    private getNode(reply:Reply) {
        return reply(this.node);
    }

    onDestroy() {
        GameEvent.offReturn('get_prop_effect_node' , this.getNode , this);
        GameEvent.targetOff(this);
    }
}
