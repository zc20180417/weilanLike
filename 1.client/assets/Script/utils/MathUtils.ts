import { EDir } from "../common/AllEnum";
import GlobalVal from "../GlobalVal";
import { Pos } from "../ld/Pos";
import { RandomUtils } from "./RandomUtils";

/**围绕下中点旋转 */
export class RotationRect {
    //左下
    p1: Point = new Point;
    //右下
    p2: Point = new Point;
    //右上
    p3: Point = new Point;
    //左上
    p4: Point = new Point;
    //下中
    p5: Point = new Point;
    //上中
    p6: Point = new Point;

    //private bound:Rect = new Rect;
    /**外包盒矩形 */
    x: number = 0;
    y: number = 0;
    width: number = 0;
    height: number = 0;
    xMax: number = 0;
    yMax: number = 0;
    setRect(rect: Rect, rotation: number) {
        let wid = rect.width * 0.5;
        let hei = rect.height;

        let cos = Math.cos(rotation);
        let sin = Math.sin(rotation);

        this.p5.x = rect.center.x;
        this.p5.y = rect.y;

        let cosX = (cos * wid);
        let sinX = (sin * wid);

        this.p1.x = this.p5.x - cosX;
        this.p1.y = this.p5.y - sinX;

        this.p2.x = this.p5.x + cosX;
        this.p2.y = this.p5.y + sinX;

        cos = Math.cos(rotation + (Math.PI * 0.5));
        sin = Math.sin(rotation + (Math.PI * 0.5));

        cosX = cos * hei;
        sinX = sin * hei;
        this.p3.x = this.p2.x + cosX;
        this.p3.y = this.p2.y + sinX;

        this.p4.x = this.p1.x + cosX;
        this.p4.y = this.p1.y + sinX;

        this.p6.x = this.p5.x + cosX;
        this.p6.y = this.p5.y + sinX;

        this.x = Math.min(this.p1.x, this.p2.x, this.p3.x, this.p4.x);
        this.y = Math.min(this.p1.y, this.p2.y, this.p3.y, this.p4.y);
        this.xMax = Math.max(this.p1.x, this.p2.x, this.p3.x, this.p4.x);
        this.yMax = Math.max(this.p1.y, this.p2.y, this.p3.y, this.p4.y);

        this.width = this.xMax - this.x;
        this.height = this.yMax - this.y;

    }
}

export class Rect {
    x: number = 0;
    y: number = 0;
    width: number = 0;
    height: number = 0;
    xMax: number = 0;
    yMax: number = 0;
    halfWid: number = 0;
    halfHei: number = 0;
    center: Point = new Point;

    private _vertices:cc.Vec2[] = [];
    //是否需要刷新vertices
    private _needRefresh:boolean = false;


    constructor(x = 0, y = 0, width = 0, height = 0) {
        if (x != null && y != null) {
            this.init(x, y, width, height);
        }
        this._vertices.push(new cc.Vec2(this.x , this.y));
        this._vertices.push(new cc.Vec2(this.x + this.width , this.y));
        this._vertices.push(new cc.Vec2(this.x + this.width , this.y + this.height));
        this._vertices.push(new cc.Vec2(this.x , this.y + this.height));

    }

    refreshSize() {
        this.xMax = this.x + this.width;
        this.yMax = this.y + this.height;
        this._needRefresh = true;
    }

    refresh() {
        this.xMax = this.x + this.width;
        this.yMax = this.y + this.height;
        this.center.x = Math.floor(this.x + this.halfWid);
        this.center.y = Math.floor(this.y + this.halfHei);
        this._needRefresh = true;
    }

    refreshByBound() {
        this.floor();
        this.width = this.xMax - this.x;
        this.height = this.yMax - this.y;
        this.halfWid = this.width * 0.5;
        this.halfHei = this.height * 0.5;
    }

