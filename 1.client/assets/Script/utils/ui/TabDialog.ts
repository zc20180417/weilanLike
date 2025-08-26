import Dialog from "./Dialog";
import { Handler } from "../Handler";
import TogGroup from "./TogGroup";
import Game from "../../Game";

const {ccclass, property} = cc._decorator;

/**带标签页的面板 */
@ccclass
export default class TabDialog extends Dialog {

    @property(TogGroup)
    togGroup:TogGroup = null;

    @property(cc.Node)
    contentNode:cc.Node = null;

    protected flag2SubData:any;

    private _selectNode:cc.Node = null;

    onLoad(){
        super.onLoad();

        this.initSubData();
        this.togGroup.node.on("valueChange", this.onTogGroupValueChanged, this);
    }

    start(){
        this.onTogGroupValueChanged(this.togGroup.selectedFlag);
    }

    /**子类必须继承 */
    protected initSubData(){
        this.flag2SubData = {};
    }

    private loadComplete(data:any){
        let flag:string = data[0];
        let prefabPath:string = data[1];
        let prefab:cc.Prefab = Game.resMgr.getRes(prefabPath);
        let node:cc.Node = cc.instantiate(prefab);
        node.name = prefab.name;
        node.setPosition(cc.Vec2.ZERO);
        this.contentNode.addChild(node);
        
        this.flag2SubData[flag].node = node;
        this._selectNode = node;
    }

    private onTogGroupValueChanged(flag:string){
        if(this._selectNode) this._selectNode.active = false;

        let d = this.flag2SubData[flag];
        if(d){
            if(d.node){
                this._selectNode = d.node;
                this._selectNode.active = true;
            }else{
                if (Game.resMgr.getRes(d.prefabPath)) {
                    this.loadComplete([flag, d.prefabPath]);
                }else{
                    Game.resMgr.loadRes(d.prefabPath, null, new Handler(this.loadComplete, this, [flag, d.prefabPath]));
                }
            }
        }else{
            cc.log("没有初始化对应的标签页:"+flag);
        }
        this.change2Flag(flag);
    }

    /**切换到子标签时 */
    protected change2Flag(flag:string){

    }
}