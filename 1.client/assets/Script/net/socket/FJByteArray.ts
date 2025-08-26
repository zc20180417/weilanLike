import Long from "./Long";
import { UTF8 } from "../../utils/StringUtils";

export class Endian {
    public static LITTLE_ENDIAN = "littleEndian";
    public static BIG_ENDIAN = "bigEndian";
}

export class ByteArray {
    private bufferExtSize:number = 0;
    private EOF_byte:number = 0;
    private EOF_code_point:number = 0;
    private write_position:number = 0;
    private data:DataView;
    private _position:number = 0;
    private _bytes:Uint8Array;
    private _endian = Endian.LITTLE_ENDIAN;
    private _endian2 = 0;
    private _buffer:ArrayBuffer;

    constructor(buffer:ArrayBuffer,bufferExtSize?:number) {
        if (bufferExtSize === void 0) { bufferExtSize = 0; }
        this.bufferExtSize = 0; //Buffer expansion size
        this.EOF_byte = -1;
        this.EOF_code_point = -1;
        if (bufferExtSize < 0) {
            bufferExtSize = 0;
        }
        this.bufferExtSize = bufferExtSize;
        var bytes, wpos = 0;
        if (buffer) {
            var uint8 = void 0;
            if (buffer instanceof Uint8Array) {
                uint8 = buffer;
                wpos = buffer.length;
            }
            else {
                wpos = buffer.byteLength;
                uint8 = new Uint8Array(buffer);
            }
            if (bufferExtSize == 0) {
                bytes = new Uint8Array(wpos);
            }
            else {
                var multi = (wpos / bufferExtSize | 0) + 1;
                bytes = new Uint8Array(multi * bufferExtSize);
            }
            bytes.set(uint8);
        }
        else {
            bytes = new Uint8Array(bufferExtSize);
        }
        this.write_position = wpos;
        this._position = 0;
        this._bytes = bytes;
        this.data = new DataView(bytes.buffer);
    }

    public get endian():string {
        return this._endian2 == 0 /* LITTLE_ENDIAN */ ? Endian.LITTLE_ENDIAN : Endian.BIG_ENDIAN;
    }

    public set endian(value:string) {
        this._endian2 = value == Endian.LITTLE_ENDIAN ? 0 : 1;
    }

    public setArrayBuffer(buffer) {

    }

    /** 可读的剩余字节数 */
    public get readAvailable():number {
        return this.write_position - this._position
    }

    public get buffer():ArrayBuffer {
        return this.data.buffer.slice(0, this.write_position)
    }

    public set buffer(value) {
        var wpos = value.byteLength;
        var uint8 = new Uint8Array(value);
        var bufferExtSize = this.bufferExtSize;
        var bytes;
        if (bufferExtSize == 0) {
            bytes = new Uint8Array(wpos);
        }
        else {
            var multi = (wpos / bufferExtSize | 0) + 1;
            bytes = new Uint8Array(multi * bufferExtSize);
        }
        bytes.set(uint8);
        this.write_position = wpos;
        this._bytes = bytes;
        this.data = new DataView(bytes.buffer);
    }

    public get rawBuffer():ArrayBuffer {
        return this.data.buffer;
    }

    public get bytes():Uint8Array {
        return this._bytes;
    }

    public get dataView():DataView {
        return this.data;
    }

    public set dataView(value:DataView) {
        this.buffer = value.buffer;
    }

    public get bufferOffset():number {
        return this.data.byteOffset;
    }

    /**
     * 将文件指针的当前位置（以字节为单位）移动或返回到 ByteArray 对象中。下一次调用读取方法时将在此位置开始读取，或者下一次调用写入方法时将在此位置开始写入。
    */
    public get position():number {
        return this._position;
    }

    public set position(value:number) {
        this._position = value;
        if (value > this.write_position) {
            this.write_position = value;
        }
    }

     /**
     * ByteArray 对象的长度（以字节为单位）。
     * 如果将长度设置为大于当前长度的值，则用零填充字节数组的右侧。
     * 如果将长度设置为小于当前长度的值，将会截断该字节数组。
     */
    public get length():number {
        return this.write_position;
    }

