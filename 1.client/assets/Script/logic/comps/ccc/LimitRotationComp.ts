import BindSoComp from "./BindSoComp";

const {ccclass, property , menu} = cc._decorator;

@ccclass
@menu("Game/comp/LimitRotationComp")
export class LimitRotationComp extends BindSoComp {


    onAdd() {

    }

    onRemove() {

    }


    protected update(dt: number): void {
        if (this.owner.rotation != 0) {
            

            if (this.owner.rotation >= 90 && this.owner.rotation <= 270) {
                this.owner.scaleX = -1;
            } else {
                this.owner.scaleX = 1;
            }

            this.owner.rotation = 0;
        }

        
    
    }
}