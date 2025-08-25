


const { ccclass, property ,menu} = cc._decorator;

@ccclass
@menu("Game/utls/PageTexure")
export class PageTexure extends cc.Component {

    @property
    flipY:boolean = false;

    private _render:cc.MeshRenderer = null;
    private _material: cc.Material = null;
    private _mesh:cc.Mesh = null;
    private _localVertexes:cc.Vec2[] = [];
    private _uv0Vertices:cc.Vec2[] = [];

    private _height = 0;
    private _width = 0;
    private _len = 20;
    private _updateFunc:Function = this.none;
    private _angle:number = 0;

    protected onLoad(): void {
        this._render = this.node.getComponent(cc.MeshRenderer);
        if (!this._render) {
            this._render = this.node.addComponent(cc.MeshRenderer);
        }

        this._material = this._render.getMaterial(0);
    }

    start() {
        this._height = this.node.height;
        this._width = this.node.width;
        let vertexCount = this._len * 2;
        var vfmt = new cc['gfx'].VertexFormat([
            { name: cc['gfx'].ATTR_POSITION, type: cc['gfx'].ATTR_TYPE_FLOAT32, num: 2 },
            { name: cc['gfx'].ATTR_UV0, type: cc['gfx'].ATTR_TYPE_FLOAT32, num: 2 },
        ]);
        
        let mesh = new cc.Mesh();
        mesh.init(vfmt, vertexCount, true);
        this._mesh = mesh;
        
        let uv0Vertices:cc.Vec2[] = [];
        let yList:number[] = this.flipY ? [1 ,  0] : [0 ,  1];
        let dx = 1 / (this._len - 1);
        for (let j = 0 ; j < 2 ; j ++) {
            let y = yList[j];
            for (let i = 0 ; i < this._len ; i++) {
                let x = i == this._len - 1 ? 1 : i * dx;
                uv0Vertices.push(cc.v2(x , y));
            }
        }

        let posVertices:cc.Vec2[] = [];
        dx = this._width / (this._len - 1);
        yList = [this._height , 0];
        for (let j = 0 ; j < 2 ; j ++) {
            let y = yList[j];
            for (let i = 0 ; i < this._len ; i++) {
                let x = i == this._len - 1 ? this._width : i * dx;
                posVertices.push(cc.v2(x , y));
            }
        }

        this._localVertexes = posVertices.slice();
        this._uv0Vertices = uv0Vertices;

        mesh.setVertices(cc['gfx'].ATTR_POSITION, posVertices);
        mesh.setVertices(cc['gfx'].ATTR_UV0, uv0Vertices);

        let indices:number[] = [];
        for (let i = 0 ; i < this._len - 1; i++) {
            //
            indices.push(i);
            indices.push(i + 1);
            indices.push(i + this._len);
            //
            indices.push(i + 1);
            indices.push(i + this._len);
            indices.push(i + this._len + 1);
        }

        mesh.setIndices(indices);
        this._render.mesh = mesh;
        this._mesh = mesh;
    }

    private updateRenderData () {
        // 左下角的坐标
        // 根据角度获得控制点的位置
        let ctrlPosData = this._getCtrlPosByAngle(this._width);
        let startPos = ctrlPosData.startPos;
        let endPos = ctrlPosData.endPos;
        let ctrlPos1 = ctrlPosData.ctrlPos1;
        let ctrlPos2 = ctrlPosData.ctrlPos2;
        // 记录各个顶点的位置
        let bezierPosList: cc.Vec2[] = [];
        bezierPosList[0] = startPos;
        // 当前所有顶点连线的总长
        let realWidth = 0;
        // 上一个点的纹理坐标
        let lastU = 0;
        // 下一个点的纹理坐标
        let nextU = 0;

        for (let i = 1; i < this._len; i++) {
            let isTail = i === this._len - 1
            let lastBezierPos = bezierPosList[i - 1]
            let nextBezierPos = this._getBezierPos(i / (this._len - 1) , startPos, endPos, ctrlPos1, ctrlPos2)
            let fixedData = this._fixWidth(lastBezierPos, nextBezierPos, this._width, realWidth, isTail)
            let gapWidth = fixedData.gapWidth
            nextBezierPos = fixedData.nextBezierPos
            realWidth += gapWidth
            bezierPosList[i] = nextBezierPos
            // 根据当前小矩形的宽度占总长度的比例来计算纹理坐标的间隔
            let gapU = gapWidth / this._width
            nextU = lastU + gapU;

            this._localVertexes[i - 1].x = lastBezierPos.x;
            this._localVertexes[i - 1].y = lastBezierPos.y + this._height;
            this._localVertexes[i - 1 + this._len].x = lastBezierPos.x;
            this._localVertexes[i - 1 + this._len].y = lastBezierPos.y;

            this._uv0Vertices[i - 1].x = lastU;
            this._uv0Vertices[i - 1 + this._len].x = lastU;


            this._localVertexes[i].x = nextBezierPos.x;
            this._localVertexes[i].y = nextBezierPos.y + this._height;
            this._localVertexes[i + this._len].x = nextBezierPos.x;
            this._localVertexes[i + this._len].y = nextBezierPos.y;

            this._uv0Vertices[i].x = nextU;
            this._uv0Vertices[i + this._len].x = nextU;
            lastU = nextU;
        }

        this._mesh.setVertices(cc['gfx'].ATTR_POSITION, this._localVertexes);
        this._mesh.setVertices(cc['gfx'].ATTR_UV0, this._uv0Vertices);
        
    }

    setTexture(texture:cc.RenderTexture) {
        if (this._material) {
            this._material.setProperty('texture', texture);
        }
    }

