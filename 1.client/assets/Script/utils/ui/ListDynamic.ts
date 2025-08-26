
import { EventEnum } from "../../common/EventEnum";
import BaseItem from "./BaseItem";

const { ccclass, property, menu } = cc._decorator;

/**
 * 列表类
 */
@ccclass
@menu("Game/utls/ListDynamic")
export default class ListDynamic extends cc.Component {

    @property({
        tooltip: "动态显示间隔时间"
    })
    spaceTime:number = 0;

    @property({
        tooltip: "子项运动时间"
    })
    itemActionTime:number = 0;

    @property({
        tooltip: "x运动值"
    })
    xDiff:number = 0;
    @property({
        tooltip: "y运动值"
    })
    yDiff:number = 0;

    @property({
        tooltip: '显示的时候是否启动缩放动画效果'
    })
    scaleAnimate: boolean = true;

    @property({
        tooltip: '显示的时候是否启动淡入动画效果'
    })
    fadeAnimate: boolean = true;

    play(nodeList:cc.Node[]) {
        let child:cc.Node;
        let j:number = 0;
        const len = nodeList.length;
        const opacity = this.fadeAnimate ? 0 : 255;
        const scale = this.scaleAnimate ? 0 : 1.0;
        for(let i:number = 0 ; i < len ;i++)
        {
            child = nodeList[i];
            if (child.active == true) {
                child.stopAllActions();
                child.opacity = opacity;
                child.scale = scale;
                let toX:number = child.x;
                let toY:number = child.y;
    
                child.x = toX + this.xDiff;
                child.y = toY + this.yDiff;
    
                let action= cc.tween(null).to(this.itemActionTime , {x:toX,y:toY,opacity:255,scale:1.0},{easing:"quadOut"});
                child.getComponent(BaseItem).setAction(action , j * this.spaceTime);
                j++;
            }
        }

        this.scheduleOnce(this.actionEnd , ((j + 1) * this.spaceTime) + 0.05);
    }

    private actionEnd() {
        this.node.emit(EventEnum[EventEnum.LIST_DYNAMIC_END].toString());
    }

}