    init(x?: number, y?: number, width?: number, height?: number) {
        this.x = x; this.y = y; this.width = width; this.height = height;
        this.floor();
        this.halfWid = this.width * 0.5;
        this.halfHei = this.height * 0.5;
        this.refreshSize();
        this.refresh();
    }

    containsPoint(x: number, y: number): boolean {
        return x >= this.x && x <= this.xMax && y >= this.y && y <= this.yMax;
    }

    private floor() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        this.width = Math.floor(this.width);
        this.height = Math.floor(this.height);
    }

    getVertices():cc.Vec2[] {
        if (this._needRefresh) {
            this._vertices[0].x =  this.x;
            this._vertices[0].y =  this.y;
            this._vertices[1].x =  this.x + this.width;
            this._vertices[1].y =  this.y;
            this._vertices[2].x =  this.x + this.width;
            this._vertices[2].y =  this.y + this.height;
            this._vertices[3].x =  this.x;
            this._vertices[3].y =  this.y + this.height;
        }
        this._needRefresh = false;
        return this._vertices;
    }

    dispose() {
        this._vertices.length = 0;
    }
}

export class Point {
    x: number = 0;
    y: number = 0;

    constructor(x: number = 0, y: number = 0) {
        this.x = x; this.y = y;
    }

    reset(x: number = 0, y: number = 0) {
        this.x = x; this.y = 0;
    }
}

export class MathUtils {
    /**角度转弧度 */
    static angle2Radian(angle: number): number {
        return angle * Math.PI / 180;
    }

    /**从min-max取随机数,小数 */
    static randomFloat(min: number, max: number): number {
        return (max - min) * this.seedRandomConst() + min;
    }

    /**从min-max取随机数,整数 */
    static randomInt(min: number, max: number): number {
        return this.randomUtils.randomInt(min , max);
    }

    /**从min-max取随机数,整数 */
    static randomIntReal(min: number, max: number): number {
        return Math.floor(Math.random()* (max - min + 1) + min);
    }

    static randomUtils:RandomUtils = new RandomUtils();
    static seedRandomConst(): number {
        return this.randomUtils.seedRandomConst();
    }

    static setRandomSeed(value: number) {
        this.randomUtils.resetRandomSeed(value);
    }

    static setInPvp(flag: boolean) {
        // this.getFrameIndexFunc = flag ? this.getFrameIndex : this.getServerTime;
    }

    /**随机从数组中取一个元素 */
    static randomGetItemByList(list: any[]): any {
        return this.randomUtils.randomGetItemByList(list);
    }
    /**随机从数组中取一个元素 */
    static randomGetItemByListReal(list: any[]): any {
        if (list.length == 0) return null;
        return list[MathUtils.randomIntReal(0, list.length - 1)];
    }

    static mixItems(items: any[]) {
        let len = items.length;
        let index = 0;
        let randomMax = len - 1;
        for (let i = 0; i < len - 1; i++) {
            index = this.randomInt(i + 1, randomMax);
            if (index != i) {
                let temp = items[index];
                items[index] = items[i];
                items[i] = temp;
            }
        }
    }

    static quadOut (k: number) {
        return k * (2 - k);
    }

    static cubicInOut (k: number) {
        k *= 2;
        if (k < 1) {
            return 0.5 * k * k * k;
        }
        return 0.5 * ((k -= 2) * k * k + 2);
    }

    static quintInOut (k: number) {
        k *= 2;
        if (k < 1) {
            return 0.5 * k * k * k * k * k;
        }
        return 0.5 * ((k -= 2) * k * k * k * k + 2);
    }

    static sineInOut (k: number) {
        return 0.5 * (1 - Math.cos(Math.PI * k));
    }

    static clamp(k: number, min: number, max: number): number {
        if (k < min) {
            k = min;
        } else if (k > max) {
            k = max;
        }
        return k;
    }

    static getDistance(Ax: number, Ay: number, Bx: number, By: number): number {
        return (Math.sqrt(((Ax - Bx) * (Ax - Bx)) + ((Ay - By) * (Ay - By))));
    }

