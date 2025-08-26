export interface WarTipsConfig { 
     id: number,                      //关卡id
     tips: string,                    //提示
     bossId: number,                  //首领id
     bossTips: Array<any>,            //首领气泡提示
     bubbleX: number,                 //气泡x坐标
     bubbleY: number,                 //气泡y坐标
     bubbleInterval: number,          //气泡间隔
     bossX: number,                   //boosx坐标
     bossScaleX: number,              //boss缩放
     bossY: number,                   //bossy坐标
     bossScaleY: number,              //boss缩放
     bossPath: string,                //boss资源名称
     bossIdleName: string,            //boos动画名称
     bossAniInterval: number,         //boos动画间隔
     bossActionName: string,          //boos间隔动画
     bossActionRepeats: number,       //boss间隔动画重复次数 
}

export interface WarEventConfig { 
     id: number,               //事件id
     type: number,             //事件类型(1，猫咪帮忙)
     towerid: number,          //猫咪id
     gx: number,               //x格子
     gy: number,               //y格子
     bubble: Array<any>,       //冒泡 
}

export interface TrapConfig { 
     id: number,               //id
     name: string,             //名字
     effectName: string,       //特效
     type: number,             //类型(1减速2中毒3加速4伤害)
     rangeType: number,        //范围类型(1圆形2矩形3随机矩形)
     rangeValue: number,       //范围值
     rate: number,             //概率
     value: number,            //效果值（伤害万分比）
     interval: number,         //间隔时间
     totalTime: number,        //持续时间
     hurtCount: number,        //生效次数
     startTime: number,        //生效开始时间 
}

export interface TowerTypeDesConfig { 
     id: number,         //炮塔类型id
     name: string,       //炮塔类型名称
     des: string,        //类型描述 
}

export interface TowerScienceDesConfig { 
     id: number,            //id
     towerId: number,       //炮塔类型id
     level: number,         //炮塔等级
     des: string,           //描述
     name: string,          //名称 
}

export interface SystemGuideConfig { 
     id: number,                    //id
     bpId: number,                  //埋点id
     bpType: string,                //埋点标示
     bpName: string,                //埋点名称
     group: number,                 //指引组ID
     targgerType: number,           //"触发条件(1,星星满了2，猫咪可以升级)"
     nextids: Array<any>,           //下一步指引id
     priority: number,              //优先级
     targgerTime: number,           //触发时间
     targgerEvt: string,            //额外触发事件
     targgerEvtParam: string,       //额外触发事件的参数
     des: string,                   //文字描述
     guideView: string,             //额外的指引面板
     getPosEvt: string,             //按钮位置帧听
     posEvtParam: string,           //获取按钮额外参数
     hideUI: number,                //是否关闭其他界面
     arrowScaleX: number,           //手指是否翻转
     arrowPoint: Array<any>,        //手指偏移位置
     labelAnchorX: number,          //文字背景锚点X
     labelAnchorY: number,          //文字背景锚点Y
     labelPoint: Array<any>,        //文字偏移
     soundEft: string,              //语音文件
     noHideView: number,            //是否不关闭遮罩
     hideEvent: string,             //关闭遮罩事件
     noSave: number,                //指引是否不要保存
     hideMask: number,              //是否隐藏遮罩
     endTime: number,               //结束时间
     hideBlock: number,             //是否穿透 
}

export interface SkillTriggerConfig { 
     skillID: number,                      //技能ID
     targetType: number,                   //目标类型(0敌1自己人2友方）
     skillType: number,                    //技能类型(1方向弹道5钢铁侠6抛物线炸弹7回旋镖8闪电链9普通技能10怪物普通技能11闪现到目标前12剑圣大招13召唤类14熊熊烈火)
     findTargetType: number,               //寻找目标类型（0血量最少1血量最多2随机3距离最近）
     useTargetPos: number,                 //是否用指定目标位置
     excludeTrigger: number,               //是否排除触发位置的怪物受击
     range: number,                        //寻怪范围
     hitRangeValue1: number,               //伤害范围值1
     hitRangeValue2: number,               //伤害范围值2
     releaseEffect: string,                //施法特效资源
     releaseTimes: number,                 //发射子弹次数
     releaseTimesRandom: Array<any>,       //随机次数
     hitRangeType: number,                 //命中范围类型0.没有【单体】；1.以目标为中心的圆形；2.以自身为中心的圆形，3.扇形；4.矩形5.自身为起点的矩形6全体7随机方向矩形
     hitRangeEft: string,                  //受击范围特效
     releaseEffectLoop: number,            //特效是否循环播放
     ammoID: number,                       //弹道ID
     hitEft: string,                       //受击特效资源
     hitTime: number,                      //受击时间
     hitInterval: number,                  //受击间隔
     hitCount: number,                     //受击次数
     hitTotalTime: number,                 //受击持续时长
     damageRate: number,                   //伤害系数
     buffs: Array<any>,                    //触发buff列表 
}

