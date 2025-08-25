import InputMgr from "./common/InputMgr";
import { Lang } from "./lang/Lang";
import SocketManager from "./net/socket/SocketManager";

import SysMgr from "./common/SysMgr";
import { ObjPool } from "./logic/Recyclable/ObjPool";
import { AllComp } from "./logic/comps/AllComp";
import ResManager from "./utils/res/ResManager";
// import SkillMgr from "./logic/attack/SkillMgr";
import SoManager from "./logic/sceneObjs/SoManager";
import GlobalVal from "./GlobalVal";
import SoundManager from "./utils/SoundManaget";
import { ItemMgr } from "./logic/item/ItemMgr";
import { UiManager } from "./utils/UiMgr";
import { TiliMgr } from "./ui/tili/TiliMgr";
import { LoginMgr } from "./login/net/LoginMgr";
import { TaskMgr } from "./ui/task/net/TaskMgr";
import { ActorMgr } from "./ui/actor/ActorMgr";
import SignMgr from "./ui/dayInfoView/net/SignMgr";
import { CertificationNetMgr } from "./ui/actor/CertificationNetMgr";
import { GoodsMgr } from "./ui/goods/GoodsMgr";
import TipsMgr from "./net/mgr/TipsMgr";
import { ContainerMgr } from "./ui/goods/ContainerMgr";
import MallProto from "./net/mgr/MallProto";
import { MonsterManualMgr } from "./net/mgr/MonsterManualMgr";
import { StatusMgr } from "./net/mgr/StatusMgr";
import { SceneNetMgr } from "./net/mgr/SceneNetMgr";
import TroopsMgr from "./net/mgr/TroopsMgr";
import GlobalFunc from "./GlobalFunc";
import AddictionMgr from "./ui/addiction/AddictionMgr";
import { StrengMgr } from "./net/mgr/StrengMgr";
import { MailMgr } from "./net/mgr/MailMgr";
import GatewayMgr from "./net/mgr/GatewayMgr";
import { ReconnectMgr } from "./net/socket/ReconnectMgr";
import GlobalEffectMgr from "./globalEffect/GlobalEffectMgr";
import RedPointSys from "./redPoint/RedPointSys";
import { SystemGuideCtrl } from "./ui/guide/SystemGuideCtrl";
import ExchangeMgr from "./net/mgr/ExchangeMgr";
import ActivetyMgr from "./net/mgr/ActivetyMgr";
import TurnTableMgr from "./net/mgr/TurnTableMgr";
import { ShareMgr } from "./ui/share/ShareMgr";
import { NativeAPI } from "./sdk/NativeAPI";
import RelationMgr from "./net/mgr/RelationMgr";
import DiscountMgr from "./net/mgr/DiscountMgr";
import { EventEnum } from "./common/EventEnum";
import { BulletChatMgr } from "./net/mgr/BulletChatMgr";
import { ChatMgr } from "./ui/chat/ChatMgr";
import FashionMgr from "./net/mgr/FashionMgr";
import { SysActivityMgr } from "./net/mgr/SysActivityMgr";
import { MathUtils } from "./utils/MathUtils";
import NoviceTaskMgr from "./net/mgr/NoviceTaskMgr";
import GrowGiftMgr from "./net/mgr/GrowGiftMgr";
import { SoprtsStoreMgr } from "./net/mgr/SoprtsStoreMgr";
import { OtherNativeAPI } from "./sdk/OtherNativeAPI";
import NewMonsterTowerManager from "./NewMonsterTowerManager";
import LuckDrawMgr from "./net/mgr/LuckDrawMgr";
import SystemTipsMgr from "./utils/SystemTipsMgr";
import FitManager from "./FitManamger";
import { NewSeviceRankingMgr } from "./net/mgr/NewSeviceRankingMgr";
import { ZeroMallMgr } from "./net/mgr/ZeroMallMgr";
import BattlePassMgr from "./net/mgr/BattlePassMgr";
import FestivalActivityMgr from "./net/mgr/FestivalActivityMgr";
import { GameEvent } from "./utils/GameEvent";
import GameConfigManager from "./utils/GameConfigManager";
import { LDBaseGameCtrl } from "./ld/LDBaseGameCtrl";
import LdSkillMgr from "./ld/skill/LdSkillManager";
import { NormalGameCtrl } from "./ld/NormalGameCtrl";
import { LdMapCtrl } from "./ld/map/LdMapCtrl";
import { LdGameMgr } from "./ld/LdGameMgr";
import { LdPvpGameCtrl } from "./ld/LdPvpGameCtrl";
import { LdCooperateCtrl } from "./ld/LdCooperateCtrl";

