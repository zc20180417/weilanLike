//该脚本为扩展插件，对引擎部分功能进行扩展
let oldLateUpdate = cc.ParticleSystem.prototype.lateUpdate;

cc.ParticleSystem.prototype.lateUpdate = function (dt) {
    if (this.isPause) return;
    oldLateUpdate.call(this, dt);
}

cc.ParticleSystem.prototype.pause = function () {
    if(cc.sys.isNative && this._simulator && this._simulator.pause ) {
        this._simulator.pause();
    }else{
        this.isPause = true;
    }
}

cc.ParticleSystem.prototype.resume = function () {
    if(cc.sys.isNative && this._simulator && this._simulator.resume) {
        this._simulator.resume();
    }else{
        this.isPause = false;
    }
}

cc.log("--------------插件初始化--------------");