import { EventEnum } from "../common/EventEnum";
import GlobalVal from "../GlobalVal";
import { GameEvent } from "./GameEvent";

import { Handler } from "./Handler";
import ResManager, { CacheModel } from "./res/ResManager";
import { StringUtils } from "./StringUtils";


export default class SoundManager {
    private static SOUND_LOCAL_KEY: string = "NC_SOUND_SWITCH";

    private effectVolume = 1;
    private musicVolume = 0.7;

    // private musicIdArr = [];

    private static _instance: SoundManager;

    public static get instance(): SoundManager {
        if (!SoundManager._instance) {
            SoundManager._instance = new SoundManager();
        }
        return SoundManager._instance;
    }

    private _audioSourceDic: Object = {};

    constructor() {
        if (cc.sys.localStorage.getItem(SoundManager.SOUND_LOCAL_KEY + "_SOUND") == undefined) {
            cc.sys.localStorage.setItem(SoundManager.SOUND_LOCAL_KEY + "_SOUND", "true");
            cc.sys.localStorage.setItem(SoundManager.SOUND_LOCAL_KEY + "_MUSIC", "true");
        }
        this._isSoundOn = cc.sys.localStorage.getItem(SoundManager.SOUND_LOCAL_KEY + "_SOUND") == "true";
        this._isMusicOn = cc.sys.localStorage.getItem(SoundManager.SOUND_LOCAL_KEY + "_MUSIC") == "true";
        cc.audioEngine.setEffectsVolume(this.effectVolume);
        cc.audioEngine.setMusicVolume(this.musicVolume);
    }

    private _isSoundOn: boolean = true;

    public get isSoundOn(): boolean {
        return this._isSoundOn;
    }

    public set isSoundOn(v: boolean) {
        cc.sys.localStorage.setItem(SoundManager.SOUND_LOCAL_KEY + "_SOUND", v ? "true" : "false");
        this._isSoundOn = v;
    }

    private _isMusicOn: boolean = true;

    public get isMusicOn(): boolean {
        return this._isMusicOn;
    }

    public set isMusicOn(v: boolean) {
        if (this._isMusicOn == v) {
            return;
        }
        cc.sys.localStorage.setItem(SoundManager.SOUND_LOCAL_KEY + "_MUSIC", v ? "true" : "false");
        this._isMusicOn = v;
        if (v) {
            if (this.priorityArray.length) {
                let p = this.priorityArray[this.priorityArray.length - 1];
                this.playMusic(p, this.priorityMap[p]);
            }
        } else {
            // this.stopMusic();
            this.stopCurrMusic();
        }
        GameEvent.emit(EventEnum.MUSIC_STATE_CHANGE, this._isMusicOn);
    }

    private currentMusicId: number = -1;
    private currentMusicPath: string;
    private soundIdDic: any = {};
    private webSoundUrl: any = {};
    private curPlayMusicData: any = {};

    public playSound(path: string, bothExist: boolean = true): number {
        //if (!GlobalVal.isEffectOn) return;
        if (!this._isSoundOn || StringUtils.isNilOrEmpty(path)) return;
        //相同音效同一时刻只存在一个
        if (!bothExist && this.soundIdDic[path] !== null && this.soundIdDic[path] !== undefined) return;

        let ac = this._audioSourceDic[path];
        if (ac) {
            let id: number = cc.audioEngine.playEffect(ac, false);
            this.soundIdDic[path] = id;
            if (!bothExist) {
                this.setFinishCallback(path, id);
            }
            return id;
        } else {
            let that = this;
            cc.resources.load(path, cc.AudioClip, function (err, clip: cc.AudioClip) {
                if (!err) {
                    // ResManager.instance.setDontReleasePath(path);
                    ac = clip;
                    that._audioSourceDic[path] = clip;
                    that.soundIdDic[path] = cc.audioEngine.playEffect(clip, false);
                    if (!bothExist) {
                        that.setFinishCallback(path, that.soundIdDic[path]);
                    }
                }
            });
            return -1;
        }

    }

    public setFinishCallback(path: string, clipId: number) {
        cc.audioEngine.setFinishCallback(clipId, () => {
            this.soundIdDic[path] = null;
        })
    }

    private priorityMap: Record<string, number> = {};
    private priorityArray: string[] = [];

    /**
     * 播放背景音
     * @param path 
     * @param priority 优先级，同级替换,优先级高的覆盖优先级低的
     * @param delay 
     * @returns 
     */
    public playMusic(path: string, priority = 0, delay?: number,) {
        if (StringUtils.isNilOrEmpty(path)) return;
        let idx = this.insertPathByPriority(path, priority);
        if (!this._isMusicOn) return;
        if ((this.currentMusicPath === path && idx === this.priorityArray.length - 1) ||
            (this.currentMusicPath !== path && idx !== this.priorityArray.length - 1)) {
            return;
        }

        this.tryRemoveLoad();

        this.currentMusicPath = path;
        this.curPlayMusicData.delay = delay;
        this.curPlayMusicData.startTime = GlobalVal.now;

        let ac = this._audioSourceDic[path];
        if (ac) {
            this.currentMusicId = cc.audioEngine.playMusic(ac, true);
            if (delay) {
                this.musicFadeIn(delay);
            }
        } else {
            let that = this;
            if (!StringUtils.isNilOrEmpty(this.webSoundUrl[path])) {
                that.playWebSound(path);
            } else {
                cc.resources.load(path, cc.AudioClip, function (err, clip: cc.AudioClip) {
                    if (that.currentMusicPath !== path) return;
                    if (!err) {
                        ac = clip;
                        that._audioSourceDic[path] = clip;
                        that.currentMusicId = cc.audioEngine.playMusic(clip, true);
                        if (delay) {
                            that.musicFadeIn(delay);
                        }
                    } else {
                        that.playWebSound(path);
                    }
                });
            }
        }
    }

