// FILEPATH: h:/workSpace/NewCatTD/1.client/assets/Script/ld/skill/ccc/BossBloodComp.ts

import { CCCBloodBase } from "./CCCBloodBase";

const { ccclass, property , menu } = cc._decorator;
@ccclass
@menu("Game/comp/BossBloodComp")
export class BossBloodComp extends CCCBloodBase {



    @property(cc.Label)
    label: cc.Label = null;

    @property(cc.Sprite)
    blood2: cc.Sprite = null;

    @property(cc.Color)
    color2: cc.Color = null;

    private _bloodRate: number = 1; // 0-1

    private readonly maxBloodCount: number = 10;

    private _isColorSwitched: boolean = false; // 标记当前颜色是否切换过

    private _tween: cc.Tween = null;

    private _useBlood2OnTop: boolean = false; // 标记当前哪个血条在上层

    private _tweenRate: number = 1; // 用于缓动的属性

    private _baseZIndex: number = 0; // 存储blood初始zIndex


    protected start(): void {
        // super.start();
        this._baseZIndex = this.blood.node.zIndex;
    }

    onAdd(): void {
        super.onAdd();
        this._bloodRate = 1;
        this._tweenRate = 1;
        this.blood2.node.active = true;
        this.blood.node.active = true;
        this.blood.fillRange = 1;
        this.blood2.fillRange = 1;
        this.label.string = `x${this.maxBloodCount}`;
        this._isColorSwitched = false;
        this._useBlood2OnTop = false;
        this.updateColors(false);
        this.updateZOrder();
    }

    /**
     * 血量比例缓动属性的getter
     */
    get tweenRate(): number {
        return this._tweenRate;
    }

    /**
     * 血量比例缓动属性的setter，设置时更新血条显示和颜色切换逻辑
     */
    set tweenRate(value: number) {
        
        const totalBlood = this.maxBloodCount;
        const oldCount = Math.ceil(this._tweenRate * totalBlood);
        const newCount = Math.ceil(value * totalBlood);

        // 更新label显示当前血条数量
        this.label.string = `x${newCount}`;

        // 计算当前fillRange
        const fillRange = ((value * 100) % 10) / 10 ;

        // 判断是否切换层级和颜色（当血条数量变化时切换）
        const switched = newCount !== oldCount;
        if (switched) {
            this._useBlood2OnTop = !this._useBlood2OnTop;
            this.updateZOrder();
            const shouldSwitch = (newCount % 2) === 0;
            if (shouldSwitch !== this._isColorSwitched) {
                this._isColorSwitched = shouldSwitch;
                this.updateColors(shouldSwitch);
            }
        }

        // 根据当前层级，分别设置fillRange
        if (this._useBlood2OnTop) {
            this.blood2.fillRange = fillRange;
            this.blood.fillRange = 1;
        } else {
            this.blood.fillRange = fillRange;
            this.blood2.fillRange = 1;
        }

        // blood2显示控制
        this.blood.node.active = newCount > 1;
        this.blood2.node.active = newCount > 0;

        this._tweenRate = value;
    }

    // private _prevNewRate: number = 1;

    /**
     * 根据传入的血量比例刷新血条显示，带缓动效果
     * @param bloodRate 0-1之间的血量比例
     */
    refreshBlood(bloodRate: number) {
        const newRate = cc.misc.clampf(bloodRate, 0, 1);
        if (this._bloodRate == newRate) return; // 避免重复调用（例如连续两次血量更新）

        if (this._tween) {
            this._tween.stop();
            this._tween = null;
        }

        const oldRate = this._tweenRate;
        this._bloodRate = newRate;

        this._tween = cc.tween(this)
            .to(0.2, { tweenRate: newRate }) // 通过setter缓动更新显示
            .start();
    }

    /**
     * 切换blood和blood2的颜色
     * @param switched 是否切换颜色（true时blood用color2，blood2用白色；false时blood用白色，blood2用color2）
     */
    private updateColors(switched: boolean) {
        return;
        if (switched) {
            this.blood.node.color = this.color2;
            this.blood2.node.color = cc.Color.WHITE;
        } else {
            this.blood.node.color = cc.Color.WHITE;
            this.blood2.node.color = this.color2;
        }
    }

    /**
     * 交换blood和blood2的显示层级，避免视觉错觉
     */
    private updateZOrder() {
        if (this._useBlood2OnTop) {
            this.blood2.node.zIndex = this._baseZIndex + 1;
            this.blood.node.zIndex = this._baseZIndex ;
        } else {
            this.blood2.node.zIndex = this._baseZIndex;
            this.blood.node.zIndex = this._baseZIndex + 1;
        }
        this.label.node.zIndex = this._baseZIndex + 2;
    }
}