    public set length(value:number) {
        this.write_position = value;
        if (this.data.byteLength > value) {
            this._position = value;
        }
        this._validateBuffer(value);
    }

    public _validateBuffer(value:number) {
        if (this.data.byteLength < value) {
            var be = this.bufferExtSize;
            var tmp = void 0;
            if (be == 0) {
                tmp = new Uint8Array(value);
            }
            else {
                var nLen = ((value / be >> 0) + 1) * be;
                tmp = new Uint8Array(nLen);
            }
            tmp.set(this._bytes);
            this._bytes = tmp;
            this.data = new DataView(tmp.buffer);
        }
    }
    
    /**
     * 可从字节数组的当前位置到数组末尾读取的数据的字节数。
     * 每次访问 ByteArray 对象时，将 bytesAvailable 属性与读取方法结合使用，以确保读取有效的数据。
     */
    public get bytesAvailable():number {
        return this.data.byteLength - this._position;
    }

    /**
     * 清除字节数组的内容，并将 length 和 position 属性重置为 0。
     */
    public clear() {
        var buffer = new ArrayBuffer(this.bufferExtSize);
        this.data = new DataView(buffer);
        this._bytes = new Uint8Array(buffer);
        this._position = 0;
        this.write_position = 0;
    }

    public readBoolean():boolean {
        if (this.validate(1 /* SIZE_OF_BOOLEAN */))
            return !!this._bytes[this.position++];  
    }

    protected readByte():number {
        if (this.validate(1 /* SIZE_OF_INT8 */))
            return this.data.getInt8(this.position++);
    }

    public readBytes(bytes:ByteArray, offset:number, length:number) {
        if (offset === void 0) { offset = 0; }
        if (length === void 0) { length = 0; }
        if (!bytes) {
            return;
        }
        var pos = this._position;
        var available = this.write_position - pos;
        if (available < 0) {
            throw RangeError("available < 0")
            return;
        }
        if (length == 0) {
            length = available;
        }
        else if (length > available) {
            throw RangeError("length > available")
            return;
        }
        bytes.validateBuffer(length);
        bytes._bytes.set(this._bytes.subarray(pos, pos + length), 0);
        this.position += length;
    }

    public readDouble():number {
        if (this.validate(8 /* SIZE_OF_FLOAT64 */)) {
            var value = this.data.getFloat64(this._position, this._endian2 == 0 /* LITTLE_ENDIAN */);
            this.position += 8 /* SIZE_OF_FLOAT64 */;
            return value;
        }
    }

    public readFloat():number {
        if (this.validate(4 /* SIZE_OF_FLOAT32 */)) {
            var value = this.data.getFloat32(this._position, this._endian2 == 0 /* LITTLE_ENDIAN */);
            this.position += 4 /* SIZE_OF_FLOAT32 */;
            return value;
        }
    }

    protected readInt():number {
        if (this.validate(4 /* SIZE_OF_INT32 */)) {
            var value = this.data.getInt32(this._position, this._endian2 == 0 /* LITTLE_ENDIAN */);
            this.position += 4 /* SIZE_OF_INT32 */;
            return value;
        }
    }

    protected readShort():number {
        if (this.validate(2 /* SIZE_OF_INT16 */)) {
            var value = this.data.getInt16(this._position, this._endian2 == 0 /* LITTLE_ENDIAN */);
            this.position += 2 /* SIZE_OF_INT16 */;
            return value;
        }
    }

    protected readUnsignedByte():number {
        if (this.validate(1 /* SIZE_OF_UINT8 */))
            return this._bytes[this.position++];
    }

    protected readUnsignedInt():number {
        if (this.validate(4 /* SIZE_OF_UINT32 */)) {
            var value = this.data.getUint32(this._position, this._endian2 == 0 /* LITTLE_ENDIAN */);
            this.position += 4 /* SIZE_OF_UINT32 */;
            return value;
        }
    }