export interface SkillMonsterNormalConfig { 
     skillID: number,                 //技能ID
     targetType: number,              //目标类型(0敌1自己人2友方）
     emptyTarget: number,             //是否不需要目标
     skillName: string,               //技能名称
     skillType: number,               //"技能类型(0,
     findTargetType: number,          //寻找目标类型（0血量最少1血量最多2随机3距离底线最近4百分比血量最少5距离自身最近）
     actionName: string,              //技能动作
     actionScale: number,             //技能动作播放速度
     actionLoop: number,              //动作是否循环播放
     releaseTime: number,             //释放时间
     releaseEffect: string,           //施法特效资源
     releaseEffectLoop: number,       //施法特效是否循环
     releaseTimes: number,            //发射子弹次数
     preTime: number,                 //前摇时间（在这时间内技能可以被打断，填前摇最后一帧时间）
     backTime: number,                //后摇开始时间（格挡时会取消后摇，后摇第1帧）
     actionTime: number,              //技能状态持续时间（该动作完整播放时间）
     ammoID: number,                  //弹道ID
     hitTime: number,                 //技能受击时间（打击帧，一般是前摇后面一帧）【一段伤害的技能冷却】
     hitCount: number,                //伤害次数
     targetCount: number,             //目标数量上限
     hitInterval: number,             //伤害间隔时间（有多段伤害就一定要配）
     hitRangeType: number,            //"伤害范围类型（0,
     range: number,                   //攻击普通怪物的距离（横向，攻击需要同时满足横向和纵向）
     rangeToCityWall: number,         //攻击城墙的距离
     hitRangeValue1: number,          //伤害范围参数1（伤害范围类型1-3：半径；4矩形是x）
     hitRangeValue2: number,          //伤害范围参数2（如果是4矩形，这里填y值）
     cd: number,                      //冷却时间（普攻无冷却）
     damageRate: number,              //伤害系数（万分比）
     buffs: Array<any>,               //触发buff列表 
}

export interface SkillLightningStrengthConfig { 
     skillID: number,                 //技能ID
     skillName: string,               //技能名称
     heroId: number,                  //所属英雄ID
     isUltimate: number,              //是否是大招
     preStrengthID: number,           //前置强化技能ID
     baseWeight: number,              //基础权重
     baseProbability: number,         //叠加权重
     ultimateSkillId: number,         //真大招技能ID
     strengthMaxHero: number,         //是否只针对最高级英雄
     strengthType: Array<any>,        //"增益类型(1伤害2持续时间3范围4受击目标数量5释放技能次数6子弹数量7释放次数翻倍8暴击率9合成同英雄权重增加默认每个英雄基础权重是100,10暴击时增加释放次数11伤害减免12血量上限增加13伤害反弹14命中数量上限增加15buff时间增加)"
     strengthSkillID: number,         //强化的技能主ID或者buffID或者陷阱ID
     strengthValue: Array<any>,       //强化值
     strengthLimit: Array<any>,       //强化限制值
     triggerSkillType: number,        //触发技能类型（1击中单个目标时概率2攻击次数3单次范围伤害触发4暴击时触发5死亡时触发6直接触发7出生时触发）
     triggerSkillID: number,          //概率触发技能ID
     triggerValue: number,            //概率
     probabilityBuffID: number,       //命中时概率触发buffId
     buffProbability: number,         //触发buff概率
     lastSkillID: number,             //最后一个单位触发技能
     newEft: string,                  //特效替换
     newHitRangeEft: string,          //新受击范围特效
     newAmmo: string,                 //新弹道资源
     des: string,                     //描述 
}

