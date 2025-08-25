import TowerStarNavItem from "../towerStarSys/towerStarNavItem";
import Game from "../../Game";
import { Handler } from "../../utils/Handler";
import { NodeUtils } from "../../utils/ui/NodeUtils";

const {ccclass,menu, property} = cc._decorator;

@ccclass
@menu("Game/ui/science/ScienceNavigation")
export class ScienceNavigation extends cc.Component {
    @property(cc.Node)
    imgLayout:cc.Node=null;

    @property(cc.Node)
    txtLayout:cc.Node=null;

    @property(cc.Prefab)
    navItem:cc.Prefab = null;

    @property(cc.Node)
    selectBg:cc.Node = null;

    private _navItems:cc.Node[];
    private _navDatas:any[];
    private _selectItem:TowerStarNavItem;
    private _selectHandler:Handler;
    private _itemWidth:number = 0;
    onLoad() {
        this.init(Game.towerMgr.getTowerTypeArr())
    }

    init(data:any){
        this._navDatas = data;
        this._itemWidth = cc.winSize.width / this._navDatas.length;
        this.selectBg.width = this._itemWidth;
        this.refreshNavs();
    }

    refreshNavs(){
        this._navItems=this._navItems||[];
        let pageLen=this._navItems.length;
        let dataLen=this._navDatas.length;
        if(pageLen>dataLen){//删除多余的导航项
            let tempArr=this._navItems.splice(dataLen,pageLen-dataLen);
            tempArr.forEach(node=>node.destroy());
        }
        let i=0;
        while(i<dataLen){//更新页面数据
            if(this._navItems[i]){
                let navItemCom:TowerStarNavItem=this._navItems[i].getComponent("towerStarNavItem");
                navItemCom.setData(this._navDatas[i] , i);
                navItemCom.refresh();
            }else{
                let navItem=cc.instantiate(this.navItem);
                this._navItems.push(navItem);
                
                let navItemCom:TowerStarNavItem=navItem.getComponent("towerStarNavItem");
                this.addItem(navItemCom);

                navItemCom.setTarget(this);
                navItemCom.setData(this._navDatas[i] , i);
                navItemCom.refresh();
            }
            i++;
        }
    }

    selectIndex(index:number) {
        let tox = -cc.winSize.width *0.5 + index * this._itemWidth;
        let bind:boolean = true;
        if (this._selectItem) {
            this._selectItem.selected = false;
            this._selectItem.updateColor(1);
            if (Math.abs(index - this._selectItem.index) == 1) {
                NodeUtils.to(this.selectBg , 0.1 , {x:tox} , "cubicOut");
                bind = false;
            }
            this._selectItem = null;
        } else {
            this.selectBg.active = true;
        }

        if (bind) this.selectBg.x = tox;
       

        let tempNavItem:cc.Node = this._navItems[index];
        if (tempNavItem) {
            let comp = tempNavItem.getComponent("towerStarNavItem");
            comp.selected = true;
            comp.updateColor(0);
            this._selectItem = comp;
        }
        if (this._selectHandler) {
            this._selectHandler.executeWith(index);
        }
    }


    refreshNav(pageIndex:number){
        let navItemCom=this._navItems[pageIndex].getComponent("towerStarNavItem");
        navItemCom.setData(this._navDatas[pageIndex]);
        navItemCom.refresh();
    }

    addItem(navItem:TowerStarNavItem){
        let node=navItem.getImgRoot();
        this.imgLayout.addChild(node);
        node=navItem.getTxtRoot();
        node.removeFromParent();
        this.txtLayout.addChild(node);
    }

    setSelectHandler(handler:Handler) {
        this._selectHandler = handler;
    }
}