export default class MathUtil {
    /**
		 * 根据两点确定这两点连线的二元一次方程 y = ax + b或者 x = ay + b
		 * @param ponit1
		 * @param point2
		 * @param type		指定返回函数的形式。为0则根据x值得到y，为1则根据y得到x
		 * 
		 * @return 由参数中两点确定的直线的二元一次函数
		 */
	public static getLineFunc(ponit1: cc.Vec2, point2: cc.Vec2, type: number = 0): Function {
		var resultFuc: Function;


		// 先考虑两点在一条垂直于坐标轴直线的情况，此时直线方程为 y = a 或者 x = a 的形式
		if (ponit1.x == point2.x) {
			if (type == 0) {
				throw new Error("两点所确定直线垂直于y轴，不能根据x值得到y值");
			}
			else if (type == 1) {
				resultFuc = function (y: Number): Number {
					return ponit1.x;
				}

			}
			return resultFuc;
		}
		else if (ponit1.y == point2.y) {
			if (type == 0) {
				resultFuc = function (x: Number): Number {
					return ponit1.y;
				}
			}
			else if (type == 1) {
				throw new Error("两点所确定直线垂直于y轴，不能根据x值得到y值");
			}
			return resultFuc;
		}

		// 当两点确定直线不垂直于坐标轴时直线方程设为 y = ax + b
		var a: number;

		// 根据
		// y1 = ax1 + b
		// y2 = ax2 + b
		// 上下两式相减消去b, 得到 a = ( y1 - y2 ) / ( x1 - x2 ) 
		a = (ponit1.y - point2.y) / (ponit1.x - point2.x);

		var b: number;

		//将a的值代入任一方程式即可得到b
		b = ponit1.y - a * ponit1.x;

		//把a,b值代入即可得到结果函数
		if (type == 0) {
			resultFuc = function (x: number): number {
				return a * x + b;
			}
		}
		else if (type == 1) {
			resultFuc = function (y: number): number {
				return (y - b) / a;
			}
		}

		return resultFuc;
	}

	/**
	 * 得到两点间连线的斜率 
	 * @param ponit1	
	 * @param point2
	 * @return 			两点间连线的斜率 
	 * 
	 */
	public static getSlope(ponit1: cc.Vec2, point2: cc.Vec2): number {
		return (point2.y - ponit1.y) / (point2.x - ponit1.x);
	}

	/**
	 * 取得num1到num2之间的一个随机整数（可取到num1，不会取到num2）
	 * */
	public static randomInt(num1: number, num2: number): number {
		var r: number;
		if (num1 == num2) {
			return num1;
		}
		else if (num1 < num2) {
			r = num1 + (num2 - num1) * Math.random();
		}
		else {
			r = num2 + (num1 - num2) * Math.random();
		}
		return r;
	}

	/**
	 * 将数字按指定长度输出，不足前缀补零
	 * @param num 
	 * @param len 
	 */
	prefixZero(num, len) {
		if (String(num).length > len) return num;
		return (Array(len).join("0") + num).slice(-len);
	}
}