


const Info = {
    0: "不存在肉鸽关卡技能随机配置，检查 levelSkill.txt 配置表 ID:",

    100: "不存在触发器 ID: %d",

    200: "不存在属性 ID: %d",

    302: "初始化本地技能，不存在技能配置，检查 skill_active.txt 配置 ID: %d",
    303: "初始化本地技能，不存在技能配置，检查技能主表、子表配置 ID: %d 等级: %d",

    400: "不存在关卡刷怪数据 ID: %d",
    401: "不存在肉鸽关卡配置 ID: %d",
    402: "不存在地图配置 ID: %d",

    500: "不存在掉落配置 ID: %d",
    501: "金币掉落:%f = 金币值:%f * (刷怪表掉落系数*金币副本系数):%f * 玩家金币加成属性：%f",
    502: "金币掉落:%f = (刷怪表掉落系数*章节表金币系数*难度表金币系数*修正系数):%f * (1 + 玩家金币加成属性)：%f",

    600: "怪物属性 ID:%d 攻击力: %f =（基础:%f * 万分比:%f）  生命值:%f = (基础:%f * 万分比:%f) 防御:%f = （基础:%f * 万分比:%f） ",
    601: "开始怪物笼子 ID:%d 怪物总数: %d 攻击系数:%f 血量系数:%f 防御系数:%f 金币系数:%f",
    602: "开始:%s",
    603: "结束:%s",

    700: "英雄受伤:%f =（己方攻击力:%f *（1+己方万分比攻击力:%f ）- 敌方防御:%f *（1 + 敌方万分比防御:%f ））*（1 + 己方万分比增伤:%f - 敌方万分比减伤:%f ）* 技能伤害系数:%f *（1 + 技能伤害加成:%f ）* Max【最小暴击倍率：%f , 暴击倍率:%f *（1 - 暴击抵抗:%f ）】* Max【最小会心倍率：%f , 会心倍率:%f *（1 - 会心抵抗:%f ）】",
    701: "怪物受伤:%f =（己方攻击力:%f *（1+己方万分比攻击力:%f ）- 敌方防御:%f *（1 + 敌方万分比防御:%f ））*（1 + 己方万分比增伤:%f - 敌方万分比减伤:%f ）* 技能伤害系数:%f *（1 + 技能伤害加成:%f ）*Max【最小暴击倍率：%f , 暴击倍率:%f *（1 - 暴击抵抗:%f ）】* Max【最小会心倍率：%f , 会心倍率:%f *（1 - 会心抵抗:%f ）】",
    702: "英雄受伤:%f = （己方攻击力:%f *（1+己方万分比攻击力:%f ）*（调整系数：%f）- 敌方防御:%f *（1 + 敌方万分比防御:%f ））+ 额外伤害：%f",

    800: "S ======> C rootID:%d mainID:%d subID:%d",
    801: "C ======> S rootID:%d mainID:%d subID:%d",

    900: "播放动画 name: %s loop: %s",
    901: "停止动画 name: %s",
    902: "播放混合动画 name: %s loop: %s",
    903: "停止混合动画 name: %s",
    904: "end 事件 name: %s",
    905: "loop-end 事件 name: %s",
    906: "frame 事件 name: %s",
}

const DEFAULT_STYLE = "color:black;";
const TAG_STYLE = "color:blue;";

export const TAG = {
    DEFAULT: "Default",
    SO_MGR: "SoMgr",                  //场景对象
    RES_MGR: "ResMgr",                //资源管理
    UI_MGR: "UiMgr",                  //ui管理
    MONSTER_CAGE: "MonsterCage",      //怪物笼子
    RGMAP_EVENT: "RGMapEvent",          //肉鸽事件
    DROP: "RGDropMgr",          //肉鸽掉落
    TRIGGER: "Trigger",                //触发器
    GAME_CONFIG: "GameCfg",  //游戏配置
    SKILL: "Skill",  //技能
    COLLIDE: "COLLIDE",//碰撞
    NET: "net",
    MAP_EVENT: "map-event",
    ANIMATION: "animation",
    AI: "ai",
    ACT_MACH: "actmach",
    
}

export const TAG_FLAG = {
    [TAG.DEFAULT]: true,
    [TAG.SO_MGR]: false,
    [TAG.RES_MGR]: true,
    [TAG.UI_MGR]: false,
    [TAG.MONSTER_CAGE]: false,
    [TAG.DROP]: false,
    [TAG.TRIGGER]: false,
    [TAG.GAME_CONFIG]: false,
    [TAG.SKILL]: true,
    [TAG.COLLIDE]: false,
    [TAG.RGMAP_EVENT]: false,
    [TAG.NET]: false,
    [TAG.MAP_EVENT]: false,
    [TAG.ANIMATION]: false,
    [TAG.AI]: false,
    [TAG.ACT_MACH]: false,
}

