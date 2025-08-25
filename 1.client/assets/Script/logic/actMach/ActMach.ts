import { IAction } from "./IAction";
import { Component } from "../comps/Component";
import { BaseAction } from "./BaseAction";
import Creature from "../sceneObjs/Creature";
import GlobalVal from "../../GlobalVal";

export enum EActType {
    NONE,
    IDLE,
    IDLE2,
    MOVE,
    ATTACK,
    DIE,
    NUMB,
    DEFEAT,
    HIT, //被击中
    FLY_ENTER,
    DEATH_RECOVER

}

/**状态机 */
export class ActMach extends Component {
    private acts:any = {};
    //private notBreakActs:{[key:string]:IAction;} = {};
    private curAct:BaseAction;
    private nextActID:EActType;
    private nextActparam:any;
    private actCls:any;

    constructor() {
        super();
        this.actCls = {};
        this.acts = {};
        this.curAct = null;
        this.nextActID = null;
        this.nextActparam = null;
    }

    init(actCls:any) {
        this.actCls = actCls;
    }

    added() {
        super.added();
    }

    removed() {
        super.removed();
        if (this.curAct) {
            this.curAct.cancel();
        }

        for (const key in this.acts) {
            if (this.acts.hasOwnProperty(key)) {
                const element = this.acts[key];
                element.dispose();
            }
        }

        this.nextActID = null;
        this.nextActparam = null;
        this.acts = {};
        this.curAct = null;
        //this.notBreakActs = null;
    }

    changeTo(actID:EActType,param?:any) {
        if (!this.owner) {
            cc.log("ActMach:ChangeTo-error:enpty-owner");
            return;
        }

        if (!actID) {
            //cc.log("ActMach:ChangeTo-error:enpty-actID")
            return;
        }

        if (!this.actCls || !this.actCls[actID]) {
            cc.log("ActMach:ChangeTo-error:inavalible-actID" + actID)
            return;
        }

        let action:BaseAction = this.acts[actID];
        if (!action) {
            action = new this.actCls[actID];
            action.machine = this;
            action.actID = actID;
            action.owner = this.owner as Creature;
            this.acts[actID] = action;
            action.init();
        }

        if (action.notBreakAct) {

        }

        if (this.curAct) {
            if (this.curAct.actID == actID) {
                this.curAct.start(param);
                return;
            }

            if (!this.curAct.canChangeTo(actID)) {
                return;
            }

            this.curAct.cancel();
        }

        this.nextActID = null;
        this.nextActparam = null;
        this.curAct = action;
        this.curAct.start(param);
    }

    getAct():IAction {
        return this.curAct;
    }

    onActSelfEnd(act:BaseAction) {
        if (!act || act != this.curAct || !this.actCls) return;
        this.curAct = null;
        if (this.nextActID != null) {
            this.changeTo(this.nextActID , this.nextActparam);
        } else {
            this.changeTo(this.actCls.defaultActID);
        }
    }

    isInAct(actID:EActType):boolean {
        return this.curAct && this.curAct.actID == actID;
    }
}