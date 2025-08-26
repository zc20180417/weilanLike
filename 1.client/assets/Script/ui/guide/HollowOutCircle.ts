import Shader from "../../Shader";


const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("Game/ui/guide/HollowOutCircle")
export class HollowOutCircle extends Shader {

    
    setPropertys(centerX:number , centerY:number , radius:number , sizeX:number = 200, sizeY:number = 200 ) {
        this.setProperty('size' , [sizeX , sizeY]);
        this.setProperty('center' , [centerX , centerY]);
        this.setProperty('radius' , radius);
    }

}