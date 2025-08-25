
import FJByteArray from "./FJByteArray";
import { Handler } from "../../utils/Handler";
import { GameEvent } from "../../utils/GameEvent";
import { EventEnum } from "../../common/EventEnum";
import { BinaryAnalysis } from "./BinaryAnalysis";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import SysMgr from "../../common/SysMgr";
import GlobalVal from "../../GlobalVal";
import { BuryingPointMgr, EBuryingPoint } from "../../buryingPoint/BuryingPointMgr";
import { StringUtils } from "../../utils/StringUtils";
import LoadingTips from "../../ui/tips/LoadingTips";
import { MathUtils } from "../../utils/MathUtils";
import Minilzo from "./Minilzo";

class HostPortObj {
    constructor(host: string, port: number) {
        this.host = host;
        this.port = port;
    }
    host: string = '';
    port: number = 0;
}

export default class SocketManager {

    private static _instance: SocketManager = null;

    public static get instance(): SocketManager {
        if (SocketManager._instance == null) {
            SocketManager._instance = new SocketManager();
        }
        return SocketManager._instance;
    }

    /////////////////////////////////////////////////////////////////
    ////////////////////////////////////////外网
    private _host: string = "";
    private _port: number = 1100;//9001;//
    private _binaryAnalysis: BinaryAnalysis = new BinaryAnalysis();

    private _ws: WebSocket = null;
    private _handler: any[] = [];
    private _packcount: number = 0;
    //private _isReconnect: boolean = false;
    private _bConnectOKCalled: boolean = false;
    private _curHost: string = "";
    private _curPort: number = 0;
    private _hostPortList: HostPortObj[] = [];
    private _reTryConnectHandler: Handler;
    private _fristConnect: boolean = true;
    private _fristHostPortObj: HostPortObj;


    constructor() {
        this._reTryConnectHandler = new Handler(this.reTryConnect, this);
    }

    private initHostPortList() {

        if (GlobalVal.serverPortList.length == 0 && GlobalVal.serverIpList.length == 0) {
            this._hostPortList.push(new HostPortObj(GlobalVal.SERVER_IP, GlobalVal.SERVER_PORT));
        } else {

            if (GlobalVal.serverIpList.length == 0) {
                GlobalVal.serverIpList = [GlobalVal.SERVER_IP];
            }

            if (GlobalVal.serverPortList.length == 0) {
                GlobalVal.serverPortList = [GlobalVal.SERVER_PORT];
            }

            let ipLen = GlobalVal.serverIpList.length;
            let portLen = GlobalVal.serverPortList.length;

            for (let i = 0; i < ipLen; i++) {
                for (let j = 0; j < portLen; j++) {
                    this._hostPortList.push(new HostPortObj(GlobalVal.serverIpList[i], GlobalVal.serverPortList[j]));
                }
            }

            if (!StringUtils.isNilOrEmpty(GlobalVal.serverIpFrist)) {
                this._fristHostPortObj = new HostPortObj(GlobalVal.serverIpFrist, MathUtils.randomGetItemByList(GlobalVal.serverPortList));
            }
        }


    }

    reConnect() {
        console.log('-----------reConnect');
        if (!StringUtils.isNilOrEmpty(this._curHost)) {
            console.log('-----------reConnect', this._curHost, this._curPort);
            this.connect(this._curHost, this._curPort);
        } else {
            this.connect();
        }
    }

    public connect(host?: string, port?: number) {
        if (host != null && port != null) {
            this._host = host;
            this._port = port;
            this.tryConnect();
        } else {
            this.initHostPortList();
            this.reTryConnect();
        }

    }

    private setHostPort() {
        if (this._fristConnect && this._fristHostPortObj) {
            this._host = this._fristHostPortObj.host;
            this._port = this._fristHostPortObj.port;
            return true;
        } else if (this._hostPortList.length > 0) {
            let index = Math.floor(Math.random() * this._hostPortList.length);
            let data = this._hostPortList[index];
            this._host = data.host;
            this._port = data.port;
            this._hostPortList.splice(index, 1);
            return true;
        } else {
            SystemTipsMgr.instance.notice("连接服务器失败，请检查网络");
            return false;
        }
    }

