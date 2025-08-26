import SceneObject from "../sceneObjs/SceneObject";
import { MathUtils,Rect } from "../../utils/MathUtils";
import Game from "../../Game";


export default class QuadTree {

   /**每个节点（象限）所能包含物体的最大数量 */
    static MAX_OBJECTS = 30;
    /**四叉树的最大深度 */
    static MAX_LEVELS = 5;

    private _objects:SceneObject[] = [];
    private _nodes:QuadTree[] = [];
    private _level:number = 0;
    private _bounds:Rect;
    private _name:string = "";

    //当前检测的矩形
    private _rect:Rect = new Rect;
    // /private
    
    constructor(bounds:Rect, level?:number , index?:number) {
        this._objects = [];
        this._nodes = [];
        this._level = typeof level === 'undefined' ? 0 : level;
        this._bounds = bounds;
        this._name = this._level + "_" + index;
    }

    getIndex(rect:Rect) {
        let onBottom:boolean = rect.yMax <= this._bounds.center.y;
        let onTop:boolean = rect.y >= this._bounds.center.y;
        let onLeft:boolean = rect.xMax <= this._bounds.center.x;
        let onRight:boolean = rect.x >= this._bounds.center.x;
    
        if (onBottom) {
            if (onRight) {
                return 0;
            } else if (onLeft) {
                return 1;
            }
        } else if (onTop) {
            if (onLeft) {
                return 2;
            } else if (onRight) {
                return 3;
            }
        }
    
        // 如果物体跨越多个象限，则放回-1
        return -1;
    }

    split() {
        let x = this._bounds.x;
        let y = this._bounds.y;
        let sWidth = this._bounds.width >> 1;
        let sHeight = this._bounds.height >> 1;
        let setLevel = this._level + 1;
        this._nodes.push(
            new QuadTree(new Rect(this._bounds.center.x, y, sWidth, sHeight), setLevel , 1),
            new QuadTree(new Rect(x, y, sWidth, sHeight), setLevel , 2),
            new QuadTree(new Rect(x, this._bounds.center.y , sWidth, sHeight), setLevel , 3),
            new QuadTree(new Rect(this._bounds.center.x, this._bounds.center.y, sWidth, sHeight), setLevel , 4)
        );

        /*
        Game.ldSkillMgr.graph.fillColor = cc.Color.RED;
        Game.ldSkillMgr.graph.fillColor.setA(110);
        Game.ldSkillMgr.graph.fillRect(this._bounds.center.x ,y ,sWidth,sHeight);

        Game.ldSkillMgr.graph.fillColor = cc.Color.YELLOW;
        Game.ldSkillMgr.graph.fillColor.setA(110);
        Game.ldSkillMgr.graph.fillRect(x, y, sWidth, sHeight);

        Game.ldSkillMgr.graph.fillColor = cc.Color.BLUE;
        Game.ldSkillMgr.graph.fillColor.setA(110);
        Game.ldSkillMgr.graph.fillRect(x, this._bounds.center.y , sWidth, sHeight);

        Game.ldSkillMgr.graph.fillColor = cc.Color.GREEN;
        Game.ldSkillMgr.graph.fillColor.setA(110);
        Game.ldSkillMgr.graph.fillRect(this._bounds.center.x, this._bounds.center.y, sWidth, sHeight);
        */
        
        
    }

    insert(so:SceneObject) {
        let objs = this._objects;
        let i, index;
    
        // 如果该节点下存在子节点
        if (this._nodes.length) {
            index = this.getIndex(so.rect);
            if (index !== -1) {
                this._nodes[index].insert(so);
                return;
            }
        }

        // 否则存储在当前节点下
        objs.push(so);
    
        // 如果当前节点存储的数量超过了MAX_OBJECTS
        if (!this._nodes.length &&
            this._objects.length > QuadTree.MAX_OBJECTS &&
            this._level < QuadTree.MAX_LEVELS) {

            this.split();

            for (i = objs.length - 1; i >= 0; i--) {
                index = this.getIndex(objs[i].rect);
                if (index !== -1) {
                    this._nodes[index].insert(objs.splice(i, 1)[0]);
                }
            }
        }
    }

    remove(so:SceneObject):boolean {
        let index:number = this._objects.indexOf(so);
        if (index != -1) {
            this._objects.splice(index , 1);
            return true;
        } else {
            let len:number = this._nodes.length;
            for (let i = len - 1 ; i >= 0 ; i--) {
                if (this._nodes[i].remove(so)) {
                    break;
                }
            }
        }

        return false;
    }

