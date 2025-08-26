import GlobalVal from "../GlobalVal";


export class UTF8 {
    private encoderError(code_point) {
        console.error("UTF8 encoderError", code_point)
    }
    private decoderError(fatal, opt_code_point?): number {
        if (fatal) console.error("UTF8 decoderError", opt_code_point)
        return opt_code_point || 0xFFFD;
    }
    private inRange(a: number, min: number, max: number) {
        return min <= a && a <= max;
    }
    private div(n: number, d: number) {
        return Math.floor(n / d);
    }

    stringToCodePoints(string: string) {
        /** @type {Array.<number>} */
        let cps = [];
        // Based on http://www.w3.org/TR/WebIDL/#idl-DOMString
        let i = 0, n = string.length;
        while (i < string.length) {
            let c = string.charCodeAt(i);
            if (!this.inRange(c, 0xD800, 0xDFFF)) {
                cps.push(c);
            } else if (this.inRange(c, 0xDC00, 0xDFFF)) {
                cps.push(0xFFFD);
            } else { // (inRange(c, 0xD800, 0xDBFF))
                if (i == n - 1) {
                    cps.push(0xFFFD);
                } else {
                    let d = string.charCodeAt(i + 1);
                    if (this.inRange(d, 0xDC00, 0xDFFF)) {
                        let a = c & 0x3FF;
                        let b = d & 0x3FF;
                        i += 1;
                        cps.push(0x10000 + (a << 10) + b);
                    } else {
                        cps.push(0xFFFD);
                    }
                }
            }
            i += 1;
        }
        return cps;
    }

    encode(str: string): Uint8Array {
        let pos: number = 0;
        let codePoints = this.stringToCodePoints(str);
        let outputBytes = [];

        while (codePoints.length > pos) {
            let code_point: number = codePoints[pos++];

            if (this.inRange(code_point, 0xD800, 0xDFFF)) {
                this.encoderError(code_point);
            }
            else if (this.inRange(code_point, 0x0000, 0x007f)) {
                outputBytes.push(code_point);
            } else {
                let count = 0, offset = 0;
                if (this.inRange(code_point, 0x0080, 0x07FF)) {
                    count = 1;
                    offset = 0xC0;
                } else if (this.inRange(code_point, 0x0800, 0xFFFF)) {
                    count = 2;
                    offset = 0xE0;
                } else if (this.inRange(code_point, 0x10000, 0x10FFFF)) {
                    count = 3;
                    offset = 0xF0;
                }

                outputBytes.push(this.div(code_point, Math.pow(64, count)) + offset);

                while (count > 0) {
                    let temp = this.div(code_point, Math.pow(64, count - 1));
                    outputBytes.push(0x80 + (temp % 64));
                    count -= 1;
                }
            }
        }
        return new Uint8Array(outputBytes);
    }
}

export class StringUtils {

    static dayTime = 86400;

    /*
    **
    * 替换format字符串中的所有 %s
    * 例如 printf('hello, %s!', 'dj') ==> 'hello, dj!'
    */
    static format(format: string, ...params): string {
        var str: string = '';
        var subs: Array<string> = format.split(/%s/);
        if (subs.length == 1) return format;
        var last: string = subs.pop();
        if (last != '') {
            subs.push(last);
        }

        let len: number = subs.length < params.length ? subs.length : params.length;
        let i = 0;
        for (i = 0; i < len; ++i) {
            str += subs[i] + params[i];
        }

        if (subs.length > len) {
            i = len;
            len = subs.length;
            for (; i < len; ++i) {
                str += subs[i];
            }
        }

        return str;
    }

    /**
     * 指定格式获取富文本
     * @param format 
     * @param formatStrColor 
     * @param paramas 
     * @param paramaColors 
     */
    static richTextFormat(format: string,
        formatStrColor: string = "#ffffff",
        params: Array<string> = [],
        paramColors: Array<string> = []) {
        var str: string = '';
        var subs: Array<string> = format.split(/%s/);
        if (subs.length == 1) return StringUtils.richTextColorFormat(format, formatStrColor);
        var last: string = subs.pop();
        if (last != '') {
            subs.push(last);
        }

        let len: number = subs.length < params.length ? subs.length : params.length;
        let i = 0;
        for (i = 0; i < len; ++i) {
            str += StringUtils.richTextColorFormat(subs[i], formatStrColor) + StringUtils.richTextColorFormat(params[i], paramColors[i]);
        }

        if (subs.length > len) {
            i = len;
            len = subs.length;
            for (; i < len; ++i) {
                str += StringUtils.richTextColorFormat(subs[i], formatStrColor);
            }
        }

        return str;
    }

