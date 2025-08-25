


/**简单封装的handler,一般用来做回调使用 */
export class Handler {

	/**
	 * 构造
	 * @param func 回调函数
	 * @param target thisArg
	 * @param args 	附带参数
	 */
	constructor(func: Function, target: any, ...args) {
		this.func = func;
		this.target = target;
		this.args = args;
	}

	/**处理方法 */
	public func: Function;
	/**附带参数 */
	public args: any[];
	/**thisArg */
	public target: any;

	/**执行处理 */
	public execute(): any {
		if (this.func != null) {
			return this.func.apply(this.target, this.args);
		}
	}

	/**执行处理(增加数据参数)*/
	public executeWith(...args): any {
		if (args == null || args == undefined || args.length == 0) {
			return this.execute();
		}
		if (this.func != null) {
			return this.func.apply(this.target, this.args ? this.args.concat(args) : args);
		}
	}

	static map: Map<number, Map<Function, Handler>> = new Map();
	private static targetIndex: number = 10;
	static create(func: Function, target: any, ...args: any) {
		if (!target.handlerKey) {
			Handler.targetIndex++;
			target.handlerKey = Handler.targetIndex;
		}
		let subMap: any = Handler.map.get(target.handlerKey);
		if (!subMap) {
			subMap = new Map();
			Handler.map.set(target.handlerKey, subMap);
		}
		let handler = subMap.get(func);
		if (!handler) {
			handler = new Handler(func, target, ...args);
			subMap.set(func, handler);
		} else {
			handler.args = args;
		}
		return handler;
	}

	static dispose(target) {
		if (target.handlerKey) {
			let map: Map<Function, Handler> = Handler.map.get(target.handlerKey);
			if (map) {
				map.clear();
				Handler.map.delete(target.handlerKey);
			}
		}
	}
}