export interface SkillLightningConfig { 
     skillID: number,                      //技能ID(技能主ID*10+英雄等级)
     skillMainID: number,                  //技能主ID
     targetType: number,                   //目标类型(0敌1自己人2友方）
     findTargetType: number,               //寻找目标类型（0血量最少1血量最多2随机3距离最近4百分比血量最少）
     skillName: string,                    //技能名称
     skillType: number,                    //"技能类型（0,
     rangeType: number,                    //攻击范围类型0以自身为中心的圆形，1一底部城墙中心为起点的矩形（安妮）
     range: number,                        //攻击距离（一格80）
     cd: number,                           //冷却时间
     damageRate: number,                   //伤害系数（千分比）
     actionName: string,                   //施法动作
     actionLoop: number,                   //施法动作循环播放
     releaseTime: number,                  //释放时间
     releaseEffect: string,                //施法特效资源
     hitRangeEft: string,                  //受击范围特效（地面上的）
     hitEft: string,                       //受击特效（单个怪物上的）
     hitTime: number,                      //受击时间
     hitInterval: number,                  //受击间隔时间
     hitCount: number,                     //链接次数
     hitTotalTime: number,                 //受击持续时长
     hitRangeType: number,                 //"(伤害范围类型（0,
     hitRangeValue1: number,               //链接范围
     hitRangeValue2: number,               //链接范围
     releaseTimes: number,                 //发射子弹次数
     releaseTimesRandom: Array<any>,       //随机次数
     ammoID: number,                       //弹道id
     blinkID: number,                      //闪现id
     buffs: Array<any>,                    //触发buff列表
     des: string,                          //描述
     soundEft: string,                     //音效 
}

export interface SkillBuffConfig { 
     buffID: number,                  //buffID
     buffName: string,                //buff名称
     tag: number,                     //tag标签类型
     buffType: number,                //buff类型(1治疗2加攻速3伤害加深4禁锢5麻痹)
     immunityTag: Array<any>,         //buff免疫标签
     priority: number,                //buff优先级（数字越大，优先级越高）
     coverType: number,               //"覆盖方式(0,覆盖，高级的盖掉低级的1,共存,2,时间叠加,3,时间覆盖4:排斥)"
     buffValue: number,               //效果参数
     buffTime: number,                //效果持续时间
     hitInterval: number,             //伤害间隔时间（有多段伤害就一定要配）
     damageCoefficient: number,       //伤害系数（万分比）
     buffEffect: string,              //效果特效
     effectPosType: number,           //特效挂点（0头顶1中心点2脚底3攻击点4真实的身体头顶5真实的身体脚底）
     effectLayer: number,             //"特效层级（0顶层,ui和怪物之上1中间层，ui之下，怪物之上2底层，ui和怪物之下3背景4角色层，参与角色的井深排序）"
     effectOffsetX: number,           //特效偏移位置x
     effectOffsetY: number,           //特效偏移位置y 
}

export interface SkillBlinkAtkDataConfig { 
     skillID: number,              //技能ID(技能主ID*10+英雄等级)
     replayAtction: number,        //是否每次释放都重新播放攻击动作
     blinkModel: string,           //瞬移的模型
     blinkAtkAction: string,       //模型的攻击动作
     atkTime: number,              //单次攻击总时间
     scale: number,                //播放速度(百分比)
     blinkX: number,               //闪现偏移值X
     blinkY: number,               //闪现偏移值Y 
}

export interface SkillAmmoDataConfig { 
     ammID: number,             //弹道ID
     ammoEft: string,           //弹道特效资源
     randomX: number,           //初始位置随机X范围
     randomY: number,           //初始位置随机Y范围
     ammoWidth: number,         //弹道宽度
     ammoHeight: number,        //弹道高度
     speed: number,             //移动速度
     maxDis: number,            //飞行最远距离
     dontRotate: number,        //是否不跟着发射角度一起旋转
     randomAngle: number,       //是否每个弹道随机角度
     isParabola: number,        //是否抛物线
     trackType: number,         //轨迹类型（0直线1导弹） 
}

