import HttpRequest from "./HttpRequest";


export default class PhpRequest extends HttpRequest {

    public static deviceid: string = "";
    public static version: string = "";
    public static devicetype: number = 0;
    public static siteid: number = 0;
    public static channel: number = 0;
    public static model: string = "";
    public static uid: number = 0;
    public static sessionkey: string = "";

    resultData: Object = null; // 请求结果（json格式）

    start(url?: string, method?: string, params?: any) {
        if (!params) {
            params = {}
        }
        params["deviceid"] = PhpRequest.deviceid;
        params["version"] = PhpRequest.version;
        params["devicetype"] = PhpRequest.devicetype;
        params["siteid"] = PhpRequest.siteid;
        params["model"] = PhpRequest.model;
        params["uid"] = PhpRequest.uid;
        params["channel"] = PhpRequest.channel;
        params["session_key"] = PhpRequest.sessionkey;

        this.xhr.responseType = "text";
        super.start(url, method, "win_param=" + encodeURI(JSON.stringify(params)))
    }

    onSuccessHandle(result: string) {
        var jsonObj;
        try {
            jsonObj = JSON.parse(result);
            this.resultData = jsonObj;
            
        } catch (error) {
            if(this.onFailed) {
                this.onFailed(error);
            }
        }

        if(this.onSuccess) {
            this.onSuccess(jsonObj);
        }
    }
}
