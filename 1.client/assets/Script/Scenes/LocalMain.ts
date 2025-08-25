import { LocalStorageMgr } from './../utils/LocalStorageMgr';
import { ComBox } from './../utils/ui/ComBox';
import GlobalVal, { ServerType } from "../GlobalVal";
import { EventEnum } from '../common/EventEnum';
import SceneMgr from '../common/SceneMgr';
import Game from '../Game';
import { GameEvent } from '../utils/GameEvent';

const { ccclass, property ,menu} = cc._decorator;

@ccclass
@menu("Game/scenes/LocalMain")
export class LocalMain extends cc.Component {

    @property(ComBox)
    platformComBox:ComBox = null;

    @property(ComBox)
    ipComBox:ComBox = null;

    @property(ComBox)
    portComBox:ComBox = null;

    private platformObjs:any = [
                                {text:'内网' , value:ServerType.LOCAL} ,
                                {text:'内网2' , value:ServerType.LOCAL} ,
                                {text:'TAPTAP' , value:ServerType.TAPTAP} ,
                                {text:'外网' , value:ServerType.GLOBAL} ,
                                {text:'闲闲' , value:ServerType.XX} ,
                                {text:'手Q' , value:ServerType.SQ} ,
                                {text:'触控' , value:ServerType.CK} ,
                                {text:'触控测试' , value:ServerType.CK_TEST} ,
                                ];

    private localIps:any = [
                                {text:'春哥:192.168.1.38' , value:'192.168.1.38'} ,
                                {text:'洪波:192.168.1.52' , value:'192.168.1.52'} ,
                                {text:'洪波:192.168.1.41' , value:'192.168.1.41'} ,
                                {text:'欧浩:192.168.1.44' , value:'192.168.1.44'} ,
                                {text:'大师:192.168.1.10' , value:'192.168.1.10'} ,
                                {text:'大师2:192.168.1.109' , value:'192.168.1.109'} ,
                                {text:'张鹏:192.168.1.140' , value:'192.168.1.140'} ,
                                {text:'李帅:192.168.1.134' , value:'192.168.1.134'} , 
                                {text:'本机:127.0.0.1' , value:'127.0.0.1'} ,
                                {text:'wss:tfssl.maostar.cn' , value:'tfssl.maostar.cn'} ,
                            ];
    private localIps2:any = [
                                {text:'李帅:192.168.1.134' , value:'192.168.1.134'} , 
                                {text:'本机:127.0.0.1' , value:'127.0.0.1'} ,
                            ];
    private localPorts:any = [
                                    {text:'1100' , value:1100} ,
                            ];
    private taptapIps:any = [
                                {text:'test-game.maostar.cn' , value:'test-game.maostar.cn'} ,
                            ];
    private taptapPort:any = [
                                {text:'2100' , value:2100} ,
                            ];
    private globalIps:any = [
                                {text:'mmbwz-game1.maostar.cn' , value:'mmbwz-game1.maostar.cn'} ,
                                {text:'mmbwz-game2.maostar.cn' , value:'mmbwz-game2.maostar.cn'} ,
                                {text:'mmbwz-game3.maostar.cn' , value:'mmbwz-game3.maostar.cn'} ,
                            ];
    private sqIps:any = [
                                {text:'sq-game1.maostar.cn' , value:'sq-game1.maostar.cn'} ,
                                {text:'sq-game2.maostar.cn' , value:'sq-game2.maostar.cn'} ,
                                {text:'sq-game3.maostar.cn' , value:'sq-game3.maostar.cn'} ,
                            ];
    private globalPort:any = [
                                {text:'1107' , value:1107} ,
                            ];
    private sqPort:any = [
                                {text:'1107' , value:1107} ,
                            ];
    private xxIps:any = [
                                {text:'xx-game1.maostar.cn' , value:'xx-game1.maostar.cn'} ,
                                {text:'xx-game2.maostar.cn' , value:'xx-game2.maostar.cn'} ,
                                {text:'xx-game3.maostar.cn' , value:'xx-game3.maostar.cn'} ,
                        ];
    private xxPort:any = [
                                {text:'1100' , value:1100} ,
                                {text:'1101' , value:1101} ,
                                {text:'1102' , value:1102} ,
                                {text:'1103' , value:1103} ,
                                {text:'1104' , value:1104} ,
                                {text:'1105' , value:1105} ,
                                {text:'1106' , value:1106} ,
                                {text:'1107' , value:1107} ,
                                {text:'1108' , value:1108} ,
                                {text:'1109' , value:1109} ,
                                {text:'1110' , value:1110} ,
                        ];
    

