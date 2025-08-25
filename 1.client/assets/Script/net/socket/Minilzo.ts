// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import lzo1x = require("./lzo1x");


export default class Minilzo {
    private static _instance: Minilzo = null;
    public static getInstance(): Minilzo {
        return this._instance || (this._instance = new Minilzo());
    }

    constructor() {
        lzo1x.setReturnNewBuffers(true);
    }

    public compress(data: Uint8Array): Uint8Array {
        let obj: { inputBuffer: Uint8Array; outputBuffer: Uint8Array } = {
            inputBuffer: data,
            outputBuffer: null,
        };
        if (lzo1x.compress(obj) == lzo1x.OK) {
            return obj.outputBuffer;
        }
        console.log('压缩失败');
        return null;
    }

    public uncompress(data: Uint8Array): ArrayBuffer {
        let obj = {
            inputBuffer: data,
            outputBuffer: null,
        };
        if (lzo1x.decompress(obj) == lzo1x.OK) {
            this.encryptData(obj.outputBuffer);
            return (obj.outputBuffer as Uint8Array).buffer;
        }
        return null;
    }

    private ENCRYPT_KEYB: number[] = [65, 68, 69, 70, 67, 66, 68, 68];

    encryptData(buffer: Uint8Array) {
        let data: DataView = new DataView(buffer.buffer);
        let len: number = buffer.length;
        let tempLen: number = len >> 3 << 3;
        let i = 0;
        let keyidx = 0;
        let u: number = 0;
        for (i = 0; i < tempLen; ++i, ++keyidx) {
            if (keyidx >= 8) {
                keyidx = 0;
            }

            u = data.getUint8(i) ^ this.ENCRYPT_KEYB[keyidx];
            data.setUint8(i, u);
        }

        keyidx = 0;
        for (i = tempLen; i < len; ++i, ++keyidx) {
            if (keyidx >= 8) {
                keyidx = 0;
            }

            u = data.getUint8(i) ^ this.ENCRYPT_KEYB[keyidx];
            data.setUint8(i, u);
        }
    }
}
