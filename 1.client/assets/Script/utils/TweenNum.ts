import { Handler } from "./Handler";

export default class TweenNum {

    private static tweenDic:any = {};

    static to(curValue:number,toValue:number,t:number,update:Handler,id:string,end?:Handler , easing:string = "circOut"):any {
        this.kill(id);

        let obj:any = {value:curValue};
        let d:number = toValue - curValue;
        let tween:any =  cc.tween(obj).to(t , {value:toValue} , {
                progress:
                    function(d1:any,d2:any,d3:any,d4:any) {
                        let value = Math.floor(curValue + d * d4);
                        update.executeWith(value);
                    },
                easing:easing
        }).call(function() {
                update.executeWith(toValue);
                TweenNum.tweenDic[id] = null;
                if (end) {
                    end.execute();
                }
            }
        ).start();
        TweenNum.tweenDic[id] = tween;
        return tween;
    }


    static kill(id:string) {
        let tween:any = TweenNum.tweenDic[id];
        if (tween) {
            tween.stop();
            TweenNum.tweenDic[id] = null;
        }
    }

}