import { Lang_CN } from "./Lang_CN";
import { Lang_EN } from "./Lang_EN";
import { EventEnum } from "../common/EventEnum";
import { LocalStorageMgr } from "../utils/LocalStorageMgr";
import { StringUtils } from "../utils/StringUtils";
import { GameEvent } from "../utils/GameEvent";

export enum LangEnum {
    Loading,
    Loginning,
    ConnecttingGameServer,
    YourAccountHasBeenSuspended,
    LoginFail,
    VerifyingWithCenter,
    ConnectErrorAndCheckNet,

    ZHAO_MU,
    TEN_CARD_TIPS1,
    PINK,
    WATCH_RATE,
    DRAW_CARD_COUNT,
    DISCOUNT,
    CLICK_TO_FLIP,
    QEUDING,
    DRAW_CARD_UNENOUGH,
    BU_ZHU,

    TOWER_STAR_CLICK_TIPS,
    ACTIVE_NEED,
    TOTAL_STAR,

    BUY,
    RECIVE,
    RECIVED,

    CAN_ACTIVE,
    WAIT_ACTIVE,
    CAN_UPGRADE,
    RMB,
    CooperateHurtAddTips,
    CooperateAwardTips,
    CooperateHurtAddTvTips,
    CooperateHurtAddValue,
    CooperateNewWaveTips,
    CooperateGameFaildTips,
}

export class Lang {

    private static dic = {
        "cn": Lang_CN,
        "eng": Lang_EN,
    }

    private static LANG_LOCAK_KEY: string = "lang";
    private static langObject: any = Lang_EN;

    public static init() {
        LocalStorageMgr.setItem(this.LANG_LOCAK_KEY, "cn");
        if (this.getLangKey() == undefined) {
            LocalStorageMgr.setItem(this.LANG_LOCAK_KEY, "cn");
        }
        this.langObject = this.dic[this.getLangKey()];
    }

    public static getL(lEnum: LangEnum): string {
        let l = this.langObject[LangEnum[lEnum]];
        return l != null ? l : "";
    }

    public static setL(lang: string) {
        this.langObject = this.dic[lang];
        LocalStorageMgr.setItem(this.LANG_LOCAK_KEY, lang);
        GameEvent.emit(EventEnum.CHANGE_LANG);
    }

    public static getLangKey() {
        return LocalStorageMgr.getItem(this.LANG_LOCAK_KEY);
    }

    static getL2(lEnum: LangEnum, ...params): string {
        let str = this.getL(lEnum);
        return StringUtils.format.call(null, str, ...params);
    }
}