    private tryConnect() {
        // this._curHost = '';
        this.closeConnect();

        this.showLoadingTips(true);
        let self: SocketManager = this;
        var ws: WebSocket = new WebSocket("ws://" + this._host + ":" + this._port);
        console.log('----------tryConnect:', ws.url);

        ws.binaryType = "arraybuffer";
        ws.onopen = function (event) {
            self.onWSOpen();
        };
        ws.onmessage = function (event) {
            // console.log("websocket datalen:",event.data.byteLength);
            let data = event.data;
            self.onSocketData(FJByteArray.CreateByteBuffer(data));
        };
        ws.onerror = function (event) {
            self.onError(event, 'connect error:');
        };
        ws.onclose = function (event) {
            self.onError(event, 'on ws close:');
        };

        this._fristConnect = false;
        this._ws = ws;
    }

    private showLoadingTips(flag: boolean) {
        if (flag) {
            LoadingTips.showLoadingTips('connectSocket');
        } else {
            LoadingTips.hideLoadingTips('connectSocket');
        }
    }

    private onError(e: CloseEvent | Event, info: string) {
        this.showLoadingTips(false);
        if (e.target == this._ws || e.target == null) {
            this.closeConnect();
        }

        if (StringUtils.isNilOrEmpty(this._curHost)) {
            console.log('连接服务器失败:', this._host, this._port);
            SysMgr.instance.clearTimer(this._reTryConnectHandler);
            SysMgr.instance.doFrameOnce(this._reTryConnectHandler, 5, true);
        }
    }

    private reTryConnect() {
        if (!this.setHostPort()) {
            return;
        }
        this.tryConnect();
    }

    private onSocketData(byteArray: FJByteArray) {
        this._packcount++;
        //解密
        //this.encryptData(byteArray);
        let nAddr: number = byteArray.readInt64(); //代理使用的头码信息(@@:只要确定需要使用代理的数据结构都必须继承GS_Head)
        let rootID: number = byteArray.readUInt8(); //分类消息码
        let mainID: number = byteArray.readUInt8(); //主消息码
        let subID: number = byteArray.readUInt8(); //子消息码

        // cc.log("rootId:" + rootID + " mainId:" + mainID + " subId:" + subID);

        if (!this._handler[rootID]) {
            console.log(`未注册解码结构体:${rootID}`);
            return;
        }

        if (!this._handler[rootID][mainID]) {
            console.log(`未注册解码结构体:${rootID},${mainID}`);
            return;
        }

        let analysis = this._handler[rootID][mainID][subID];
        if (!analysis) {
            console.log(`未注册解码结构体:${rootID},${mainID},${subID}`);
            return;
        }

        if(GlobalVal.encrypt) {
            let bodybuff: Uint8Array = byteArray.bytes.slice(byteArray.position);
            let outBuffer:ArrayBuffer;
            if (nAddr != 0) {
                outBuffer = Minilzo.getInstance().uncompress(bodybuff);
            } else {
                Minilzo.getInstance().encryptData(bodybuff);
                outBuffer = bodybuff.buffer;
            }
            byteArray.buffer = outBuffer;
            byteArray.position = 0;
        }

        let log = false;
        if (mainID == 3 && subID == 0) {
            // log = true;
        }

        try {
            let data: any = this._binaryAnalysis.decode(byteArray, new (analysis.c)(), log);
            (analysis.handler as Handler).executeWith(data);
        } catch (error) {
            console.log(`解码出错:${rootID},${mainID},${subID}`, error);
        }
    }

    private onWSOpen() {
        console.log('----------onWSOpen:', this._host, this._port);
        this.showLoadingTips(false);
        if (this._bConnectOKCalled)
            return;
        console.log("Websocket was opened.");
        this._packcount = 0;
        this._bConnectOKCalled = true;
        this._curHost = this._host;
        this._curPort = this._port;
        BuryingPointMgr.postFristPoint(EBuryingPoint.CONNECT_SERVER);
        GameEvent.emit(EventEnum.SOCKET_CONNECTED);

        /*
        if (this._isReconnect) {
            this._isReconnect = false;
            SystemTipsMgr.instance.notice('重新连接服务器成功');
        }
        */
    }