    protected readUnsignedShort() {
        if (this.validate(2 /* SIZE_OF_UINT16 */)) {
            var value = this.data.getUint16(this._position, this._endian2 == 0 /* LITTLE_ENDIAN */);
            this.position += 2 /* SIZE_OF_UINT16 */;
            return value;
        }
    }

    protected readUTF():string {
        var length = this.readUnsignedShort();
        if (length > 0) {
            return this.readUTFBytes(length);
        }
        else {
            return "";
        }
    }

    public readUTFBytes(length:number):string {
        if (!this.validate(length)) {
            return;
        }
        var data = this.data;
        var bytes = new Uint8Array(data.buffer, data.byteOffset + this._position, length);
        this.position += length;
        return this.decodeUTF8(bytes);
    }

    public writeBoolean(value:boolean) {
        this.validateBuffer(1 /* SIZE_OF_BOOLEAN */);
        this._bytes[this.position++] = +value;
    }

    protected writeByte(value:number) {
        this.validateBuffer(1 /* SIZE_OF_INT8 */);
        this._bytes[this.position++] = value & 0xff;
    }

    public writeBytes(bytes, offset, length) {
        if (offset === void 0) { offset = 0; }
        if (length === void 0) { length = 0; }
        var writeLength;
        if (offset < 0) {
            return;
        }
        if (length < 0) {
            return;
        }
        else if (length == 0) {
            writeLength = bytes.length - offset;
        }
        else {
            writeLength = Math.min(bytes.length - offset, length);
        }
        if (writeLength > 0) {
            this.validateBuffer(writeLength);
            this._bytes.set(bytes._bytes.subarray(offset, offset + writeLength), this._position);
            this.position = this._position + writeLength;
        }
    }

    public writeDouble(value:number) {
        this.validateBuffer(8 /* SIZE_OF_FLOAT64 */);
        this.data.setFloat64(this._position, value, this._endian2 == 0 /* LITTLE_ENDIAN */);
        this.position += 8 /* SIZE_OF_FLOAT64 */;
    }

    public writeFloat(value:number) {
        this.validateBuffer(4 /* SIZE_OF_FLOAT32 */);
        this.data.setFloat32(this._position, value, this._endian2 == 0 /* LITTLE_ENDIAN */);
        this.position += 4 /* SIZE_OF_FLOAT32 */;
    }

    protected writeInt(value:number) {
        this.validateBuffer(4 /* SIZE_OF_INT32 */);
        this.data.setInt32(this._position, value, this._endian2 == 0 /* LITTLE_ENDIAN */);
        this.position += 4 /* SIZE_OF_INT32 */;
    }

    protected writeShort(value:number) {
        this.validateBuffer(2 /* SIZE_OF_INT16 */);
        this.data.setInt16(this._position, value, this._endian2 == 0 /* LITTLE_ENDIAN */);
        this.position += 2 /* SIZE_OF_INT16 */;
    }

    protected writeUnsignedInt(value:number) {
        this.validateBuffer(4 /* SIZE_OF_UINT32 */);
        this.data.setUint32(this._position, value, this._endian2 == 0 /* LITTLE_ENDIAN */);
        this.position += 4 /* SIZE_OF_UINT32 */;
    }

    protected writeUnsignedShort(value:number) {
        this.validateBuffer(2 /* SIZE_OF_UINT16 */);
        this.data.setUint16(this._position, value, this._endian2 == 0 /* LITTLE_ENDIAN */);
        this.position += 2 /* SIZE_OF_UINT16 */;
    }

    protected writeUTF(value:string) {
        var utf8bytes = this.encodeUTF8(value);
        var length = utf8bytes.length;
        this.validateBuffer(2 /* SIZE_OF_UINT16 */ + length);
        this.data.setUint16(this._position, length, this._endian2 == 0 /* LITTLE_ENDIAN */);
        this.position += 2 /* SIZE_OF_UINT16 */;
        this._writeUint8Array(utf8bytes, false);
    }

