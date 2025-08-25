import Dialog from "../../utils/ui/Dialog";
import ImageLoader from "../../utils/ui/ImageLoader";
import Game from "../../Game";
import { EResPath } from "../../common/EResPath";
import { MonsterConfig } from "../../common/ConfigInterface";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/ui/monster/BossDesView")
export class BossDesView extends Dialog {

    @property(ImageLoader)
    img: ImageLoader = null;

    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(cc.Label)
    desLabel: cc.Label = null;

    @property(cc.Label)
    technicLabel: cc.Label = null;

    _isBossBgPlayed: boolean = false;

    setData(data: any) {
        if (!data) return;
        let monsterCfg: MonsterConfig = Game.monsterManualMgr.getMonsterCfg(data.id);
        this.nameLabel.string = monsterCfg.szname;


        this.img.url = EResPath.MONSTER_IMG + data.img;
        this.desLabel.string = data.des;
        this.technicLabel.string = data.technic;
    }

    onEnable() {
        Game.soundMgr.playSound(EResPath.BOSS_WARING);
        this.scheduleOnce(() => {
            Game.soundMgr.playMusic(EResPath.FOREST_BOSS_BG);
            this._isBossBgPlayed = true;
        }, 2.3);
    }

    onDisable() {
        if (!this._isBossBgPlayed) {
            Game.soundMgr.playMusic(EResPath.FOREST_BOSS_BG);
        }
        //Game.soundMgr.stopAllEffects();
    }
}