export interface RedPointConfig { 
     name: string,               //节点名称
     style: string,              //红点样式
     x: number,                  //x坐标
     y: number,                  //y坐标
     isLeafNode: number,         //是否是叶子节点(1是，0否）
     preNodeName: string,        //前置节点名称（前置节点红点数为零显示当前节点）
     nextNodeName: string,       //后置节点 
}

export interface RandomTowerConfig { 
     id: number,                      //id
     towers: Array<Array<any>>,       //参数1(id_权重|id_权重) 
}

export interface PvpMainConfig { 
     nwarid: number,                        //ID
     szname: string,                        //关卡名称
     szbgmusic: string,                     //背景音乐
     szbgpic: string,                       //场景资源
     nmonsterhpaddper: number,              //关卡强度系数
     name: string,                          //关卡buff组（1-2个）
     baseReward1: Array<Array<any>>,        //关卡基础奖励1（小于4波，可填写掉落id或者宝箱id）
     baseReward2: Array<Array<any>>,        //关卡基础奖励2（小于7波，可填写掉落id或者宝箱id）
     baseReward3: Array<Array<any>>,        //关卡基础奖励3（7波以上奖励，可填写掉落id或者宝箱id）
     fristReward1: Array<Array<any>>,       //首通奖励1（可填写掉落id或者宝箱id）
     fristReward2: Array<Array<any>>,       //首通奖励2（50%血以上通关激活，可填写掉落id或者宝箱id）
     fristReward3: Array<Array<any>>,       //首通奖励3（无伤通关解锁，可填写掉落id或者宝箱id）
     winReward: Array<Array<any>>,          //胜利奖励【新加】
     loseReward: Array<Array<any>>,         //失败奖励【新加】 
}

export interface PvpBrushConfig { 
     id: number,                       //自定义ID
     warId: number,                    //关卡id
     boIndex: number,                  //关卡波数
     nbloodratio: number,              //怪物强度系数
     coinRatio: number,                //金币系数
     isClearStart: number,             //是否等怪物全清后再刷
     npoint1monterboxid: number,       //怪物盒1
     npoint2monterboxid: number,       //怪物盒2
     npoint3monterboxid: number,       //怪物盒3
     npoint4monterboxid: number,       //怪物盒4
     npoint5monterboxid: number,       //怪物盒5 
}

export interface PropertyConfig { 
     id: number,                  //ID
     name: string,                //名称
     des: string,                 //属性说明
     btwanratio: number,          //是否万分比
     nparentattrid: number,       //父属性id 
}

export interface PassiveSkillConfig { 
     id: number,                    //被动技能ID
     name: string,                  //技能名称
     paramValue1: Array<any>,       //技能附加值1
     paramValue2: Array<any>,       //技能附加值2
     passiveType: number,           //"ADD_BUFF=1,
     triggerType: number,           //"DEFAULT=0,
     triggerValue: number,          //触发副参（概率，次数等）
     targetType: number,            //"SELF=0,
     targetValue: number,           //目标类型副参
     cd: number,                    //技能CD
     limitCount: number,            //限制次数
     limitType: number,             //限制次数类型（1，正常战斗的触发次数2每隔英雄的触发次数） 
}

export interface OtherRatioConfig { 
     index: number,        //索引
     Ratio1: number,       //参数1 
}

export interface NightResConfig { 
     id: number,          //id
     name: string,        //节点名称
     mapid: number,       //地图id
     path: string,        //资源路径 
}

export interface NewMonsterTowerTipsConfig { 
     id: number,                  //提示id
     warid: number,               //关卡id
     targetId: number,            //怪物id/猫咪id
     tipsType: number,            //类型（0：怪物，1：猫咪）
     monsterScaleX: number,       //怪物X缩放
     monsterScaleY: number,       //怪物Y缩放 
}

export interface NameConfig { 
     id: number,         //id
     type: number,       //类型（1前缀｛代码加"的"｝，2后缀）
     des: string,        //文本 
}

