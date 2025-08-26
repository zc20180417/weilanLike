export class Pos {
    x:number = 0;
    y:number = 0;

    constructor() {

    }

    setPos(x:number, y:number) {
        this.x = x;
        this.y = y;
    }

    public toString() {
        return '(' + this.x + ', ' + this.y + ')';
    }

    static getPos(x:number = 0, y:number = 0):Pos {
        let point:Pos = this.getPointFromPool();
        point.setPos(x, y);
        return point;
    }

    static returnPos(point:Pos) {
        this.pool.push(point);
    }

    private static pool:Pos[] = [];
    private static getPointFromPool():Pos {
        if (this.pool.length > 0) {
            return this.pool.pop();
        } else {
            return new Pos();
        }
    }

}