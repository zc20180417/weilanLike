import Game from "../../Game";
import { EResPath } from "../../common/EResPath";
import { Item } from "./Item";
import { EventEnum } from "../../common/EventEnum";
import { GameDataCtrl } from "../gameData/GameDataCtrl";
import { ItemType, EMODULE } from "../../common/AllEnum";
import { StringUtils } from "../../utils/StringUtils";
import SystemTipsMgr from "../../utils/SystemTipsMgr";
import { TowerUtil } from "../sceneObjs/TowerUtil";
import SceneMgr from "../../common/SceneMgr";
import { GameEvent } from "../../utils/GameEvent";

export class ItemMgr extends GameDataCtrl {

    private _itemCfg:any = null;
    private _allItem:Item[] = [];

    private _tryUseItemList:any[] = [];

    constructor() {
        super();
        this.module = EMODULE.ITEM;
        this.init();
    }

    /**获取一个物品 */
    getItem(id:number):Item {
        let len = this._allItem.length;
        for (let i = 0 ; i < len ; i++ ) {
            if (this._allItem[i].id == id) {
                return this._allItem[i];
            }
        }
        return null;
    }

    /**获取物品数量 */
    getItemCount(id:number):number {
        let item = this.getItem(id);
        if (item) {
            return item.count;
        }
        return 0;
    }

    addItemList(list:Item[]) {
        let len = list.length;
        let item:Item;
        for (let i = 0 ; i < len ; i++) {
            item = list[i];
            this.addItem(item.id , item.count);
        }
    }

    /**添加道具 */
    addItem(id:number , count:number , init:boolean = false) {
        let item = this.getItem(id);
        if (!item) {
            item = ItemMgr.createItem(id);
            if (!item) {
                return false;
            }
            this._allItem.push(item);
        }
        item.count += count;
        if (!init) {
            this.checkUnlockTower(id);
            GameEvent.emit(EventEnum.ITEM_COUNT_CHANGE , id , item.count);
            this.tryWrite();
        }
        return true;
    }

    deleteItemByItemList(items:Item[] ,showTips:boolean = true):boolean {
        if (!this.itemListIsEnough(items , showTips)) {
            return false;
        }

        let len = items.length;
        let i = 0;
        for (i = len - 1 ; i >= 0 ; i--) {
            this.deleteItemByItem(items[i]);
        }
        return true;
    }

    deleteItemByItem(item:Item ,showTips:boolean = true):boolean {
        return this.deleteItem(item.cfg.id , item.count , showTips);
    }

    /**删除道具 */
    deleteItem(id:number , count:number ,showTips:boolean = true):boolean {
        let item = this.getItem(id);
        if (!item || !this.isEnough(id , count , showTips)) {
            return false;
        }
        item.count -= count;
        if (item.count <= 0) {
            let index = this._allItem.indexOf(item);
            if (index != -1) {
                this._allItem.splice(index , 1);
            }
        }
        GameEvent.emit(EventEnum.ITEM_COUNT_CHANGE , id , item.count);
        this.tryWrite();
        return true;
    }

    /**deleteItemByArgs(true ,1,2,1,2,1,2,1,23,4,8,1) */
    deleteItemByArgs(showTips:boolean,...args):boolean {
        let len = args.length;
        if (len == 0 || len % 2 != 0) {
            cc.log("deleteItems error !传参不对");
            return false;
        }
        let i = 0;
        for (i = 0 ; i < len ; i+=2) {
            if (!this.isEnough(args[i] ,args[i+ 1] ,showTips)) {
                return false;
            }
        }

        for (i = 0 ; i < len ; i+=2) {
            this.deleteItem(args[i] , args[i + 1]);
        }

        return true;
    }

    /**是否足够 */
    isEnough(id:number ,count:number ,showTips:boolean = false):boolean {
        let flag = this.getItemCount(id) >= count;
        if (!flag && showTips) {
            let cfg = this.getItemCfg(id);
            SystemTipsMgr.instance.notice((cfg ? cfg.name:"") + "不足");
        }
        return flag;
    }

    itemIsEnough(item:Item ,showTips:boolean = false):boolean {
        let flag = this.getItemCount(item.id) >= item.count;
        if (!flag && showTips) {
            SystemTipsMgr.instance.notice((item.cfg ? item.cfg.name:"") + "不足");
        }
        return flag;
    }