    /**简单的直线距离 */
    static getSimpleDis(ax: number, ay: number, bx: number, by: number): number {
        return Math.abs(ax - bx) + Math.abs(ay - by);
    }

    /**插值
     * k范围(0-1)
     * k=0时返回a;k=1时返回b
     */
    static lerp(a: number, b: number, k: number): number {
        return (b - a) * k + a;
    }

    static getRotate(Ax: number, Ay: number, Bx: number, By: number): number {
        var tempXDistance: number = Bx - Ax;
        var tempYDistance: number = By - Ay;
        return Math.atan2(tempYDistance, tempXDistance);
    }

    //private static division_PI:Number =180 / Math.PI; 
    static getAngleByRotate(rotate: number): number {
        return Math.round(rotate * 180 / Math.PI);
    }

    static getAngle(Ax: number, Ay: number, Bx: number, By: number): number {
        var tempXDistance: number = Bx - Ax;
        var tempYDistance: number = By - Ay;

        var rotation: number = Math.round(Math.atan2(tempYDistance, tempXDistance) * 57.33);
        rotation = (rotation + 360) % 360;
        return rotation;
    }

    static getEDir(angle: number): EDir {
        if (angle > 45 && angle < 135) {
            return EDir.TOP;
        } else if (angle >= 135 && angle < 225) {
            return EDir.LEFT;
        } else if (angle >= 225 && angle < 315) {
            return EDir.BOTTOM;
        }
        return EDir.RIGHT;
    }

    static containsPoint(rect: Rect, x: number, y: number): boolean {
        return rect.x <= x && x <= rect.xMax && rect.y <= y && y <= rect.yMax;
    }

    /**两矩形是否相交 */
    static intersects(a: Rect, b: Rect): boolean {
        return !(a.xMax < b.x || b.xMax < a.x || a.yMax < b.y || b.yMax < a.y);
    }

    /**A是否包含 B */
    static containsRect(a: Rect, b: Rect): boolean {
        return b.x >= a.x && b.x + b.width <= a.x + a.width && b.y >= a.y && b.y + b.height <= a.y + a.height;
    }

    /**点到矩形的距离 */
    static p2RectDis(rect: Rect, p: cc.Vec2) {
        let dx = Math.max(rect.x - p.x, 0, p.x - rect.xMax);
        let dy = Math.max(rect.y - p.y, 0, p.y - rect.yMax);
        return Math.sqrt(dx * dx + dy * dy);
    }

    static checkAngleCoincide(list: number[][], list2: number[][]) {
        let len2 = list2.length;
        let len = list.length;

        let a1, a2, b1, b2;
        for (let j = 0; j < len2; j++) {
            a1 = list2[j][0];
            a2 = list2[j][1];
            for (let i = 0; i < len; i++) {
                b1 = list[i][0];
                b2 = list[i][1];
                if ((a1 >= b1 && a1 <= b2) || (a2 >= b1 && a2 <= b2) ||
                    (b1 >= a1 && b1 <= a2) || (b2 >= a1 && b2 <= a2)) {
                    return true;
                }
            }
        }

        return false;
    }

    /** */
    static calcPathDisList(path: Pos[]):number[] {
        let disList:number[] = [0];
        let dis: number = 0;
        let len = path.length - 1;
        let p1: Pos, p2: Pos;
        for (let i = 0; i < len; i++) {
            p1 = path[i];
            p2 = path[i + 1];
            dis += MathUtils.getSimpleDis(p1.x, p1.y, p2.x, p2.y);
            disList.push(dis);
        }
        return disList;
    }

    static calcPathDis(path: cc.Vec2[], startIndex: number = 0, startPos?: cc.Vec2): number {
        let dis: number = 0;
        let len = path.length - 1;
        let p1: cc.Vec2, p2: cc.Vec2;
        for (let i = startIndex; i < len; i++) {
            p1 = i == startIndex ? (startPos ? startPos : path[i]) : path[i];
            p2 = path[i + 1];
            dis += MathUtils.getSimpleDis(p1.x, p1.y, p2.x, p2.y);
        }
        return dis;
    }

