// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

export class Command {
    public commandFlow: CommandsFlow = null;
    public nextCmd: Command = null;

    start() {

    }

    end() {
        if (this.nextCmd) {
            this.nextCmd.start();
        } else {
            CommandsFlow.clearFlow(this.commandFlow);
        }
    }

    abort() {
        this.commandFlow.clearCommand();
    }
}

/**
 *命令流 
 */

@ccclass
export default class CommandsFlow {
    public firstCommand: Command = null;
    public lastCommand: Command = null;

    private static tempFlow: CommandsFlow = null;
    private static flowList: CommandsFlow[] = [];

    static addCommand(command: Command) {
        if (!this.tempFlow) {
            this.tempFlow = new CommandsFlow();
        }

        if (!this.tempFlow.firstCommand) {
            this.tempFlow.firstCommand = this.tempFlow.lastCommand = command;
        } else {
            this.tempFlow.lastCommand.nextCmd = command;
            this.tempFlow.lastCommand = command;
        }
        command.commandFlow=this.tempFlow;
        return this;
    }

    static startCommand() {
        this.flowList.push(this.tempFlow);
        this.tempFlow.firstCommand.start();
        this.tempFlow = null;
    }

    static clearFlow(flow: CommandsFlow) {
        flow.clearCommand();
        let index = this.flowList.indexOf(flow);
        if (index !== -1) {
            this.flowList.splice(index, 1);
        }
    }

    public clearCommand() {
        this.firstCommand = null;
        this.lastCommand = null;
    }
}
