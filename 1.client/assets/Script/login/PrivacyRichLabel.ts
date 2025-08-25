import { EResPath } from "../common/EResPath";
import { UiManager } from "../utils/UiMgr";


const { ccclass, property , menu } = cc._decorator;

@ccclass
@menu("Game/Login/PrivacyRichLabel")
export class PrivacyRichLabel extends cc.Component {

    click1() {
        UiManager.showDialog(EResPath.USER_AGREEMENT_VIEW);
    }

    click2() {
        UiManager.showDialog(EResPath.PRIVACY_AGREEMENT_VIEW);
    }
}