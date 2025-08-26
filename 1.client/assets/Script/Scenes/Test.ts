import { ECamp } from "../common/AllEnum";
import { EventEnum } from "../common/EventEnum";
import GlobalVal from "../GlobalVal";
import { FloatComp } from "../ld/FloatComp";
import { Pos } from "../ld/Pos";
import MathUtil from "../logic/map/MathUtil";
import { GameEvent } from "../utils/GameEvent";
import { MathUtils } from "../utils/MathUtils";



const { ccclass, property , menu } = cc._decorator;

@ccclass
@menu('Game/scenes/Test')
export default class Logo extends cc.Component {

    @property(cc.PolygonCollider)
    block1:cc.PolygonCollider = null;

    @property(cc.PolygonCollider)
    block2:cc.PolygonCollider = null;

    @property(cc.Node)

    testBlockNode:cc.Node = null;

    @property(cc.Graphics)

    gs1:cc.Graphics = null;

    @property(cc.Graphics)
    gs2:cc.Graphics = null;

    @property(FloatComp)
    floatItem:FloatComp = null;

    @property(cc.Node)
    bg:cc.Node = null;

    private _blockPoints1:cc.Vec2[] = [];
    private _blockPoints2:cc.Vec2[] = [];

    private _centerRoadLeftTopPos:cc.Vec2 = cc.Vec2.ZERO;
    private _centerRoadRightTopPos:cc.Vec2 = new cc.Vec2(10000 , 0);

    protected start(): void {
       
        this.fitScene();
        this.drawBlock( this.block1);
        this.drawBlock( this.block2);

        const points1 = this.block1.points;
        const points2 = this.block2.points;

        this._blockPoints1.length = 0;
        this._blockPoints2.length = 0;
        points1.forEach(element => {
            this._blockPoints1.push(new cc.Vec2(element.x + this.block1.node.x, element.y + this.block1.node.y));
        });
        points2.forEach(element => {
            this._blockPoints2.push(new cc.Vec2(element.x + this.block2.node.x, element.y + this.block2.node.y));
        });

        this._blockPoints1.forEach(element => {
            if (element.x > this._centerRoadLeftTopPos.x && element.y > 0) {
                this._centerRoadLeftTopPos.x = element.x;
                this._centerRoadLeftTopPos.y = element.y;
            }
        });

        this._blockPoints2.forEach(element => {
            if (element.x < this._centerRoadRightTopPos.x && element.y > 0) {
                this._centerRoadRightTopPos.x = element.x;
                this._centerRoadRightTopPos.y = element.y;
            }
        });

        this.testBlockNode.on(cc.Node.EventType.TOUCH_END , this.onTouchEnd , this);


    }

    private onTouchEnd(event: cc.Event.EventTouch) {
        cc.log('onTouchEnd:' , event.getLocationX() , event.getLocationY());

        const pos = this.testBlockNode.convertToNodeSpaceAR(event.getLocation());


        this.gs2.clear();

        this.gs2.circle(334 , 454 , 10);
        this.gs2.stroke();
        this.gs2.fill();




        // let posList = this.sommonFindMovePath(pos.x , pos.y , this._tempPos.x , this._tempPos.y);
        let posList = this.sommonFindMovePath(334 ,454 , 276 , 526);


        posList.forEach((element , index) => {
            if (index == 0) {
                this.gs2.moveTo(element.x , element.y);
            } else {
                this.gs2.lineTo(element.x , element.y);
            }
        });
        this.gs2.stroke();


    }

    

    private fitScene() {
        let dSize = cc.view.getDesignResolutionSize();
        let fSize = cc.view.getFrameSize();
        let vSize = cc.view.getVisibleSize();

        cc.log('fsize:' , fSize.width , fSize.height)
        cc.log('vSize:' , vSize.width , vSize.height)

        if ((vSize.width / vSize.height) <= 0.5) {
            cc.log(111);

            const scaleMin = Math.max( vSize.width / this.bg.width,  vSize.height / this.bg.height)

            this.bg.scale = scaleMin;

        } else {
            const canvas = cc.Canvas.instance;
            if (canvas) {
                canvas.designResolution.height = 1440;
                canvas.fitHeight = true;
                canvas.fitWidth = false;

                const wid = vSize.width / vSize.height * 1440;

                // fSize = cc.view.getFrameSize();
                // cc.log('fsize:' , fSize.width , fSize.height)
                const scaleMin = Math.max( wid / this.bg.width,  1440 / this.bg.height);
                this.bg.scale = scaleMin;
            }
        }
    }

    private drawPoint(x:number , y:number) {
        this.gs2.moveTo(x , y);
        this.gs2.circle(x , y , 10);
        this.gs2.stroke();
        this.gs2.fill();
    }

