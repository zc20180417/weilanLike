

export default class HttpRequest {
    public static HTTP_METHOD_GET: string = "GET";
    public static HTTP_METHOD_POST: string = "POST";
    public static HTTP_METHOD_PUT: string = "PUT";
    public static HTTP_METHOD_DELETE: string = "DELETE";

    protected url: string = "";
    protected method: string = ""

    protected xhr: XMLHttpRequest;

    onSuccess: (this: HttpRequest, result: any) => any;
    onFailed: (this: HttpRequest, errorMsg: string) => any;

    /**
     * 
     * @param url 请求地址
     * @param method 方法，暂支持 GET / POST
     */
    constructor(url?: string, method?: string) {

        this.url = url ? url : this.url;
        this.method = method ? method : HttpRequest.HTTP_METHOD_GET;

        this.xhr = new XMLHttpRequest();

        let thisObj: HttpRequest = this;
        this.xhr.onreadystatechange = function() {
            // 这里的this 是xhr，而不是HttpRequest
            if (this.readyState == 4) {
                if(this.status >= 200 && this.status < 400) {
                    var response = this.responseText;
                    thisObj.onSuccessHandle(this.responseText)
                } else {
                    thisObj.onFailedHandle(this.status, this.responseText);
                }
            } 
        }
    }

    /**
     * 请求成功回调
     * @param result respones结果
     */
    protected onSuccessHandle(result: string) {
        if(this.onSuccess) {
            this.onSuccess(result);
        }
    }

    /**
     * 请求失败
     * @param code 错误码
     * @param errorMsg 错误信息 
     */
    protected onFailedHandle(code?: number, errorMsg?: string) {
        if (this.onFailed) {
            this.onFailed(errorMsg);
        }
    }

    /**
     * 
     * @param url 请求地址
     * @param method 方法，暂支持 GET / POST
     * @param params 请求参数，json格式的string
     */
    public start(url?: string, method?: string, params?: string) {
        if (url) {
            this.url = url;
        } 
        if (method) {
            this.method = method;
        }

        this.xhr.open(this.method, this.url, true);
        this.xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        this.xhr.send(params);
    }
    
}