    protected writeUTFBytes(value:string) {
        this._writeUint8Array(this.encodeUTF8(value));
    }

    public toString():string {
        return "[ByteArray] length:" + this.length + ", bytesAvailable:" + this.bytesAvailable;
    }

    private _writeUint8Array(bytes:Uint8Array, validateBuffer?:boolean) {
        if (validateBuffer === void 0) { validateBuffer = true; }
        var pos = this._position;
        var npos = pos + bytes.length;
        if (validateBuffer) {
            this.validateBuffer(npos);
        }
        this.bytes.set(bytes, pos);
        this.position = npos;
    }

    public validate(len:number) {
        var bl = this._bytes.length;
        if (bl > 0 && this._position + len <= bl) {
            return true;
        }
        else {
            throw RangeError("bl > 0 && this._position + len <= bl")
        }
    }

    private validateBuffer(len:number) {
        this.write_position = len > this.write_position ? len : this.write_position;
        len += this._position;
        this._validateBuffer(len);
    }

    private encodeUTF8(str):Uint8Array {
        var pos = 0;
        var codePoints = this.stringToCodePoints(str);
        var outputBytes = [];
        while (codePoints.length > pos) {
            var code_point = codePoints[pos++];
            if (this.inRange(code_point, 0xD800, 0xDFFF)) {
                this.encoderError(code_point);
            }
            else if (this.inRange(code_point, 0x0000, 0x007f)) {
                outputBytes.push(code_point);
            }
            else {
                var count = void 0, offset = void 0;
                if (this.inRange(code_point, 0x0080, 0x07FF)) {
                    count = 1;
                    offset = 0xC0;
                }
                else if (this.inRange(code_point, 0x0800, 0xFFFF)) {
                    count = 2;
                    offset = 0xE0;
                }
                else if (this.inRange(code_point, 0x10000, 0x10FFFF)) {
                    count = 3;
                    offset = 0xF0;
                }
                outputBytes.push(this.div(code_point, Math.pow(64, count)) + offset);
                while (count > 0) {
                    var temp = this.div(code_point, Math.pow(64, count - 1));
                    outputBytes.push(0x80 + (temp % 64));
                    count -= 1;
                }
            }
        }
        return new Uint8Array(outputBytes);
    }

    private decodeUTF8(data:Uint8Array) {
        var fatal = false;
        var pos = 0;
        var result = "";
        var code_point;
        var utf8_code_point = 0;
        var utf8_bytes_needed = 0;
        var utf8_bytes_seen = 0;
        var utf8_lower_boundary = 0;
        while (data.length > pos) {
            var _byte = data[pos++];
            if (_byte == this.EOF_byte) {
                if (utf8_bytes_needed != 0) {
                    code_point = this.decoderError(fatal);
                }
                else {
                    code_point = this.EOF_code_point;
                }
            }
            else {
                if (utf8_bytes_needed == 0) {
                    if (this.inRange(_byte, 0x00, 0x7F)) {
                        code_point = _byte;
                    }
                    else {
                        if (this.inRange(_byte, 0xC2, 0xDF)) {
                            utf8_bytes_needed = 1;
                            utf8_lower_boundary = 0x80;
                            utf8_code_point = _byte - 0xC0;
                        }
                        else if (this.inRange(_byte, 0xE0, 0xEF)) {
                            utf8_bytes_needed = 2;
                            utf8_lower_boundary = 0x800;
                            utf8_code_point = _byte - 0xE0;
                        }
                        else if (this.inRange(_byte, 0xF0, 0xF4)) {
                            utf8_bytes_needed = 3;
                            utf8_lower_boundary = 0x10000;
                            utf8_code_point = _byte - 0xF0;
                        }
                        else {
                            this.decoderError(fatal);
                        }
                        utf8_code_point = utf8_code_point * Math.pow(64, utf8_bytes_needed);
                        code_point = null;
                    }
                }
                else if (!this.inRange(_byte, 0x80, 0xBF)) {
                    utf8_code_point = 0;
                    utf8_bytes_needed = 0;
                    utf8_bytes_seen = 0;
                    utf8_lower_boundary = 0;
                    pos--;
                    code_point = this.decoderError(fatal, _byte);
                }
                else {
                    utf8_bytes_seen += 1;
                    utf8_code_point = utf8_code_point + (_byte - 0x80) * Math.pow(64, utf8_bytes_needed - utf8_bytes_seen);
                    if (utf8_bytes_seen !== utf8_bytes_needed) {
                        code_point = null;
                    }
                    else {
                        var cp = utf8_code_point;
                        var lower_boundary = utf8_lower_boundary;
                        utf8_code_point = 0;
                        utf8_bytes_needed = 0;
                        utf8_bytes_seen = 0;
                        utf8_lower_boundary = 0;
                        if (this.inRange(cp, lower_boundary, 0x10FFFF) && !this.inRange(cp, 0xD800, 0xDFFF)) {
                            code_point = cp;
                        }
                        else {
                            code_point = this.decoderError(fatal, _byte);
                        }
                    }
                }
            }
            //Decode string
            if (code_point !== null && code_point !== this.EOF_code_point) {
                if (code_point <= 0xFFFF) {
                    if (code_point > 0)
                        result += String.fromCharCode(code_point);
                }
                else {
                    code_point -= 0x10000;
                    result += String.fromCharCode(0xD800 + ((code_point >> 10) & 0x3ff));
                    result += String.fromCharCode(0xDC00 + (code_point & 0x3ff));
                }
            }
        }
        return result;
    }

