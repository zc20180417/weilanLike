

import { ECamp, FLOAT_DAMAGE_TYPE } from "../common/AllEnum";
import { EventEnum } from "../common/EventEnum";
import Game from "../Game";
import GlobalVal from "../GlobalVal";
import { NodePool } from "../logic/sceneObjs/NodePool";
import { GameEvent } from "../utils/GameEvent";
import { Handler } from "../utils/Handler";
import { FloatComp } from "./FloatComp";
import { LdDropBoxComp } from "./LdDropBoxComp";
import { CityWallHurtFloatComp } from "./ui/CityWallHurtFloatComp";
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/LD/FloatCtrlComp")
export class FloatCtrlComp extends cc.Component {

    @property(cc.Node)
    floatItem:cc.Node = null;

    @property(cc.Node)
    cirtItem:cc.Node = null;

    @property(cc.Node)
    cityWallHurtFloatItem:cc.Node = null;

    @property(cc.Node)
    cirtBg:cc.Node = null;

    @property
    sceneType:number = 0;

    @property(cc.Node)
    dropBox1:cc.Node = null;

    @property(cc.Node)
    dropBox2:cc.Node = null;


    private nodePool:NodePool = new NodePool();
    private cirtNodePool:NodePool = new NodePool();
    private cirtBgPool:NodePool = new NodePool();
    private dropBox1Pool:NodePool = new NodePool();
    private dropBox2Pool:NodePool = new NodePool();
    private cityWallHurtFloatPool:NodePool = new NodePool();
    private _count:number = 0;
    private _activeFloatList: FloatComp[] = [];

    start() {
        this.dropBox1 && this.dropBox1Pool.put(this.dropBox1);
        this.dropBox2 && this.dropBox2Pool.put(this.dropBox2);
        GameEvent.on(EventEnum.ON_DAMAGE , this.onDamage , this);
        GameEvent.on(EventEnum.LD_MONSTER_DROPS , this.onDropBox , this);
        GameEvent.on(EventEnum.LD_CITY_WALL_HURT , this.onCityWallHurt , this);
    }

    onDestroy() {
        GameEvent.off(EventEnum.LD_CITY_WALL_HURT , this.onCityWallHurt , this);
        GameEvent.off(EventEnum.ON_DAMAGE , this.onDamage , this);
        GameEvent.off(EventEnum.LD_MONSTER_DROPS , this.onDropBox , this);
    }

    private onDropBox(dropId:number , x:number , y:number , campId:ECamp = ECamp.BLUE) {
        if (dropId <= 0 || (GlobalVal.checkSkillCamp && campId !== Game.curLdGameCtrl.getSelfCamp())) return;

        let dropBox:cc.Node = null;
        switch (dropId) {
            case 1:
                dropBox = this.dropBox1Pool.size() > 0 ? this.dropBox1Pool.get() : cc.instantiate(this.dropBox1);
                break;
            case 2:
                dropBox = this.dropBox2Pool.size() > 0 ? this.dropBox2Pool.get() : cc.instantiate(this.dropBox2);
                break;
        }

        if (dropBox) {
            if (!dropBox.parent) {
                this.dropBox1.parent.addChild(dropBox);
            }
            dropBox.active = true;
            dropBox.setPosition(x , y);

            const dropComp = dropBox.getComponent(LdDropBoxComp);
            if (dropComp) {
                dropComp.show(dropId , Handler.create(this.onOpenDropBoxEnd , this) , campId)
            }
        }

    }

    private onCityWallHurt(value:number , campId:ECamp = ECamp.BLUE) {
        if (GlobalVal.checkSkillCamp && campId !== ECamp.BLUE) return;
        const itemNode = this.getCityWallHurtFloatItem();
        itemNode.setPosition(582 , 0);
        const itemComp = itemNode.getComponent(CityWallHurtFloatComp);
        itemComp.play(value  , Handler.create(this.onCityWallHurtEnd , this));
    }

    private onOpenDropBoxEnd(dropComp:LdDropBoxComp) {
        const pool = dropComp.getDropsId() == 1 ? this.dropBox1Pool : this.dropBox2Pool;
        pool.put(dropComp.node);
    }


    private onDamage(value:number , type:FLOAT_DAMAGE_TYPE , campId:ECamp = ECamp.BLUE ) {
        if (this._count > 100 || !GlobalVal.isShowFloat) return;
        const itemNode = this.getItem(type == FLOAT_DAMAGE_TYPE.CRIT);
        itemNode.setPosition(GlobalVal.tempVec2.x , GlobalVal.tempVec2.y);
        this._count ++;
        const itemComp = itemNode.getComponent(FloatComp);
        if (type == FLOAT_DAMAGE_TYPE.CRIT) {
            const cirtImg = this.getCritBg();
            itemComp.cirtNode = cirtImg;
        }
        itemComp.play(value , type  , Handler.create(this.onPlayEnd , this));

        this._activeFloatList.push(itemComp);
    }

    private onPlayEnd(item:FloatComp) {
        this._count --;
        const pool = item.isCirt ? this.cirtNodePool : this.nodePool;
        if (item.cirtNode) {
            item.cirtNode.active = false;
        }
        pool.put(item.node);
        // 从活跃列表移除
        const idx = this._activeFloatList.indexOf(item);
        if (idx !== -1) this._activeFloatList.splice(idx, 1);
    }

    private getItem(isCirt:boolean):cc.Node {
        const pool = isCirt ? this.cirtNodePool : this.nodePool;
        if (pool.size() > 0) {
            return pool.get();
        }

        const itemNode = cc.instantiate(isCirt ? this.cirtItem : this.floatItem);
        this.node.addChild(itemNode);
        return itemNode;
    }

    private getCritBg():cc.Node {
        const pool = this.cirtBgPool;
        if (pool.size() > 0) {
            return pool.get();
        }

        const itemNode = cc.instantiate(this.cirtBg);
        this.cirtBg.parent.addChild(itemNode);
        itemNode.active = true;
        return itemNode;
    }

    private getCityWallHurtFloatItem():cc.Node {
        const pool = this.cityWallHurtFloatPool;
        if (pool.size() > 0) {
            return pool.get();
        }

        const itemNode = cc.instantiate(this.cityWallHurtFloatItem);
        itemNode.active = true;
        this.node.addChild(itemNode);
        return itemNode;
    }

    private onCityWallHurtEnd(item:CityWallHurtFloatComp) {
        this.cityWallHurtFloatPool.put(item.node);
    }

    update(dt:number) {
        for (let i = this._activeFloatList.length - 1; i >= 0; i--) {
            const floatComp = this._activeFloatList[i];
            if (floatComp.batchUpdate && floatComp.batchUpdate(dt)) {
                // 只调用 onPlayEnd 统一回收和移除
                this.onPlayEnd(floatComp);
            }
        }
    }

}