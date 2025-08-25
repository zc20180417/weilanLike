import { Handler } from "../../utils/Handler";
import FJByteArray from "./FJByteArray";

export default class FjSocket {
    private ws:WebSocket;
    public static SOCKET_CRYPT_METHOD_NORMAL:number = 1;
    public static SOCKET_CRYPT_METHOD_NO:number = 2;
    public static SYS_INFO_LEN:number = 20;

    public static uint(v:number):number {
        return v;    
    }

    public static DataViewCopy(des:DataView, des_offset:number, src:DataView, src_offset:number, count:number) {
        var remainder = count % 4;
        var size = count - remainder;
        for (var i = 0; i < size; i += 4) {
            des.setUint32(des_offset + i, src.getUint32(src_offset + i));
        }
        for (var i = 0; i < remainder; i++) {
            des.setUint8(des_offset + size + i, src.getUint8(src_offset + size + i));
        }
    }

    public static s_EncodeMap:number[] = [
        0x40, 0x84, 0xF0, 0xBE, 0x2D, 0xB8, 0x0D, 0xDF, 0x6E, 0xE9, 0x7F, 0x2E, 0x9B, 0xF4, 0x07, 0xD9,
        0xBD, 0x35, 0x9F, 0x6F, 0x51, 0x6D, 0xDD, 0xCF, 0x0E, 0x34, 0x39, 0x22, 0x10, 0x1C, 0x8F, 0x4E,
        0x03, 0xB6, 0xAF, 0xE5, 0xF5, 0x85, 0x11, 0x24, 0x32, 0xA7, 0xBB, 0xE4, 0x83, 0xA2, 0xEA, 0x06,
        0x70, 0xF2, 0x09, 0xFF, 0xD1, 0x81, 0x96, 0x30, 0xD2, 0x1A, 0x9C, 0xA8, 0xB5, 0x38, 0x57, 0xF6,
        0xCD, 0x60, 0xB1, 0x4F, 0x28, 0x7D, 0x2F, 0xD4, 0x1F, 0x23, 0x94, 0xCE, 0xB3, 0x45, 0x21, 0x82,
        0x91, 0x3E, 0x5E, 0x43, 0x95, 0x62, 0xAC, 0x9E, 0x3C, 0xC5, 0xAE, 0x87, 0x71, 0xC8, 0xC4, 0xB2,
        0xE6, 0x61, 0xA9, 0x4C, 0x13, 0x5A, 0x37, 0x46, 0x01, 0xED, 0x98, 0x18, 0xB4, 0x73, 0xC9, 0x2A,
        0x58, 0x97, 0xEE, 0x7B, 0x68, 0x19, 0x90, 0x7C, 0x88, 0xBF, 0xCB, 0x3B, 0x4D, 0x48, 0x3F, 0x65,
        0xD3, 0xDA, 0x4A, 0x8B, 0x33, 0x8D, 0xD0, 0x67, 0x54, 0xAB, 0xA3, 0xF7, 0x31, 0xD5, 0xE3, 0xA4,
        0xE2, 0xFB, 0x27, 0xB7, 0x59, 0x2B, 0x1B, 0xF9, 0x05, 0x5D, 0x7E, 0x74, 0xC6, 0x93, 0xAA, 0xA1,
        0x9A, 0xE0, 0xBA, 0x7A, 0xD7, 0x0A, 0xD6, 0x8E, 0xB9, 0xDE, 0xF3, 0x3A, 0x42, 0x0C, 0x0B, 0x5C,
        0x00, 0xEB, 0x25, 0x1E, 0x47, 0xC1, 0x5B, 0x0F, 0x04, 0xDB, 0x14, 0x2C, 0xE1, 0x4B, 0x12, 0x89,
        0xC7, 0x8C, 0x79, 0xE8, 0x78, 0xFD, 0x69, 0x55, 0x52, 0x15, 0x17, 0xC0, 0x63, 0x76, 0x56, 0x77,
        0x08, 0xCA, 0xC3, 0x9D, 0x99, 0x66, 0xC2, 0xE7, 0x6B, 0x6C, 0xBC, 0xDC, 0xFE, 0x44, 0x8A, 0xF1,
        0x86, 0xA5, 0x53, 0x5F, 0x80, 0x64, 0xAD, 0x20, 0x50, 0x36, 0x92, 0x3D, 0x75, 0xD8, 0x26, 0x41,
        0x72, 0xFA, 0x29, 0xB0, 0x16, 0x49, 0xFC, 0xEF, 0xA6, 0x1D, 0x6A, 0xCC, 0x02, 0xF8, 0xA0, 0xEC
    ];
    public static s_DecodeMap:number[] = [
        0xB0, 0x68, 0xFC, 0x20, 0xB8, 0x98, 0x2F, 0x0E, 0xD0, 0x32, 0xA5, 0xAE, 0xAD, 0x06, 0x18, 0xB7,
        0x1C, 0x26, 0xBE, 0x64, 0xBA, 0xC9, 0xF4, 0xCA, 0x6B, 0x75, 0x39, 0x96, 0x1D, 0xF9, 0xB3, 0x48,
        0xE7, 0x4E, 0x1B, 0x49, 0x27, 0xB2, 0xEE, 0x92, 0x44, 0xF2, 0x6F, 0x95, 0xBB, 0x04, 0x0B, 0x46,
        0x37, 0x8C, 0x28, 0x84, 0x19, 0x11, 0xE9, 0x66, 0x3D, 0x1A, 0xAB, 0x7B, 0x58, 0xEB, 0x51, 0x7E,
        0x00, 0xEF, 0xAC, 0x53, 0xDD, 0x4D, 0x67, 0xB4, 0x7D, 0xF5, 0x82, 0xBD, 0x63, 0x7C, 0x1F, 0x43,
        0xE8, 0x14, 0xC8, 0xE2, 0x88, 0xC7, 0xCE, 0x3E, 0x70, 0x94, 0x65, 0xB6, 0xAF, 0x99, 0x52, 0xE3,
        0x41, 0x61, 0x55, 0xCC, 0xE5, 0x7F, 0xD5, 0x87, 0x74, 0xC6, 0xFA, 0xD8, 0xD9, 0x15, 0x08, 0x13,
        0x30, 0x5C, 0xF0, 0x6D, 0x9B, 0xEC, 0xCD, 0xCF, 0xC4, 0xC2, 0xA3, 0x73, 0x77, 0x45, 0x9A, 0x0A,
        0xE4, 0x35, 0x4F, 0x2C, 0x01, 0x25, 0xE0, 0x5B, 0x78, 0xBF, 0xDE, 0x83, 0xC1, 0x85, 0xA7, 0x1E,
        0x76, 0x50, 0xEA, 0x9D, 0x4A, 0x54, 0x36, 0x71, 0x6A, 0xD4, 0xA0, 0x0C, 0x3A, 0xD3, 0x57, 0x12,
        0xFE, 0x9F, 0x2D, 0x8A, 0x8F, 0xE1, 0xF8, 0x29, 0x3B, 0x62, 0x9E, 0x89, 0x56, 0xE6, 0x5A, 0x22,
        0xF3, 0x42, 0x5F, 0x4C, 0x6C, 0x3C, 0x21, 0x93, 0x05, 0xA8, 0xA2, 0x2A, 0xDA, 0x10, 0x03, 0x79,
        0xCB, 0xB5, 0xD6, 0xD2, 0x5E, 0x59, 0x9C, 0xC0, 0x5D, 0x6E, 0xD1, 0x7A, 0xFB, 0x40, 0x4B, 0x17,
        0x86, 0x34, 0x38, 0x80, 0x47, 0x8D, 0xA6, 0xA4, 0xED, 0x0F, 0x81, 0xB9, 0xDB, 0x16, 0xA9, 0x07,
        0xA1, 0xBC, 0x90, 0x8E, 0x2B, 0x23, 0x60, 0xD7, 0xC3, 0x09, 0x2E, 0xB1, 0xFF, 0x69, 0x72, 0xF7,
        0x02, 0xDF, 0x31, 0xAA, 0x0D, 0x24, 0x3F, 0x8B, 0xFD, 0x97, 0xF1, 0x91, 0xF6, 0xC5, 0xDC, 0x33
    ];