export interface MonsterBoxConfig { 
     nmonsterboxid: number,             //盒子id（刷法【1位】+怪物id【5位】+密度【2位】）
     nmonsterid: Array<any>,            //怪物数组
     nbronspacetimes: Array<any>,       //间隔时间数组
     btrandmode: number,                //"循环类型0.首尾循环：1231231231.尾循环：123333332.反序循环：123321123321"
     nrandcount: number,                //重复次数 
}

export interface MonsterDesConfig { 
     id: number,            //
     img: string,           //半身像
     head: string,          //头像
     des: string,           //介绍
     technic: string,       //技巧
     isBoss: number,        //是否是boss 
}

export interface MonsterConfig { 
     id: number,                         //dwwawd
     szname: string,                     //名称
     resName: string,                    //怪物资源（或者路径）
     uscale: number,                     //怪物模型缩放
     dropsId: number,                    //掉落盒id
     aiId: number,                       //AIID
     bttype: number,                     //怪物类型(0普通1精英2boss)
     btshapetype: number,                //怪物类型（0普通，1肉盾，2高速，3远程，4飞行）
     hitOffsetY: number,                 //受击Y轴偏移
     hitWid: number,                     //受击宽度
     hitHei: number,                     //受击高度
     uspace: number,                     //移动速度
     udropgold: number,                  //掉落金币数量
     ubasehp: number,                    //基础血量
     skillId: number,                    //技能ID
     bloodPath: string,                  //血条样式路径
     bloodOffsetY: number,               //血条Y偏移
     attack: number,                     //攻击力
     props: Array<Array<any>>,           //属性列表
     passiverSkillIDs: Array<any>,       //被动技能ID
     moveAnimation: string,              //移动动画
     nopenwarid: number,                 //解锁怪物图鉴所需关卡ID
     nopenkillcount: number,             //解锁图鉴击杀数量
     nopenrewarddiamonds: number,        //激活图鉴奖励钻石数量
     nopenrewardfaceid: number,          //激活图鉴奖励头像
     nbookspicid: number,                //图鉴头像ID 
}

export interface MissionTipsConfig { 
     id: number,         //编号
     type: number,       //类型
     info: string,       //描述 
}

export interface MissionMainConfig { 
     nwarid: number,                        //ID
     szname: string,                        //关卡名称
     szbgmusic: string,                     //背景音乐
     szbgpic: string,                       //场景资源
     nmonsterhpaddper: number,              //关卡强度系数
     name: string,                          //关卡buff组（1-2个）
     baseReward1: Array<Array<any>>,        //关卡基础奖励1（小于4波，可填写掉落id或者宝箱id）
     baseReward2: Array<Array<any>>,        //关卡基础奖励2（小于7波，可填写掉落id或者宝箱id）
     baseReward3: Array<Array<any>>,        //关卡基础奖励3（7波以上奖励，可填写掉落id或者宝箱id）
     fristReward1: Array<Array<any>>,       //首通奖励1（可填写掉落id或者宝箱id）
     fristReward2: Array<Array<any>>,       //首通奖励2（50%血以上通关激活，可填写掉落id或者宝箱id）
     fristReward3: Array<Array<any>>,       //首通奖励3（无伤通关解锁，可填写掉落id或者宝箱id） 
}

export interface MissionDropConfig { 
     id: number,           //技能宝箱id
     kind1: number,        //图标数
     kind2: number,        //3技能（AAAAA）
     kind3: number,        //2技能（AAAA*）
     kind4: number,        //1技能+，1技能（AAABB）
     kind5: number,        //1技能，1技能（AABB*)
     kind6: number,        //1技能+（AAA**)
     kind7: number,        //1技能(AA***)
     kind8: number,        //超量金币(SSSSS)
     kind9: number,        //大量金币(SSSS*)
     kind10: number,       //适量金币(SSS**)
     kind11: number,       //少量金币(SS***)
     kind12: number,       //1技能+，少量金币(AAASS)
     kind13: number,       //1技能，适量金币(AASSS)
     kind14: number,       //1技能，少量金币(AASS*) 
}

