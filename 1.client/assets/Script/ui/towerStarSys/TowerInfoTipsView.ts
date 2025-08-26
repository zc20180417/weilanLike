import Game from "../../Game";
import { GS_TroopsInfo_TroopsInfoItem } from "../../net/proto/DMSG_Plaza_Sub_Troops";
import Dialog from "../../utils/ui/Dialog";

const { ccclass, property , menu } = cc._decorator;

@ccclass
@menu("Game/tower/TowerInfoTipsView")
export class TowerInfoTipsView extends Dialog {

    @property(cc.Label)
    atkLabel:cc.Label = null;

    @property(cc.Label)
    speedLabel:cc.Label = null;

    @property(cc.Label)
    rangeLabel:cc.Label = null;

    @property(cc.Label)
    propTipsLabel:cc.Label = null;

    @property(cc.Label)
    propLabel:cc.Label = null;

    @property(cc.Label)
    skinLabel:cc.Label = null;


    private _data:GS_TroopsInfo_TroopsInfoItem = null;

    public setData(data: any): void {
        this._data = data;
    }

    protected beforeShow(): void {
        const star = Game.towerMgr.getStar(this._data.ntroopsid);
        this.atkLabel.string = Game.towerMgr.getAttack(this._data.ntroopsid , star).toString();
        this.speedLabel.string = (Game.towerMgr.getUpStarSpeed(this._data.ntroopsid , star , 3) / 1000).toFixed(2);
        this.rangeLabel.string = (Game.towerMgr.getUpStarDis(this._data.ntroopsid , star , 3) / 75).toFixed(2) + '格';
        this.skinLabel.string = (Game.fashionMgr.getTowerFashionAddHurtPer(this._data.ntroopsid) / 100).toFixed(2) + "%";
        
        let scienceL = Game.towerMgr.getTowerScienceDes(this._data.ntroopsid , 5).des;
        scienceL = scienceL.split('<color')[0] + '加成';
        this.propTipsLabel.string = scienceL;
        let sciencePro = Game.strengMgr.getScienceProData(this._data.ntroopsid);
        this.propLabel.string = sciencePro.deepenHurtSelfValue.toString();
    }






}