    private drawLine(start:cc.Vec2 , end:cc.Vec2) {
        this.gs2.moveTo(start.x , start.y);
        this.gs2.lineTo(end.x , end.y);
        this.gs2.stroke();
    }



    private drawBlock(blockNode:cc.PolygonCollider) {
        const blockGs:cc.Graphics = blockNode.node.getComponent(cc.Graphics);
        const points = blockNode.points;
        for (let i = 0 ; i < points.length ; i++) {
            const p = points[i];
            if (i == 0) {
                blockGs.moveTo(p.x , p.y);
            } else {
                blockGs.lineTo(p.x , p.y);
            }
        }
        blockGs.close();
        blockGs.stroke();
        blockGs.fill();
    }
   
    private _tempPos:cc.Vec2 = cc.Vec2.ZERO;


    private onClick() {
        // for (let i = 0 ; i < 10 ; ++i) {
        //     GlobalVal.tempVec2.x = 0;
        //     GlobalVal.tempVec2.y = 0;
        //     GameEvent.emit(EventEnum.ON_DAMAGE , 100 , false, this);
        // }

        const x = Math.random() * 800;
        let   y = 0;
        let index = 0;
        if (x <= this._centerRoadLeftTopPos.x) {
            index = this.calcHitPoint(x , 2000 , this._blockPoints1 , this._tempPoint1);
        } else {
            index = this.calcHitPoint(x , 2000 , this._blockPoints2 , this._tempPoint1);
        }

        if (index != -1) {
            y = this._tempPoint1.y;
        } else {
            y = Math.random( ) * 1000;

        }
        
        // 276 , 526
        this._tempPos.x = 276;
        this._tempPos.y = 526;
        this.gs1.clear();
        this.gs1.circle(276 , 526 , 20);
        this.gs1.stroke();
        this.gs1.fill();




        



    }

    private onEnd(floatComp:FloatComp) {
        cc.log('onEnd');
        floatComp.node.destroy();
    }


     ////////////////////////////////////////////////////////////////////////////

    
        /**
         * 计算两线段是否相交，返回交点（如果有）
         */
        private calcSegmentIntersectPos(p1:cc.Vec2, p2:cc.Vec2, q1:cc.Vec2, q2:cc.Vec2): cc.Vec2|null {
            const dx1 = p2.x - p1.x;
            const dy1 = p2.y - p1.y;
            const dx2 = q2.x - q1.x;
            const dy2 = q2.y - q1.y;
            const denominator = dx1 * dy2 - dy1 * dx2;

            // 使用一个小的 epsilon 来避免浮点数除零错误
            if (Math.abs(denominator) < 1e-9) {
                return null;
            }

            const dx = q1.x - p1.x;
            const dy = q1.y - p1.y;
            const t = (dx * dy2 - dy * dx2) / denominator;
            const u = (dx * dy1 - dy * dx1) / denominator;

            // 关键修复：t 的范围是 [0, 1)，不包含1。
            // 这可以防止当子路径的目标点本身就是障碍物顶点时，发生无限递归。
            // 我们只关心在到达目标“之前”是否发生碰撞。
            // u 的范围仍然是 [0, 1]，因为它代表障碍物的边。
            if (t >= 0 && t < (1.0 - 1e-9) && u >= 0 && u <= 1) {
                return new cc.Vec2(p1.x + t * dx1, p1.y + t * dy1);
            }

            return null;
        }
    
    
        /**
         * 召唤物寻找移动路径，使用递归分割算法在多边形障碍物中寻找路径。
         * 
         * @param sx 起始点x坐标
         * @param sy 起始点y坐标
         * @param tx 目标点x坐标
         * @param ty 目标点y坐标
         * @param campId 阵营ID
         * @returns 返回路径点数组，包含起点和终点
         */
        public sommonFindMovePath(sx: number, sy: number, tx: number, ty: number, campId: ECamp = ECamp.BLUE): Pos[] {
            const start = cc.v2(sx, sy);
            const end = cc.v2(tx, ty);

            const recursivePath = this.findPathRecursive(start, end, 0);

            if (recursivePath) {
                // 将起点加入并优化路径
                const finalPath = this.optimizePath([start].concat(recursivePath));
                return finalPath.map(p => Pos.getPos(p.x, p.y));
            }

            // 如果找不到路径，返回包含起点和终点的直线路径作为备用
            return [Pos.getPos(sx, sy), Pos.getPos(tx, ty)];
        }