export interface MissionBrushConfig { 
     id: number,                       //自定义ID
     warId: number,                    //关卡id
     boIndex: number,                  //关卡波数
     nbloodratio: number,              //怪物强度系数
     coinRatio: number,                //金币系数
     isClearStart: number,             //是否等怪物全清后再刷
     npoint1monterboxid: number,       //怪物盒1
     npoint2monterboxid: number,       //怪物盒2
     npoint3monterboxid: number,       //怪物盒3
     npoint4monterboxid: number,       //怪物盒4
     npoint5monterboxid: number,       //怪物盒5 
}

export interface MagicSkillConfig { 
     skillID: number,          //技能ID
     targetType: number,       //目标类型(0敌1自己人2友方）
     skillName: string,        //技能名称
     totalTime: number,        //持续时间/公用cd
     interval: number,         //受击间隔时间
     delay: number,            //加一个延迟生效时间
     effect: string,           //释放特效
     hitEft: string,           //受击特效
     value: number,            //效果值
     buffID: number,           //buff
     cd: number,               //cd
     price: number,            //售价
     des: string,              //描述 
}

export interface HeroConfig { 
     ntroopsid: number,               //dwwawd
     szname: string,                  //名称
     resName: string,                 //英雄资源（或者路径）
     bttype: number,                  //职业类型(1战士2法师3射手4毒师5召唤6控制7辅助)
     skillId: number,                 //技能ID
     quality: number,                 //初始品质
     attack: number,                  //初始攻击力
     crit: number,                    //初始暴击率
     callWeight: Array<any>,          //召唤系数
     correctWeight: Array<any>,       //修正系数 
}

export interface GuideUiCfgConfig { 
     id: number,              //引导ID
     itemId: number,          //物品ID
     titleIcon: string,       //标题图标
     titleBg: string,         //标题背景
     titleName: string,       //标题内容
     icon: string,            //图标预制体路径
     des: string,             //描述内容 
}

export interface GuideBPMissionConfig { 
     id: number,           //id
     warId: number,        //关卡id
     bpForm: number,       //埋点大类
     bpId: number,         //埋点ID
     bpType: string,       //埋点标示
     bpName: string,       //埋点名称 
}

export interface GuideConfig { 
     id: number,                     //引导ID
     bpId: number,                   //埋点id
     bpType: string,                 //埋点类型
     bpName: string,                 //埋点说明
     missionID: number,              //关卡id
     triggerType: number,            //触发类型
     triggerParam1: number,          //触发类型参数1
     triggerParam2: number,          //触发类型参数2
     triggerParam3: number,          //触发类型参数3
     endType: number,                //结束条件
     endParam1: Array<any>,          //结束条件参数1
     endParam2: number,              //结束条件参数2
     showCountDown: number,          //引导结束后是否播放倒计时
     endCreateMonster: number,       //结束后是否刷怪
     noPause: number,                //不暂停
     canSkip: number,                //是否可跳过
     noPassNoSkip: number,           //是否没通关不能跳过
     noShowWaveEft: number,          //是否不显示波纹特效
     justShowRect: number,           //是否不显示手指
     showArrow: number,              //是否要显示遮罩
     endTriggerEvt: number,          //结束触发事件
     getPosEvt: string,              //手指位置帧听参数
     point: Array<any>,              //*手指位置
     rectRange: number,              //遮罩洞大小/点击区域大小
     viewPath: string,               //面板id
     info: string,                   //引导文本
     labelHeight: number,            //文本行高，默认50
     soundEft: string,               //语音文件
     noOnce: number,                 //是否可反复触发
     towerid: number,                //显示的猫咪id 
}

export interface GlobalConfig { 
     id: number,                      //功能ID
     name: string,                    //功能名称
     uiPath: string,                  //功能对应界面
     funcOpenCondition: number,       //"功能开启需要通关冒险模式关卡ID填0为默认开启填-1显示“敬请期待”"
     uiShowCondition: number,         //"隐藏界面入口（0不隐藏；数字通X关之前隐藏）"
     tips: string,                    //功能未开启时提升内容
     showOpenView: number,            //是否显示系统开放面板
     guideId: number,                 //功能开启对应指引ID
     guideUi: string,                 //指引触发界面 
}

