
import { EventEnum } from "../../common/EventEnum";
import { GameEvent } from "../../utils/GameEvent";

export default class LoginBase {

    constructor(){
        GameEvent.on(EventEnum.LOGOUT, this.logout, this);
    }

    login(){

    }

    protected logout(){

    }

    fastLogin(){
        
    }
}
