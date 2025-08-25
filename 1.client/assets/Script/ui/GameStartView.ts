import Dialog from "../utils/ui/Dialog";
import SysMgr from "../common/SysMgr";
import { Handler } from "../utils/Handler";
import { NodeUtils } from "../utils/ui/NodeUtils";
import { GameEvent } from "../utils/GameEvent";
import { EventEnum } from "../common/EventEnum";
import Game from "../Game";
import { EResPath } from "../common/EResPath";
import { BuryingPointMgr, EBuryingPoint } from "../buryingPoint/BuryingPointMgr";
import { CpTaskItem } from "./CpTaskItem";
import { CpTask } from "../logic/cpTask/CpTask";
import GlobalVal from "../GlobalVal";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/ui/GameStartView")
export class GameStartView extends Dialog {

    @property(cc.Node)
    countDownBg: cc.Node = null;

    @property([cc.Node])
    imgList: cc.Node[] = [];

    @property([cc.SpriteFrame])
    sfList: cc.SpriteFrame[] = [];

    @property(cc.Node)
    goNode: cc.Node = null;

    @property(cc.Sprite)
    numImg: cc.Sprite = null;

    @property(CpTaskItem)
    tempTaskItem: CpTaskItem = null;

    @property(cc.Node)
    maozhaNode: cc.Node = null;

    @property(cc.Node)
    bg: cc.Node = null;

    private _showTaskCount: number = 0;
    private _timerHandler: Handler;
    private _index: number = 0;
    private _tempNodePro: any = { x: 150, y: -20, angle: -20, opacity: 0 };
    private _curTaskIndex: number = -1;
    private _handler: Handler;

    protected beforeShow() {
        GameEvent.emit(EventEnum.CP_TASK_VIEW_SHOWED);
    }

    protected afterShow() {
        this.tryShowTask();
        BuryingPointMgr.postWar(EBuryingPoint.SHOW_COUNT_DOWN);
    }

    private onTimer() {
        if (this._index == 4) {
            SysMgr.instance.clearTimer(this._timerHandler, true);
            this.hide();

            Game.soundMgr.playSound(EResPath.CP_START_COUNT_END);
            return;
        }
        Game.soundMgr.playSound(EResPath.CP_START_COUNT);
        this.numImg.spriteFrame = this.sfList[this._index];
        let node: cc.Node = this.imgList[this._index];
        this.tweenNode(node);
        this.tweenNode(this.goNode);
        this._index++;
    }

    private tweenNode(node: cc.Node) {
        node.active = true;
        node.scale = 0;
        NodeUtils.scaleTo(node, 0.3, 1, null, this, 'backOut');
    }

    protected afterHide() {
        SysMgr.instance.clearTimer(this._handler, true);
        SysMgr.instance.clearTimer(this._timerHandler, true);
        BuryingPointMgr.postWar(EBuryingPoint.COUNT_DOWN_END);
        GameEvent.emit(EventEnum.HIDE_START_GAME);
    }

    private showCountDown() {
        this._timerHandler = new Handler(this.onTimer, this);
        //this._index = 0;
        SysMgr.instance.doLoop(this._timerHandler, 1000,0, true);
    }

    private tryShowTask() {
        let task = this.getTask();
        if (task) {
            this._showTaskCount++;
            this.showTask(task);
        } else {
            //this.tempTaskItem.node.active = false;
            //this.bg.active = true;
            this.maozhaNode.active = true;
            if (true) {
                this._index = 4;
                for (let i = 0; i < this._index; i++) {
                    this.imgList[i].active = true;
                }
                this.numImg.spriteFrame = this.sfList[this._index - 1];
            } else {
                this._index = 0;
            }
            this.maozhaNode.scale = 0.5;
            this.tweenNode(this.maozhaNode);
            this.tweenNode(this.goNode);
            Game.soundMgr.playSound(EResPath.CP_READY_GO);
            this.showCountDown();
        }
    }


    private showTask(task: CpTask) {
        let tempNode: cc.Node = this._showTaskCount > 1 ? cc.instantiate(this.tempTaskItem.node) : this.tempTaskItem.node;

        tempNode.x = this._tempNodePro.x;
        tempNode.y = this._tempNodePro.y;
        tempNode.scale = 1;
        tempNode.angle = this._tempNodePro.angle;
        tempNode.opacity = this._tempNodePro.opacity;

        if (!tempNode.parent) {
            this.tempTaskItem.node.parent.addChild(tempNode);
        }

        tempNode.active = true;
        let comp = tempNode.getComponent(CpTaskItem);
        comp.setData(task);
        Game.soundMgr.playSound(EResPath.TASK_SHOW);
        NodeUtils.to(tempNode, 0.3, { x: 0, y: 20, angle: 0, scale: 1, opacity: 255 }, "sineIn", this.showTaskStepEnd1,
            { showTaskCount: this._showTaskCount, curTaskIndex: this._curTaskIndex, tempNode: tempNode },
            this);
    }


    private showTaskStepEnd1(params: any) {
        let tempNode: cc.Node = params.tempNode;
        let toNode: cc.Node = GameEvent.dispathReturnEvent('get_task_track_item', this._showTaskCount - 1);
        if (toNode) {

            let worldPos = toNode.convertToWorldSpaceAR(cc.Vec2.ZERO_R);
            let nodePos = this.tempTaskItem.node.parent.convertToNodeSpaceAR(worldPos);
            params.nodePos = nodePos;
            params.angle = toNode.angle;

            if (tempNode.scale == undefined) {
                tempNode.scale = 1;
            }

            NodeUtils.to(tempNode, 0.4, { x: nodePos.x + 50, y: nodePos.y + 300, scale: 0.5 }, 'sineOut', this.showTaskStepEnd2, params, this, 0.5);
            if (!this._handler) {
                this._handler = new Handler(this.tryShowTask, this);
            }
            SysMgr.instance.doOnce(this._handler, 500, true);
        } else {
            this.tryShowTask();
        }
    }

    private showTaskStepEnd2(params: any) {
        let tempNode: cc.Node = params.tempNode;
        let nodePos = params.nodePos;
        NodeUtils.to(tempNode, 0.2, { x: nodePos.x, y: nodePos.y, opacity: 80, angle: params.angle }, "backOut", this.showTaskStepEnd3, params, this);
        this.scheduleOnce(() => {
            tempNode.stopAllActions();
            this.showTaskStepEnd3(params);
            GameEvent.emit(EventEnum.SHOW_TASK_TRACK_ITEM, params.showTaskCount - 1, params.curTaskIndex, tempNode);
        }, 0.08);
    }

    private showTaskStepEnd3(params: any) {
        let tempNode: cc.Node = params.tempNode;
        tempNode.active = false;
    }

    private getTask() {
        if (GlobalVal.curMapCfg.tasklist && Game.curGameCtrl) {
            let list = Game.curGameCtrl.getTaskCtrl().getCurTaskList();
            for (let i = this._curTaskIndex + 1; i < 3; i++) {
                let task = list[i];
                this._curTaskIndex = i;
                if (task && !task.isSuccess()) {
                    return task;
                }
            }
        }
        return null;
    }
}