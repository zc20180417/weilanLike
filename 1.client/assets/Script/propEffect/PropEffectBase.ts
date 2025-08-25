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
import { GameEvent } from "../utils/GameEvent";
import { Handler } from "../utils/Handler";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PropEffectBase extends cc.Component {

    startNode: cc.Node = null;
    protected skillId: number = null;
    public setSkillId(skillId: number) {
        this.skillId = skillId;
    }
    public play() { }
    public iconAniEnd() { }
    public beforeExistAni() { }
    public releaseSkill() {
        Game.skillMgr.releaseFullSceneSkill(this.skillId);
    }

    playSound() {
        Game.soundMgr.playSound(EResPath.MAGIC_SOUND + this.skillId);
    }

    onEnable() {
        GameEvent.on(EventEnum.GAME_PAUSE, this.onGamePause, this);
        GameEvent.on(EventEnum.EXIT_GAME_SCENE, this.onExitGameScene, this);
    }

    onDisable() {
        GameEvent.targetOff(this);
    }

    private onGamePause(pause: boolean) {
        pause ? this.onPause() : this.onResume();
    }

    private onExitGameScene() {
        this.onPause();
    }

    protected onPause() {

    }

    protected onResume() {

    }

    onDestroy() {
        SysMgr.instance.clearTimerByTarget(this);
        Handler.dispose(this);
    }
}
