import ActionEffect from "./ActionEffect";
import { EventEnum } from "../../common/EventEnum";
import { EDir } from "../../common/AllEnum";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("effect/DirectionalActionEffect")
export default class DirectionalActionEffect extends ActionEffect {

    @property([cc.String])
    directionalActions: string[] = ["move"]; // 需要分方向处理的动作名列表

    @property([cc.String])
    noDirectionActions: string[] = ["attack", "die"]; // 不分方向的动作名列表

    @property([cc.String])
    sharedIdleWithMoveActions: string[] = ["idle"]; // 可能共用move帧的动作名列表

    protected _currentDir: EDir = EDir.RIGHT;

    
    init() {
        if (this.owner) {
            this._currentDir = this.owner.dir;
            this.owner.on(EventEnum.LD_CREATURE_DIR_CHANGE, this.onDirChange, this);
        }
    }

    reset() {
        if (this.owner) {
            this.owner.off(EventEnum.LD_CREATURE_DIR_CHANGE, this.onDirChange, this);
        }
    }

    protected onDirChange(newDir: EDir) {
        this._currentDir = newDir;
        // 方向变化时，外部会统一处理scaleX，这里只做动作名和方向的区分逻辑
        // 如果需要根据方向切换动画帧，可以在这里处理
        // 例如重新播放当前动作以刷新帧
        if (this._curIndex !== -1) {
            const curAction = this.actionNames[this._curIndex];
            this.playAction(curAction, true);
        }
    }

    /**
     * 重写播放动作，支持idle共用move帧，其他动作按原逻辑
     * @param name 动作名
     * @param isLoop 是否循环
     * @param scale 时间缩放
     */
    playAction(name: string, isLoop: boolean = true, scale: number = 1) {
        // idle动作可能共用move的帧序列
        if (this.sharedIdleWithMoveActions.includes(name)) {
            name = "move";
        }

        // 对于分方向动作，动作名可以带方向后缀，如 move_up, move_down, move_right
        if (this.isDirectionalAction(name)) {
            const dirSuffix = this.getDirSuffix(this._currentDir);
            name = `${name}_${dirSuffix}`;
        }

        super.playAction(name, isLoop, scale);
    }

    /**
     * 判断动作是否需要分方向
     * @param name 动作名
     * @returns 是否分方向
     */
    isDirectionalAction(name: string): boolean {
        // 只判断基础动作名，不带方向后缀
        const baseName = name.split("_")[0];
        return this.directionalActions.includes(baseName);
    }

    /**
     * 判断动作是否不分方向
     * @param name 动作名
     * @returns 是否不分方向
     */
    isNoDirectionAction(name: string): boolean {
        const baseName = name.split("_")[0];
        return this.noDirectionActions.includes(baseName);
    }

    /**
     * 根据方向枚举获取字符串后缀
     * @param dir 方向枚举
     * @returns 方向字符串后缀
     */
    protected getDirSuffix(dir: EDir): string {
        switch (dir) {
            case EDir.TOP:
                return "up";
            case EDir.BOTTOM:
                return "down";
            case EDir.LEFT:
            case EDir.RIGHT:
            default:
                return "right"; // 左右都用right方向动画，scaleX由外部控制翻转
        }
    }
}