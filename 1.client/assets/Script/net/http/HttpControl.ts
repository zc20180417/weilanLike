import { EventEnum } from "../../common/EventEnum";
import GlobalVal from "../../GlobalVal";
import { md5 } from "../../libs/encrypt/md5";
import { GameEvent } from "../../utils/GameEvent";
import { StringUtils } from "../../utils/StringUtils";

export default class HttpControl {
    
    static get(url:string, params:object = {}, callback:(suc:boolean, ret:string|any)=>void , encode:boolean = true) {
        let dataStr = "";
        Object.keys(params).forEach(key => {
            dataStr += key + "=" + (encode ? encodeURI(params[key]) : params[key]) + "&";
        });
        if(dataStr != ""){
            dataStr = dataStr.substr(0, dataStr.lastIndexOf("&"));
            url += "?" + dataStr;
        }
        cc.log("http get, url:"+ url);

        let xhr = cc.loader.getXMLHttpRequest();
        xhr.timeout = 30000;
        xhr.open("GET", url, true);
        //xhr.HEADERS_RECEIVED
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
            if(xhr.readyState == 4 && callback != null) {
                let response = xhr.responseText;
                response = decodeURIComponent(response);
                if(xhr.status >= 200 && xhr.status < 300) {
                    let obj = null;
                    try {
                        obj = JSON.parse(response);
                    } catch (error) {
                        console.log('http error:' + error , '  ,url:' + url);
                        callback(false, response);
                        return;
                    }
                    callback(true, obj);
                } else {
                    callback(false, response);
                }
            }
        };
        xhr.send();
    }

    static post(url:string, params:object = {}, callback:(suc:boolean, ret:string|any )=>void , encode:boolean = true){
        let dataStr = ''; 
        Object.keys(params).forEach(key => {
            dataStr += key + '=' + (encode ? encodeURI(params[key]) : params[key]) + '&';
        });
        if (dataStr !== '') {
            dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
        }
        console.log("http post, url:"+url+", param:" + dataStr);

        let xhr = cc.loader.getXMLHttpRequest();
        xhr.timeout = 30000;
        xhr.open("post", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && callback) {
                let response = xhr.responseText;
                cc.log('url:' ,  url , response);
                if(xhr.status >= 200 && xhr.status < 300){
                    let obj = null;
                    try {
                        obj = JSON.parse(response);
                    } catch (error) {
                        console.log('http error:' + error , '  ,url:' + url);
                        callback(false, response);
                        return;
                    }
                    callback(true, obj);
                }else{
                    callback(false, response);
                }
            }
        };
        xhr.send(dataStr);
    }

    private static _time:number = 0;
    private static _noticeInfo:string = '';
    public static hideNotice: boolean = true;
    static requestNotice() {
        if (cc.sys.now() < this._time) {

            if (!StringUtils.isNilOrEmpty(this._noticeInfo)) {
                GameEvent.emit(EventEnum.ON_NOTICE_INFO ,this._noticeInfo);
            }

            return;
        }

        this._time = cc.sys.now() + 5000;
        let data = {
            channel: GlobalVal.channel,
            edition: GlobalVal.curPlazaversion,
            token: md5(GlobalVal.TOKEN_FLAG)
        }
        HttpControl.get(GlobalVal.NOTICE_URL, data, (suc: boolean, ret: any) => {
            if (suc) {
                this._noticeInfo = ret.info;
                if (StringUtils.isNilOrEmpty(ret.info)) {
                    this.hideNotice = true;
                    GameEvent.emit(EventEnum.ON_NULL_NOTICE_INFO);
                } else {
                    this.hideNotice = false;
                    GameEvent.emit(EventEnum.ON_NOTICE_INFO, ret.info);
                }
            }
        }, true);
    }

    static checkServerInfo(channelId:string , systemType:number) {
        // let channel_id = Game.nativeApi.getPhoneInfo(SysState.SYSSTATE_CHANNEL_ID);
        // let os_type = this.getSystemType();
        let channel_id = channelId;
        let os_type = systemType;
        let tempStr = channel_id + os_type + GlobalVal.packageVersionName + GlobalVal.TOKEN_FLAG;
        let md5Str = md5(tempStr);
        let data = {
            channel:channel_id,
            os_type:os_type,
            edition:GlobalVal.packageVersionName,
            sign:md5Str, 
        }

        HttpControl.post(GlobalVal.CHECK_SERVER_INFO , data , (suc:boolean , ret:any) => {
            if (suc) {
                if (ret.status == 0) {
                    // SystemTipsMgr.instance.notice(ret.info);
                    console.log('requset server info error' , ret.info);
                } else {

                    if (ret.info && (ret.info as string).indexOf('test') != -1) {
                        GlobalVal.initCkServerUrl(true);
                    }

                    GlobalVal.serverIpList = [ret.info];
                    GlobalVal.serverOpened = ret.open_or_not == 1;
                }
            }
        } , 
        true);
    }
}