    private encoderError(code_point:number) {
        throw RangeError("encoderError: " + code_point);
    }

    private decoderError(fatal:boolean, opt_code_point?:number) {
        if (fatal) {
            throw RangeError("decoderError: " + opt_code_point);
        }
        return opt_code_point || 0xFFFD;
    }

    private inRange(a:number, min:number, max:number):boolean {
        return min <= a && a <= max;
    }

    private div(n:number, d:number):number {
        return Math.floor(n / d);
    }

    private stringToCodePoints(string:string) {
        /** @type {Array.<number>} */
        var cps = [];
        // Based on http://www.w3.org/TR/WebIDL/#idl-DOMString
        var i = 0, n = string.length;
        while (i < string.length) {
            var c = string.charCodeAt(i);
            if (!this.inRange(c, 0xD800, 0xDFFF)) {
                cps.push(c);
            }
            else if (this.inRange(c, 0xDC00, 0xDFFF)) {
                cps.push(0xFFFD);
            }
            else {
                if (i == n - 1) {
                    cps.push(0xFFFD);
                }
                else {
                    var d = string.charCodeAt(i + 1);
                    if (this.inRange(d, 0xDC00, 0xDFFF)) {
                        var a = c & 0x3FF;
                        var b = d & 0x3FF;
                        i += 1;
                        cps.push(0x10000 + (a << 10) + b);
                    }
                    else {
                        cps.push(0xFFFD);
                    }
                }
            }
            i += 1;
        }
        return cps;
    }

    protected writeLongInt64(value:any) {
        if (isNaN(value)) {
            value = 0;
        }
        this.validateBuffer(8 /* SIZE_OF_INT64 */)
        if (typeof value === 'number')
            value = Long.fromNumber(value);
        else if (typeof value === 'string')
            value = Long.fromString(value);

        var lo = value.low,
            hi = value.high;
        if (this.endian === Endian.LITTLE_ENDIAN) {
            this._bytes[this.position + 3] = (lo >>> 24) & 0xFF;
            this._bytes[this.position + 2] = (lo >>> 16) & 0xFF;
            this._bytes[this.position + 1] = (lo >>> 8) & 0xFF;
            this._bytes[this.position] = lo & 0xFF;
            this.position += 4;
            this._bytes[this.position + 3] = (hi >>> 24) & 0xFF;
            this._bytes[this.position + 2] = (hi >>> 16) & 0xFF;
            this._bytes[this.position + 1] = (hi >>> 8) & 0xFF;
            this._bytes[this.position] = hi & 0xFF;
            this.position += 4;
        } else {
            this._bytes[this.position] = (hi >>> 24) & 0xFF;
            this._bytes[this.position + 1] = (hi >>> 16) & 0xFF;
            this._bytes[this.position + 2] = (hi >>> 8) & 0xFF;
            this._bytes[this.position + 3] = hi & 0xFF;
            this.position += 4;
            this._bytes[this.position] = (lo >>> 24) & 0xFF;
            this._bytes[this.position + 1] = (lo >>> 16) & 0xFF;
            this._bytes[this.position + 2] = (lo >>> 8) & 0xFF;
            this._bytes[this.position + 3] = lo & 0xFF;
            this.position += 4;
        }
        return this;
    }
    