export interface GameCommonConfig { 
     id: number,                           //id
     callHeroCoins: Array<any>,            //召唤英雄所需金币数组
     callSkillCoins: Array<any>,           //召唤技能所需金币数组
     heroTableCallTimes: Array<any>,       //创建新的英雄台子所需召唤次数
     baseCoin: number,                     //基础金币
     cityWallHp: number,                   //城墙血量
     nspace: number,                       //刷怪间隔
     drop1: number,                        //掉落金币超量
     drop2: number,                        //掉落金币大量
     drop3: number,                        //掉落金币适量
     drop4: number,                        //掉落金币少量
     killMonsterCount: number,             //每击杀几只怪给对方刷怪（竞技场）
     createMonsterId: number,              //刷怪ID（竞技场） 
}

export interface CpGuideTipsConfig { 
     id: number,                      //引导ID
     missionID: number,               //关卡id
     triggerType: number,             //触发类型
     triggerParam1: Array<any>,       //触发类型参数1
     endType: number,                 //结束条件
     endParam1: Array<any>,           //结束条件参数1
     point: Array<any>,               //显示位置
     info: string,                    //引导文本 
}

export interface CooperateMissionMainConfig { 
     nwarid: number,                        //ID
     szname: string,                        //关卡名称
     szbgmusic: string,                     //背景音乐
     szbgpic: string,                       //场景资源
     nmonsterhpaddper: number,              //关卡强度系数
     name: string,                          //关卡buff组（1-2个）
     baseReward1: Array<Array<any>>,        //关卡基础奖励1（小于4波，可填写掉落id或者宝箱id）
     baseReward2: Array<Array<any>>,        //关卡基础奖励2（小于7波，可填写掉落id或者宝箱id）
     baseReward3: Array<Array<any>>,        //关卡基础奖励3（7波以上奖励，可填写掉落id或者宝箱id）
     fristReward1: Array<Array<any>>,       //首通奖励1（可填写掉落id或者宝箱id）
     fristReward2: Array<Array<any>>,       //首通奖励2（50%血以上通关激活，可填写掉落id或者宝箱id）
     fristReward3: Array<Array<any>>,       //首通奖励3（无伤通关解锁，可填写掉落id或者宝箱id）
     winReward: Array<Array<any>>,          //胜利奖励【新加】
     loseReward: Array<Array<any>>,         //失败奖励【新加】 
}

export interface CooperateBrushConfig { 
     id: number,                       //自定义ID
     warId: number,                    //关卡id
     boIndex: number,                  //关卡波数
     nbloodratio: number,              //怪物强度系数
     coinRatio: number,                //金币系数
     isClearStart: number,             //是否等怪物全清后再刷
     npoint1monterboxid: number,       //怪物盒1
     npoint2monterboxid: number,       //怪物盒2
     npoint3monterboxid: number,       //怪物盒3
     npoint4monterboxid: number,       //怪物盒4
     npoint5monterboxid: number,       //怪物盒5
     npointBoss: number,               //公共刷怪盒（只有左边的才会刷，一般用来刷BOSS） 
}

export interface BookWeaponConfig { 
     id: string,                //武器id（炮塔id+等级lv)
     hurtPer: number,           //伤害系数
     attackRange: number,       //攻击范围
     ctrl: number,              //减速效果
     attackSpeed: number,       //攻击间隔
     dot: number,               //持续伤害
     buildcost: number,         //升级消耗 
}

export interface BookUnlockConfig { 
     id: number,                  //怪物id
     monsterX: number,            //怪物IconX坐标
     monsterY: number,            //怪物IconY坐标
     monsterScaleX: number,       //怪物Icon缩放
     monsterScaleY: number,       //怪物IconY缩放
     style: number,               //邮票样式 
}

export interface BookTowerConfig { 
     id: number,                //炮塔id
     science: Array<any>,       //生效天赋 
}

export interface ActiveConfig { 
     id: number,              //id
     name: string,            //活动名称
     type: number,            //活动类型
     startTime: string,       //开始时间（2022/12/700:00:00）
     interval: number,        //持续时间(天) 
}

export interface AccountConfig { 
     account: string,             //账号
     age: number,                 //年龄
     certification: number,       //是否认证 
}