    public static CalcNewKey(key:number):number {
        var mult = 37313513;
        var add = 313272523;
        var k_h = (key >>> 16);
        var k_l = (key) & 0xFFFF;
        var m_h = (mult >>> 16);
        var m_l = (mult) & 0xFFFF;
        var a_h = (add >>> 16);
        var a_l = (add) & 0xFFFF;
        var a = k_l * m_l;
        var b = k_h * m_l;
        var c = k_l * m_h;
        var d = k_h * m_h;
        var A = (a & 0xFFFF);
        var B = (c & 0xFFFF) + (b & 0xFFFF) + (a >>> 16);
        B &= 0xFFFF;
        var r_l = A + a_l;
        var r_h = B + a_h;
        var r_l_2 = r_l & 0xFFFF;
        var r_h_2 = (r_l >>> 16) + (r_h & 0xFFFF);
        return r_l_2 + (r_h_2 << 16);
    }

    private m_Crypt:FJSocketCrypt = new FJSocketCrypt();

    public OnConnectError:Handler = null;
    public OnConnectOK:Handler = null;
    public OnConnectClose:Handler = null;
    public OnProtocolError:Handler = null;
    public OnPeerInfoReady:Handler = null;
    public OnSocketData:Handler = null;

    private m_flux_in:number = 0;
    private m_flux_out:number = 0;
    private m_bPeerInfoReady:boolean = false;
    private m_bActiveClosed:boolean = false;
    private m_socket:WebSocket = null;
    private m_bConnectOKCalled:boolean = false;
    private m_bErrorCloseCalled:boolean = false;
    private m_UserData:any = null; 

