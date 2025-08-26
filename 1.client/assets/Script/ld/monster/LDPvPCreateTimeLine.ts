import { ECamp } from "../../common/AllEnum";
import Game from "../../Game";
import { EComponentType } from "../../logic/comps/AllComp";
import { Monster } from "../../logic/sceneObjs/Monster";
import { MathUtils } from "../../utils/MathUtils";
import { LDCreateTimeLine } from "./LDCreateTimeLine";

export class LDPvPCreateTimeLine extends LDCreateTimeLine {

    constructor(index: number , camp:ECamp) {
        super(index , camp);
        this._minX = 49;
        this._maxX = 665;
        this._initY = 800;

    }


    protected doCreate() {
        let monsterID: number = this._monList.nmonsterid[this._index];
        if (monsterID > 0) {
            let so: Monster = Game.soMgr.createMonster(monsterID, this._bloodRatio , 0 , this._campId);
            if (so) {
                //调试用
                so.setBoIndex(this._boIndex);
                //49地图最左边，665地图最右边
                const x = MathUtils.randomInt(this._minX + so.halfSize.width , this._maxX - so.halfSize.width);
                let y = this._initY + MathUtils.randomInt(50 , 100);
                y = Game.curLdGameCtrl.mirrorY(y , this._campId);
                so.setPosNow(x, y);
                so.getAddComponent(EComponentType.MONSTER_AUTO);
            }
        }
        this._count ++;
        this._addIndexFunc();
    }
}