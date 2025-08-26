import { EventEnum } from "../common/EventEnum";
import GameEvent from "../utils/GameEvent";

window.onLoginSuccess = function(plat,msg) {
    GameEvent.emit(EventEnum.JAVA_CALL_LOGIN_SUCCESS , plat , msg);
}

window.onLoginFail = function(plat,msg) {
    GameEvent.emit(EventEnum.JAVA_CALL_LOGIN_FAIL , plat , msg);
}

window.onLoginCancel = function(plat,msg) {
    GameEvent.emit(EventEnum.JAVA_CALL_LOGIN_CANCEL , plat , msg);
}

window.onShareComplete = function(plat,msg) {
    GameEvent.emit(EventEnum.JAVA_CALL_SHARE_SUCCESS , plat , msg);
}

window.onShareError = function(plat,msg) {
    GameEvent.emit(EventEnum.JAVA_CALL_SHARE_FAIL , plat , msg);
}

window.onShareCancel = function(plat,msg) {
    GameEvent.emit(EventEnum.JAVA_CALL_SHARE_CANCEL , plat , msg);
}

window.onPaySuccess = function(plat,msg) {
    GameEvent.emit(EventEnum.JAVA_CALL_PAY_SUCCESS , plat , msg);
}

window.onPayFail = function(plat,msg) {
    GameEvent.emit(EventEnum.JAVA_CALL_PAY_FAIL , plat , msg);
}

window.onPayCancel = function(plat,msg) {
    GameEvent.emit(EventEnum.JAVA_CALL_PAY_CANCEL , plat , msg);
}

window.reegionalismReturn = function(ZipCode, ProviceName , CityName , DistrictName) {
    GameEvent.emit(EventEnum.JAVA_REEGIONALISM_RETURN ,ZipCode, ProviceName , CityName , DistrictName );
}

window.saveImgSuccess = function(path) {
    GameEvent.emit(EventEnum.JAVA_CALL_SAVE_IMG_SUCCESS , path);
}

window.onGetDeviceId = function(id) {
    GameEvent.emit(EventEnum.JAVA_CALL_ON_GET_DEVICEID , id);
}