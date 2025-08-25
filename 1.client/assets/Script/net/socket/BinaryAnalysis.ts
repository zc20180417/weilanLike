import FJByteArray from "./FJByteArray";

export class BinaryAnalysis {


    /*
    protoList:any[] = 
		[			
			{	"KEY" : "servertime",	"COUNT" : 1,	"TYPE" : "slong",},			
			{	"KEY" : "btcount",	"COUNT" : 1,	"TYPE" : "uchar",},			
			{	"KEY" : "btcontinuestate",	"COUNT" : 0,	"TYPE" : "uchar",},
        ]
    */

/*
switch (type) {
            case 'uint64':
                return this.readUInt64();
            case 'sint64':
                return this.readInt64();
            case 'slong':
            case 'sint32':
                return this.readInt32();
            case 'ulong':
                return this.readUInt32();
            case 'sfloat':
                return this.readFloat();
            case 'ushort':
                return this.readUInt16();
            case 'sshort':
            case 'sint16':
                return this.readInt16();
            case 'sint8':
            case 'uchar':
                return this.readInt8();
            case 'stchar':
            case 'stchar_string':
                return this.readStCharString(len);
            case 'uchar_string':
                return this.readUCharString(len);
            default:
                cc.log("error read byte data:" + type);
                break;
*/
    
    private readFunc = {};
    private writeFunc = {};
    private onePros = {};
    private byteLenDic = {};

    constructor() {
        this.readFunc["uint64"] = "readUInt64";
        this.readFunc["sint64"] = "readInt64";

        this.readFunc["slong"]  = "readInt32";
        this.readFunc["sint32"] = "readInt32";
        this.readFunc["ulong"]  = "readUInt32";

        this.readFunc["sfloat"]  = "readFloat";

        this.readFunc["ushort"]  = "readUInt16";
        this.readFunc["sshort"]  = "readInt16";
        this.readFunc["sint16"]  = "readInt16";

        this.readFunc["sint8"]  = "readInt8";
        this.readFunc["uchar"]  = "readInt8";
        this.readFunc["char"]  = "readCharString";

        this.readFunc["stchar"]  = "readStCharString";
        this.readFunc["stchar_string"]  = "readStCharString";
        this.readFunc["uchar_string"]  = "readUCharString";
        this.readFunc["FJByteArray"]  = "readByteArray";

        this.onePros["uint64"] = true;
        this.onePros["sint64"] = true;

        this.onePros["slong"]  = true;
        this.onePros["sint32"] = true;
        this.onePros["ulong"]  = true;

        this.onePros["sfloat"]  = true;

        this.onePros["ushort"]  = true;
        this.onePros["sshort"]  = true;
        this.onePros["sint16"]  = true;

        this.onePros["sint8"]  = true;
        this.onePros["uchar"]  = true;

        
        this.writeFunc["uint64"] = "writeUInt64";
        this.writeFunc["sint64"] = "writeInt64";

        this.writeFunc["slong"]  = "writeInt32";
        this.writeFunc["sint32"] = "writeInt32";
        this.writeFunc["ulong"]  = "writeUInt32";

        this.writeFunc["sfloat"]  = "writeFloat";

        this.writeFunc["ushort"]  = "writeUInt16";
        this.writeFunc["sshort"]  = "writeInt16";
        this.writeFunc["sint16"]  = "writeInt16";

        this.writeFunc["sint8"]  = "writeInt8";
        this.writeFunc["uchar"]  = "writeInt8";
        // this.writeFunc["char"]  = "writeCharString";
        this.writeFunc["stchar"]         = "writeStCharString";
        this.writeFunc["stchar_string"]  = "writeStCharString";
        this.writeFunc["uchar_string"]   = "writeUCharString";
        this.writeFunc["FJByteArray"]   = "writeBytes";

         //

         this.byteLenDic["uint64"] = 8;
         this.byteLenDic["sint64"] = 8;
 
         this.byteLenDic["slong"]  = 4;
         this.byteLenDic["sint32"] = 4;
         this.byteLenDic["ulong"]  = 4;
 
         this.byteLenDic["sfloat"]  = 4;
 
         this.byteLenDic["ushort"]  = 2;
         this.byteLenDic["sshort"]  = 2;
         this.byteLenDic["sint16"]  = 2;
 
         this.byteLenDic["sint8"]  = 1;
         this.byteLenDic["uchar"]  = 1;
         this.byteLenDic["stchar"]  = 2;
    }

    

