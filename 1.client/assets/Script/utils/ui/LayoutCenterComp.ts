

const { ccclass, property, executeInEditMode ,menu } = cc._decorator;
 @ccclass
@executeInEditMode
@menu("Game/utls/LayoutCenterComp")
export default class CenterLayout extends cc.Component {

    @property({ type: cc.Integer, tooltip: '子节点之间的水平间距' })
    set spacingX(value: number) {
        this._spacingX = value;
        this.layout();
    }
    get spacingX() {
        return this._spacingX;
    }
    @property({ type: cc.Integer, tooltip: '子节点之间的垂直间距' })
    set spacingY(value: number) {
        this._spacingY = value;
        this.layout();
    }
    get spacingY() {
        return this._spacingY;
    }

    @property({ type: cc.Integer, tooltip: '子节点宽度' })
    set gridWidth(value: number) {
        this._gridWidth = value;
        this.layout();
    }
    get gridWidth() {
        return this._gridWidth;
    }

    @property({ type: cc.Integer, tooltip: '子节点宽度' })
    set gridHeight(value: number) {
        this._gridHeight = value;
        this.layout();
    }
    get gridHeight() {
        return this._gridHeight;
    }

    @property
    private _spacingX = 0;
    @property
    private _spacingY = 0;
    @property
    private _gridWidth = 0;
    @property
    private _gridHeight = 0;

    start() {
        this.layout();
    }
    onEnable() {
        this.node.on(cc.Node.EventType.CHILD_ADDED, this.layout, this);
        this.node.on(cc.Node.EventType.CHILD_REMOVED, this.layout, this);
    }
    onDisable() {
        this.node.off(cc.Node.EventType.CHILD_ADDED, this.layout, this);
        this.node.off(cc.Node.EventType.CHILD_REMOVED, this.layout, this);
    }
    
    private layout() {
        let children = this.node.children;
        let len = 0;
        let layoutList:cc.Node[] = [];
        children.forEach(element => {
            element.on('active-in-hierarchy-changed', this.layout, this);
            if (element.active) {
                len ++;
                layoutList.push(element);
            }
        });

        const cellHeight = this._spacingY + this._gridHeight;
        const cellWidth = this._spacingX + this._gridWidth;
        let colCount = Math.max(Math.floor(this.node.width / cellWidth) , 1);
        
        if ((colCount + 1) * cellWidth - this._spacingX <= this.node.width) {
            colCount ++;
        }
        const rowCount = Math.max(Math.ceil(len / colCount) , 1);
        const startY = ((rowCount * cellHeight - this._spacingY) - this._gridHeight) * 0.5;
        const fullStartX = -(colCount * cellWidth - this._spacingX - this._gridWidth) * 0.5;
        const lastRowCount = len % colCount;
        const lastRowStartX = -(lastRowCount * cellWidth - this._spacingX - this._gridWidth) * 0.5;

        let item:cc.Node;
        let index = 0;

        // for (let i = 0; i < len; i++) {
        //     const element = layoutList[i];
        //     element.y = startY - cellHeight * Math.floor(i / colCount);
        //     element.x = 
        // }


        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                item = layoutList[index];
                if (item) {
                    index ++;
                    item.y = startY - cellHeight * i;
                    if (i == rowCount - 1 && lastRowCount > 0) {
                        item.x = lastRowStartX + cellWidth * j;
                    } else {
                        item.x = fullStartX + cellWidth * j;
                    }
                }
            }
            
        }
        
    }
}