
import Dialog from "../utils/ui/Dialog";
import List from "../utils/ui/List";
import Game from "../Game";
import { EventEnum } from "../common/EventEnum";
import GlobalVal from "../GlobalVal";
import { CpTaskItem } from "./CpTaskItem";
import { GameEvent } from "../utils/GameEvent";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/ui/CpTaskView")
export class CpTaskView extends Dialog {

    @property(List)
    list: List = null;


    addEvent() {
        super.addEvent();

        GameEvent.on(EventEnum.CPTASK_STATE_CHANGE, this.onCpTaskChange, this);
    }

    protected beforeShow() {
        if (!Game.curGameCtrl) return;
        this.list.array = Game.curGameCtrl.getTaskCtrl().getCurTaskList(); 
    }

    protected afterShow(): void {
        if (GlobalVal.isUserClickCPTaskView && !cc.sys.localStorage.getItem("cpTaskItemTips")) {
            cc.sys.localStorage.setItem("cpTaskItemTips", "true");
            let node = this.list.getCell(0);
            let taskComp = node.getComponent(CpTaskItem);
            taskComp.clickDiamond();
        }
    }

    protected afterHide(): void {
        GlobalVal.isUserClickCPTaskView = false;
    }

    private onCpTaskChange() {
        if (!Game.curGameCtrl) return;
        this.list.array = Game.curGameCtrl.getTaskCtrl().getCurTaskList();
    }
}