    /**
     * 获取指定颜色富文本
     * @param text 
     * @param color 
     * @returns 
     */
    static richTextColorFormat(text: string = "", color: string = "#ffffff"): string {
        return "<color=" + color + ">" + text + "</color>";
    }

    static richTextSizeFormat(text: string = "", size: number = 24): string {
        return "<size=" + size + ">" + text + "</s>";
    }

    static richTextEventFormat(text: string = "", funcName: string): string {
        return "<on click='" + funcName + "'>" + text + "</on>";
    }

    /**
     * 忽略大小字母比较字符是否相等;   
     * */
    static equalsIgnoreCase(char1: string, char2: string): boolean {
        return char1.toLowerCase() == char2.toLowerCase();
    }

    private static patternrtrim: RegExp = /\s*$/;

    /**
     * 比较字符是否相等;   
     * */
    static equals(char1: string, char2: string): boolean {
        return char1 == char2;
    }

    private static patternltrim: RegExp = /^\s*/;

    /**
     * 去左右空格;   
     * */
    static trim(char: string): string {
        if (char == null) {
            return null;
        }
        return StringUtils.rtrim(StringUtils.ltrim(char));
    }

    /**
     * 去左空格;    
     * */
    static ltrim(char: string): string {
        if (char == null) {
            return null;
        }

        return char.replace(StringUtils.patternltrim, "");
    }
    /**
     * 去右空格;   
     * */
    static rtrim(char: string): string {
        if (char == null) {
            return null;
        }

        return char.replace(StringUtils.patternrtrim, "");
    }

    private static patternctrim: RegExp = /\s+/g;
    static ctrim(char:string) :string {
        if (char == null) {
            return null;
        }

        return char.replace(this.patternctrim, "");
    }

    /**
     * 是否是数值字符串;   
     * */
    static isNumber(char: string): boolean {
        if (char == null) {
            return false;
        }
        return !isNaN(parseInt(char));
    }

    /**
     * 替换指定位置字符;   
     * */
    static replaceAt(char: string, value: string, beginIndex: number, endIndex: number): string {
        beginIndex = Math.max(beginIndex, 0);
        endIndex = Math.min(endIndex, char.length);
        var firstPart: String = char.substr(0, beginIndex);
        var secondPart: String = char.substr(endIndex, char.length);
        return (firstPart + value + secondPart);
    }


    /**
     * 删除指定位置字符;   
     * */
    static removeAt(char: string, beginIndex: number, endIndex: number): string {
        return StringUtils.replaceAt(char, "", beginIndex, endIndex);
    }

    /**替换 */
    static replace(char: string, replace: string, replaceWith: string): string {
        return char.split(replace).join(replaceWith);
    }

    /**移除 */
    static remove(input: string, remove: string): String {
        return StringUtils.replace(input, remove, "");
    }

    static startsWith(source: string, starts: string): boolean {
        if (!source || !starts)
            return false;
        return source.search(starts) == 0;
    }

    static isNilOrEmpty(s: string): boolean {
        return s == null || s == undefined || s == "" || s == "null";
    }

    /**富文本 颜色 */
    static fontColor(info: string, color: string): string {
        return "<color=" + color + ">" + info + "</color>";
    }

    /**富文本 颜色 */
    static changeFontColor(info: string, color: string): string {
        const rg = /<color=.+?>/g
        return info.replace(rg, "<color=" + color + ">");
    }

    /**
     * 通过时间获取时分秒（一般用来做倒计时）
     * @param time 时间(单位秒)
     * @param split 分割符（默认":"）
     */
    static doInverseTime(time: number, split: string = ':'): string {
        var str: string = "";
        time = Math.ceil(time);
        let hours: number;
        var second: number;
        var minute: number;
        if (time <= 0) {
            str = "00" + split + "00";
        }
        else {
            second = time % 60;
            minute = time % (60 * 60);
            minute = Math.floor(minute / 60);
            hours = Math.floor(time / (60 * 60));
            if (hours > 0) {
                str += StringUtils.formatZero(hours, 2) + split;
            }

            str += StringUtils.formatZero(minute, 2) + split + StringUtils.formatZero(second, 2);
        }
        return str;
    }

