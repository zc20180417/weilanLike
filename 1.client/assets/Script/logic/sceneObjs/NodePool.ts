export class NodePool {
    private _list:cc.Node[] = [];
    private _len:number = 0;

    put(node:cc.Node) {
        node.active = false;

        if (this._list.indexOf(node) == -1) {
            this._list[this._len] = node;
            this._len ++;
        }

    }

    get():cc.Node {
        if (this._len <= 0) return null;
        let node:cc.Node = this._list.pop();
        node.active = true;
        this._len --;
        return node;
    }

    size():number {
        return this._len;
    }

    clear() {
        let node:cc.Node;
        for (let i = this._len - 1 ; i >= 0 ; i--) {
            node = this._list[i];
            if (node && node.parent && node.isValid) {
                node.removeFromParent();
                node.destroy();
            }
        }
        this._list = [];
        this._len = 0;
    }
}

