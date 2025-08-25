import WidgetManagerEx from "./WidgetManagerEx";

const { ccclass, property, executeInEditMode, menu } = cc._decorator;

export enum BorderType {
    TOP,
    BOTTOM,
    LEFT,
    RIGHT,
    CENTER,
}


enum PositionMode {
    ABSOLUTE,   //绝对
    RELATIVE,   //相对
    FIXED,      //固定
}
/**
 * 自由对齐组件
 */
@ccclass
@executeInEditMode
@menu("UI/WidgetFree")
export default class WidgetFree extends cc.Component {
    @property({
        type: cc.Enum(cc.Widget.AlignMode)
    })
    private _alignMode: cc.Widget.AlignMode = cc.Widget.AlignMode.ON_WINDOW_RESIZE;

    @property({
        type: cc.Enum(cc.Widget.AlignMode),
        displayName: "对齐模式"
    })
    get alignMode(): cc.Widget.AlignMode {
        return this._alignMode;
    }
    set alignMode(value: cc.Widget.AlignMode) {
        this._alignMode = value;
    }

    @property({
        type: cc.Enum(PositionMode)
    })
    private _positionMode: PositionMode = PositionMode.ABSOLUTE;

    @property({
        type: cc.Enum(PositionMode),
        displayName: "位置模式",
        tooltip: "ABSOLUTE:绝对\nRELATIVE:相对"
    })
    get positionMode(): PositionMode {
        return this._positionMode;
    }
    set positionMode(value: PositionMode) {
        this.onPositionModeChange();
        this._positionMode = value;
    }

    @property
    private _widgetVertical: boolean = false;
    @property({
        visible() {
            return this._positionMode === PositionMode.RELATIVE;
        },
    })
    public get widgetVertical(): boolean {
        return this._widgetVertical;
    }
    public set widgetVertical(value: boolean) {
        this._widgetVertical = value;
        if (!this._top && this.node.parent) {
            this.top = this.node.parent;
        }
        if (!this._bottom && this.node.parent) {
            this.bottom = this.node.parent;
        }
        this.updateVerticalPercent();
    }

    @property
    private _widgetTop: boolean = false;
    @property({
        visible() {
            return this._positionMode === PositionMode.ABSOLUTE || this._positionMode === PositionMode.FIXED;
        },
    })
    public get widgetTop(): boolean {
        return this._widgetTop;
    }
    public set widgetTop(value: boolean) {
        this._widgetTop = value;
        if (this._widgetTop) {
            if (!this.top && this.node.parent) {
                this.top = this.node.parent;
            }
        }
    }

    @property(cc.Node)
    private _top: cc.Node = null;
    @property(cc.Node)
    public get top(): cc.Node {
        return this._top;
    }
    public set top(value: cc.Node) {
        if (this._top) {
            if (this._positionMode === PositionMode.ABSOLUTE || this._positionMode === PositionMode.FIXED) {
                this.offEvents(this.top, this.updateTop);
                this.offEvents(this.top, this.updateVertical);
            } else {
                this._top.off(cc.Node.EventType.POSITION_CHANGED, this.updateVerticalPercent, this);
            }
        }
        this._top = value;
        if (this.top) {
            if (this._positionMode === PositionMode.ABSOLUTE) {
                this.onEvents(this.top, this.updateTop);
                this.updateOffsetByType(BorderType.TOP);
            } else if (this._positionMode === PositionMode.FIXED) {
                this.updateVertical();
                this.onEvents(this.top, this.updateVertical);
            }
            else {
                this.top.on(cc.Node.EventType.POSITION_CHANGED, this.updateVerticalPercent, this);
                this.updateVerticalPercent();
            }
        } else {
            this._topOffset = 0;
        }
    }

    @property
    private _topOffset: number = 0;
    @property({
        visible() {
            return this._widgetTop && (this._positionMode === PositionMode.ABSOLUTE ||
                this._positionMode === PositionMode.FIXED);
        }
    })
    public get topOffset(): number {
        return this._topOffset;
    }
    public set topOffset(value: number) {
        this._topOffset = value;
        if (this._positionMode === PositionMode.ABSOLUTE) {
            this.updateTop();
        } else {
            this.updateVertical();
        }
    }