    constructor()
	{
		
    }  

    private CallErrorAndClose(str:string) {
        console.log(str)
        if (this.m_bActiveClosed){
            return;
        }
        if (this.m_bErrorCloseCalled)
            return;
        this.m_bErrorCloseCalled = true;
        if (this.m_bConnectOKCalled) {
            if (this.OnProtocolError)
                if (str != undefined && str != null)
                    this.OnProtocolError.executeWith(str);
            if (this.OnConnectClose)
                this.OnConnectClose.execute();
        }
        else {
            if (this.OnConnectError) {
                if (str != undefined && str != null) {
                    this.OnConnectError.executeWith(str);
                }
                else {
                    this.OnConnectError.executeWith("connect error 1");
                }
            }
        }
        this.doCloseConnect();
    }

    private OnWSOpen() {
        if (this.m_bActiveClosed)
            return;
        if (this.m_bConnectOKCalled)
            return;
        this.m_bConnectOKCalled = true;
    }

    private OnWSError(e) {
        this.CallErrorAndClose("connect error");
        //cc.kc.Log.info("OnWSClose", e);
    }

    private OnWSClose(e) {
        this.CallErrorAndClose("OnWSClose");
        //cc.kc.Log.info("OnWSClose", e);
    }

    private OnWSMessage(data:ArrayBuffer) {
        if (this.m_socket == null || this.m_bActiveClosed)
            return;
        var buf = FJByteArray.CreateByteBuffer(data);

        if (this.m_bPeerInfoReady) {
            if (buf.rawBuffer.byteLength <= 2) {
                this.CallErrorAndClose("size error");
                return;
            }
            var len = buf.rawBuffer.byteLength - 2;
            var dv = new DataView(buf.rawBuffer);
            var sign = dv.getUint16(0, true);
            if ((sign & 0x8000) != 0) {
                this.CallErrorAndClose("服务器发来关闭请求");
                return;
            }
            if ((sign & 0x7fff) != len) {
                //  console.log("消息格式有问题");
                this.CallErrorAndClose("message format error");
                return;
            }
            var ab = this.m_Crypt.Decode(buf.rawBuffer, dv, len);
            if (this.OnSocketData)
                this.OnSocketData.executeWith(FJByteArray.CreateByteBuffer(ab));
            return;
        }
        var dv = new DataView(buf.rawBuffer);
        if (dv.getUint8(0) != FjSocket.SYS_INFO_LEN) {
            this.CallErrorAndClose("对方系统信息包长度错误!");
            return;
        }
        if (dv.getUint8(1) != 2) {
            this.CallErrorAndClose("对方Socket主版本号不匹配!");
            return;
        }
        if (dv.getUint8(2) != 0) {
            this.CallErrorAndClose("对方Socket次版本号不匹配!");
            return;
        }
        if (dv.getUint8(3) != 1) {
            this.CallErrorAndClose("对方系统信息包错误（字节序）!");
            return;
        }
        if (dv.getUint8(4) != 0 ||
            (dv.getUint8(5) != FjSocket.SOCKET_CRYPT_METHOD_NORMAL &&
                dv.getUint8(5) != FjSocket.SOCKET_CRYPT_METHOD_NO)) {
            this.CallErrorAndClose("不支持的加密或压缩方法!");
            return;
        }
        if (dv.getUint8(7) < 0 ||
            dv.getUint8(7) > 12) {
            this.CallErrorAndClose("服务器Socket初始化信息附加长度错误!");
            return;
        }
        this.m_Crypt.SetEncodeKey(dv.getUint8(5), dv.getUint32(8, true));
        var self = this;
        var socket = this.m_socket;
        var id = setInterval(function () {
            //if (socket.readyState >= 1) {
            if (socket.readyState == WebSocket.OPEN) {
                clearInterval(id);
                var ph = self.m_Crypt.GetProtocolHead();
                self.doSend(ph, FjSocket.SYS_INFO_LEN, false);
                if (self.OnConnectOK)
                    self.OnConnectOK.execute();
                self.m_bPeerInfoReady = true;
                if (self.OnPeerInfoReady != null)
                    self.OnPeerInfoReady.execute();
            }
        }, 100);
    }

