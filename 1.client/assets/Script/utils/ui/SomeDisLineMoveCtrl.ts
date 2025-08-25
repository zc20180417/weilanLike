import BaseItem from "./BaseItem";

export default class SomeDisLineMoveControll {

    public static Horizontal:string = "Horizontal";
    public static Vertical:string = "Vertical";
    
    
    static setContainer(ui:cc.Node,distance:number,time:number,spaceTime:number,direction:String = "Horizontal"):void
    {
        let child:cc.Node;
        let j:number = 0;
        for(let i:number =0 ; i<ui.childrenCount ;i++)
        {
            child = ui.children[i];
            child.opacity = 0;
            var to:Number = 0;
            if(direction == SomeDisLineMoveControll.Horizontal)
            {
                to = child.x;
                child.x = child.x + distance;
                let action=cc.tween(null).delay(j*spaceTime).to(time , {x:to,opacity:255},{easing:"quadOut"});
                child.getComponent(BaseItem).setAction(action);
                // cc.tween(child).delay(j*spaceTime).to(time , {x:to,opacity:255},{easing:"quadOut"}).start();
            }
            else
            {
                to = child.y;
                child.y = child.y - distance;
                let action=cc.tween(null).delay(j*spaceTime).to(time , {y:to,opacity:255},{easing:"quadOut"});
                child.getComponent(BaseItem).setAction(action);
                // cc.tween(child).delay(j*spaceTime).to(time , {y:to,opacity:255},{easing:"quadOut"}).start();
            }
            j++;
        }
    }
    
    
}