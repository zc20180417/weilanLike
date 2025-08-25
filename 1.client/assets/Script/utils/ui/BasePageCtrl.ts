import TapNavigation from "../../ui/dayInfoView/TapNavigation";

const { ccclass, property } = cc._decorator;
@ccclass
export class BasePageCtrl extends cc.Component {
    
    @property(TapNavigation)
    navigation: TapNavigation = null;

    _data: any = null;
    _currIndex: number = -1;
    
    selectTap(index:number) {

    }
}