    private ckIps:any = [{text:'触控正式' , value:'gamemmbwz.chukonggame.com'} ];
    private ckTestIps:any = [{text:'触控测试' , value:'test-gamemmbwz.chukonggame.com'} ,
                                {text:'触控IOS' , value:'ios-gamemmbwz.chukonggame.com'}];
    private ck_ios_TestIps:any = [{text:'触控IOS测试' , value:'ios-gamemmbwz.chukonggame.com'}];
    private ckPort:any = [
                            {text:'1100' , value:1100} ,
                    ];
    private ckTestPort:any = [
                            {text:'1100' , value:1100} ,
                            {text:'2100' , value:2100} ,
                    ];
    private ck_ios_TestPort:any = [
                            {text:'2100' , value:2100} ,
                    ];
    private _cachePlatform:ServerType;
    private _cacheIp:string;
    private _cachePort:number;


    private _mat:cc.Material;
    onLoad() {
        GameEvent.on(EventEnum.COMBOX_SELECT , this.onComboxSelect , this);
        cc.dynamicAtlasManager.enabled = false;
    }

    // private _dt:number = 0;
    // protected update(dt: number): void {
    //     this._dt += dt * 10;
    //     this._mat.setProperty('bluramount' , (this._dt % 25) / 1000);
    // }

    start() {
        cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
        GlobalVal.initUrl();
        Game.baseInit();
        GlobalVal.channel = Game.nativeApi.getChannel();
        GlobalVal.sdkChannel = Game.nativeApi.getSdkChannel();
        let platform = LocalStorageMgr.getItem('_platform' , false) || ServerType.LOCAL;
        let ip = LocalStorageMgr.getItem('_ip' , false);
        let port = LocalStorageMgr.getItem('_port' , false);

        this.platformComBox.dataSource = this.platformObjs;
        this.ipComBox.dataSource = this.localIps;
        this.portComBox.dataSource = this.localPorts;

        if (platform) {
            this.platformComBox.setCurSelectDataByValue(platform);
        }

        if (ip) {
            this.ipComBox.setCurSelectDataByValue(ip);
        }

        if (port) {
            this.portComBox.setCurSelectDataByValue(port);
        }
    }

    onStartClick() {
        GlobalVal.serverType = this._cachePlatform;
        GlobalVal.initUrl();
        GlobalVal.SERVER_IP = this._cacheIp;
        GlobalVal.SERVER_PORT = this._cachePort;
        GlobalVal.serverIpList.length = 0;
        GlobalVal.serverPortList.length = 0;
        LocalStorageMgr.setItem('_platform' , this._cachePlatform , false);
        LocalStorageMgr.setItem('_ip' , this._cacheIp , false);
        LocalStorageMgr.setItem('_port' , this._cachePort , false);

        SceneMgr.instance.loadScene("Loading");

    }

    private onComboxSelect(node:cc.Node) {
        if (node == this.platformComBox.node) {
            this._cachePlatform = this.platformComBox.data.value;
            switch (this._cachePlatform) {
                case ServerType.LOCAL:
                    this.ipComBox.dataSource = this.localIps;
                    this.portComBox.dataSource = this.localPorts;
                    break;
                case ServerType.LOCAL:
                    this.ipComBox.dataSource = this.localIps2;
                    this.portComBox.dataSource = this.localPorts;
                    break;
                case ServerType.GLOBAL:
                    this.ipComBox.dataSource = this.globalIps;
                    this.portComBox.dataSource = this.globalPort;
                    break;
                case ServerType.TAPTAP:
                    this.ipComBox.dataSource = this.taptapIps;
                    this.portComBox.dataSource = this.taptapPort;
                    break;
                case ServerType.XX:
                    this.ipComBox.dataSource = this.xxIps;
                    this.portComBox.dataSource = this.xxPort;
                    break;
                case ServerType.SQ:
                    this.ipComBox.dataSource = this.sqIps;
                    this.portComBox.dataSource = this.sqPort;
                    break;
                case ServerType.CK:
                    this.ipComBox.dataSource = this.ckIps;
                    this.portComBox.dataSource = this.ckPort;
                    break;
                case ServerType.CK_TEST:
                    this.ipComBox.dataSource = this.ckTestIps;
                    this.portComBox.dataSource = this.ckTestPort;
                    break;
                case ServerType.CK_IOS_TEST:
                    this.ipComBox.dataSource = this.ck_ios_TestIps;
                    this.portComBox.dataSource = this.ck_ios_TestPort;
                    break;
            
                default:
                    break;
            }
        } else if (node == this.ipComBox.node) {
            this._cacheIp = this.ipComBox.data.value;
        } else if (node == this.portComBox.node) {
            this._cachePort = this.portComBox.data.value;
        }
    }


}