    itemListIsEnough(itemList:Item[] , showTips:boolean = false):boolean {
        let len = itemList.length;
        let item:Item;
        let i = 0;
        for (i = 0 ; i < len ; i++) {
            item = itemList[i];
            if (!this.itemIsEnough(item ,showTips)) {
                return false;
            }
        }
        return true;
    }
 
    useItem(id:number , count:number = 1) {
        let item = this.getItem(id);
        if (!item) return;
        if (item.cfg.type == ItemType.SPELL) {
            
        } else if (item.cfg.type == ItemType.CARD) {
            this.useCard(id);
        }
    }

    private useCard(id:number) {
        let mainID:number = TowerUtil.getTypeByMainID(id);
        let quality:number = TowerUtil.getQualityByMainID(id);
        // if (!Game.towerStarSys.getTowerCurrStar(mainID , quality).isUnlock) {
        //     Game.towerStarSys.unlockTower(mainID , quality);

        //     this.deleteItem(id , 1);
        // }
    }

    private checkUnlockTower(id:number) {
        let itemCfg = this.getItemCfg(id);
        if (itemCfg.type != ItemType.CARD) {
            return;
        }

        let mainID:number = TowerUtil.getTypeByMainID(id);
        let quality:number = TowerUtil.getQualityByMainID(id);
        // if (!Game.towerStarSys.getTowerCurrStar(mainID , quality).isUnlock) {
        //     if (SceneMgr.instance.isInHall()) {
        //         this.useCard(id);
        //     } else {
        //         this._tryUseItemList.push(id);
        //         GameEvent.on(EventEnum.ON_SCENE_LOAD_COMPLETE , this.onSceneLoaded , this));
        //     }
        // }
    }

    private onSceneLoaded(sceneName?:string) {
        if (SceneMgr.instance.isInHall()) {
            if (this._tryUseItemList.length > 0) {
                this.tryUseItem(this._tryUseItemList.pop());
            }
        }
    }

    private tryUseItem(id:number) {
        this.useItem(id , 1);
        this.onSceneLoaded();
    }

   
    /**获取物品配置 */
    getItemCfg(id:number):any {
        return this._itemCfg[id];
    }

    read() {
        let allItem = this.readData();
        if (allItem) {
            let len = allItem.length;
            let item:any;
            for (let i = 0 ; i < len ; i++) {
                item = allItem[i];
                this.addItem(item.id , item.value , true);
                //cc.log("item.id:" + item.id + "," + item.value);
            }
        }
    }

    write() {
        if (this._allItem.length <= 0) return;
        let allItem:any[] = [];
        let len = this._allItem.length;
        for (let i = 0 ; i < len ; i++) {
            allItem[i] = this._allItem[i].writeData;
        }

        this.writeData(allItem);
    }

    init() {

    }

    ////////////////////////////////////////////////////////static

    static createItem(id:number) {
        let cfg = Game.itemMgr.getItemCfg(id)
        if (!cfg) {
            cc.log("create item error ,not found cfg:" + id);
            return null;
        }

        return new Item(id , cfg);
    }

    static paraseItemListByData(values:number[][]):Item[] {
        if (!values) return;
        let len = values.length;
        let tempArr:number[];
        let items:Item[] = [];
        for (let i = 0 ;i <len ; i++) {
            tempArr = values[i];
            let item = this.paraseItembyData(tempArr);
            if (item) {
                items.push(item);
            }
        }
        return items;
    }

    static paraseItembyData(value:number[]):Item {
        let item = this.createItem(value[0]);
        if (item) {
            item.count = value[1];
            return item;
        }
        return null;
    }

    static paraseItemList(str:string):Item[] {
        if (StringUtils.isNilOrEmpty(str)) return null;
        let itemStr:string[] = str.split("|");
        let len = itemStr.length;
        let items:Item[] = [];
        for (let i = 0 ; i < len ; i++) {
            let item = this.paraseItem(itemStr[i]);
            if (item) {
                items.push(item);
            }
        }
        return items;
    }

    static paraseItem(str:string):Item {
        let strList:string[] = str.split("_");
        let item = this.createItem(Number(strList[0]));
        if (item) {
            item.count = Number(strList[1]);
        }
        return item;
    }
}