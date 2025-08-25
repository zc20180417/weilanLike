
import { CombNode } from "./CombNode";
import { MatUtils } from "./MatUtils";

export class NodeUtils {

    static scaleTo(node: cc.Node, time: number, value: number, endFunc?: Function, target?: any, easing: string = "sineIn") {
        node.stopAllActions();
        let tween = cc.tween(node).to(time, { scale: value }, { easing: easing });
        this.setCallFunc(tween, endFunc, target);
        tween.start();
    }

    static fadeTo(node: cc.Node, time: number, value: number, endFunc?: Function, target?: any) {
        node.stopAllActions();
        let tween = cc.tween(node).to(time, { opacity: value }, { easing: "sineIn" });
        this.setCallFunc(tween, endFunc, target);
        tween.start();
    }

    /**
     * 
     * @param node 
     * @param time 时间(单位秒)
     * @param value 要旋转到的值
     * @param easing 缓动函数
     * @param endFunc 结束回调方法
     * @param target 
     */
    static rotationTo(node: cc.Node, time: number, value: number, easing: any, endFunc?: Function, target?: any) {
        node.stopAllActions();
        let tween = cc.tween(node).to(time, { rotation: value }, { easing: easing });
        this.setCallFunc(tween, endFunc, target);
        tween.start();
    }

    static to(node: cc.Node, time: number, props: any, easing: any, endFunc?: Function, funParam?: any, target?: any, dy?: number, stopOther: boolean = true) {
        if (stopOther) {
            node.stopAllActions();
        }
        let tween = cc.tween(node);
        if (dy) {
            tween.delay(dy);
        }
        tween.to(time, props, { easing: easing });
        this.setCallFunc(tween, endFunc, target, funParam);
        tween.start();
    }

    static bezierTo(node: cc.Node, time: number, curPos: cc.Vec2, midPos: cc.Vec2, toPos: cc.Vec2, endFunc?: Function, funParam?: any, target?: any, dy?: number) {
        node.stopAllActions();
        let tween = cc.tween(node);
        if (dy) {
            tween.delay(dy);
        }
        tween.bezierTo(time, curPos, midPos, toPos);
        this.setCallFunc(tween, endFunc, target, funParam);
        tween.start();
    }

    /**按钮是否禁用 */
    static enabled(btn: cc.Button, flag: boolean) {
        btn.enabled = flag;
        btn.node.opacity = flag ? 255 : 125;
    }

    static enabledGray(btn:cc.Button , flag:boolean) {
        btn.enabled = flag;
        this.setNodeGray(btn.node , !flag);
    }

    /**添加进节点 */
    static addToParent(node: cc.Node, parent: cc.Node) {
        if (node.parent) {
            let worldPos: cc.Vec2 = node.convertToWorldSpaceAR(cc.Vec2.ZERO_R);
            let nodePos: cc.Vec2 = parent.convertToNodeSpaceAR(worldPos);
            node.removeFromParent();
            node.setPosition(nodePos);
        }
        parent.addChild(node);
    }

    private static setCallFunc(tween: any, endFunc?: Function, target?: any, funParam?: any) {
        if (endFunc) {
            tween.call(function () {
                endFunc.apply(target, funParam != undefined ? [funParam] : null);
            });
        }
    }

    /**
     * label数字增长动画
     * @param target 
     * @param start 
     * @param end 
     * @param progress 
     * @param complete 
     * @param pre 
     * @param suffix 
     */
    static labelCountingAni(
        target: cc.Label,
        start: number,
        addNum: number,
        progress: Function = null,
        complete: Function = null,
        pre: string = "",
        suffix: string = "") {

        let step = addNum / 5;
        let tempValue = start;

        let tween = cc.tween()
            .call(() => {
                tempValue += step;
                let temp = Math.floor(tempValue);

                target.string = pre + temp.toString() + suffix;
                if (progress) {
                    progress.call(null, temp);
                }
            })
            .delay(0.06);

        cc.tween(target.node)
            .repeat(5, tween)
            .call(() => {
                target.string = pre + (start + addNum).toString() + suffix;
                if (complete) {
                    complete.call(null, start + addNum);
                }
            })
            .start();
    }


    static moenyLabelAni(
        target: cc.Label,
        startNum: number,
        addNum: number
    ) {
        let step = addNum / 5;
        let temp = 0;
        let tween = cc.tween()
            .call(() => {
                temp += step;
                target.string = ((startNum + temp) / 100).toFixed(2);
            })
            .delay(0.06);

        cc.tween(target.node)
            .repeat(5, tween)
            .call(() => {
                target.string = ((startNum + addNum) / 100).toFixed(2);
            })
            .start();
    }

    

    static setColor(node: cc.Node, color: cc.Color) {
        if (!node) return;
        let sprites: cc.RenderComponent[] = node.getComponentsInChildren(cc.RenderComponent);
        if (sprites) {
            sprites.forEach(element => {
                element.node.color = color;
            });
        }

    }

    /**
     * 
     * @param node 
     * @param isGray 
     */
    static setNodeGray(node: cc.Node | CombNode, isGray: boolean) {
        if (node instanceof cc.Node) {
            if (isGray) {
                MatUtils.setNodeGray(node);
            } else {
                MatUtils.setNodeNormal(node);
            }
        } else {
            node.setGray(isGray)
        }

    }

    static progressAni(progressBar: cc.ProgressBar,
        startProgress: number,
        endPorgress: number,
        times: number,
        dir: number,
        time: number) {
        let tween: cc.Tween<cc.ProgressBar>;
        tween = cc.tween(progressBar);
        if (times == 1) {
            tween.call(() => { progressBar.progress = startProgress; })
                .to(time, { progress: dir > 0 ? 1 : 0 });
        } else if (times == 2) {
            tween.call(() => { progressBar.progress = startProgress; })
                .to(time, { progress: dir > 0 ? 1 : 0 })
                .call(() => { progressBar.progress = dir > 0 ? 0 : 1; })
                .to(time, { progress: endPorgress })
        } else if (times >= 3) {
            tween.call(() => { progressBar.progress = startProgress; })
            .to(time, { progress: dir > 0 ? 1 : 0 })

            for (let i = 0, len = times - 2; i < len; i++) {
                tween.call(() => { progressBar.progress = dir > 0 ? 0 : 1; })
                    .to(time, { progress: dir > 0 ? 1 : 0 });
            }

            tween.call(() => { progressBar.progress = dir > 0 ? 0 : 1; })
            tween.to(time, { progress: endPorgress })
        }

        tween.start();
    }

    static cacheTransitionChangeDic: Record<number, boolean> = {};
    // static enabledGray(btn: cc.Button, flag: boolean) {
    //     this.enabledBtn(btn, flag);
    //     this.setNodeGray(btn.node, !flag);
    // }

    static enabledBtn(btn: cc.Button, flag: boolean) {
        if (!flag && btn.transition == cc.Button.Transition.COLOR) {
            btn.transition = cc.Button.Transition.NONE;
            this.cacheTransitionChangeDic[btn.uuid] = true;
        }

        if (flag && this.cacheTransitionChangeDic[btn.uuid]) {
            btn.transition = cc.Button.Transition.COLOR;
            delete this.cacheTransitionChangeDic[btn.uuid];
        }

        btn.interactable = flag;
    }
}