    @property
    private _widgetBottom: boolean = false;
    @property({
        visible() {
            return this._positionMode === PositionMode.ABSOLUTE || this._positionMode === PositionMode.FIXED;
        }
    })
    public get widgetBottom(): boolean {
        return this._widgetBottom;
    }
    public set widgetBottom(value: boolean) {
        this._widgetBottom = value;
        if (this._widgetBottom) {
            if (!this.bottom && this.node.parent) {
                this.bottom = this.node.parent;
            }
        }
    }

    @property(cc.Node)
    private _bottom: cc.Node = null;
    @property({
        type: cc.Node,
    })
    public get bottom(): cc.Node {
        return this._bottom;
    }
    public set bottom(value: cc.Node) {
        if (this._bottom) {
            if (this._positionMode === PositionMode.ABSOLUTE || this._positionMode === PositionMode.FIXED) {
                this.offEvents(this._bottom, this.updateBottom);
                this.offEvents(this._bottom, this.updateVertical);
            } else {
                this._bottom.off(cc.Node.EventType.POSITION_CHANGED, this.updateVerticalPercent, this);
            }
        }
        this._bottom = value;
        if (this._bottom) {
            if (this._positionMode === PositionMode.ABSOLUTE) {
                this.onEvents(this.bottom, this.updateBottom);
                this.updateOffsetByType(BorderType.BOTTOM);
            } else if (this._positionMode === PositionMode.FIXED) {
                this.updateVertical();
                this.onEvents(this.bottom, this.updateVertical);
            }
            else {
                this._bottom.on(cc.Node.EventType.POSITION_CHANGED, this.updateVerticalPercent, this);
                this.updateVerticalPercent();
            }

        } else {
            this._bottomOffset = 0;
        }
    }

    @property
    private _bottomOffset: number = 0;
    @property({
        visible() {
            return this._widgetBottom && (this._positionMode === PositionMode.ABSOLUTE ||
                this._positionMode === PositionMode.FIXED);
        },
    })
    public get bottomOffset(): number {
        return this._bottomOffset;
    }
    public set bottomOffset(value: number) {
        this._bottomOffset = value;
        if (this._positionMode === PositionMode.ABSOLUTE) {
            this.updateBottom();
        } else {
            this.updateVertical();
        }
    }

    @property
    private _verticalPercent: number = 0;
    @property({
        visible() {
            return this._positionMode === PositionMode.RELATIVE;
        },
        displayName: "垂直百分比",
        tooltip: "从下到上垂直方向百分比（0-1）",
        min: 0,
        max: 1
    })
    public get verticalPercent(): number {
        return this._verticalPercent;
    }
    public set verticalPercent(value: number) {
        this._verticalPercent = Math.min(1, Math.max(0, value));
        this.updateVerticalPercent();
    }

    @property
    private _widgetHorizantal: boolean = false;
    @property({
        visible() {
            return this._positionMode === PositionMode.RELATIVE;
        },
    })
    public get widgetHorizantal(): boolean {
        return this._widgetHorizantal;
    }
    public set widgetHorizantal(value: boolean) {
        this._widgetHorizantal = value;
        if (!this.left && this.node.parent) {
            this.left = this.node.parent;
        }
        if (!this.right && this.node.parent) {
            this.right = this.node.parent;
        }
        this.updateHorizantalPercent();
    }

    @property
    private _widgetLeft: boolean = false;
    @property({
        visible() {
            return this._positionMode === PositionMode.ABSOLUTE ||
                this._positionMode === PositionMode.FIXED;
        },
    })
    public get widgetLeft(): boolean {
        return this._widgetLeft;
    }
    public set widgetLeft(value: boolean) {
        this._widgetLeft = value;
        if (this._widgetLeft) {
            if (!this.left && this.node.parent) {
                this.left = this.node.parent;
            }
        }
    }

    @property(cc.Node)
    private _left: cc.Node = null;
    @property({
        type: cc.Node,
    })
    public get left(): cc.Node {
        return this._left;
    }
    public set left(value: cc.Node) {
        if (this._left) {
            if (this._positionMode === PositionMode.ABSOLUTE || this._positionMode === PositionMode.FIXED) {
                this.offEvents(this.left, this.updateLeft);
                this.offEvents(this.left, this.updateHorizantal);
            } else {
                this.left.off(cc.Node.EventType.POSITION_CHANGED, this.updateHorizantalPercent, this);
            }
        }
        this._left = value;
        if (this.left) {
            if (this._positionMode === PositionMode.ABSOLUTE) {
                this.onEvents(this.left, this.updateLeft);
                this.updateOffsetByType(BorderType.LEFT);
            } else if (this._positionMode === PositionMode.FIXED) {
                this.updateHorizantal();
                this.onEvents(this.left, this.updateHorizantal);
            }
            else {
                this.left.on(cc.Node.EventType.POSITION_CHANGED, this.updateHorizantalPercent, this);
                this.updateHorizantalPercent();
            }
        } else {
            this._leftmOffset = 0;
        }
    }

