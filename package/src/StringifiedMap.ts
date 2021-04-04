export class StringifiedMap<K, V> extends Map {
    private keyMap = new Map<string, K>();

    public set(key: K, value: V) {
        const keyString = JSON.stringify(key);
        this.keyMap.set(keyString, key);

        return super.set(keyString, value);
    }

    public get(key: K): V {
        return super.get(JSON.stringify(key));
    }

    public has(key: K): boolean {
        return super.has(JSON.stringify(key));
    }

    public keys(): IterableIterator<K> {
        return this.keyMap.values();
    }

    public entries(): IterableIterator<[K, V]> {
        return this[Symbol.iterator]();
    }

    public *[Symbol.iterator](): IterableIterator<[K, V]> {
        for (const [key, value] of super[Symbol.iterator]()) {
            yield [this.keyMap.get(key), value];
        }
    }
}
