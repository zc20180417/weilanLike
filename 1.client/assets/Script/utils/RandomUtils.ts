import { SeedRandom } from "./SeedRandom";

export class RandomUtils {


    private seedRandom: SeedRandom;

    constructor() {
        this.seedRandom = new SeedRandom();
    }

    seedRandomConst(): number {
        return this.seedRandom.seedRandom();
    }

    randomInt(min: number, max: number): number {
        return Math.floor(this.seedRandomConst() * (max - min + 1) + min);
    }

    resetRandomSeed(value: number) {
        this.seedRandom.seed = value;
    }

    randomGetItemByList(list: any[]): any {
        if (list.length == 0) return null;
        return list[this.randomInt(0, list.length - 1)];
    }
}