
import { EventEnum } from "../../common/EventEnum";
import { GameEvent } from "../../utils/GameEvent";
import Dialog from "../../utils/ui/Dialog";
import JingCaiSuccTaskItem from "./JingCaiSuccTaskItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class JingCaiSuccView extends Dialog {

    @property(JingCaiSuccTaskItem)
    taskItems: JingCaiSuccTaskItem[] = [];


    setData(taskDatas:any[]) {
        if (!taskDatas) return;
        let len = Math.min(taskDatas.length , this.taskItems.length);
        for (let i = 0 ; i < len ; i++) {
            this.taskItems[i].setData(taskDatas[i]);
        }
    }

    private onBackClick() {
        this.hide();
        GameEvent.emit(EventEnum.DO_EXIT_MAP);
    }
    
}
