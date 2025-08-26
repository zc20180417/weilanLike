
import { EventEnum } from "../../common/EventEnum";
import Game from "../../Game";
import { GameEvent } from "../../utils/GameEvent";
import Dialog from "../../utils/ui/Dialog";


const { ccclass, property ,menu} = cc._decorator;

@ccclass
@menu("Game/ui/tips/DownLoadGameView")
export class DownLoadGameView extends Dialog {


    @property(cc.Label)
    tipLabel:cc.Label = null;

    @property(cc.Node)
    btn:cc.Node = null;

    @property(cc.Label)
    progressLabel:cc.Label = null;

    @property(cc.Node)
    progressNode:cc.Node = null;

    @property(cc.Node)
    progressSp:cc.Node = null;

    private _spState:number = 0;
    addEvent() {
        GameEvent.on(EventEnum.UPDATE_APK_PROGRESS , this.refreshProgress , this);
    }

    setData(str:string) {
        this.tipLabel.string = str;
    }


    onOkClick() {
        let str = 'https://cdnmmbwz.chukonggame.com/build/apk/tf_mmbwz.apk';
        Game.nativeApi.downLoadApk(str);
        this.btn.active = false;
        this.progressLabel.node.active = true;
        this.progressNode.active = true;
        this.refreshProgress('0');
    }

    private refreshProgress(progress:string) {
        if (!this.progressLabel || !this.progressLabel.isValid) return;
        let p = Number(progress);
        this.progressLabel.string = `正在下载：${Math.floor(p)}%`;
        let wid = p / 100 * 446;
        this.progressSp.width = wid;
    }

}