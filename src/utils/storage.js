const namespace = '[USER_TOKEN]';
export const storage = {
    set(key, value) {
        let storage = window.localStorage.getItem(namespace);
        if (!storage) {
            storage = {};
        } else {
            storage = JSON.parse(storage);
        }
        storage[key] = {
            ...value,
        };
        storage.expires = new Date().getTime() + 1000 * 60 * 60 * 24 * 2;
        window.localStorage.setItem(namespace, JSON.stringify(storage));
    },
    get(key, def) {
        let storage = window.localStorage.getItem(namespace);
        if (!storage) {
            return def;
        }
        storage = JSON.parse(storage);
        console.log('storage', storage);
        if (storage.expires < new Date().getTime()) {
            this.remove(key);
            return def;
        }
        let result = storage[key];
        return result || def;
    },
    remove(key) {
        let storage = window.localStorage.getItem(namespace);
        if (!storage) {
            return;
        }
        storage = JSON.parse(storage);
        delete storage[key];
        this.clear();
    },
    clear() {
        window.localStorage.removeItem(namespace);
    },
};
