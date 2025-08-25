
import Game from "../../Game";
import GlobalVal from "../../GlobalVal";
import { LightningSkillProcessor } from "../../logic/comps/skill/LightningSkillProcessor";
import { ObjPool } from "../../logic/Recyclable/ObjPool";
import { SKILLTYPE } from "../../net/socket/handler/MessageEnum";
import { AmmoSkillProcessor } from "./AmmoSkillProcessor";
import { BaseSkillProcessor } from "./BaseSkillProcessor";
import FixedBombProcessor from "./FixedBombProcessor";
import { ReleaseSkillData } from "./LdSkillManager";
import { NormalSkillProcessor } from "./NormalSkillProcessor";
import { XiongSkillProcessor } from "./XiongSkillProcessor";

export class TriggerSkillCtrl {

    /**
     * 当触发技能命中时调用
     *
     * @param sx 触发位置的 x 坐标
     * @param sy 触发位置的 y 坐标
     * @param skillId 技能ID
     * @param heroId 英雄ID
     * @param baseDamage 基础伤害值
     */
    static onHitTriggerSkill(releaseSkillData:ReleaseSkillData) {
        if (!releaseSkillData.skill) return;
        let processor:BaseSkillProcessor;
        switch (releaseSkillData.skill.skillType) {
            case SKILLTYPE.SKILLTYPE_LIGHTNING:
                processor = ObjPool.instance.getObj(LightningSkillProcessor);
                (processor as LightningSkillProcessor).setData(releaseSkillData, null , true);
                return
            case SKILLTYPE.SKILLTYPE_NORMAL:
                processor = ObjPool.instance.getObj(NormalSkillProcessor);
                break;
            case SKILLTYPE.SKILLTYPE_TARGETTRAJECTORY:
            case SKILLTYPE.SKILLTYPE_DIRECTTRAJECTORY:
                GlobalVal.tempVec2.x = releaseSkillData.sx;
                GlobalVal.tempVec2.y = releaseSkillData.sy;
                if (releaseSkillData.skill['useTargetPos'] && releaseSkillData.skill['useTargetPos'] == 1) {
                   //
                } else {
                    const target = Game.soMgr.findTarget(GlobalVal.tempVec2 , releaseSkillData.skill.range , releaseSkillData.skill.findTargetType , releaseSkillData.campId, null);
                    if (target) {
                        releaseSkillData.tx = target.x;
                        releaseSkillData.ty = target.y;
                        releaseSkillData.targetId = target.id;
                    }
                }
                processor = ObjPool.instance.getObj(AmmoSkillProcessor);
                break;
            case SKILLTYPE.SKILLTYPE_FIXEDBOMB:
                processor = ObjPool.instance.getObj(FixedBombProcessor);
                break;
            case SKILLTYPE.SKILLTYPE_XIONGXIONG:
                processor = ObjPool.instance.getObj(XiongSkillProcessor);
                break;
        
            default:
                break;
        }
        if (processor){
            processor.setData(releaseSkillData);
        }
    }









}