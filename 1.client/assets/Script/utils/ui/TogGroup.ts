const {ccclass, property, menu} = cc._decorator;
@ccclass
@menu("Game/utils/TogGroup")
export default class TogGroup extends cc.Component {

    @property([cc.Node])
    toggles:cc.Node[] = []

    private _togs:cc.Toggle[] = [];

    @property([cc.String])
    flags:string[] = [];


    @property([cc.Label])
    titleLabels:cc.Label[] = [];

    

    @property(cc.Color)
    selectColor:cc.Color = null;

    @property(cc.Color)
    unSelectColor:cc.Color = null;

    private _selectTog:cc.Node;
    private _selectIndex:number = -1;

    onLoad() {
        for(let i=0;i<this.toggles.length;i++) {
            let node = this.toggles[i];
            node.on("toggle", this.onTogValueChanged, this);

            let toggle = node.getComponent(cc.Toggle);
            this._togs[i] = toggle;
            if(toggle && toggle.isChecked){
                this._selectTog = node;
            }
        }

        this.refreshLabel();
    }

    start() {
        if (this._selectIndex != -1) {
            this.selectedIndex = this._selectIndex;
        }
    }

    onTogValueChanged(e:any) {
        if(this._selectTog == e.node) return;

        this._selectTog = e.node;
        let index = this.toggles.indexOf(e.node);
        if(index >= 0){
            this.node.emit("valueChange", this.flags[index]);
        }

        this.refreshLabel();
    }

    get selectedNode():cc.Node{
        return this._selectTog;
    }
    
    get selectedIndex():number{
        return this.toggles.indexOf(this._selectTog);
    }

    get selectedFlag():string{
        let index = this.selectedIndex;
        if(index >= 0){
            return this.flags[index];
        }
        return null;
    }

    set selectedFlag(v:string){
        for(let i=0;i<this.flags.length;i++){
            if(this.flags[i] == v){
                this.selectedIndex = i;
                break;
            }
        }
    }

    set selectedIndex(index:number) {
        this._selectIndex = index;
        if (this._togs.length == 0) return;
        let tog = this._togs[index];
        tog.isChecked = true;
        this._selectTog = tog.node;
        this.node.emit("valueChange", this.flags[index]);
        this.refreshLabel();
    }

    private refreshLabel() {
        if (this.titleLabels.length <= 0 || !this.selectColor || !this.unSelectColor) return;
        for(let i= 0 ;i < this._togs.length ;i ++) {
            let tog = this._togs[i];
            let label = this.titleLabels[i];
            if (label) {
                label.node.color = tog.isChecked ? this.selectColor : this.unSelectColor;
            }
        }
    }
}