    @property
    private _leftmOffset: number = 0;
    @property({
        visible() {
            return this._widgetLeft && (this._positionMode === PositionMode.ABSOLUTE ||
                this._positionMode === PositionMode.FIXED);
        },
    })
    public get leftmOffset(): number {
        return this._leftmOffset;
    }
    public set leftmOffset(value: number) {
        this._leftmOffset = value;
        if (this._positionMode === PositionMode.ABSOLUTE) {
            this.updateLeft();
        } else {
            this.updateHorizantal();
        }
    }

    @property
    private _widgetRight: boolean = false;
    @property({
        visible() {
            return this._positionMode === PositionMode.ABSOLUTE ||
                this._positionMode === PositionMode.FIXED;
        },
    })
    public get widgetRight(): boolean {
        return this._widgetRight;
    }
    public set widgetRight(value: boolean) {
        this._widgetRight = value;
        if (this._widgetRight) {
            if (!this.right && this.node.parent) {
                this.right = this.node.parent;
            }
        }
    }

    @property(cc.Node)
    private _right: cc.Node = null;
    @property({
        type: cc.Node,
    })
    public get right(): cc.Node {
        return this._right;
    }
    public set right(value: cc.Node) {
        if (this._right) {
            if (this._positionMode === PositionMode.ABSOLUTE || this._positionMode === PositionMode.FIXED) {
                this.offEvents(this.right, this.updateRight);
                this.offEvents(this.right, this.updateHorizantal);
            } else {
                this.right.off(cc.Node.EventType.POSITION_CHANGED, this.updateHorizantalPercent, this);
            }
        }
        this._right = value;
        if (this.right) {
            if (this._positionMode === PositionMode.ABSOLUTE) {
                this.onEvents(this.right, this.updateRight);
                this.updateOffsetByType(BorderType.RIGHT);
            } else if (this._positionMode === PositionMode.FIXED) {
                this.updateHorizantal();
                this.onEvents(this.right, this.updateHorizantal);
            }
            else {
                this.right.on(cc.Node.EventType.POSITION_CHANGED, this.updateHorizantalPercent, this);
                this.updateHorizantalPercent();
            }
        } else {
            this._rightOffset = 0;
        }
    }

    @property
    private _rightOffset: number = 0;
    @property({
        visible() {
            return this._widgetRight && (this._positionMode === PositionMode.ABSOLUTE ||
                this._positionMode === PositionMode.FIXED);
        },
    })
    public get rightOffset(): number {
        return this._rightOffset;
    }
    public set rightOffset(value: number) {
        this._rightOffset = value;
        if (this._positionMode === PositionMode.ABSOLUTE) {
            this.updateRight();
        } else {
            this.updateHorizantal();
        }
    }

    @property
    private _horizantalPercent: number = 0;
    @property({
        visible() {
            return this._positionMode === PositionMode.RELATIVE;
        },
        displayName: "水平百分比",
        tooltip: "从左到右水平方向百分比(0-1)",
        min: 0,
        max: 1
    })
    public get horizantalPercent(): number {
        return this._horizantalPercent;
    }
    public set horizantalPercent(value: number) {
        this._horizantalPercent = Math.min(1, Math.max(0, value));
        this.updateHorizantalPercent();
    }

    private _layoutDirty = true;
    public get layoutDirty() {
        return this._layoutDirty;
    }
    public set layoutDirty(value) {
        this._layoutDirty = value;
    }

    private _enableUpdateOffset: boolean = true;
    private _isDisable: boolean = false;

    protected onLoad(): void {
        WidgetManagerEx.getInstance().registerWidget(this);
    }

    protected onDestroy(): void {
        WidgetManagerEx.getInstance().unregisterWidget(this);
    }

