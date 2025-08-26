import { BuryingPointMgr, EBuryingPoint } from "../buryingPoint/BuryingPointMgr";
import { LocalStorageMgr } from "../utils/LocalStorageMgr";
import Dialog from "../utils/ui/Dialog";
import { NodeUtils } from "../utils/ui/NodeUtils";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/Login/ManHua")
export class ManHua extends Dialog {


    @property([dragonBones.ArmatureDisplay])
    nodeList:dragonBones.ArmatureDisplay[] = [];

    // private handler:Handler;
    private index = 0;
    private _state = 1;
    protected beforeShow() {
        BuryingPointMgr.postFristPoint(EBuryingPoint.SHOW_CARTOON);
        this.blackLayer.opacity = 255;
        this.playEft();

        this.nodeList.forEach(element => {
            element.on(dragonBones.EventObject.COMPLETE, this.dragonEventHandler, this);
            element.on(dragonBones.EventObject.LOOP_COMPLETE, this.dragonEventHandler, this);
        });
        
        LocalStorageMgr.setItem(LocalStorageMgr.SHOW_MANHUA , 1);
    }

    protected dragonEventHandler(event: any) {
        let flag = false;
        if (event.type == dragonBones.EventObject.COMPLETE) {
            flag = true;
        } else if (event.type == dragonBones.EventObject.LOOP_COMPLETE) {
            if (this.index == 3) {
                flag = true;
            }
        }
        if (flag) {
            this.index ++;
            if (this.index >= 4) {
                this._state = 2;
                // this.closeButton.node.active = true;
            } else {
                this.playEft();
            }
        }
    }

    

    private playEft() {
        let curNode = this.nodeList[this.index].node;
        curNode.active = true;
        curNode.opacity = 0;
        this.nodeList[this.index].armature().animation['gotoAndStopByFrame']('newAnimation' , 0);
        let tempX = curNode.x;
        switch (this.index) {
            case 0:
                curNode.x = tempX - 200;
                break;
            case 1:
                curNode.x = tempX + 200;
                break;
            case 2:
                curNode.x = tempX - 200;
                break;
            case 3:
                curNode.x = tempX + 200;
                break;
            default:
                break;
        }
        NodeUtils.to(curNode , 1 , {x:tempX , opacity:255} , 'sineIn' , this.endFunc , this.index , this);
    }

    private endFunc(index) {
        const times = index == 3 ? 0 : 1;
        cc.log('-iunbdex:' , index);
        this.nodeList[index].playAnimation('newAnimation' , times);
    }

    onSkip() {
        if (this._state == 1) {

            for (let i = this.index ; i < 4 ; i++) {
                this.index ++;
                if (this.index == 4) {
                    this._state = 2;
                } else {
                    this.playEft();
                }
            }

        } else {
            this.hide();
        }
    }


}