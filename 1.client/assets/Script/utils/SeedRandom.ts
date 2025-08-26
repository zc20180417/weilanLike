export class SeedRandom {

    private _seed:number = 0;

    public set seed(value:number) {
        this._seed = value;
    }

     /**种子随机数 */
    seedRandom(): number {
        this._seed = (this._seed * 9301 + 49297) % 233280;
        const value =  this._seed / 233280.0;
        return value;
    }
}