    private playWebSound(path: string) {
        let list: string[] = path.split("/");
        let soundName = list.pop();
        let url = GlobalVal.SOUND_URL + soundName + ".mp3";
        this.webSoundUrl[path] = url;
        ResManager.instance.loadNetRes(url, 'mp3', Handler.create(this.onSoundLoaded, this), CacheModel.CUSTOM);
    }

    private tryRemoveLoad() {
        if (!StringUtils.isNilOrEmpty(this.currentMusicPath)) return;
        let url = this.webSoundUrl[this.currentMusicPath];
        if (!StringUtils.isNilOrEmpty(url)) {
            ResManager.instance.removeLoadNetRes(url, Handler.create(this.onSoundLoaded, this));
        }
    }

    private onSoundLoaded(resData: any, path: string) {
        cc.log('onSoundLoaded');
        let url = this.webSoundUrl[this.currentMusicPath];
        cc.log('-------path:', path, url);
        if (url == path) {
            this._audioSourceDic[this.currentMusicPath] = resData;
            this.currentMusicId = cc.audioEngine.play(resData, true, 1);
            if (this.curPlayMusicData.delay) {
                this.musicFadeIn(this.curPlayMusicData.delay);
            }
        }
    }

    /**
     * 音乐淡入
     * @param time 淡入时间 
     */
    private musicFadeIn(time) {

        cc.Tween.stopAllByTarget(this);
        time = time || 0;
        let times = 10;
        let step = 1 / 10;
        cc.audioEngine.setMusicVolume(0);
        let action = cc.tween()
            .delay(time / 10)
            .call(() => {
                cc.audioEngine.setMusicVolume(cc.audioEngine.getMusicVolume() + step);
            });
        cc.tween()
            .target(this)
            .repeat(times, action)
            .start();
    }

    public stopMusic(path?: string) {
        if (path && path !== this.currentMusicPath) {
            this.removePath(path);
        } else {
            this.tryRemoveLoad();
            this.removePath(this.currentMusicPath);
            this.stopCurrMusic();

            if (this.priorityArray.length) {
                let p = this.priorityArray[this.priorityArray.length - 1];
                this.playMusic(p, this.priorityMap[p]);
            }
        }
    }

    private stopCurrMusic() {
        if (this.currentMusicId >= 0) {
            cc.audioEngine.stop(this.currentMusicId);
            this.currentMusicId = -1;
        }
        this.currentMusicPath = null;
    }

    public stopAllMusic() {
        this.stopMusic();
        this.priorityArray.length = 0;
        this.priorityMap = {};
    }

    public stopSound(soundID: number) {
        if (soundID > 0) {
            cc.audioEngine.stopEffect(soundID);
        }
    }

    /**
     * 通过资源路径来移除音效
     * @param path 
     */
    stopSoundByPath(path: string) {
        let id = this.soundIdDic[path];
        if (id !== null && id !== undefined && id > 0) {
            cc.audioEngine.stopEffect(id);
            this.soundIdDic[path] = null;
        }
    }

    public stopAllEffects() {
        cc.audioEngine.stopAllEffects();
    }


    /**
     * 设置背景音乐声音0.0~1.0
     * @param volume 
     */
    public setMusicVolume(volume: number) {
        cc.audioEngine.setMusicVolume(volume);
    }

    private insertPathByPriority(path: string, priority: number) {
        if (this.priorityMap[path] !== undefined && this.priorityMap[path] === priority) {
            return this.priorityArray.indexOf(path);
        }
        this.priorityMap[path] = priority;
        let idx = this.priorityArray.indexOf(path);
        if (idx !== -1) this.priorityArray.splice(idx, 1);
        idx = -1;
        for (let i = 0, len = this.priorityArray.length; i < len; i++) {
            let p = this.priorityArray[i];
            if (this.priorityMap[p] == priority) {
                delete this.priorityMap[p];
                this.priorityArray[i] = path;
                idx = i;
                break;
            } else if (this.priorityMap[p] > priority) {
                this.priorityArray.splice(i, 0, path);
                idx = i;
                break;
            }
        }
        if (idx === -1) {
            this.priorityArray.push(path);
            idx = this.priorityArray.length - 1;
        }
        return idx;
    }

    private removePath(path: string) {
        delete this.priorityMap[path];
        let idx = this.priorityArray.indexOf(path);
        if (idx !== -1) {
            this.priorityArray.splice(idx, 1);
        }
    }
}