    static doInverseTime2(time: number , formatStr:string = "%s 分 %s 秒"): string {
        var str: string = "";
        time = Math.ceil(time);
        var second: number;
        var minute: number;
        if (time <= 0) {
            str = this.format(formatStr , '00' , '00');
        }
        else {
            second = time % 60;
            minute = Math.floor(time / 60);
            str = this.format(formatStr , this.formatZero(minute, 2) , this.formatZero(second, 2));
        }
        return str;
    }

    /**
     * 将Date默认格式化为  “2000年1月1日00:00:00的形式”
     * @param time 时间戳(单位秒)
     * @param splite  分隔符
     * @param yearAbbr 年是否缩写 2022 -> 22
     */
    static formateTimeTo(time: number, splite: string = '' , yearAbbr:boolean = false): string {
        var date: Date = new Date();
        date.setTime(time * 1000);
        var hour: number = date.getHours();
        var minute: number = date.getMinutes();
        var second: number = date.getSeconds();
        var hourStr: string = (hour < 10) ? "0" + hour : hour + '';
        var minuteStr: string = (minute < 10) ? "0" + minute : minute + '';
        var secondStr: string = (second < 10) ? "0" + second : second + '';
        var year = date.getFullYear();
        if (yearAbbr) {
            year %= 100;
        }
        if (splite == '') {
            return year + StringUtils.getNianStr() + (date.getMonth() + 1) + StringUtils.getYueStr() + date.getDate() + StringUtils.getRiStr() + " "
                + hourStr + ":" + minuteStr + ":" + secondStr;
        }
        else {
            return year + splite + (date.getMonth() + 1) + splite + date.getDate() + " "
                + hourStr + ":" + minuteStr + ":" + secondStr;
        }
        //return "";
    }

    /**
    * 将时间转化为“01:00”的形式(time单位为毫秒)
    * @param time 
    */
    static formatTimeToMFromMs(time: number): string {
        var date: Date = new Date();
        date.setTime(time);
        var hour: number = date.getHours();
        var minute: number = date.getMinutes();
        var miao: number = date.getSeconds();
        var hourStr: string = (hour < 10) ? "0" + hour : hour + '';
        var minuteStr: string = (minute < 10) ? "0" + minute : minute + '';
        var miaoStr: string = (miao < 10) ? "0" + miao : miao + '';
        return hourStr + ":" + minuteStr + ":" + miaoStr;
    }

    
    static formatTimeToDH(time: number): string {
        if (time < 0) time = 0;
        time = Math.round(time);
        var str: string = "";
        var day: number;
        var minute: number;
        var hour: number;

        day = Math.floor(time / StringUtils.dayTime);
        hour = Math.floor((time % StringUtils.dayTime) / 3600);
        minute = Math.floor((time % 3600) / 60);

        str = day + "天";
        str += (hour < 10 ? "0" + hour : hour) + "时";

        return str;
    }


    static formatTimeToDHM(time: number): string {
        if (time < 0) time = 0;
        time = Math.round(time);
        var str: string = "";
        var day: number;
        var minute: number;
        var hour: number;

        day = Math.floor(time / StringUtils.dayTime);
        hour = Math.floor((time % StringUtils.dayTime) / 3600);
        minute = Math.floor((time % 3600) / 60);

        str = day + "天";
        str += (hour < 10 ? "0" + hour : hour) + "时";
        str += (minute < 10 ? "0" + minute : minute) + "分";

        return str;
    }

    static formatTimeToHM(time: number): string {
        if (time < 0) time = 0;
        time = Math.round(time);
        var str: string = "";
        var minute: number;
        var hour: number;
        hour = Math.floor(time / 3600);
        minute = Math.floor((time % 3600) / 60);

        str += (hour < 10 ? "0" + hour : hour) + "时";
        str += (minute < 10 ? "0" + minute : minute) + "分";

        return str;
    }

    static formatTimeAuto(time:number):string {
        if (time < 3600) {
            return this.doInverseTime2(time);
        } 
        return this.formatTimeToHM(time);
    }

