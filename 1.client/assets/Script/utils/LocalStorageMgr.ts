import GlobalVal from "../GlobalVal";

export class LocalStorageMgr {

    static ACCOUNT:string = "ACCOUNT";
    static PSWD:string = "pswd";
    static CONFIG_VERSION:string = 'config_version_';
    static CUR_AI_TYPE:string = 'ai_type';
    static CHANGE_NAME:string = 'change_name';
    static OPEN_BTNS:string = 'open_btns';
    static HOT_UPDATA:string = 'hot_updata';
    static LAUNCH_APP_FRIST = 'launchAppFrist';
    static SHOW_LOGIN_FRIST = 'showLoginFrist';
    static DOUBLE_SPEED:string = 'double_speed';
    static SHOW_MANHUA:string = 'show_manhua';
    static GROUP_WAR_DATA:string = 'g_w_d';
    static OPEN_BOX:string = 'open_box';
    static CHAT_TIP:string = 'chat_tip';
    static CLOSE_VIDEO:string = 'close_video';

    public static getItem(key:string , useModuleName:boolean = true):any {
        return cc.sys.localStorage.getItem(useModuleName ? GlobalVal.moduleName + key : GlobalVal.GAME_NAME + key);
    }

    public static setItem(key:string , value:any ,useModuleName:boolean = true) {
        switch (typeof value) {
            case "object":
                value = JSON.stringify(value);
                break;
            case "boolean":
                value = value ? "true" : "false";
            default:
                value.toString();
                break;
        }
        cc.sys.localStorage.setItem(useModuleName ? GlobalVal.moduleName + key : GlobalVal.GAME_NAME + key, value);
    }

}