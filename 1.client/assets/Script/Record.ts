// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:

import { EventEnum } from "./common/EventEnum";
import Utils from "./utils/Utils";

//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
type MessageId = { rootId: number, mainId: number, subId: number };

export interface RecordData {
    type: 'socket' | 'http';
    method?: 'get' | 'post';
    url?: string;
    messageId?: MessageId;
    waitEventId?: EventEnum;
    data?: any;
    time: number;
}


export default class Record {
    private static _instacne: Record;
    public static get instance() {
        return this._instacne ? this._instacne : this._instacne = new Record();
    }

    private _recordDatas: RecordData[] = [];
    private _lastTime: number = -1;

    constructor() {

    }

    // get(url: string, data: any) {
    //     let recordData: RecordData = {
    //         type: 'http',
    //         method: 'get',
    //         url: url,
    //         data: data
    //     }

    //     this._recordDatas.push(recordData);
    // }

    // post(url: string, data: any) {
    //     let recordData: RecordData = {
    //         type: 'http',
    //         method: 'post',
    //         url: url,
    //         data: data
    //     }

    //     this._recordDatas.push(recordData);
    // }

    send(rootId: number, mainId: number, subId: number, data: any) {
        let keys = Object.keys(data);
        let tempData = {};
        for (let key of keys) {
            if (key === 'protoList') continue;
            tempData[key] = data[key];
        }

        let now = Date.now();
        let recordData: RecordData = {
            type: 'socket',
            messageId: { rootId: rootId, mainId: mainId, subId: subId },
            data: tempData,
            time: this._lastTime === -1 ? 0 : now - this._lastTime
        }
        this._lastTime = now;

        this._recordDatas.push(recordData);
    }

    recive() {

    }

    save() {
        Utils.save('record.json', JSON.stringify(this._recordDatas, null, 4));
    }
}   