    protected readLongInt64() {
        if (this.validate(8 /* SIZE_OF_INT64 */)){
            var lo = 0,
                hi = 0;
            if (this.endian === Endian.LITTLE_ENDIAN) {
                lo = this._bytes[this.position + 2] << 16;
                lo |= this._bytes[this.position + 1] << 8;
                lo |= this._bytes[this.position];
                lo += this._bytes[this.position + 3] << 24 >>> 0;
                this.position += 4;
                hi = this._bytes[this.position + 2] << 16;
                hi |= this._bytes[this.position + 1] << 8;
                hi |= this._bytes[this.position];
                hi += this._bytes[this.position + 3] << 24 >>> 0;
                this.position += 4;
            } else {
                hi = this._bytes[this.position + 1] << 16;
                hi |= this._bytes[this.position + 2] << 8;
                hi |= this._bytes[this.position + 3];
                hi += this._bytes[this.position] << 24 >>> 0;
                this.position += 4;
                lo = this._bytes[this.position + 1] << 16;
                lo |= this._bytes[this.position + 2] << 8;
                lo |= this._bytes[this.position + 3];
                lo += this._bytes[this.position] << 24 >>> 0;
                this.position += 4;
            }
            var value = new Long(lo, hi, false);
            return value.toNumber();
        }
    }

    protected writeLongUint64(value:any) {
        this.validateBuffer(8/*SIZE_OF_UINT64*/)
        if (typeof value === 'number')
            value = Long.fromNumber(value);
        else if (typeof value === 'string')
            value = Long.fromString(value);
   
        var lo = value.low,
            hi = value.high;
        if (this.endian === Endian.LITTLE_ENDIAN) {
            this._bytes[this.position + 3] = (lo >>> 24) & 0xFF;
            this._bytes[this.position + 2] = (lo >>> 16) & 0xFF;
            this._bytes[this.position + 1] = (lo >>> 8) & 0xFF;
            this._bytes[this.position] = lo & 0xFF;
            this.position += 4;
            this._bytes[this.position + 3] = (hi >>> 24) & 0xFF;
            this._bytes[this.position + 2] = (hi >>> 16) & 0xFF;
            this._bytes[this.position + 1] = (hi >>> 8) & 0xFF;
            this._bytes[this.position] = hi & 0xFF;
            this.position += 4;
        } else {
            this._bytes[this.position] = (hi >>> 24) & 0xFF;
            this._bytes[this.position + 1] = (hi >>> 16) & 0xFF;
            this._bytes[this.position + 2] = (hi >>> 8) & 0xFF;
            this._bytes[this.position + 3] = hi & 0xFF;
            this.position += 4;
            this._bytes[this.position] = (lo >>> 24) & 0xFF;
            this._bytes[this.position + 1] = (lo >>> 16) & 0xFF;
            this._bytes[this.position + 2] = (lo >>> 8) & 0xFF;
            this._bytes[this.position + 3] = lo & 0xFF;
            this.position += 4;
        }
        return this;
    }

