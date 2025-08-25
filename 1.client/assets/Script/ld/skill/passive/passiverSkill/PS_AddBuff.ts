
import { EComponentType } from "../../../../logic/comps/AllComp";
import Creature from "../../../../logic/sceneObjs/Creature";
import BuffContainerComp from "../../buff/BuffContainerComp";
import { PassiveSkillBase } from "../PassiveSkillBase";

/**添加buff的被动 */
export class PS_AddBuff extends PassiveSkillBase {

    onTrigger(param?:any) {
        let target = this.getTarget(param);
        if (target instanceof Creature) {
            this.addBuff(target);
        } else if (target) {
            target.forEach(element => {
                this.addBuff(element)
            });
        }
    }

    onTriggerStop() {
        console.log('被动触发移除Buff！！');
        let target = this.getTarget();
        if (target instanceof Creature) {
            this.removeBuff(target);
        } else if (target) {
            target.forEach(element => {
                this.removeBuff(element)
            });
        }
    }


    private addBuff(target:Creature) {
        if (!target) return console.log('添加被动buff失败！ target is null');
        console.log('被动触发添加buff，' , target.cfg.name , ',buffId：' , this.passiveValue1);

        let buffComp: BuffContainerComp = target.getAddComponent(EComponentType.BUFF);
        buffComp.addBuff(this.passiveValue1[0],  0, 0);
    }

    private removeBuff(target:Creature) {
        if (!target) return console.log('添加被动buff失败！ target is null');
        console.log('被动触发移除buff，' , target.cfg.name , ',buffId：' , this.passiveValue1);
        let buffComp: BuffContainerComp = target.getAddComponent(EComponentType.BUFF);
        buffComp.removeBuff(this.passiveValue1[0]);
    }

}