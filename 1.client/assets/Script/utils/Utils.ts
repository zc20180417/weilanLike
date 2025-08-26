
import GlobalVal from "../GlobalVal";
import { StringUtils } from "./StringUtils";

export default class Utils {

  public static createTexture(): cc.RenderTexture {
    let texture = new cc.RenderTexture();
    let gl = cc.game["_renderContext"];
    texture.initWithSize(cc.visibleRect.width, cc.visibleRect.height, gl.STENCIL_INDEX8);
    return texture;
  }

  public static bytes2string(array: Uint8Array): string {
    var out, i, len, c;
    var char2, char3;

    out = "";
    len = array.length;
    i = 0;
    while (i < len) {
      c = array[i++];
      switch (c >> 4) {
        case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
          // 0xxxxxxx
          out += String.fromCharCode(c);
          break;
        case 12: case 13:
          // 110x xxxx   10xx xxxx
          char2 = array[i++];
          out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
          break;
        case 14:
          // 1110 xxxx  10xx xxxx  10xx xxxx
          char2 = array[i++];
          char3 = array[i++];
          out += String.fromCharCode(((c & 0x0F) << 12) |
            ((char2 & 0x3F) << 6) |
            ((char3 & 0x3F) << 0));
          break;
      }
    }

    return out;
  }

  public static getQueryVariable(variable: string): string {
    if (window.location.search && window.location.search != "") {
      var query: string = window.location.search.substring(1);

      // const flag: string = "?&";
      // let idx: number = window.location.search.lastIndexOf(flag);
      // if (idx > 0) {
      //   query = window.location.search.substring(1, idx);
      // }

      var vars: string[] = query.split("&");
      for (var i = 0; i < vars.length; i++) {
        var pair: string[] = vars[i].split("=");
        if (pair[0] == variable) {
          return pair[1];
        }
      }
    }
    if (window.location.hash && window.location.hash != "") {
      var query: string = window.location.hash.substring(1);

      // const flag: string = "?&";
      // let idx: number = window.location.hash.lastIndexOf(flag);
      // if (idx > 0) {
      //   query = window.location.hash.substring(1, idx);
      // }

      var vars: string[] = query.split("&");
      for (var i = 0; i < vars.length; i++) {
        var pair: string[] = vars[i].split("=");
        if (pair[0] == variable) {
          return pair[1];
        }
      }
    }
    return null;
  }

  public static getParamVariable(variable: string): string {
    let paramStr: string = Utils.getQueryVariable("param");
    if (paramStr && paramStr != "") {
      paramStr = decodeURIComponent(paramStr);
      try {
        let param: any = JSON.parse(paramStr);
        if (param) {
          return param[variable];
        }
      } catch (err) { }
    }
    return null;
  }

  public static setParamVariable(key: string, value: string): void {
    let paramStr: string = Utils.getQueryVariable("param");
    const flag: string = "";
    let param: any = {};
    if (paramStr && paramStr != "") {
      paramStr = decodeURIComponent(paramStr);
      try {
        param = JSON.parse(paramStr);
      } catch (err) { }
    }
    param[key] = value;
    paramStr = JSON.stringify(param);

    if (cc.sys.os == cc.sys.OS_ANDROID) {
      history.replaceState({}, "", flag + "?param=" + encodeURI(paramStr));
    } else {
      window.location.hash = flag + "param=" + encodeURI(paramStr);
      console.log(window.location.hash);

    }
  }

  public static setStrClipboard(input: string): boolean {
    if (cc.sys.isBrowser) {
      const el = document.createElement('textarea');

      el.value = input;

      // Prevent keyboard from showing on mobile
      el.setAttribute('readonly', '');

      // el.style.contain = 'strict';
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      el.style.fontSize = '12pt'; // Prevent zooming on iOS

      let selection = document.getSelection();
      let originalRange = null;
      if (selection.rangeCount > 0) {
        originalRange = selection.getRangeAt(0);
      }

      document.body.appendChild(el);
      el.select();

      // Explicit selection workaround for iOS
      el.selectionStart = 0;
      el.selectionEnd = input.length;

      let success = false;
      try {
        success = document.execCommand('copy');
      } catch (err) { }

      document.body.removeChild(el);

      if (originalRange) {
        selection.removeAllRanges();
        selection.addRange(originalRange);
      }
      return success;
    }
  }

  public static deepCopy(p: any, c: any) {
    for (var i in p) {
      if (!p.hasOwnProperty(i)) {
        continue;
      }
      if (typeof p[i] === 'object') {
        c[i] = (p[i].constructor === Array) ? [] : {};
        Utils.deepCopy(p[i], c[i]);
      } else {
        c[i] = p[i];
      }
    }
    return c;
  }

  /////////////////////////////////
  public static removeDOMElement(elementId: string): void {
    var list = document.getElementById(elementId);
    if (list) {
      list.parentNode.removeChild(list);
    }
  }

