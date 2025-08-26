import { ECamp } from "../../common/AllEnum";
import Game from "../../Game";
import { EComponentType } from "../../logic/comps/AllComp";
import { Monster } from "../../logic/sceneObjs/Monster";
import { MathUtils } from "../../utils/MathUtils";
import { LDCreateTimeLine } from "../monster/LDCreateTimeLine";

export class LDCooperateCreateTimeLine extends LDCreateTimeLine {

    
    private _isBoss:boolean;


    constructor(index: number , camp:ECamp = ECamp.BLUE , isBoss:boolean) {
        super(index , camp);
        this._minX = camp == ECamp.BLUE ? 85 : 443;
        this._maxX = camp == ECamp.BLUE ? 345 : 703;
        this._initY = 1300;
        this._isBoss = isBoss;
    }


    protected doCreate() {
        let monsterID: number = this._monList.nmonsterid[this._index];
        if (monsterID > 0 ) {
            let so: Monster = Game.soMgr.createMonster(monsterID, this._bloodRatio);
            if (so) {
                //调试用
                so.setBoIndex(this._boIndex);
                //调试
                const x = this._isBoss ? Game.ldCooperateCtrl.mapHalfWid : MathUtils.randomInt(this._minX + so.halfSize.width , this._maxX - so.halfSize.width);
                const y = this._isBoss ? this._initY : this._initY + MathUtils.randomInt(50 , 100);
                if (this._campId == ECamp.COOPERATE) {
                    so.scaleX = -1;
                }
                so.setPosNow(x, y);
                so.getAddComponent(EComponentType.MONSTER_AUTO);
            }
        }
        this._count ++;
        this._addIndexFunc();
    }
}