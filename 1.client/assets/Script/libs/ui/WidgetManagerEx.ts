import WidgetFree from "./WidgetFree";

export default class WidgetManagerEx {
    private static _instance: WidgetManagerEx = null;
    public static getInstance(): WidgetManagerEx {
        return this._instance || (this._instance = new WidgetManagerEx());
    }

    private _widgets: WidgetFree[] = [];

    constructor() {
        cc.director.on(cc.Director.EVENT_AFTER_UPDATE, this.update, this);
        cc.view.on("canvas-resize", this.onCanvasResize, this);
    }

    public registerWidget(widget: WidgetFree) {
        widget.layoutDirty = true;
        this._widgets.push(widget);
    }

    public unregisterWidget(widget: WidgetFree) {
        let index = this._widgets.indexOf(widget);
        if (index !== -1) {
            this._widgets.splice(index, 1);
            return true;
        }
        return false;
    }

    private update() {
        let widget: WidgetFree;
        for (let i = 0; i < this._widgets.length; i++) {
            widget = this._widgets[i];
            if (widget.enabled && widget.layoutDirty) {
                widget.updateLayout();
                switch (widget.alignMode) {
                    case cc.Widget.AlignMode.ON_WINDOW_RESIZE:
                        widget.layoutDirty = false;
                        break;
                    case cc.Widget.AlignMode.ONCE:
                        if (this.unregisterWidget(widget)) {
                            i--;
                        }
                        break;
                }
            }
        }
    }

    private onCanvasResize() {
        for (let i = 0; i < this._widgets.length; i++) {
            if (this._widgets[i].alignMode === cc.Widget.AlignMode.ON_WINDOW_RESIZE) {
                this._widgets[i].layoutDirty = true;
            }
        }
    }
}