    /**解析数据 */
    decode(byteArray:FJByteArray , data:any , log:boolean = false):any {
        let protoList:any[] = data.protoList;
        if (!protoList) {
            return null;
        }

        let len = protoList.length;
        let proData:any = null;
        let count:number = 0;
        let size:number = 0;
        let readSize:number = 0;
        let curSize:number = byteArray.position;
        let i , j;
        let value:any;
        for (i = 0 ; i < len ; i++) {
            proData = protoList[i];
            count = data[proData.ck] || proData.c;
            
            let readFuncStr = this.readFunc[proData.t];
            if (readFuncStr) {
                if (count == 0) {
                    if (this.onePros[proData.t]) {
                        value = [];
                        while (byteArray.bytesAvailable > 0) {
                            value.push(byteArray[readFuncStr]());
                        }
                    } else {
                        value = byteArray[readFuncStr](byteArray.bytesAvailable);
                    }

                } else if ( count == 1 || !this.onePros[proData.t] ) {
                    if (proData.c == 1 || !proData.ck)
                        value = byteArray[readFuncStr](count);
                    else
                        value = [byteArray[readFuncStr](count)];
                } else {
                    value = [];
                    for (j = 0 ; j < count ; j++) {
                        value.push(byteArray[readFuncStr]());
                    }
                }
            } else {
                if (proData.ck || count > 1) {
                    count = count || data[proData.ck];
                    size = data[proData.s];

                    if (count <= 0 ) continue;

                    value = [];

                    for (j = 0 ; j < count ; j++) {
                        curSize = byteArray.position;
                        value.push(this.decode(byteArray , new data[proData.k + "Class"] , log));

                        if (!size || size <= 0) continue;

                        readSize = byteArray.position - curSize;
                        if (readSize < size) {
                            byteArray.position += (size - readSize);
                        }
                    }
                } else if (count == 1) {
                    value = this.decode(byteArray , new data[proData.k + "Class"] , log);
                } else if (count == 0) {
                    value = [];
                    while(byteArray.bytesAvailable > 0) {
                        value.push(this.decode(byteArray , new data[proData.k + "Class"], log));
                    }
                }
            }

            if (log) {
                console.log('proData.k:' , proData.k , 'type:' ,readFuncStr,   'value:' , value);
            }
            data[proData.k] = value;
        }
        return data;
    }

    encode( data:any , byteArray?:FJByteArray) {
        if (data == null) return;

        byteArray = byteArray || FJByteArray.CreateByteBuffer();
        let protoList:any[] = data.protoList;
        if (!protoList) {
            return;
        }

        let len = protoList.length;
        let proData:any = null;
        let count:number = 0;
        let i , j ;
        for (i = 0 ; i < len ; i++) {
            proData = protoList[i];
            count = proData.c;

            let writeFuncStr = this.writeFunc[proData.t];
            if (writeFuncStr) {
                if (count == 0) {
                    if (this.onePros[proData.t]) {
                        let value:any[] = data[proData.k];
                        for (j = 0 ; j < value.length ; j++) {
                            byteArray[writeFuncStr](value[j]);
                        }
                    } else {
                        byteArray[writeFuncStr](data[proData.k]);
                    }

                } else if ( count == 1 || !this.onePros[proData.t] ) {
                    byteArray[writeFuncStr](data[proData.k] , count);
                } else {
                    let value:any[] = data[proData.k];
                    for (j = 0 ; j < count ; j++) {
                        byteArray[writeFuncStr](value[j]);
                    }
                }
            } else {
                if (count == 1) {
                    this.encode( data[proData.k], byteArray);
                } else {
                    let list:any[] = data[proData.k];
                    if (list && list.length > 0) {
                        for ( j = 0 ; j < list.length ; j++) {
                            this.encode(list[j] , byteArray);
                        }
                    }
                }
            }
        }

        return byteArray;
    }

    calcByteLen(data:any) {
        let propList = data.protoList;
        let prop:any;
        let len = propList.length;
        let count:number = 0;
        let value:number = 0;


        for (let i = 0 ; i < len ; i++) {
            prop = propList[i];
            count = this.byteLenDic[prop.t];
            if (count) {
                value += (count * prop.c);
            } else if (prop.t == 'FJByteArray') {
                let fjByte:FJByteArray =  data[prop.k] as FJByteArray;
                if (fjByte) {
                    value += fjByte.length;
                }
            } else if (prop.t == 'stchar' || prop.t == 'stchar_string') {
                value += (prop.c * 2);
            }
        }

        return value;
    }


}