    public doConnectError() {
        /*
        var r = (new Date).getTime();
        if (r - this.error_time < 500) return;
        cc.log("doConnectErrordoConnectErrordoConnectError");
        this.error_time = r;
        */
    }

    public send(buffer: FJByteArray) {
        if (this.isConnected) {
            this._ws.send(buffer.rawBuffer);
            this.setIdleTimer();
            return this;
        }
    }

    public closeConnect() {
        if (this._ws != null) {
            console.log('--------closeConnect', this._ws.url);
            this._ws.onclose = null;
            this._ws.onerror = null;
            this._ws.close();
            this._ws = null;
            this._bConnectOKCalled = false;

            if (!StringUtils.isNilOrEmpty(this._curHost)) {
                GameEvent.emit(EventEnum.SOCKET_ON_ERROR);
            }
        }
    }

    //模拟断线
    public simulateDisconnect() {
        this.closeConnect();
    }


    public getSocket() {
        return this._ws;
    }

    get isConnected() {
        return this._ws && this._ws.readyState == 1 && this._bConnectOKCalled;
    }

    /**注册解码消息体 */
    registerHandler(rootID: number, mainID: number, subID: number, handler: Handler, c: any) {
        if (!this._handler[rootID]) {
            this._handler[rootID] = {};
        }

        if (!this._handler[rootID][mainID]) {
            this._handler[rootID][mainID] = {};
        }

        if (this._handler[rootID][mainID][subID]) {
            console.log(`重复注册解码结构体：${rootID} , ${mainID} , ${subID}`);
        }

        this._handler[rootID][mainID][subID] = { handler: handler, c: c };
    }

    private _sendBodyByteArray:FJByteArray = FJByteArray.CreateByteBuffer();
    sendData(rootID: number, mainID: number, subID: number, data: any) {
        let buffer: FJByteArray = this.getByteArray(rootID, mainID, subID);
        //加密
        if(GlobalVal.encrypt) {
            this._sendBodyByteArray.clear();
            this._binaryAnalysis.encode(data, this._sendBodyByteArray);
            // this.logBuffer(this._sendBodyByteArray.bytes , `rootid:${roo}`)
            Minilzo.getInstance().encryptData(this._sendBodyByteArray.bytes);
            const bodyByteLen = this._sendBodyByteArray.bytes.byteLength;
            if (bodyByteLen > 64) {
                let tempData = Minilzo.getInstance().compress(this._sendBodyByteArray.bytes);
                if (!tempData) {
                    return;
                }
                if (tempData.length < bodyByteLen) {
                    this._sendBodyByteArray.buffer = tempData.buffer;
                    buffer.position = 0;
                    buffer.writeInt64(bodyByteLen);
                    buffer.position = 11;
                } else {
                    // cc.log('压缩后比压缩前大:' ,'压缩前：' , bodyByteLen , '压缩后:' , tempData.length);
                }
            }
            buffer.writeBytes(this._sendBodyByteArray , 0 , this._sendBodyByteArray.length);
        } else {
            this._binaryAnalysis.encode(data, buffer);
        }
        this.send(buffer);
    }

    private getByteArray(rootID: number, mainID: number, subID: number): any {
        let net: FJByteArray = FJByteArray.CreateByteBuffer();
        net.writeInt64(0);
        net.writeInt8(rootID);
        net.writeInt8(mainID);
        net.writeInt8(subID);
        return net;
    }

    private logBuffer(data: Uint8Array, prevStr?: string) {
        var arr = new Array();

        for (var i = 0; i < data.length; i++) {
            var charI: string = data[i].toString(16);
            if (charI.length == 1) {
                charI = "0" + charI;
            }
            arr.push(charI);
        }
        console.log((prevStr ? prevStr : "") + arr.join(' '));
    }

    //设置空闲计时器
    private setIdleTimer() {
        //SysMgr.instance.clearTimer(Handler.create(this.onIdleTimer , this) , true);
        //SysMgr.instance.doOnce(Handler.create(this.onIdleTimer , this) , 60000 , true);
    }

    //
    private onIdleTimer() {
        GameEvent.emit(EventEnum.SOCKET_IDLE);
    }


}