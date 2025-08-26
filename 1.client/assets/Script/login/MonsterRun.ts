import { EResPath } from "../common/EResPath";
import SysMgr from "../common/SysMgr";
import { EComponentType } from "../logic/comps/AllComp";
import LoginMoveComp from "../logic/comps/animation/LoginMoveComp";
import { Monster } from "../logic/sceneObjs/Monster";
import { Handler } from "../utils/Handler";
import { MathUtils } from "../utils/MathUtils";

/**怪物随便跑跑 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("游戏脚本/login/MonsterRun")
export class MonsterRun extends cc.Component {

    @property({
        tooltip:"刷怪最短时间"
    })
    dyMin:number = 0;

    @property({
        tooltip:"刷怪最长时间"
    })
    dyMax:number = 3000;

    @property({
        type:[cc.String],
        tooltip:"怪物列表" 
    })
    monsterResList:string[] = [
        'dongxiguarang',
        'guaguawa',
        'huolongguo',
        'shiliuwang',
        'xiguarang',
        'xueyouguai1',
        'xueyouguai2',
        'xueyouguai3',
        'zhengshi12_tizi2',
        'zhengshi13_boluo',
        'zhengshi13_caomei',
        'zhengshi13_hamigua',
        'zhengshi13_pingguo',
        'zhengshi13_shiliuzi',
        'zhengshi13_tizi',
        'zhengshi13_xiangjiao',
        'zhengshi13_yali',
        'zhengshi13_yingtao',
        'zhengshi17_mangguo',
    ];

    @property({
        type:[cc.Integer],
        tooltip:"怪物移动速度，与怪物列表一一对应" 
    })
    monsterSpeedList:number[] = [
        200,
        200,
        200,
        200,
        200,
        200,
        200,
        200,
        200,
        200,
        200,
        200,
        200,
        200,
        200,
        200,
        200,
        200,
        200,
        200,
    ]

    private _monsterList:Monster[] = [];
    private _size:cc.Size;
    start() {
        this._size = this.node.getContentSize();
        this.node.on("size-changed" , this.contentSizeChanged , this)
        this.onTimer();
    }

    private onTimer() {
        let index = MathUtils.randomInt(0 , this.monsterResList.length - 1);
        this.createMonster(this.monsterResList[index] , this.monsterSpeedList[index]);
        this.addTimer();
    }

    private createMonster(name:string , speed:number) {
        let so: Monster = new Monster();
        so.activeComp = false;
        let walkComp: LoginMoveComp = so.getAddComponent(EComponentType.LOGIN_MOVE) as LoginMoveComp;
        so.addTo(this.node);
        so.name = name;
        
        let x = 0;
        let y = Math.random() * this._size.height;
        so.setPos(x , y);

        walkComp.setSpeed(speed);
        so.initAnimationComp(EComponentType.ANIMATION);
        so.setModelUrl(EResPath.CREATURE_MONSTER + name);
        walkComp.setHandler(new Handler(this.onWalkSuccess , this));
        walkComp.moveTo(this._size.width);
        this._monsterList.push(so);
    }

    private onWalkSuccess(so:Monster , success:boolean) {
        let index = this._monsterList.indexOf(so);
        if (index != -1) {
            this._monsterList.splice(index , 1);
        }
        so.dispose();
    }

    private addTimer() {
        SysMgr.instance.doOnce(Handler.create(this.onTimer , this) , MathUtils.randomInt(this.dyMin , this.dyMax) , true);
    }

    onDisable(){
        SysMgr.instance.clearTimer(Handler.create(this.onTimer , this) , true);
        let len = this._monsterList.length;
        for (let i = len - 1 ; i >= 0 ; i--) {
            this._monsterList[i].dispose();
        }
        this._monsterList.length = 0;
    }

    onDestroy() {

    }

    update() {
        let len = this._monsterList.length;
        if (this._monsterList.length > 0) {
            this._monsterList.sort((a: any, b: any) => {
                return a.y - b.y;
            });

            let so: Monster;
            let groupIdx: number = -1;
            for (let i = 0; i < len; i++) {
                so = this._monsterList[i];
                if (so.renderNode) {
                    if (so['groupID'] && so['groupID'] > 0) {
                        if (groupIdx == -1) {
                            groupIdx = 10000 - i;
                        }
                        so.renderNode.zIndex = groupIdx;
                    } else {
                        so.renderNode.zIndex = 10000 - i;
                    }
                }
            }
        }
    }

    private contentSizeChanged() {
        this._size = this.node.getContentSize();
    }

}