    set angle(value:number) {
        if (value < 0) value = 0;
        this._angle = value;
        this.updateRenderData();
    }

    get angle():number {
        return this._angle;
    }

    private _toAngle:number = 0;
    private _dy = 0;
    private _dyChange:number = 0;

    autoToLeft() {
        this._toAngle = 180;
        this._dy = 1;
        this._dyChange = 0.1;
        this._updateFunc = this.enterFrame;
    }

    autoToRight() {
        this._toAngle = 0;
        this._dy = -1;
        this._dyChange = -0.1;
        this._updateFunc = this.enterFrame;
    }
    
    update (dt) {
        this._updateFunc();
    }

    private none() {

    }

    private enterFrame() {
        if (this._dy > 0 && this.angle >= this._toAngle) return this.playEnd();
        if (this._dy < 0 && this.angle <= this._toAngle) return this.playEnd();
        this.angle += this._dy;
        this._dy += this._dyChange;
    }

    private playEnd() {
        this._updateFunc = this.none;
    }

    private _getCtrlPosByAngle(width: number): {startPos: cc.Vec2, endPos: cc.Vec2, ctrlPos1: cc.Vec2, ctrlPos2: cc.Vec2} {
        let startPos = new cc.Vec2(0, 0)
        let endPos = null
        let ctrlPos1 = null
        let ctrlPos2 = null
        let rad = this.angle * Math.PI / 180
        let per = rad * 2 / Math.PI
        if(this.angle <= 90) {
            // 终点的x坐标变换 width => 0，速度先慢后快，使用InCubic缓动函数
            let endPosX = width * (1 - Math.pow(per, 3))
            // InCubic
            // 终点的y坐标变换 0 => width / 4, 速度先快后慢，使用OutQuart缓动函数
            let endPosY = width / 4 * (1 - Math.pow(1 - per, 4))
            endPos = new cc.Vec2(endPosX, endPosY)

            // 中间两个控制点坐标匀速变换
            // x坐标 width => width * 3 / 4
            let ctrlPosX = width * (1 - 1 / 4 * per)
            // 控制点1y坐标 0 => width / 16
            let ctrlPos1Y = width * 1 / 16 * per
            // 控制点2y坐标 0 => width * 3 / 16
            let ctrlPos2Y = width * 3 / 16 * per
            ctrlPos1 = new cc.Vec2(ctrlPosX, ctrlPos1Y)
            ctrlPos2 = new cc.Vec2(ctrlPosX, ctrlPos2Y)
        } else {
            per = per - 1
            // 终点的x坐标变换 0 => width，速度先快后慢，使用OutCubic缓动函数
            let endPosX = - width * (1 - Math.pow(1 - per, 3))
            // 终点的y坐标变换 width / 4 => 0, 速度先慢后快，使用InQuart缓动函数
            let endPosY = width / 4 * (1 - Math.pow(per, 4))
            endPos = new cc.Vec2(endPosX, endPosY)

            // 控制点1x坐标 width * 3 / 4 => 0
            let ctrlPos1X = width * 3 / 4 * (1 - per)
            // 控制点2x坐标 width * 3 / 4 => 0
            let ctrlPos2X = width * 3 / 4 * Math.pow(1 - per, 3)
            // 控制点1y坐标 width / 16 => 0
            let ctrlPos1Y = width * 1 / 16 *  (1 - per)
            // 控制点2y坐标 width * 3 / 16 => 0
            let ctrlPos2Y = width * 3 / 16 * (1 - Math.pow(per, 4))
            ctrlPos1 = new cc.Vec2(ctrlPos1X, ctrlPos1Y)
            ctrlPos2 = new cc.Vec2(ctrlPos2X, ctrlPos2Y)
        }

        return {
            startPos: startPos,
            endPos: endPos,
            ctrlPos1: ctrlPos1,
            ctrlPos2: ctrlPos2
        }
    }

    // 修正宽度
    private _fixWidth(lastBezierPos: cc.Vec2, nextBezierPos: cc.Vec2, width: number, realWidth: number, isTail: boolean) {
        let deltaVector = nextBezierPos.sub(lastBezierPos)
        // 两个顶点的间距
        let gapWidth = deltaVector.mag()
        // 当前的总长
        let curWidth = realWidth + gapWidth
        if(isTail) {
            // 如果是最后一个顶点则将总长度修正至书页的真实宽度
            gapWidth = width - realWidth
            let direction = deltaVector.normalize()
            nextBezierPos = lastBezierPos.add(direction.mul(gapWidth))
        } else if(curWidth >= width) {
            // 如果当前总长超过了书页的真实宽度，就衰减超过部分的1.1倍
            let delta = curWidth - width
            gapWidth = gapWidth - delta * 1.1
            gapWidth = Math.max(0, gapWidth)
            let direction = deltaVector.normalize()
            nextBezierPos = lastBezierPos.add(direction.mul(gapWidth))
        }

        return {
            gapWidth: gapWidth,
            nextBezierPos: nextBezierPos,
        }
    }

    // 贝塞尔曲线公式
    private _getBezierPos(t: number, startPos: cc.Vec2, endPos: cc.Vec2, ctrlPos1: cc.Vec2, ctrlPos2: cc.Vec2): cc.Vec2 {
        startPos = startPos.mul(Math.pow(1 - t, 3))
        ctrlPos1 = ctrlPos1.mul(3 * t * Math.pow(1 - t, 2))
        ctrlPos2 = ctrlPos2.mul(3 * (1 - t) * Math.pow(t, 2))
        endPos = endPos.mul(Math.pow(t, 3))
        return startPos.add(ctrlPos1.add(ctrlPos2.add(endPos)))
    }
}