export default class Game {
    static inputMgr: InputMgr = null;
    static resMgr: ResManager;
    static mapCtrl: LdMapCtrl;

    static soMgr: SoManager;
    static ldSkillMgr:LdSkillMgr;


    static curLdGameCtrl:LDBaseGameCtrl;
    static ldNormalGameCtrl:NormalGameCtrl;
    static ldPvpGameCtrl:LdPvpGameCtrl;
    static ldCooperateCtrl:LdCooperateCtrl;



    static soundMgr: SoundManager;
    static itemMgr: ItemMgr;
    static tiliMgr: TiliMgr;

    static globalFunc: GlobalFunc;
    static addictionMgr: AddictionMgr;


    //net
    static loginMgr: LoginMgr
    static taskMgr: TaskMgr;
    static actorMgr: ActorMgr;
    static signMgr: SignMgr;
    static goodsMgr: GoodsMgr;
    static certification: CertificationNetMgr;
    static tipsMgr: TipsMgr;
    static mallProto: MallProto;
    static monsterManualMgr: MonsterManualMgr;
    static statusMgr: StatusMgr;
    static sceneNetMgr: SceneNetMgr;
    static towerMgr: TroopsMgr;
    static exchangeMgr: ExchangeMgr;
    /**背包 */
    static containerMgr: ContainerMgr;
    /**科技 */
    static strengMgr: StrengMgr;
    static emailMgr: MailMgr;
    static gatewayMgr: GatewayMgr;
    static reconnectMgr: ReconnectMgr;
    static isInited: boolean = false;
    static globalEffect: GlobalEffectMgr = null;
    static redPointSys: RedPointSys = null;
    static systemGuideCtrl: SystemGuideCtrl = null;
    static activityMgr: ActivetyMgr = null;
    static turnTableMgr: TurnTableMgr = null;
    static shareMgr: ShareMgr = null;
    static relationMgr: RelationMgr = null;
    static nativeApi: NativeAPI = null;
    static discountMgr: DiscountMgr = null;
    static bulletChatMgr: BulletChatMgr = null;
    static chatMgr: ChatMgr = null;
    static fashionMgr: FashionMgr = null;
    static sysActivityMgr: SysActivityMgr = null;
    // static experienceWarCtrl: ExperienceWarCtrl = null;
    // static pvpNetCtrl: PvpNetCtrl = null;
    static noviceTask: NoviceTaskMgr = null;
    static growGiftMgr: GrowGiftMgr = null;
    static soprtsStoreMgr: SoprtsStoreMgr = null;
    // static ckSdkEventListener: CKSdkEventListener = null;
    static luckDrawMgr: LuckDrawMgr = null;
    static fitMgr: FitManager = null;
    static newSevicerankMgr:NewSeviceRankingMgr = null;
    static zeroMallMgr:ZeroMallMgr = null;
    static battlePassMgr:BattlePassMgr = null;
    static festivalActivityMgr:FestivalActivityMgr = null;
    static gameConfigMgr:GameConfigManager = null;
    static ldGameMgr:LdGameMgr;



    static init() {
        if (this.isInited) return;
        Lang.init();
        Game.netInit();
        Game.sysInit();
        Game.initGameData();
        this.isInited = true;
    }