    onEnable() {
        if (CC_EDITOR) {
            if (this.top) {
                this._positionMode !== PositionMode.RELATIVE ?
                    this.onEvents(this.top, this._positionMode === PositionMode.ABSOLUTE ? this.updateTop : this.updateVertical) :
                    this.top.on(cc.Node.EventType.POSITION_CHANGED, this.updateVerticalPercent, this);
            }
            if (this.bottom) {
                this._positionMode !== PositionMode.RELATIVE ?
                    this.onEvents(this.bottom, this._positionMode === PositionMode.ABSOLUTE ? this.updateBottom : this.updateVertical) :
                    this.bottom.on(cc.Node.EventType.POSITION_CHANGED, this.updateVerticalPercent, this);
            }
            if (this.left) {
                this._positionMode !== PositionMode.RELATIVE ?
                    this.onEvents(this.left, this._positionMode === PositionMode.ABSOLUTE ? this.updateLeft : this.updateHorizantal) :
                    this.left.on(cc.Node.EventType.POSITION_CHANGED, this.updateHorizantalPercent, this);
            }
            if (this.right) {
                this._positionMode !== PositionMode.RELATIVE ?
                    this.onEvents(this.right, this._positionMode === PositionMode.ABSOLUTE ? this.updateRight : this.updateHorizantal) :
                    this.right.on(cc.Node.EventType.POSITION_CHANGED, this.updateHorizantalPercent, this);
            }

            if (this._positionMode !== PositionMode.RELATIVE) {
                this.onEvents(this.node, this.updateOffset)
            } else {
                this.node.on(cc.Node.EventType.POSITION_CHANGED, this.updatePercent, this);
            }
        }
        if (this._isDisable) {
            this.updateLayout();
            this._isDisable = false;
        }
    }

    protected onDisable(): void {
        if (CC_EDITOR) {
            if (this.top) {
                this._positionMode !== PositionMode.RELATIVE ?
                    this.offEvents(this.top, this._positionMode === PositionMode.ABSOLUTE ? this.updateTop : this.updateVertical) :
                    this.top.off(cc.Node.EventType.POSITION_CHANGED, this.updateVerticalPercent, this);
            }
            if (this.bottom) {
                this._positionMode !== PositionMode.RELATIVE ?
                    this.offEvents(this.bottom, this._positionMode === PositionMode.ABSOLUTE ? this.updateBottom : this.updateVertical) :
                    this.bottom.off(cc.Node.EventType.POSITION_CHANGED, this.updateVerticalPercent, this);
            }
            if (this.left) {
                this._positionMode !== PositionMode.RELATIVE ?
                    this.offEvents(this.left, this._positionMode === PositionMode.ABSOLUTE ? this.updateLeft : this.updateHorizantal) :
                    this.left.off(cc.Node.EventType.POSITION_CHANGED, this.updateHorizantalPercent, this);
            }
            if (this.right) {
                this._positionMode !== PositionMode.RELATIVE ?
                    this.offEvents(this.right, this._positionMode === PositionMode.ABSOLUTE ? this.updateRight : this.updateHorizantal) :
                    this.right.off(cc.Node.EventType.POSITION_CHANGED, this.updateHorizantalPercent, this);
            }

            if (this._positionMode !== PositionMode.RELATIVE) {
                this.offEvents(this.node, this.updateOffset)
            } else {
                this.node.off(cc.Node.EventType.POSITION_CHANGED, this.updatePercent, this);
            }
        }
        this._isDisable = true;
    }

    public updateLayout() {
        if (this._positionMode === PositionMode.ABSOLUTE) {
            this.updateTop();
            this.updateBottom();
            this.updateLeft();
            this.updateRight();
        } else if (this._positionMode === PositionMode.FIXED) {
            this.updateHorizantal();
            this.updateVertical();
        } else {
            this.updatePercent();
        }
    }

    private updateOffset() {
        this.updateOffsetByType(BorderType.TOP);
        this.updateOffsetByType(BorderType.BOTTOM);
        this.updateOffsetByType(BorderType.LEFT);
        this.updateOffsetByType(BorderType.RIGHT);
    }

    public updateOffsetByType(type: BorderType) {
        if (!this._enableUpdateOffset) return;
        switch (type) {
            case BorderType.TOP:
                if (this.top) {
                    this._topOffset = this.node.y + this.node.height * (1 - this.node.anchorY) -
                        this.getLocalBorder(this.top, type);
                }
                break;
            case BorderType.BOTTOM:
                if (this.bottom) {
                    this._bottomOffset = this.node.y - this.node.anchorY * this.node.height -
                        this.getLocalBorder(this.bottom, type);
                }
                break;
            case BorderType.LEFT:
                if (this.left) {
                    this._leftmOffset = this.node.x - this.node.width * this.node.anchorX -
                        this.getLocalBorder(this.left, type);
                }
                break;
            case BorderType.RIGHT:
                if (this.right) {
                    this._rightOffset = this.node.x + this.node.width * (1 - this.node.anchorX) -
                        this.getLocalBorder(this.right, type);
                }
                break;
        }
    }

