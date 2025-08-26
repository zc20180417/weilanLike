

export class MatUtils {
    static customCache:any =  {};

    static MAT: any = {
        // build in
        DEFAULT: {
            custom: false,
            name: cc.Material.BUILTIN_NAME.SPRITE,
        },
        GRAY: {
            custom: false,
            name: cc.Material.BUILTIN_NAME.GRAY_SPRITE,
        },
        GRAY_DRAGON: {
            custom: true,
            name: 'gray',
        },
        SHIHUA: {
            custom: true,
            name: 'hsl-sprite',
        },
        BLUR: {
            custom: true,
            name: 'blur',
        },
        HIT_HIGH_LIGHT: {
            custom: true,
            name: 'highlight',
        }
    }

    static clearCache() {
        this._matDic = {};
        this.customCache = {};
    }

    private static _matDic:any = { };

    static getMat(matCfg, cb) {
        let mat = MatUtils._matDic[matCfg.name];
        if (mat) {
            cb(false, mat);
            return;
        }

        if (matCfg.custom) {
            let url = "materials/" + matCfg.name;
            if (this.customCache[url]) {
                cb(false, this.customCache[url]);
                return;
            }

            cc.loader.loadRes(url, cc.Material, (err, asset) => {
                if (err) {
                    cc.error(err);
                    cb(err, null);
                }
                this.customCache[url] = asset;
                MatUtils._matDic[matCfg.name] = asset;
                cb(false, asset);
            });
        } else {
            mat = cc.Material.createWithBuiltin(matCfg.name);
            if (matCfg.name == cc.Material.BUILTIN_NAME.SPRITE) {
                mat.define("USE_TEXTURE", true, 0);
            }
            MatUtils._matDic[matCfg.name] = mat;
            cb(false, mat);
        }
    }

    static useMat(sp: cc.RenderComponent, matCfg, cb?) {
        this.getMat(matCfg, (err, mat: cc.Material) => {
            if (err) return;
            //mat.setProperty("texture", sp.spriteFrame.getTexture());
            sp.setMaterial(0, mat);
            //sp.markForRender(true);
            if (cb) cb(err, mat);
        });
    }

    static useNodeMat(node:cc.Node ,matCfg, cb?) {
        this.getMat(matCfg, (err, mat: cc.Material) => {
            if (err) return;
            let renders:cc.RenderComponent[] = node.getComponentsInChildren(cc.RenderComponent);
            renders.forEach(element => {
                element.setMaterial(0, mat);
            });
            if (cb) cb(err, mat);
        });
    }

    static setNodeGray(node:cc.Node) {
        this.useNodeMat(node , MatUtils.MAT.GRAY_DRAGON);
    }

    static setNodeNormal(node:cc.Node) {
        this.useNodeMat(node , MatUtils.MAT.DEFAULT);
    }

    static setSpriteGray(sp: cc.Sprite) {
        this.useMat(sp, MatUtils.MAT.GRAY);
    }

    static setSpriteNormal(sp: cc.Sprite) {
        this.useMat(sp, MatUtils.MAT.DEFAULT);
    }

    static setGray(lb: cc.RenderComponent) {
        this.useMat(lb, MatUtils.MAT.GRAY);
    }

    static setNormal(lb: cc.RenderComponent) {
        this.useMat(lb, MatUtils.MAT.DEFAULT);
    }


}