    /**
     * 00天00时00分00秒
     * @param time (s)
     * @returns 
     */
    static formatTimeToDHMS(time: number , splite: string = ''): string {
        time = Math.round(time);
        if (time < 0) time = 0;
        var str: string = "";
        var day: number = 0;
        var minute: number = 0;
        var hour: number = 0;
        let second: number = 0;

        day = Math.floor(time / StringUtils.dayTime);
        hour = Math.floor((time % StringUtils.dayTime) / 3600);
        minute = Math.floor((time % 3600) / 60);
        second = time % 60;

        str = day + splite + "天" + splite;
        str += this.fix0(hour, 2) + splite + "时" + splite;
        str += this.fix0(minute, 2) + splite + "分" + splite;
        str += this.fix0(second, 2) + splite + "秒" + splite;
        return str;
    }

    static formatTimeToDHMS2(time: number):string {
        time = Math.round(time);
        if (time < 0) return "00分00秒";
        if (time > StringUtils.dayTime) return this.formatTimeToDH(time);
        if (time > 3600) return this.formatTimeToHM(time);
        return this.doInverseTime2(time , "%s分%秒");

    }

    static fix0(num: number, length: number) {
        return (Array(length).join('0') + num).slice(-length);
    }

    static GetLength(str) {
        ///<summary>获得字符串实际长度，中文2，英文1</summary>
        ///<param name="str">要获得长度的字符串</param>
        var realLength = 0, len = str.length, charCode = -1;
        for (var i = 0; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128) realLength += 1;
            else realLength += 2;
        }
        return realLength;
    };

    //js截取字符串，中英文都能用  
    //如果给定的字符串大于指定长度，截取指定长度返回，否者返回源字符串。  
    //字符串，长度  
    /** 
     * js截取字符串，中英文都能用 
     * @param str：需要截取的字符串 
     * @param len: 需要截取的长度 
     */
    static cutstr(str: string, len: number): string {
        var str_length: number = 0;
        var str_len: number = 0;
        var str_cut: string = "";
        str_len = str.length;
        for (var i = 0; i < str_len; i++) {
            var a = str.charAt(i);
            str_length++;
            if (escape(a).length > 4) {
                //中文字符的长度经编码之后大于4  
                str_length++;
            }
            str_cut = str_cut.concat(a);
            if (str_length >= len) {
                str_cut = str_cut.concat("..");
                return str_cut;
            }
        }
        //如果给定字符串小于指定长度，则返回源字符串；  
        if (str_length < len) {
            return str;
        }
    }

    static getShowName(name: string, len: number = 8): string {
        return this.cutstr(name, len);
    }

    /**转换成中文数字 */
    private static cnNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
    static num2Cn1(value: number): string {
        if (value <= 10 && value >= 0) {
            return this.cnNum[value];
        }
        return value + '';
    }

    static getNianStr(): string { return "年" };
    static getYueStr(): string { return "月" };
    static getRiStr(): string { return "日" };

    private static utf8: UTF8 = new UTF8();
    static encode(str: string): Uint8Array {
        return StringUtils.utf8.encode(str);
    }

    static formatNum(num: number): string {
        if (num >= 1000000) {
            const divided = num / 1000000;
            // 判断是否为整数，整数则不显示小数点
            if (Number.isInteger(divided)) {
                return divided.toString() + 'M';
            } else {
                return divided.toFixed(1) + 'M';
            }
        } else  if (num >= 1000) {
            const divided = num / 1000;
            // 判断是否为整数，整数则不显示小数点
            if (Number.isInteger(divided)) {
                return divided.toString() + 'K';
            } else {
                return divided.toFixed(1) + 'K';
            }
        }

        return num.toString();
    }

    /**
         * 添加新字符到指定位置;          
         * */
    static addAt(char: string, value: string, position: number): string {
        if (position > char.length) {
            position = char.length;
        }
        var firstPart: String = char.substring(0, position);
        var secondPart: String = char.substring(position, char.length);
        return (firstPart + value + secondPart);
    }

    static formatNum2(num: number): string {
        let tempStr: string = num.toString();
        let str: string = tempStr;
        for (let i = tempStr.length - 3; i > 0; i -= 3) {
            str = this.addAt(str, ',', i);
        }
        return str;
    }



    /**把字符串分割成 key-value */
    static splitToDic(s: string, p: string = ";", e: string = "=") {
        let rzt: any = {}
        let list: string[] = s.split(p);
        for (let i = 0; i < list.length; i++) {
            let data = list[i].split(e);
            if (data.length == 2) {
                rzt[data[0]] = data[1];
            }
        }
        return rzt;
    }
    static merge2String(o: any, p: string = ";", e: string = "="): string {
        let rzt = "";
        if (o != null) {
            Object.keys(o).forEach(key => {
                rzt += key + e + encodeURI(o[key]) + p;
            });
            if (rzt != "") {
                rzt = rzt.substr(0, rzt.lastIndexOf(p));
            }
        }
        return rzt;
    }

    private static cutZero(num: string): string {
        let num1 = Number(num)
        let num2: number = Math.floor(num1);
        return num1 > num2 ? num : num2 + "";
    }

    /**
     * 获取明天00:00:00时的时间戳
     */
    public static getTimesByDay(): number {
        let date = new Date();
        // date.setDate(date.getDate() + 1);
        let times = new Date(date.toLocaleDateString()).getTime();
        return times + 24 * 60 * 60 * 1000;
    }

    /**
     * 获取下周一00:00:00时的时间戳
     */
    public static getTimesByWeek(): number {
        let date = new Date(GlobalVal.getServerTime());
        let day = date.getDay();
        // let addDay = (7 - weekDay) % 7 + 1;
        date.setDate(date.getDate() - (day ? day : 7) + 1);
        let times = new Date(date.toLocaleDateString()).getTime();
        return times + 7 * 24 * 60 * 60 * 1000;
    }

    /**
     * 获取下个月一日00:00:00时的时间戳
     */
    public static getTimesByMonth(): number {
        let date = new Date(GlobalVal.getServerTime());
        let month = date.getMonth();
        date.setDate(1);
        date.setMonth((month + 1 % 12));
        let times = new Date(date.toLocaleDateString()).getTime();
        return times;
    }

    /**
     * 获取当前月份一日00:00:00时的时间戳
     * @returns 
     */
    public static getCurrMonthTimes(): number {
        let date = new Date(GlobalVal.getServerTime());
        date.setDate(1);
        let times = new Date(date.toLocaleDateString()).getTime();
        return times;
    }

    /**
     * 指定位数len显示数字,不足补0
     * @param num 
     * @param len 
     */
    public static formatZero(num, len) {
        if (String(num).length > len) return num;
        return (Array(len).join("0") + num).slice(-len);
    }

    /**
     * （分、时、天）
     * @param time 秒
     */
    public static getCeilTime(time: number): string {
        //分
        let m = Math.floor(time / 60);
        if (m <= 0) return "1 分钟";
        else if (m < 60) return m + " 分钟";
        let h = Math.floor(m / 60);
        if (h <= 0) return "1 小时";
        else if (h < 24) return h + " 小时"
        let d = Math.floor(h / 24);
        if (d <= 0) return "1 天";
        else {
            return d + " 天";
        }
    }

    /**
     * 根据服务器下发的好友最后登录日期计算出显示内容
       如果最后登录日期与当前日期相同，则显示“今日”
       如果最后登录日期与当前日期相差1天，则显示“1日前”以此类推
       如果最后登录日期与当前日期相差30天以上，则统一显示为“1个月前”
     */
    public static getLastLoginTime(time: number): string {
        //分
        let m = Math.floor(time / 60);
        if (m <= 0) return "1 分钟";
        else if (m < 60) return m + " 分钟";
        let h = Math.floor(m / 60);
        if (h <= 0) return "1 小时";
        else if (h < 24) return h + " 小时"
        let d = Math.floor(h / 24);
        if (d <= 0) return "1 天";
        else {
            return d + " 天";
        }
    }


    private static filterStrs:string[] = ["&"];
    private static filterStr1: RegExp = /[\&\@\#\$\_\-\+\(\)\/\*\"\'\:\;\!\?ɑː ɔ: ɜː i: u: ʌ ɒ ə ɪ ʊ e æあいうえおぁぃぅぇぉかきくけこがぎぐげごさすしせそずざじぜたぞちだつとてどぢでづぬっになひねはのばふほへぼびべぶぷぴむぽみまゆめやもょよゅゃれらるりんわをゎアエウイオゥァィェキォカコクガケゴギゲグスサセシズジソスザツダトテドヂデヅヌッニナヒネハノバフホヘビボブベペピプパムポミマユメヤモョヨュャレラルリロンワヲヮ♂♀฿¢¢£¿€&✔✘？ё☞☜\^O\^\^‖☆\$か♞★♛℡♀◎囍♬]/g;
    static filterCensorWords(value:string):string {
        if (this.isNilOrEmpty(value)) return "";
        value = this.trim(value);
        value = this.ctrim(value);
        value = value.replace(this.filterStr1 , '');
        return value;
    } 
}