    private updateTop() {
        if (!this.widgetTop) return;
        this._enableUpdateOffset = false;
        let top = this.node.y + this.node.height * (1 - this.node.anchorY);
        if (this.top) {
            let local = this.node.parent ?
                this.node.parent.convertToNodeSpaceAR(cc.v2(0, this.getWorldBorder(this.top, BorderType.TOP))) :
                cc.v2(0, this.getWorldBorder(this.top, BorderType.TOP));
            top = local.y + this.topOffset;
        }

        if (this.bottom && this.widgetBottom) {
            this.node.height = Math.max(0, top - (this.node.y - this.node.anchorY * this.node.height));
        }
        this.node.y = top - this.node.height + this.node.anchorY * this.node.height;
        this._enableUpdateOffset = true;
    }

    private updateBottom() {
        if (!this.widgetBottom) return;
        this._enableUpdateOffset = false;
        let bottom = this.node.y - this.node.anchorY * this.node.height;
        if (this.bottom) {
            let local = this.node.parent ? this.node.parent.convertToNodeSpaceAR(cc.v2(0, this.getWorldBorder(this.bottom, BorderType.BOTTOM))) :
                cc.v2(0, this.getWorldBorder(this.bottom, BorderType.BOTTOM));
            bottom = local.y + this.bottomOffset;
        }
        if (this.top && this.widgetTop) {
            this.node.height = Math.max(0, this.node.y + this.node.height * (1 - this.node.anchorY) - bottom);
        }
        this.node.y = bottom + this.node.height * this.node.anchorY;
        this._enableUpdateOffset = true;
    }

    private updateLeft() {
        if (!this.widgetLeft) return;
        this._enableUpdateOffset = false;
        let left = this.node.x - this.node.width * this.node.anchorX;
        if (this.left) {
            let local = this.node.parent ? this.node.parent.convertToNodeSpaceAR(cc.v2(this.getWorldBorder(this.left, BorderType.LEFT), 0)) :
                cc.v2(this.getWorldBorder(this.left, BorderType.LEFT), 0);
            left = local.x + this.leftmOffset;
        }

        if (this.right && this.widgetRight) {
            this.node.width = Math.max(0, this.node.x + this.node.width * (1 - this.node.anchorX) - left);
        }
        this.node.x = left + this.node.width * this.node.anchorX;
        this._enableUpdateOffset = true;
    }

    private updateRight() {
        if (!this.widgetRight) return;
        this._enableUpdateOffset = false;
        let right = this.node.x + this.node.width * (1 - this.node.anchorX);
        if (this.right) {
            let local = this.node.parent ? this.node.parent.convertToNodeSpaceAR(cc.v2(this.getWorldBorder(this.right, BorderType.RIGHT), 0)) :
                cc.v2(this.getWorldBorder(this.right, BorderType.RIGHT), 0);
            right = local.x + this.rightOffset;
        }
        if (this.left && this.widgetLeft) {
            this.node.width = Math.max(0, right - (this.node.x - this.node.width * this.node.anchorX));
        }
        this.node.x = right - this.node.width + this.node.width * this.node.anchorX;
        this._enableUpdateOffset = true;
    }

    private getLocalBorder(node: cc.Node, type: BorderType) {
        let result: number = 0;
        switch (type) {
            case BorderType.TOP:
                result = this.node.parent.convertToNodeSpaceAR(cc.v2(0, this.getWorldBorder(node, type))).y;
                break;
            case BorderType.BOTTOM:
                result = this.node.parent.convertToNodeSpaceAR(cc.v2(0, this.getWorldBorder(node, type))).y;
                break;
            case BorderType.LEFT:
                result = this.node.parent.convertToNodeSpaceAR(cc.v2(this.getWorldBorder(node, type), 0)).x;
                break;
            case BorderType.RIGHT:
                result = this.node.parent.convertToNodeSpaceAR(cc.v2(this.getWorldBorder(node, type), 0)).x;
                break;
        }
        return result;
    }