    static isLineIntersectRect(ptStartX: number, ptStartY: number, ptEndX: number, ptEndY: number, rect: Rect): boolean {
        this.ptStart.x = ptStartX;
        this.ptStart.y = ptStartY;

        this.ptEnd.x = ptEndX;
        this.ptEnd.y = ptEndY;

        // 如果有一个点在矩形内
        if (rect.containsPoint(ptStartX, ptStartY) || rect.containsPoint(ptEndX, ptEndY)) {
            return true;
        }

        // 两个点都不在矩形内
        if (this.intersect(ptStartX, ptStartY, ptEndX, ptEndY, rect.x, rect.yMax, rect.x, rect.y))
            return true;
        if (this.intersect(ptStartX, ptStartY, ptEndX, ptEndY, rect.x, rect.y, rect.xMax, rect.y))
            return true;
        if (this.intersect(ptStartX, ptStartY, ptEndX, ptEndY, rect.xMax, rect.y, rect.xMax, rect.yMax))
            return true;
        if (this.intersect(ptStartX, ptStartY, ptEndX, ptEndY, rect.x, rect.yMax, rect.xMax, rect.yMax))
            return true;

        return false;
    }

    /**叉积 */
    static mult(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): number {
        return (x1 - x3) * (y2 - y3) - (x2 - x3) * (y1 - y3);
    }

    static intersect(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number): boolean {
        if (Math.max(x1, x2) < Math.min(x3, x4)) {
            return false;
        }
        if (Math.max(y1, y2) < Math.min(y3, y4)) {
            return false;
        }
        if (Math.max(x3, x4) < Math.min(x1, x2)) {
            return false;
        }
        if (Math.max(y3, y4) < Math.min(y1, y2)) {
            return false;
        }
        if (this.mult(x3, y3, x2, y2, x1, y1) * this.mult(x2, y2, x4, y4, x1, y1) < 0) {
            return false;
        }
        if (this.mult(x1, y1, x4, y4, x3, y3) * this.mult(x4, y4, x2, y2, x3, y3) < 0) {
            return false;
        }
        return true;
    }

    /**获取点到矩形的角度区间 */
    static getAngleP2Rect(pos: cc.Vec2, rect: Rect): number[][] {
        let angle1: number = this.getAngle(pos.x, pos.y, rect.x, rect.y);
        let angle2: number = this.getAngle(pos.x, pos.y, rect.x, rect.yMax);
        let angle3: number = this.getAngle(pos.x, pos.y, rect.xMax, rect.y);
        let angle4: number = this.getAngle(pos.x, pos.y, rect.xMax, rect.yMax);

        let min = Math.min(angle1, angle2, angle3, angle4);
        let max = Math.max(angle1, angle2, angle3, angle4);
        this.tempArr.length = 0;
        if (max - min >= 180) {
            if (angle1 > 180) {
                angle1 -= 360;
            }

            if (angle2 > 180) {
                angle2 -= 360;
            }

            if (angle3 > 180) {
                angle3 -= 360;
            }

            if (angle4 > 180) {
                angle4 -= 360;
            }

            min = Math.min(angle1, angle2, angle3, angle4);
            max = Math.max(angle1, angle2, angle3, angle4);

            this.tempArr = [[min + 360, 360], [0, max]];
        } else {
            this.tempArr = [[min, max]];
        }

        return this.tempArr;
    }

    static turnToLeft(a: number, b: number) {
        if (a < b) {
            return b - a <= a + 360 - b;
        } else {
            return b + 360 - a <= a - b;
        }
    }

    static gapAngle(a: number, b: number) {
        let d = Math.abs(a - b);
        if (d > 180) {
            d = 360 - d;
        }
        return d;
    }

    static ptStart: Point = new Point(0, 0);
    static ptEnd: Point = new Point(0, 0);
    static tempArr: number[][] = [];
}