    static baseInit() {
        this.fitMgr = FitManager.getInstance();
        this.soundMgr = SoundManager.instance;
        GlobalVal.GRID_RATE = 1 / GlobalVal.GRID_SIZE;
        SysMgr.instance;
        SystemTipsMgr.instance;
        ObjPool.instance.init();
        AllComp.instance.init();
        UiManager.init();
        cc.dynamicAtlasManager.enabled = false;
        Game.soMgr = new SoManager();
        Game.resMgr = ResManager.instance;
        MathUtils.setInPvp(false);
        //初始化nativeApi
        /*
        if (cc.sys.os == cc.sys.OS_IOS) {
            this.nativeApi = new IOSNativeAPI();
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            // this.nativeApi = new AndroidNativeAPI();
            this.nativeApi = new OtherNativeAPI();
        } else {
            this.nativeApi = new OtherNativeAPI();
        }*/
        this.nativeApi = new OtherNativeAPI();
        // this.ckSdkEventListener = new CKSdkEventListener();
    }

    private static netInit() {
        SocketManager.instance;
        this.gameConfigMgr = new GameConfigManager();
        this.loginMgr = new LoginMgr();
        this.taskMgr = new TaskMgr();
        this.actorMgr = new ActorMgr();
        this.signMgr = new SignMgr();
        this.certification = new CertificationNetMgr();
        this.tipsMgr = new TipsMgr();
        this.goodsMgr = new GoodsMgr();
        this.containerMgr = new ContainerMgr();
        this.mallProto = new MallProto();
        this.exchangeMgr = new ExchangeMgr();
        this.monsterManualMgr = new MonsterManualMgr();
        this.statusMgr = new StatusMgr();
        this.sceneNetMgr = new SceneNetMgr();
        this.towerMgr = new TroopsMgr();
        this.strengMgr = new StrengMgr();
        this.emailMgr = new MailMgr();
        this.gatewayMgr = new GatewayMgr();
        this.reconnectMgr = new ReconnectMgr();
        this.turnTableMgr = new TurnTableMgr();
        this.shareMgr = new ShareMgr();
        this.relationMgr = new RelationMgr();
        this.discountMgr = new DiscountMgr();
        this.bulletChatMgr = new BulletChatMgr();
        this.chatMgr = new ChatMgr();
        this.fashionMgr = new FashionMgr();
        this.sysActivityMgr = new SysActivityMgr();
        this.noviceTask = new NoviceTaskMgr();
        this.growGiftMgr = new GrowGiftMgr();
        this.soprtsStoreMgr = new SoprtsStoreMgr();
        this.luckDrawMgr = new LuckDrawMgr();
        this.newSevicerankMgr = new NewSeviceRankingMgr();
        this.zeroMallMgr = new ZeroMallMgr();
        this.battlePassMgr = new BattlePassMgr();
        this.festivalActivityMgr = new FestivalActivityMgr();
        this.ldGameMgr = new LdGameMgr();
    }

    private static sysInit() {
        
        if (this.itemMgr == null) Game.itemMgr = new ItemMgr();
        if (this.inputMgr == null) Game.inputMgr = new InputMgr();
        if (this.ldSkillMgr == null) Game.ldSkillMgr = new LdSkillMgr();
        Game.ldNormalGameCtrl = new NormalGameCtrl();
        Game.ldPvpGameCtrl = new LdPvpGameCtrl();
        Game.ldCooperateCtrl = new LdCooperateCtrl();


        Game.activityMgr = new ActivetyMgr();
        Game.globalFunc = new GlobalFunc();
        this.globalEffect = GlobalEffectMgr.getInstance();
        this.addictionMgr = new AddictionMgr();
        this.tiliMgr = new TiliMgr();
        this.redPointSys = RedPointSys.getInstance();
        this.systemGuideCtrl = new SystemGuideCtrl();

        Game.soMgr.initCfgs();

        this.globalEffect.init();
        this.systemGuideCtrl.init();

        NewMonsterTowerManager.getInstance();

        GameEvent.emit(EventEnum.ON_GAME_START);
    }


    static initGameData() {
        cc.log("initGameData");
        this.globalFunc.read();
        this.globalFunc.init();
        this.redPointSys.init();
        this.systemGuideCtrl.read();
        this.bulletChatMgr.read();
        this.monsterManualMgr.readData();
        this.addictionMgr.read();
        this.sysActivityMgr.init();
        this.towerMgr.readConfig();
        this.ldGameMgr.read();
        GlobalVal.failTipsType = [];
    }

    static isPlaying(): boolean {
        if (this.curLdGameCtrl) {
            return this.curLdGameCtrl.isPlaying();
        }
        return false;
    }
}