    private doSend(ab:ArrayBuffer, len:number, sendlen:boolean) {
        if (sendlen === undefined) { sendlen = true; }
        if (this.m_socket == null || this.m_bActiveClosed)
            return;
        if (!sendlen) {
            var data = ab;
            if (data.byteLength != len) {
                data = data.slice(0, len);
            }
            this.m_socket.send(data);
            return;
        }
        else {
            var data = this.m_Crypt.Encode(ab, len);
            this.m_socket.send(data);
        }
    }

    public doCloseConnect() {
        if (this.m_socket != null) {
            this.m_socket.close();
            this.m_socket = null;
            this.m_bErrorCloseCalled = false;
            this.m_bConnectOKCalled = false;
        }
    }

    public Connect(server:string, port:number) {
        cc.log("Connect server=" + server + " ,port=" + port);
        if (this.m_socket != null) {
            console.log('donot do that');
        }
        var url;
        if (!cc.sys.isNative) {
            if (typeof (window['wx']) !== "undefined" || (document && document.location && 'https:' == document.location.protocol))
                url = "wss://" + server + ":" + port;
            else
                url = "ws://" + server + ":" + port;
        }
        else {
            url = "ws://" + server + ":" + port;
        }
        cc.log("url = " + url)
        //this.m_socket =	new	WebSocket(url);
        this.doCloseConnect();
        this.m_socket = new WebSocket(url);
        if (this.m_socket) {

            var e = this;
            this.m_socket.onopen = function (t) {
                e.OnWSOpen();
                function r() {
                    // e.isInit && !e.heartTime && (e.heartTime = setTimeout(function () {
                    //     e.heartTime = null,
                    //     __SendNetData(MSG_SUBID_HALL, 0),
                    //     r();
                    // }, 6e4));
                }
               r();
            }, this.m_socket.onmessage = function (t) {
                e.OnWSMessage(t.data);
            }, this.m_socket.onerror = function (t) {
                e.OnWSError(t);
            }, this.m_socket.onclose = function (t) {
                e.OnWSClose(t);
            },
            this.m_socket.binaryType = "arraybuffer";
        }
    }

    public Send(ab:ArrayBuffer, len:number) {
        if (!this.m_bPeerInfoReady) {
            console.log("Send(): !m_bPeerInfoReady");
            return;
        }
        if (len == null || len == undefined)
            len = ab.byteLength;
        if (len <= 0 || len > 4080) {
            console.log("Send(): len error");
            return;
        }
        this.doSend(ab, len, true);
    }

    public CloseConnect() {
        this.m_bActiveClosed = true;
        this.doCloseConnect();
    }

    public IsPeerInfoReady():boolean {
        return this.m_bPeerInfoReady;
    }

    public GetFluxOut():number {
        return this.m_flux_out;
    }

    public GetFluxIn():number {
        return this.m_flux_in;
    }
   
    public isConnected():boolean {
        return this.m_socket && !this.m_bActiveClosed;
    } 
}

export class DebugFJSocket {

