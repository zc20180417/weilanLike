import Game from "../../Game";
import { TextureRenderUtils } from "./TextureRenderUtils";

const { ccclass, property ,menu} = cc._decorator;
@ccclass
@menu("Game/ui/share/CaptureToNative")
export class CaptureToNative extends TextureRenderUtils {

    private _filePath:string = "";
    start () {
        this._width = 1280;
        this._height = 720;
        this.init();
        
    }

    // create the capture
    captureImg() {
        let picData = this.initImage();
        this.createCanvas(picData);
        this.saveFile(picData);
        this.camera.enabled = false;
    }
    
    // override
    initImage () {
        let data = this.texture.readPixels();
        this._width = this.texture.width;
        this._height = this.texture.height;
        let picData = this.filpYImage(data, this._width, this._height);
        return picData;
    }

    // override init with Data
    createCanvas (picData) {
        let texture = new cc.Texture2D();
        texture.initWithData(picData, 32, this._width, this._height);
    }

    saveFile (picData) {
        if (CC_JSB) {
            this._filePath = jsb.fileUtils.getWritablePath() + 'ScreenShot.jpg';

            let success = jsb.saveImageData(picData, this._width, this._height, this._filePath);
            if (success) {
                cc.log("save image data success, file: " + this._filePath);
                Game.shareMgr.onSaveImgSuccess(this._filePath);
                /*
                if(cc.sys.os == cc.sys.OS_ANDROID) { //安卓的分享路径比较坑，只能重新写文件
                    cc.log('start save to sdcard');
                    /*
                    let imagePath = this.getScreenShotImagePath();
                    var fileData = jsb.fileUtils.getDataFromFile(this._filePath);
                    cc.log('_filePath:' , this._filePath);
                    cc.log('fileData:' , fileData);
                    cc.log('imagePath:' , imagePath);
                    if (jsb.fileUtils.writeDataToFile(fileData, imagePath)) {
                        cc.log("save image data to sdcard success , file:" + imagePath);
                    } else {
                        cc.error("save image data to sdcard failed!");
                    }
                    */

                    /*
                    Game.nativeApi.saveScreenShotImg();
                    jsb.fileUtils.removeFile(this._filePath);//写了新文件后删除旧文件
                } else {
                    cc.log("cc.sys.os is not cc.sys.OS_ANDROID:" + cc.sys.os);
                }
                */
            }
            else {
                cc.error("save image data failed!");
            }
        }
    }

    // This is a temporary solution
    filpYImage (data, width, height) {
        cc.log("---filpYImage:" + width , height);
        // create the data array
        let picData = new Uint8Array(width * height * 4);
        let rowBytes = width * 4;
        for (let row = 0; row < height; row++) {
            let srow = height - 1 - row;
            let start = srow * width * 4;
            let reStart = row * width * 4;
            // save the piexls data
            for (let i = 0; i < rowBytes; i++) {
                picData[reStart + i] = data[start + i];
            }
        }
        return picData;
    }


}