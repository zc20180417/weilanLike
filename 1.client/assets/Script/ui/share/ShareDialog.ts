import Game from "../../Game";
import Dialog from "../../utils/ui/Dialog";
import { EShareTarget } from "./ShareMgr";


const { ccclass, property ,menu} = cc._decorator;
@ccclass
@menu("Game/ui/share/ShareDialog")
export class ShareDialog extends Dialog {


    onFriendClick() {
        Game.shareMgr.shareImg(EShareTarget.friend , '测试' , '测试分享给好友' , null);
    }


    onCircleClick() {
        Game.shareMgr.shareImg(EShareTarget.circle , '测试' , '测试分享朋友圈' , null);
    }

}