    constructor()
	{
        let sk:FjSocket = new FjSocket();
		sk.OnConnectError = new Handler(this.OnConnectError , this);
        sk.OnConnectOK = new Handler(this.OnConnectOK , this);
        sk.OnConnectClose = new Handler(this.OnConnectClose , this);
        sk.OnProtocolError = new Handler(this.OnProtocolError , this);
        sk.OnPeerInfoReady = new Handler(this.OnPeerInfoReady , this);
        sk.OnSocketData = new Handler(this.OnSocketData , this);
        sk.Connect("127.0.0.1", 9900);
    }

    public OnConnectError(msg) {
        cc.log("OnConnectError()", msg);
    }
    public OnConnectOK() {
        cc.log("OnConnectOK()");
    }
    //自己调CloseConnect()不会回调这个 
    public OnConnectClose() {
        cc.log("OnConnectClose()");
    }
    //之后OnConnectClose()会被调用
    public OnProtocolError(msg) {
        cc.log("OnProtocolError()", msg);
    }
    public OnPeerInfoReady() {
       
    }
    public OnSocketData(ab) {
        var data = FJByteArray.CreateByteBuffer(ab);
        var mainCode = data.readUInt8();
        var SubCode = data.readUInt8();
        console.log("code=", mainCode, SubCode);
    }
    //    sk.m_UserData        = //可以用来存this指针之类的
    
}

export class FJSocketCrypt {
    private m_strServer = null;
    private m_uiPort:number = 0;
    private m_uiEncodekey:number = 0;
    private m_uiDecodekey:number = 0;
    private m_nEncodeMethod:number = 0;
    private m_nDecodeMethod:number = FjSocket.SOCKET_CRYPT_METHOD_NORMAL;
    
    public SetEncodeKey(method:number, key:number) {
        this.m_nEncodeMethod = method;
        this.m_uiEncodekey = key;
    }

    public GetProtocolHead():ArrayBuffer {
        let ret:ArrayBuffer = new ArrayBuffer(20);
        let dv:DataView = new DataView(ret);
        dv.setUint8(0, FjSocket.SYS_INFO_LEN);
        dv.setUint8(1, 2);
        dv.setUint8(2, 0);
        dv.setUint8(3, 1);
        dv.setUint8(4, 0);
        dv.setUint8(5, this.m_nDecodeMethod);
        dv.setUint8(6, 0);
        this.m_uiDecodekey = Math.floor(Math.random() * 2000000000);
        if (this.m_nDecodeMethod == FjSocket.SOCKET_CRYPT_METHOD_NORMAL) {
            dv.setUint8(7, 4);
            dv.setUint32(8, this.m_uiDecodekey, true);
            for (var i = 0; i < 8; i++)
                dv.setUint8(12 + i, 0);
        }
        else {
            dv.setUint8(7, 0);
            for (i = 0; i < 12; i++)
                dv.setUint8(8 + i, 0);
        }
        return ret;
    }

    public Encode(ab:ArrayBuffer, count:number):ArrayBuffer {
        var data = new ArrayBuffer(count + 2);
        var dv = new DataView(data);
        var dvab = new DataView(ab);
        dv.setUint8(0, count & 0xFF);
        dv.setUint8(1, (count >> 8) & 0xFF);
        if (this.m_nEncodeMethod != 1) {
            FjSocket.DataViewCopy(dv, 2, dvab, 0, count);
            return data;
        }
        this.m_uiEncodekey = FjSocket.uint(FjSocket.CalcNewKey(this.m_uiEncodekey));
        var Key = (this.m_uiEncodekey >> 22) & 0xFF;
        for (var i = 0; i < count; ++i) {
            var u = dvab.getUint8(i);
            u = (u ^ Key) & 0xFF;
            dv.setUint8(2 + i, FjSocket.s_EncodeMap[u] & 0xFF);
        }
        return data;
    }

    public Decode(data:ArrayBuffer, dv:DataView, count:number):ArrayBuffer {
        if (this.m_nDecodeMethod != 1) {
            return data.slice(2, data.byteLength - 2);
        }
        this.m_uiDecodekey = FjSocket.uint(FjSocket.CalcNewKey(this.m_uiDecodekey));
        var Key = (this.m_uiDecodekey >> 22) & 0xFF;
        var ret = new ArrayBuffer(count);
        var dvret = new DataView(ret);
        for (var i = 0; i < count; ++i) {
            var u = dv.getUint8(2 + i);
            dvret.setUint8(i, (FjSocket.s_DecodeMap[u] ^ Key) & 0xFF);
        }
        return ret;
    }

}
 