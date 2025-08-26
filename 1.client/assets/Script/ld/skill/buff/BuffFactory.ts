
import { TreatBuff } from "./TreatBuff";
import { ImprisonmentBuff } from "./ImprisonmentBuff";
import { BuffType } from "../../../common/AllEnum";
import Game from "../../../Game";
import Creature from "../../../logic/sceneObjs/Creature";
import { AddAtttackSpeedBuff } from "./AddAtttackSpeedBuff";
import BuffBase from "./BuffBase";
import { DeepeningDamageBuff } from "./DeepeningDamageBuff";
import { NumbBuff } from "./NumbBuff";
import { BurnBuff } from "./BurnBuff";
import { TauntBuff } from "./TauntBuff";
import { DefeatBuff } from "./DefeatBuff";
import { TreatReduceBuff } from "./TreatReduceBuff";
import { VertigoBuff } from "./VertigoBuff";
import { ImmuneCtrlBuff } from "./ImmuneCtrlBuff";

export default class BuffFactory {
    static getBuff(buffId: number, receiver: Creature, damageValue:number , skillUid:number, ...args: any[]): BuffBase {
        let buffConfig = Game.ldSkillMgr.getBuff(buffId);
        let buff: BuffBase;
        if (buffConfig) {
            buff = this.getBuffByType(buffConfig.buffType, args[0]);
            buff.config = buffConfig;
            buff.skillUid = skillUid;
            buff.damageValue = damageValue;
            buff.receiver = receiver;
        } else {
           cc.warn("不存在buff id", buffId);
        }
        return buff;
    }

    private static getBuffByType(type: BuffType, args: any) {
        let buff: BuffBase;
        switch (type) {
            case BuffType.TREAT:
                buff = new TreatBuff();
                break;
            case BuffType.ADD_ATTACK_SPEED:
                buff = new AddAtttackSpeedBuff();
                break;
            case BuffType.DEEPENING_DAMAGE:
                buff = new DeepeningDamageBuff();
                break;
            case BuffType.IMPRISONMENT:
                buff = new ImprisonmentBuff();
                break;
            case BuffType.NUMB:
                buff = new NumbBuff();
                break;
            case BuffType.BURN:
                buff = new BurnBuff();
                break;
            case BuffType.TAUNT:
                buff = new TauntBuff();
                break;
            case BuffType.BEAT_BACK:
                buff = new DefeatBuff();
                break;
            case BuffType.TREAT_REDUCE:
                buff = new TreatReduceBuff();
                break;
            case BuffType.VERTIGO:
                buff = new VertigoBuff();
                break;
            case BuffType.IMMUNE_CTRL:
                buff = new ImmuneCtrlBuff();
                break;
        }
        if (buff) {
            buff.args = args;
        }
        return buff;
    }
}
