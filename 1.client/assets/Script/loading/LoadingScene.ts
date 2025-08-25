


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/Loading/LoadingScene")
export default class LoadingScene extends cc.Component {


    @property(cc.Label)
    textPrg: cc.Label = null;

    @property(cc.Sprite)
    proImg: cc.Sprite = null;

    onLoad() {

    }

    start() {
        
    }

    onUpdateComplete() {
        this.textPrg.string = '';
    }

    refreshProgress(progress: number) {
        //cc.log(progress);
        this.textPrg.string = "正在进入游戏 " + (progress * 100).toFixed(2) + "%";
        this.proImg.fillRange = progress;
    }

    refreshProgress2(progress: number) {
        this.textPrg.string = "正在下载更新文件 " + Math.floor(progress * 100) + "%";
        this.proImg.fillRange = progress;
    }

    refreshTips(tips:string) {
        this.textPrg.string = tips;
    }

}
