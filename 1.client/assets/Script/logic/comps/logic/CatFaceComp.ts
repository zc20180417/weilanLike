import { EResPath } from "../../../common/EResPath";
import Game from "../../../Game";
import GlobalVal from "../../../GlobalVal";
import { Handler } from "../../../utils/Handler";
import { StringUtils } from "../../../utils/StringUtils";
import { NodeUtils } from "../../../utils/ui/NodeUtils";
import { Component } from "../Component";

export class CatFaceComp extends Component {
    
    private _loadedHandler:Handler;
    private _loadBgHandler:Handler;
    private _curPath:string = '';
    private _curFaceNode:cc.Node;
    private _curBgNode:cc.Node;
    /** 组件添加到主体上 */
    added() {

    }

    /** 组件从主体上移除 */
    removed() {
        if (this._curFaceNode) {
            this._curFaceNode.removeFromParent();
            this._curFaceNode = null;
        }
        if (this._curBgNode) {
            NodeUtils.to(this._curBgNode , .3 , {scale:0,opacity:0 } , 'sineIn' , this.onTweenEnd , this._curBgNode , this);
            
            this._curBgNode = null;
        }
        if (!StringUtils.isNilOrEmpty(this._curPath)) {
            Game.resMgr.removeLoad(this._curPath, this._loadedHandler);
            this._curPath = '';
        }
        // if (!StringUtils.isNilOrEmpty(this._curPath)) {
            Game.resMgr.removeLoad(EResPath.WAR_FACE, this._loadBgHandler);
        //     this._curPath = '';
        // }
    }

    private onTweenEnd(node:cc.Node) {
        if (node && node.parent) {
            node.removeFromParent();
        }
    }

    /** 重置数据 */
    resetData() {
        
        super.resetData();
    }

    /** 丢弃 */
    giveUp() {

        super.giveUp();
    }

    setFaceName(name:string) {

        if (StringUtils.isNilOrEmpty(name) ) {
            return;
        }

        if (!this._loadedHandler) {
            this._loadedHandler = new Handler(this.onLoaded , this);
        }
        if (!this._loadBgHandler) {
            this._loadBgHandler = new Handler(this.onBgLoaded , this);
        }

        if (this._curFaceNode) {
            this._curFaceNode.removeFromParent();
            this._curFaceNode = null;
        }

        const facePath = EResPath.PVP_CHAT_FACE + name;
        this._curPath = facePath;
        if (!this._curBgNode) {
            Game.resMgr.loadRes(EResPath.WAR_FACE ,cc.Prefab , this._loadBgHandler );
        }
        Game.resMgr.loadRes(facePath, cc.Prefab, this._loadedHandler);
    }

    private onBgLoaded(res: cc.Prefab, path: string) {
        this._curBgNode = cc.instantiate(res);
        this.tryShow();
    }

    private onLoaded(res: cc.Prefab, path: string) {
        Game.resMgr.addRef(path);
        if (path != this._curPath) return;
        this._curPath = '';
        this._curFaceNode = cc.instantiate(res);
        this.tryShow();
        
    }

    private tryShow() {
        if (!this._curBgNode || !this._curFaceNode) return;
        this._curBgNode.scale = 0;
        this._curBgNode.opacity = 255;
        NodeUtils.to(this._curBgNode , .3 , {scale:1,opacity:255 } , 'sineIn');
        this._curBgNode.getChildByName('faceNode').addChild(this._curFaceNode);
        if (!this._curBgNode.parent) {
            Game.soMgr.addBlood(this._curBgNode);
        }

        GlobalVal.tempVec2.x = this.m_Owner['centerPos'].x;
        GlobalVal.tempVec2.y = this.m_Owner['y'] + (this.m_Owner['size'].height == 0 ? 40 : this.m_Owner['size'].height) + 10;
        this._curBgNode.setPosition(GlobalVal.tempVec2.x, GlobalVal.tempVec2.y);

    }
}