    protected readLongUint64() {
        if (this.validate(8 /* SIZE_OF_UINT64 */)) {
            var lo = 0,
                hi = 0;
            if (this.endian === Endian.LITTLE_ENDIAN) {
                lo = this._bytes[this.position + 2] << 16;
                lo |= this._bytes[this.position + 1] << 8;
                lo |= this._bytes[this.position];
                lo += this._bytes[this.position + 3] << 24 >>> 0;
                this.position += 4;
                hi = this._bytes[this.position + 2] << 16;
                hi |= this._bytes[this.position + 1] << 8;
                hi |= this._bytes[this.position];
                hi += this._bytes[this.position + 3] << 24 >>> 0;
                this.position += 4;
            } else {
                hi = this._bytes[this.position + 1] << 16;
                hi |= this._bytes[this.position + 2] << 8;
                hi |= this._bytes[this.position + 3];
                hi += this._bytes[this.position] << 24 >>> 0;
                this.position += 4;
                lo = this._bytes[this.position + 1] << 16;
                lo |= this._bytes[this.position + 2] << 8;
                lo |= this._bytes[this.position + 3];
                lo += this._bytes[this.position] << 24 >>> 0;
                this.position += 4;
            }
            var value = new Long(lo, hi, true);
            return value.toNumber();
        }
    }
}

export default class FJByteArray extends ByteArray {
    public static CreateByteBuffer(buffer?:ArrayBuffer) {
        return new FJByteArray(buffer);
    }

    constructor(buffer:ArrayBuffer,bufferExtSize?:number) {
        super(buffer,bufferExtSize)
        this.endian = Endian.LITTLE_ENDIAN;
    }

    public readInt32():number {
        return this.readInt();
    }

    public readUInt32():number {
        return this.readUnsignedInt();
    }

    public readInt8():number {
        return this.readByte();
    }

    public readUInt8():number {
        return this.readUnsignedByte();
    }

    public readInt16():number {
        return this.readShort();
    }

    public readUInt16():number {
        return this.readUnsignedShort()
    }

    public readInt64():number {
        return this.readLongInt64();
    }

    public readUInt64():number {
        return this.readLongUint64();
    }

    public readString():string {
        return this.readUTF();   
    }

    public readString2():string {
        var pos:number = this.position;
        var len:number = this.getStringLength(this, pos);
        var str:string;
        if (pos + len != this.length) {
            len++;
        }
        str = this.readUTFBytes(len);
        return str;  
    }

    readStCharString(len:number):string {
        let str = '';
        let code = 0;
        for (let i = 0 ; i < len ; i++) {
            code = this.readUInt16();
            if (code == 0 ) {
                this.position += (len - i - 1) * 2;
                break;
            }
            if (code > 0) {
                str += String.fromCharCode(code);
            }
        }
        return str;
    }

    readCharString(len:number):string {
        let str = '';
        let code = 0;
        for (let i = 0 ; i < len ; i++) {
            code = this.readByte();
            if (code == 0 ) {
                this.position += (len - i - 1);
                break;
            }
            if (code > 0) {
                str += String.fromCharCode(code);
            }
        }
        return str;
    }

    

    readUCharString(len:number):string {
        let str = '';
        if (len > 0) {
            str = this.readUTFBytes(len);
        } else {
            str = this.readString2();
        }
        return str;
    }

    writeStCharString(value:string , len?:number) {
        let strLen:number = value.length;
        len = len ? len : strLen;
        for (let i = 0 ; i < len ; i++) {
            if (i < strLen && i != len - 1) {
                let num:number = value.charCodeAt(i);
                this.writeUInt16(num);
            } else {
                this.writeInt16(0);
            }
        }
    }

    writeUCharString(value:string , len?:number) {
        if (len && len > 0) {
            this.AppendCharArray(value , len);
        } else {
            this.writeString(value);
        }
    }

    // writeCharString(info:string) {
    //     let str = '';
    //     let code = 0;
    //     for (let i = 0 ; i < len ; i++) {
    //         code = this.readByte();
    //         if (code == 0 ) {
    //             this.position += (len - i - 1);
    //             break;
    //         }
    //         if (code > 0) {
    //             str += String.fromCharCode(code);
    //         }
    //     }
    //     return str;
    // }