  public static addDateFormat(): void {
    Date.prototype['format'] = function (fmt) {
      var o = {
        "M+": this.getMonth() + 1,                 //月份 
        "d+": this.getDate(),                    //日 
        "h+": this.getHours(),                   //小时 
        "m+": this.getMinutes(),                 //分 
        "s+": this.getSeconds(),                 //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds()             //毫秒 
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      }
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
      }
      return fmt;
    }
  }

  public static getDeviceID(): string {
    var deviceid = cc.sys.localStorage.getItem(GlobalVal.GAME_NAME + "_device_id");
    if (!deviceid || deviceid == undefined) {
      if (cc.sys.isNative) {
        cc.log("java生成机器码", null);
      }
      deviceid = this.uuidInt();
      cc.sys.localStorage.setItem(GlobalVal.GAME_NAME + "_device_id", deviceid);
    }
    cc.log("deviceID:" + deviceid, null);
    return deviceid;
  }

  static find(node: cc.Node, name: string): cc.Node {
    let child: cc.Node = node.getChildByName(name);
    if (child != null) return child;

    for (let i = 0; i < node.childrenCount; i++) {
      child = this.find(node.children[i], name);
      if (child != null) return child;
    }

    return null;
  }

  static uuidInt():number {
    return Math.floor(Math.random() * 2000000000);
  }

  //uuid(32,16);//生成32位长度的基数为16进制的uuid
  static uuid(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;

    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
      // rfc4122, version 4 form
      var r;

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }

    return uuid.join('');
  }

  static getIP(): string {
    return "127.0.0.1";
  }

  /**
   * 状态位操作数数组
   */
  static OPTR_ARRAY: number[] = [
    1, 1 << 1, 1 << 2, 1 << 3, 1 << 4, 1 << 5, 1 << 6, 1 << 7, 1 << 8, 1 << 9, 1 << 10, 1 << 11, 1 << 12, 1 << 13, 1 << 14, 1 << 15, 1 << 16
    , 1 << 17, 1 << 18, 1 << 19, 1 << 20, 1 << 21, 1 << 22, 1 << 23, 1 << 24, 1 << 25, 1 << 26, 1 << 27, 1 << 28, 1 << 29, 1 << 30, 1 << 31
  ];

  /**
   * 状态位操作数数组长度
   */
  static OPTR_ARRAY_LEN: number = 32;

  static checkBitFlag(value: number, index: number): boolean {
    const value2 = this.OPTR_ARRAY[index];
    return (value & this.OPTR_ARRAY[index]) != 0;
  }

  static setBitValue(value: number, index: number): number {
    return value | this.OPTR_ARRAY[index];
  }

  static resetBitValue(value: number, index: number): number {
    return value & (~this.OPTR_ARRAY[index]);
  }




  /**
   * 检测节点是否在屏幕之外
   * @param node 
   * @param offset 
   */
  static isOutOfScreen(node: cc.Node, offset?: cc.Vec2): boolean {
    offset = offset || cc.Vec2.ZERO_R;

    let worldOriginPos = this.getWorldOriginPos(node);
    return worldOriginPos.x + offset.x > cc.winSize.width || worldOriginPos.x + (node.width * node.scaleX) + offset.y < 0;
  }

  private static tempPos: cc.Vec2 = cc.Vec2.ZERO;
  /**
   * 获取节点左下角局部坐标
   * @param node 
   */
  static getLocalOriginPos(node: cc.Node): cc.Vec2 {
    Utils.tempPos.x = - node.anchorX * node.width;
    Utils.tempPos.y = - node.anchorY * node.height;
    return Utils.tempPos;
  }

  /**
   * 获取节点左下角世界坐标
   * @param node 
   */
  static getWorldOriginPos(node: cc.Node): cc.Vec2 {
    let localPos = this.getLocalOriginPos(node);
    return node.convertToWorldSpaceAR(localPos);
  }

  /**
   * 获取今天零点时间(s)
   * @returns 
   */
  static getTodayStartTime(): number {
    return new Date(new Date(GlobalVal.getServerTime()).toLocaleDateString()).getTime() * 0.001;
  }

  /**返回0点时间戳 */
  static zerobasetimes(time:number):number {
    let date:Date = new Date(time);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    return  Math.floor(date.getTime() * 0.001);

  }

  /**
   * 两个时间戳相差的天数
   * @param time1 毫秒
   * @param time2 
   * @returns 
   */
  static getDiffDay(time1:number , time2:number):number {
    let zeroTime1 = this.zerobasetimes(time1);
    let zeroTime2 = this.zerobasetimes(time2);
    return Math.abs(zeroTime1 - zeroTime2) / (24 * 60 * 60);
  }

  /**
   * time是否是今日时间
   * @param time (s)
   * @returns 
   */
  static isTimeInToday(time: number): boolean {
    let todayStartTime = Utils.getTodayStartTime();
    let todayEndTime = todayStartTime + 24 * 60 * 60 - 1;
    return time >= todayStartTime && time < todayEndTime;
  }

  static copyMsgObjPro(a: any, b: any) {
    for (const key in b) {
      if (Object.prototype.hasOwnProperty.call(b, key) && key != 'protoList') {
        a[key] = b[key];
      }
    }
  }

  static isSameList(a: any[], b: any[]): boolean {
    if (a == null && b == null) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;
    let len = a.length;
    for (let i = 0; i < len; i++) {
      if (a[i] != b[i]) {
        return false;
      }
    }
    return true;
  }

  static removeFromArray(arr: any[], item: any): boolean {
    let index = arr.indexOf(item);
    if (index != -1) {
      arr.splice(index, 1);
      return true;
    }
    return false;
  }

  public static save(fileName, data) {
    if (!(data instanceof Array)) {
      data = [data];
    }
    var blob = new Blob(data);
    var URL = window.URL || window.webkitURL;
    var bloburl = URL.createObjectURL(blob);
    var anchor = document.createElement("a");
    if ('download' in anchor) {
      anchor.style.visibility = "hidden";
      anchor.href = bloburl;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      var evt = document.createEvent("MouseEvents");
      evt.initEvent("click", true, true);
      anchor.dispatchEvent(evt);
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(anchor.href);
    }
  }
}
