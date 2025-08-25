import { SceneNetMgr } from './../../net/mgr/SceneNetMgr';
import Game from "../../Game";
import Dialog from "../../utils/ui/Dialog";
import ImageLoader from "../../utils/ui/ImageLoader";
import { UiManager } from "../../utils/UiMgr";
import { EResPath } from "../../common/EResPath";
import { EventEnum } from "../../common/EventEnum";
import { GS_SceneWorldData } from '../../net/proto/DMSG_Plaza_Sub_Scene';
import { ActorProp, GOODS_TYPE } from '../../net/socket/handler/MessageEnum';
import GlobalVal, { SEND_TYPE } from '../../GlobalVal';
import { GameEvent } from '../../utils/GameEvent';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/ui/TrophyView")

export class TrophyView extends Dialog {
    @property(cc.Label)
    roleLab: cc.Label = null;

    @property(cc.Label)
    uidLab: cc.Label = null;

    @property(ImageLoader)
    icon: ImageLoader = null;

    @property(cc.Label)
    Samsung: cc.Label = null;

    @property(cc.Label)
    perfect: cc.Label = null;

    @property(cc.Label)
    dynasty: cc.Label = null;

    @property(cc.Node)
    changeNameNode: cc.Node = null;



    onLoad() {

        // this.icon.setFaceFile(Game.actorMgr.privateData.szmd5facefile);
        this.onRolePower();

        let sceneNetMgr: SceneNetMgr = Game.sceneNetMgr;
        let worldData: GS_SceneWorldData = sceneNetMgr.getWorldData();
        this.uidLab.string = Game.actorMgr.privateData.nactordbid + "";
        if (worldData && worldData.data1) {
            this.Samsung.string = (worldData.data1[0].nthreestarcount + worldData.data1[0].nhardthreestarcount) + "";
            this.perfect.string = (worldData.data1[0].nthreegradecount + worldData.data1[0].nhardthreegradecount) + "";
            this.dynasty.string = (worldData.data1[0].nclearthingcount + worldData.data1[0].nhardclearthingcount) + "";
        }


        if (Game.actorMgr.privateData) {
            let rankIndex = Game.actorMgr.getPvpRankIndex(Game.actorMgr.privateData.nrankscore);
            //段位icon
            // this.rankIcon.setRankLv(rankIndex);
        }
    }

    private onRolePower() {
        //玩家拥有的角色数量
        //this.roleLab.string = '玩家拥有'+ Game.towerMgr.getAllUnlockTowerCfgs().length + "个角色";
        this.onNameChange();
    }

    protected addEvent() {
        GameEvent.on(EventEnum.PLAYER_NAME_CHANGE, this.onNameChange, this);
    }

    private onNameChange(name?: string) {
        if (name) {
            //上报数据
            // Game.actorMgr.roleInfoChange(SEND_TYPE.ROLE_INFO_CHANGE);
            GameEvent.emit(EventEnum.CK_ROLE_INFO_CHANGE,SEND_TYPE.ROLE_INFO_CHANGE);
        }
        this.roleLab.string = Game.actorMgr.privateData.szname;
        let showChangeName = (Game.actorMgr.getProp(ActorProp.ACTOR_PROP_OPENFLAG) & 0x100) == 0 || Game.containerMgr.checkItemByType(GOODS_TYPE.GOODSTYPE_CARD_RENAME);
        this.changeNameNode.active = showChangeName;
    }


    /**
     * 头像界面
     */
    private headPortrait() {
        UiManager.showDialog(EResPath.HEAD_PORTRAIT_VIEW);
    }

    private onChangeNodeClick() {
        UiManager.showDialog(EResPath.CHANGE_NAME_VIEW);
    }

    onDestroy() {

    }

}