    public writeInt32(value:number):FJByteArray {
        this.writeInt(value);
        return this;
    }

    public writeUInt32(value:number):FJByteArray {
        this.writeUnsignedInt(value);
        return this;
    }

    public writeInt8(value:number):FJByteArray {
        this.writeByte(value);
        return this;
    }

    public writeUInt8(value:number):FJByteArray {
        this.writeByte(value);
        return this;
    }

    public writeInt16(value:number):FJByteArray {
        this.writeShort(value);
        return this;
    }

    public writeUInt16(value:number):FJByteArray {
        this.writeUnsignedShort(value);
        return this;
    }


    public writeInt64(value:any):FJByteArray {
        this.writeLongInt64(value);
        return this;
    }

    public writeUInt64(value:any):FJByteArray {
        this.writeLongUint64(value);
        return this;
    }

    public writeString(value:string):FJByteArray {
        this.writeUTFBytes(value);
        this.writeByte(0);
        return this;
    }

    public getStringLength(buffer:ByteArray , pos:number):number {
        if (pos === void 0) { pos = -1; }
        if (pos < 0) {
            pos = buffer.position;
        }
        var len = 0;
        var bufferLen = buffer.length;
        var dv = buffer.dataView;
        for (; pos < bufferLen && dv.getInt8(pos) != 0; pos++) {
            len++;
        }
        return len;
    }

    public fill(value:any, begin?:number, end?:number):FJByteArray {
        var relative = typeof begin === 'undefined';
        if (relative) begin = this.position;
        if (typeof value === 'string' && value.length > 0)
            value = value.charCodeAt(0);
        if (typeof begin === 'undefined') begin = this.position;
        if (typeof end === 'undefined') end = this.length;
        if (begin >= end)
            return this; // Nothing to fill
        while (begin < end) {
            this.writeByte(value);
            begin++;
        }
        return this;
    }

    public AppendCharArray(str:string, length:number):FJByteArray {
        var old_pos = this.position;
        this.writeUTFBytes(str);
        var new_pos = this.position;
        var offset = new_pos - old_pos
        if(length > offset){
            this.fill(0, new_pos, new_pos + length - offset)
        }
        return this;
    }

    
    readByteArray(len:number) {
        let bytes:FJByteArray = FJByteArray.CreateByteBuffer();
        this.readBytes(bytes , this.position , len == 0 ? this.bytesAvailable : len);
        return bytes;
    }

    /*
    -- 正规的写法
    ["__SBOOLEAN"]                  = "slong",
    ["__SBOOLEANS"]                 = "slong",
    ["__UCHARS_STRING"]             = "uchar_string",
    ["__STCHARS_STRING"]            = "stchar_string",
    ["__SLONG"]                     = "slong",
    ["__SLONGS"]                    = "slong",
    ["__SINT64"]                    = "sint64",
    ["__SINT64S"]                   = "sint64",
    ["__STCHAR"]                    = "stchar",
    ["__STCHARS"]                   = "stchar",
    ["__UINT64"]                    = "uint64",
    ["__UINT64S"]                   = "uint64",
    ["__UCHAR"]                     = "uchar",
    ["__UCHARS"]                    = "uchar",
    ["__SCHAR"]                     = "uchar",
    ["__SCHARS"]                    = "uchar",
    ["__USHORT"]                    = "ushort",
    ["__USHORTS"]                   = "ushort",
    ["__ULONG"]                     = "ulong",
    ["__ULONGS"]                    = "ulong",
    ["__SINT32"]                    = "sint32",
    ["__SINT32S"]                   = "sint32",
    ["__SINT16"]                    = "sint16",
    ["__SINT16S"]                   = "sint16",
    ["__SINT8"]                     = "sint8",
    ["__SINT8S"]                    = "sint8",
    ["__SFLOAT"]                    = "sfloat",
    ["__SFLOATS"]                   = "sfloat",
    ["__SSHORT"]                    = "sshort",
    ["__SSHORTS"]                   = "sshort",
    */
}