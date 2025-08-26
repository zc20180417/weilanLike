import SoundManager from "../SoundManaget";

const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("Game/PlaySound")
export default class PlaySound extends cc.Component {

    @property
    soundUrl:string = "sound/click_common_1";

    onLoad(){
        this.node.on("click", this.onClick, this);
    }

    onClick(){
        SoundManager.instance.playSound(this.soundUrl);
    }

    onDestroy(){
        this.node.targetOff(this);
    }
}