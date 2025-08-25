import Dialog from "../../utils/ui/Dialog";

const { ccclass, property ,menu } = cc._decorator;

@ccclass
@menu('Game/ui/active-taqing/ActiveTaqingHeChengHelpTips')
export class ActiveTaqingHeChengHelpTips extends Dialog {

    @property(cc.Label)
    label:cc.Label = null;

    private str = '';
    setData(data:any) {
        this.str = data;
    }

    protected beforeShow(): void {
        if (this.label) {
            this.label.string = this.str;
        }
    }

}