const TAG_NAME = {
    [TAG.DEFAULT]: "默认",
    [TAG.SO_MGR]: "对象",
    [TAG.RES_MGR]: "资源",
    [TAG.UI_MGR]: "UI",
    [TAG.MONSTER_CAGE]: "怪物笼子",
    [TAG.DROP]: "掉落",
    [TAG.TRIGGER]: "触发器",
    [TAG.GAME_CONFIG]: "本地配置",
    [TAG.SKILL]: "技能",
    [TAG.COLLIDE]: "碰撞",
    [TAG.RGMAP_EVENT]: "肉鸽事件",
    [TAG.NET]: "网络",
    [TAG.MAP_EVENT]: "地图事件",
    [TAG.ANIMATION]: "动画",
    [TAG.AI]: "ai",
    [TAG.ACT_MACH]: "状态机",
}

export default class Debug {
    /**
     * 避障耗时
     */
    static rvoCostTime: number = 0;
    /**
     * 四叉树更新耗时
     */
    static quatTreeUpdateCostTime: number = 0;
    /**
     * 四叉树检测耗时
     */
    static quatTreeQuaryCostTime: number = 0;
    /**
     * 屏幕外对象数量
     */
    static cullObjectsNums: number = 0;

    private static _graphcis: cc.Graphics = null;

    private static openLog = true;

    static log(tag: string, ...args) {
        if (CC_DEBUG && Debug.openLog) {
            if (TAG_FLAG[tag] === false) return;
            console.log("%c【" + this.getTagName(tag) + "】%c", TAG_STYLE, DEFAULT_STYLE, ...args);
        }
    }

    static logId(tag: string, id: number, ...args) {
        if (CC_DEBUG && Debug.openLog) {
            if (TAG_FLAG[tag] === false) return;
            console.log("%c【" + this.getTagName(tag) + "】%c" + Info[id], TAG_STYLE, DEFAULT_STYLE, ...args);
        }
    }

    static warn(tag: string, ...args) {
        if (CC_DEBUG && Debug.openLog) {
            if (TAG_FLAG[tag] === false) return;
            console.warn("%c【" + this.getTagName(tag) + "】%c", TAG_STYLE, DEFAULT_STYLE, ...args);
        }
    }

    static warnId(tag: string, id: number, ...args) {
        if (CC_DEBUG && Debug.openLog) {
            if (TAG_FLAG[tag] === false) return;
            console.warn("%c【" + this.getTagName(tag) + "】%c" + Info[id], TAG_STYLE, DEFAULT_STYLE, ...args);
        }
    }

    static error(tag: string, ...args) {
        if (CC_DEBUG && Debug.openLog) {
            if (TAG_FLAG[tag] === false) return;
            console.error("【" + this.getTagName(tag) + "】", ...args);
        }
    }

    static errorId(tag: string, id: number, ...args) {
        if (CC_DEBUG && Debug.openLog) {
            if (TAG_FLAG[tag] === false) return;
            console.error("【" + this.getTagName(tag) + "】" + Info[id], ...args);
        }
    }

    static getGraphcis() {
        // if (!this._graphcis) {
        //     let node = PersistNodeManager.getInstance().addPersistNode("Debuger Graphcis");
        //     this._graphcis = node.addComponent(cc.Graphics);
        //     // node.setContentSize(cc.winSize);
        //     // node.setPosition(cc.v2(cc.winSize.width * 0.5, cc.winSize.height * 0.5));
        // }
        return this._graphcis;
    }

    static getTagName(tag: string) {
        return TAG_NAME[tag] || "默认";
    }

    static drawGrid(gridRect: cc.Rect, rowCol: cc.Vec2) {
        let graphcis = this.getGraphcis();
        graphcis.moveTo(gridRect.x, gridRect.y);
        let cellWidth = gridRect.width / rowCol.x;
        let cellHeight = gridRect.height / rowCol.y;
        graphcis.lineWidth = 4;
        graphcis.strokeColor = cc.Color.WHITE;
        for (let i = 0, len = rowCol.x; i <= len; i++) {
            graphcis.moveTo(i * cellWidth + gridRect.x, gridRect.y);
            graphcis.lineTo(i * cellWidth + gridRect.x, gridRect.height + gridRect.y);
            graphcis.stroke();
        }

        for (let i = 0, len = rowCol.y; i <= len; i++) {
            graphcis.moveTo(gridRect.x, i * cellHeight + gridRect.y);
            graphcis.lineTo(gridRect.width + gridRect.x, i * cellHeight + gridRect.y);
            graphcis.stroke();
        }
    }

    static drawXY(pos: cc.Vec2) {
        let graphcis = this.getGraphcis();
        graphcis.strokeColor = cc.Color.RED;
        graphcis.lineWidth = 3;
        graphcis.moveTo(pos.x, 10000);
        graphcis.lineTo(pos.x, -10000);
        graphcis.stroke();

        graphcis.moveTo(10000, pos.y);
        graphcis.lineTo(-10000, pos.y);
        graphcis.stroke();
    }
}
