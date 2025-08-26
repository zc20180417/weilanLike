import Dialog from "../../utils/ui/Dialog";

const { ccclass, property ,menu } = cc._decorator;

@ccclass
@menu('Game/ui/active-taqing/ActiveTaqingHelpView')
export class ActiveTaqingHelpView extends Dialog {

    @property(cc.Label)
    label2:cc.Label = null;

    private str = '';
    setData(data:any) {
        this.str = data;
    }

    protected beforeShow(): void {
        if (this.label2) {
            this.label2.string = this.str;
        }
    }

}