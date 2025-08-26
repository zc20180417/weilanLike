
import { EResPath } from './../../common/EResPath';
import { UiManager } from './../../utils/UiMgr';
import { NodeUtils } from './../../utils/ui/NodeUtils';
import Dialog from "../../utils/ui/Dialog";
import GlobalVal from '../../GlobalVal';
import Game from '../../Game';
import { StringUtils } from '../../utils/StringUtils';

const { ccclass, property , menu } = cc._decorator;

@ccclass
@menu("Game/ui/bounty/BountyModeDialog")
export default class BountyModeDialog extends Dialog {

    @property(cc.Button)
    enterBtn:cc.Button = null;

    @property(cc.Sprite)
    imgTaskMode:cc.Sprite = null;

    @property(cc.Sprite)
    imgWujinMode:cc.Sprite = null;

    @property(cc.Label)
    openTimeLabel:cc.Label = null;

    @property(cc.Label)
    openTimeLabel2:cc.Label = null;

    private _enableTask:boolean = false;
    private _enableWuJin:boolean = false;
    private _mode:number = -1;

    protected beforeShow() {
        this.initOpenTime();
        if (this._enableTask) {
            this.selectMode(1);
        } else if (this._enableWuJin) {
            this.selectMode(2);
        }
        NodeUtils.enabled(this.enterBtn , this._enableTask || this._enableWuJin);
    }

    private onTaskModeClick() {
        if (this._enableTask) {
            this.selectMode(1);
        }
    }

    private onWuJinModeClick() {
        if (this._enableWuJin) {
            this.selectMode(2);
        }
    }

    private selectMode(mode:number) {
        if (this._mode == mode) return;
        this._mode = mode;
        this.imgTaskMode.node.color = mode == 1 ? cc.Color.WHITE : cc.Color.GRAY;
        this.imgWujinMode.node.color = mode == 1 ? cc.Color.GRAY : cc.Color.WHITE;
    }

    onEnterClick() {
        this.hide();
        if (this._mode == 1) {
            UiManager.showDialog(EResPath.SHANG_JIN);
        } else {
            UiManager.showDialog(EResPath.BOUNTRY_TOWER_VIEW);
        }
    }


    private initOpenTime() {
        let time = GlobalVal.getServerTime();
        let date:Date = new Date(time);
        let day = date.getDay();
        let taskCfg = Game.bountyMgr.getBountyCfg();


        if (taskCfg) {
            this._enableTask = taskCfg.btopendate[day] == 1;
            this.openTimeLabel.string = this.getTimeStr(taskCfg.btopendate);
        }

        let wujinTask = Game.bountyTowerMgr.bountryTowerCfg;
        if (wujinTask && wujinTask.data1.length > 0) {
            this._enableWuJin = wujinTask.data1[0].btopendate[day] == 1;
            this.openTimeLabel2.string = this.getTimeStr(wujinTask.data1[0].btopendate);
        }

    }

    private getTimeStr(btopendate:number[]):string {
        let timerStr = '开放时间：每周';
        let first:boolean = true;
        let len = btopendate.length;
        let isOpen:boolean = false;
        for (let i = 0 ; i < len ; i++) {
            if (btopendate[i] == 1) {
                if (!first) {
                    timerStr += "、"; 
                }
                timerStr += this.num2Cn(i);
                first = false;
                isOpen = true;
            }
        }
        if (!isOpen) {
            timerStr = '暂未开放';
        }
        return timerStr;
    }


    private num2Cn(value:number):string {
        if (value == 0) {
            return '日';
        }
        return StringUtils.num2Cn1(value);
    }


}