        /**
         * 递归寻找路径的核心函数
         * @param start 起点
         * @param end 终点
         * @param depth 当前递归深度，防止无限循环
         * @returns 返回路径节点数组 (不包含起点), 或者在找不到路径时返回 null
         */
        private findPathRecursive(start: cc.Vec2, end: cc.Vec2, depth: number): cc.Vec2[] | null {
            const MAX_DEPTH = 10; // 最大递归深度
            if (depth > MAX_DEPTH) {
                return null;
            }

            if (this.isPointInPolygon(start , this._blockPoints1)) {
                cc.log('isPointInPolygon , start pos:' , start);
            }

            if (this.isPointInPolygon(end , this._blockPoints1)) {

                const index = this.calcHitPoint(end.x , 2000 , this._blockPoints1 , this._tempPoint1);
                if (index != -1) {
                    cc.log('calcHitPoint , end pos:' , this._tempPoint1.y);

                }
                end.y = this._tempPoint1.y + 1;



                cc.log('isPointInPolygon , end pos:' , end);
            }





            // 1. 检查起点和终点之间是否有障碍物
            if (!this.isPathBlocked(start, end)) {
                return [end]; // 路径通畅，直接返回终点
            }

            // 2. 路径被阻挡，找到最近的交点信息
            const intersectionInfo = this.findNearestIntersection(start, end);
            if (!intersectionInfo) {
                return null; // 理论上不应该发生，因为 isPathBlocked 返回 true
            }

            // 3. 关键改动：不再直接使用障碍物的顶点，
            //    而是计算一个在障碍物边缘外侧的“安全点”来作为绕行目标。
            //    这可以彻底解决路径目标点刚好落在障碍物边界上，导致递归卡死的问题。
            const detourPoints = this.getSafeDetourPoints(intersectionInfo.edge[0], intersectionInfo.edge[1], end , depth);

            // 4. 依次尝试两个“安全”的绕行点
            for (const detourPoint of detourPoints) {
                const path_part1 = this.findPathRecursive(start, detourPoint, depth + 1);
                if (path_part1) {
                    const path_part2 = this.findPathRecursive(detourPoint, end, depth + 1);
                    if (path_part2) {
                        return path_part1.concat(path_part2); // 找到一条完整路径，返回
                    }
                }
            }

            return null; // 两条绕行路径都失败
        }

        /**
         * 根据障碍物的边，计算出两个在障碍物外侧的安全绕行点
         * @param v1 边的顶点1
         * @param v2 边的顶点2
         * @param finalEnd 最终的目标点，用于排序
         */
        private getSafeDetourPoints(v1: cc.Vec2, v2: cc.Vec2, finalEnd: cc.Vec2 , depth:number): cc.Vec2[] {
            v1 = v1.clone();
            v2 = v2.clone();
            v1.y += 10;
            v2.y += 10;

            if (finalEnd.x < 480) {
                v1.x += 30;
                v2.x += 30;
            } else {
                v1.x -= 30;
                v2.x -= 30;
            }

            const edgeVec = v2.clone().sub(v1);
            
            // 关键假设：我们假设障碍物多边形的顶点是按“顺时针”顺序定义的。
            // 基于此，(dy, -dx)可以计算出指向障碍物外部的法线。
            const outwardNormal = cc.v2(edgeVec.y, -edgeVec.x).normalize();
            const offset = 30.0 + depth * 2; // 将绕行点向外偏移2个单位，确保它在障碍物之外


            const safe_v1 = v1.clone().add(outwardNormal.mul(offset));
            const safe_v2 = v2.clone().add(outwardNormal.mul(offset));

            // this.drawPoint(safe_v1.x , safe_v1.y);
            // this.drawPoint(safe_v2.x , safe_v2.y);

            // console.log("safe_v1" , safe_v1.x , safe_v1.y);
            // console.log("safe_v2" , safe_v2.x , safe_v2.y);

            // 优先选择离最终目标点更近的那个安全绕行点
            if (safe_v1.y > safe_v2.y) {
                return [safe_v1, safe_v2];
            } else {
                return [safe_v2, safe_v1];

            }
        }

        /**
         * 检查路径是否被任何障碍物阻挡
         */
        private isPathBlocked(p1: cc.Vec2, p2: cc.Vec2): boolean {
            return this.isSegmentIntersectPolygon(p1, p2, this._blockPoints1) || this.isSegmentIntersectPolygon(p1, p2, this._blockPoints2);
        }