    removeAll() {
        this._objects = [];
        let len:number = this._nodes.length;
        for (let i = len - 1 ; i >= 0 ; i--) {
            this._nodes[i].removeAll();
        }
    }

    /** 
    /*检索功能：
    /*给出一个物体对象，该函数负责将该物体可能发生碰撞的所有物体选取出来。该函数先查找物体所属的象限，该象限下的物体都是有可能发生碰撞的，然后再递归地查找子象限...
    */
    retrieve(rect:Rect):SceneObject[] {

        this._rect.x = MathUtils.clamp(rect.x , this._bounds.x , this._bounds.xMax);
        this._rect.y = MathUtils.clamp(rect.y , this._bounds.y , this._bounds.yMax);
        this._rect.xMax = MathUtils.clamp(rect.xMax , this._bounds.x , this._bounds.xMax);
        this._rect.yMax = MathUtils.clamp(rect.yMax , this._bounds.y , this._bounds.yMax);
        this._rect.refreshByBound();

        let result:SceneObject[] = [],
            arr,index,len;

        if ((this._rect.xMax - this._rect.x) == 0 || (this._rect.yMax - this._rect.y) == 0) {
            return result;
        }
        if (this._nodes.length) {
            index = this.getIndex(this._rect);
            if (index !== -1) {
                result = result.concat(this._nodes[index].retrieve(this._rect));
            } else {
                // 切割矩形
                arr = this.carve(this._rect);
                len = arr.length;
                for (let i = len - 1; i >= 0; i--) {
                    index = this.getIndex(arr[i]);
                    if (index != -1) {
                        result = result.concat(this._nodes[index].retrieve(this._rect));
                    } else {
                        cc.log("-----retrieve error");
                    }
                }
            }
        }
        result = result.concat(this._objects);
        return result;
    }

    private carve(rect:Rect):Rect[] {
        let list:Rect[] = [];
        let splitX = rect.xMax > this._bounds.center.x && rect.x < this._bounds.center.x;
        let splitY = rect.yMax > this._bounds.center.y && rect.y < this._bounds.center.y;
        let subRect1:Rect;
        let subRect2:Rect;

        if (splitX && splitY) {

            //右上
            subRect1 = new Rect(this._bounds.center.x , this._bounds.center.y , rect.xMax - this._bounds.center.x , rect.yMax - this._bounds.center.y);
            //左上
            subRect2 = new Rect(rect.x , this._bounds.center.y , this._bounds.center.x - rect.x    , rect.yMax - this._bounds.center.y);
            //左下
            let subRect3 = new Rect(rect.x , rect.y , this._bounds.center.x - rect.x , this._bounds.center.y - rect.y);
            //右下
            let subRect4 = new Rect(this._bounds.center.x , rect.y , rect.xMax - this._bounds.center.x , this._bounds.center.y - rect.y);

            list.push(subRect3);
            list.push(subRect4);
        } else if (splitX) {
            subRect1 = new Rect(this._bounds.center.x , rect.y , rect.xMax - this._bounds.center.x , rect.height);
            subRect2 = new Rect(rect.x , rect.y , this._bounds.center.x - rect.x  , rect.height);

        } else {
            subRect1 = new Rect(rect.x , this._bounds.center.y , rect.width , rect.yMax - this._bounds.center.y);
            subRect2 = new Rect(rect.x , rect.y , rect.width  , this._bounds.center.y - rect.y);
        }

        list.push(subRect1);
        list.push(subRect2);

        return list;
    }

    /** 
    /*动态更新：
    /*从根节点深入四叉树，检查四叉树各个节点存储的物体是否依旧属于该节点（象限）的范围之内，如果不属于，则重新插入该物体。
    */
    refresh(root?:QuadTree) {
        let objs = this._objects,
            rect, index, i, len;
    
        root = root || this;

        let contains:boolean = false;
        for (i = objs.length - 1; i >= 0; i--) {
            rect = objs[i].rect;

            contains = MathUtils.containsRect(this._bounds , rect);

            // 如果矩形不属于该象限，则将该矩形重新插入
            if (!contains) {
                if (this !== root) {
                    root.insert(objs.splice(i, 1)[0]);
                }
            } else {
                // 如果矩形属于该象限 且 该象限具有子象限，则
                // 将该矩形安插到子象限中
                index = this.getIndex(rect);
                if (this._nodes.length && index != -1) {
                    this._nodes[index].insert(objs.splice(i, 1)[0]);
                }
            }
        }
    
        // 递归刷新子象限
        for (i = 0, len = this._nodes.length; i < len; i++) {
            this._nodes[i].refresh(root);
        }
    } 
}