    private getWorldBorder(node: cc.Node, type: BorderType) {
        let result: number = 0;
        switch (type) {
            case BorderType.TOP:
                result = node.y + node.height * (1 - node.anchorY);
                if (node.parent) {
                    result = node.parent.convertToWorldSpaceAR(cc.v2(0, result)).y;
                }
                break;
            case BorderType.BOTTOM:
                result = node.y - node.height * node.anchorY;
                if (node.parent) {
                    result = node.parent.convertToWorldSpaceAR(cc.v2(0, result)).y;
                }
                break;
            case BorderType.LEFT:
                result = node.x - node.width * node.anchorX;
                if (node.parent) {
                    result = node.parent.convertToWorldSpaceAR(cc.v2(result, 0)).x;
                }
                break;
            case BorderType.RIGHT:
                result = node.x + node.width * (1 - node.anchorX);
                if (node.parent) {
                    result = node.parent.convertToWorldSpaceAR(cc.v2(result, 0)).x;
                }
                break;
        }
        return result;
    }

    private updatePercent() {
        this.updateVerticalPercent();
        this.updateHorizantalPercent();
    }

    private updateHorizantalPercent() {
        if (!this._widgetHorizantal || !this.left || !this.right) return;
        let leftLocal = this.node.parent ? this.node.parent.convertToNodeSpaceAR(cc.v2(this.getWorldBorder(this.left, BorderType.LEFT), 0)) :
            cc.v2(this.getWorldBorder(this.left, BorderType.LEFT), 0);
        let rightLocal = this.node.parent ? this.node.parent.convertToNodeSpaceAR(cc.v2(this.getWorldBorder(this.right, BorderType.RIGHT), 0)) :
            cc.v2(this.getWorldBorder(this.right, BorderType.RIGHT), 0);

        this.node.x = leftLocal.x + (rightLocal.x - leftLocal.x) * this._horizantalPercent;
    }

    private updateVerticalPercent() {
        if (!this._widgetVertical || !this.top || !this.bottom) return;
        let topLocal = this.node.parent ?
            this.node.parent.convertToNodeSpaceAR(cc.v2(0, this.getWorldBorder(this.top, BorderType.TOP))) :
            cc.v2(0, this.getWorldBorder(this.top, BorderType.TOP));
        let bottomLocal = this.node.parent ? this.node.parent.convertToNodeSpaceAR(cc.v2(0, this.getWorldBorder(this.bottom, BorderType.BOTTOM))) :
            cc.v2(0, this.getWorldBorder(this.bottom, BorderType.BOTTOM));
        this.node.y = bottomLocal.y + (topLocal.y - bottomLocal.y) * this._verticalPercent;
    }

    private updateVertical() {
        if (!this.top || !this.bottom || !this._widgetTop || !this._widgetBottom) return;
        this._enableUpdateOffset = false;
        let top = this.getWorldBorder(this.top, BorderType.TOP) + this._topOffset;
        let bottom = this.getWorldBorder(this.bottom, BorderType.BOTTOM) + this._bottomOffset;
        this.node.height = Math.abs(top - bottom);
        this._enableUpdateOffset = true;
    }

    private updateHorizantal() {
        if (!this.right || !this.left || !this._widgetRight || !this._widgetLeft) return;
        this._enableUpdateOffset = false;
        let right = this.getWorldBorder(this.right, BorderType.RIGHT) + this._rightOffset;
        let left = this.getWorldBorder(this.left, BorderType.LEFT) + this._leftmOffset;
        this.node.width = Math.abs(right - left);
        this._enableUpdateOffset = true;
    }

    private onEvents(target: cc.Node, callback: Function) {
        target.on(cc.Node.EventType.SIZE_CHANGED, callback, this);
        target.on(cc.Node.EventType.ANCHOR_CHANGED, callback, this);
        target.on(cc.Node.EventType.POSITION_CHANGED, callback, this);
        target.on(cc.Node.EventType.SCALE_CHANGED, callback, this);
    }

    private offEvents(target: cc.Node, callback: Function) {
        target.off(cc.Node.EventType.SIZE_CHANGED, callback, this);
        target.off(cc.Node.EventType.ANCHOR_CHANGED, callback, this);
        target.off(cc.Node.EventType.POSITION_CHANGED, callback, this);
        target.off(cc.Node.EventType.SCALE_CHANGED, callback, this);
    }

    private onPositionModeChange() {
        this.right = null;
        this.left = null;
        this.top = null;
        this.bottom = null;
        this._widgetVertical = false;
        this._widgetHorizantal = false;
        this._widgetTop = false;
        this._widgetBottom = false;
        this._widgetLeft = false;
        this._widgetBottom = false;
    }
}