        /**
         * 找到线段与所有障碍物相交的、离起点最近的交点
         * @returns 返回交点信息，包括交点坐标和相交的边
         */
        private findNearestIntersection(start: cc.Vec2, end: cc.Vec2): { point: cc.Vec2; edge: [cc.Vec2, cc.Vec2] } | null {
            this.drawLine(start , end);

            let nearest: { point: cc.Vec2; edge: [cc.Vec2, cc.Vec2] } | null = null;
            let minDistance = Infinity;
            const obstacles = [this._blockPoints1, this._blockPoints2];

            for (const block of obstacles) {
                if (!block || block.length === 0) continue;
                for (let i = 0; i < block.length; i++) {
                    const p1 = block[i];
                    const p2 = block[(i + 1) % block.length];
                    const intersectionPoint = this.calcSegmentIntersectPos(start, end, p1, p2);

                    if (intersectionPoint) {
                        // BUG 修复: 使用 distancesqr 方法来计算距离，避免修改 'start' 向量。
                        // 之前的代码 start.sub(intersectionPoint) 会改变 start 向量的值，
                        // 导致后续的递归计算出错。
                        const dist =  MathUtils.getDistance(start.x , start.y, intersectionPoint.x , intersectionPoint.y);
                        if (dist < minDistance) {
                            minDistance = dist;
                            nearest = { point: intersectionPoint, edge: [p1, p2] };
                        }
                    }
                }
            }
            return nearest;
        }

        /**
         * 优化路径，移除路径中可以被直线替代的多余节点
         */
        private optimizePath(path: cc.Vec2[]): cc.Vec2[] {
            if (path.length < 3) {
                return path;
            }
            const optimizedPath: cc.Vec2[] = [path[0]];
            let i = 0;
            while (i < path.length - 1) {
                let lastVisibleIndex = i + 1;
                for (let j = i + 2; j < path.length; j++) {
                    if (!this.isPathBlocked(path[i], path[j])) {
                        lastVisibleIndex = j;
                    }
                }
                optimizedPath.push(path[lastVisibleIndex]);
                i = lastVisibleIndex;
            }
            return optimizedPath;
        }


        /**
         * 判断线段与多边形是否相交
         */
        private isSegmentIntersectPolygon(p1: cc.Vec2, p2: cc.Vec2, polygon: cc.Vec2[]): boolean {
            if (!polygon) return false;
            for (let i = 0; i < polygon.length; i++) {
                const a = polygon[i];
                const b = polygon[(i + 1) % polygon.length];
                // 关键修复：调用我们修正过的、更精确的 calcSegmentIntersectPos 函数
                // 来进行相交判断。如果该函数返回一个非 null 的交点，则说明路径被阻挡。
                if (this.calcSegmentIntersectPos(p1, p2, a, b)) {
                    return true;
                }
            }
            return false;
        }

        private isPointInPolygon(point: cc.Vec2, polygon: cc.Vec2[]): boolean {
            let isInside = false;
            const x = point.x, y = point.y;
            for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
                const xi = polygon[i].x, yi = polygon[i].y;
                const xj = polygon[j].x, yj = polygon[j].y;
    
                // Check if the point is on a horizontal edge
                if (((yi > y && yj > y) || (yi < y && yj < y)) && (yi !== yj)) {
                    // both above or both below
                } else if (yi === y && yj === y && x >= Math.min(xi, xj) && x <= Math.max(xi, xj)) {
                    return true; // On horizontal edge
                }
    
                // Check if the point is on a vertical edge
                if (xi === xj && xi === x && y >= Math.min(yi, yj) && y <= Math.max(yi, yj)) {
                    return true; // On vertical edge
                }
    
                const intersect = ((yi > y) !== (yj > y))
                    && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                if (intersect) {
                    isInside = !isInside;
                }
            }
            return isInside;
        }



        private _tempPoint1:cc.Vec2 = new cc.Vec2();
        private _tempPoint2:cc.Vec2 = new cc.Vec2();
        private calcHitPoint(x:number , y:number , blocks:cc.Vec2[] , outPoint:cc.Vec2):number {
            let maxY = -Infinity;
            let index = -1;
            for (let i = 0, n = blocks.length; i < n; ++i) {
                let a = blocks[i];
                let b = blocks[(i + 1) % n];
                if ((a.x - x) * (b.x - x) > 0) continue;
                if (a.x === b.x && a.x !== x) continue;
                if (a.x === b.x && a.x === x) {
                    let minY = Math.min(a.y, b.y);
                    let maxYEdge = Math.max(a.y, b.y);
                    if (maxYEdge < y && maxYEdge > maxY) {
                        maxY = maxYEdge;
                        outPoint.x = x;
                        outPoint.y = maxYEdge;
                        index = i;
                    }
                    if (minY < y && minY > maxY) {
                        maxY = minY;
                        outPoint.x = x;
                        outPoint.y = minY;
                        index = i;
                    }
                } else {
                    let t = (x - a.x) / (b.x - a.x);
                    if (t < 0 || t > 1) continue;
                    let interY = a.y + (b.y - a.y) * t;
                    if (interY < y && interY > maxY) {
                        maxY = interY;
                        outPoint.x = x;
                        outPoint.y = interY;
                        index = i;
    
                    }
                }
            }
            return index;
        }

}