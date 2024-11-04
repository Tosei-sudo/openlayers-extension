
class iDBEvent extends Event {
    constructor(type, data) {
        super(type);

        this.data = data;
    }
}

class iDBError extends Error {
    constructor(message) {
        super(message);
    }
}

class iDB {
    constructor(dbName) {
        this.dbName = dbName;
        this.db = null;

        this.eventTarget = new EventTarget();
    }

    connect() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName);

            request.onerror = (event) => {
                reject(event);
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;

                this.eventTarget.dispatchEvent(new iDBEvent("open", this.db));
                resolve(event);
            };
        });
    }

    disconnect() {
        if (this.db !== null) {
            this.db.close();
            this.db = null;
        }
    }

    uninstall() {
        return new Promise((resolve, reject) => {
            this.disconnect();

            const req = indexedDB.deleteDatabase(this.dbName);

            req.onsuccess = (event) => {
                resolve(event);
            };

            req.onerror = (event) => {
                reject(new iDBError(event.target.error));
            };
        });
    }

    on(eventName, callback) {
        this.eventTarget.addEventListener(eventName, callback);
    }

    hasStore(storeName) {
        return this.db.objectStoreNames.contains(storeName);
    }

    createStore(storeName, options) {
        return new Promise((resolve, reject) => {
            const newVersion = this.db.version + 1;
            this.db.close();

            const req = indexedDB.open(this.dbName, newVersion);

            req.onupgradeneeded = (event) => {
                this.db = event.target.result;

                if (!this.db.objectStoreNames.contains(storeName)) {
                    this.db.createObjectStore(storeName, options);
                } else {
                    reject(new iDBError("Store already exists"));
                }
            };

            req.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(event);
            };

            req.onerror = (event) => {
                reject(new iDBError(event.target.error));
            };
        });
    }

    deleteStore(storeName) {
        return new Promise((resolve, reject) => {
            const newVersion = this.db.version + 1;
            this.db.close();

            const req = indexedDB.open(this.dbName, newVersion);

            req.onupgradeneeded = (event) => {
                this.db = event.target.result;

                if (this.db.objectStoreNames.contains(storeName)) {
                    this.db.deleteObjectStore(storeName);
                } else {
                    reject(new iDBError("Store does not exist"));
                }
            };

            req.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(event);
            };

            req.onerror = (event) => {
                reject(new iDBError(event.target.error));
            };
        });
    }

    checkConnStore(storeName) {
        if (!this.db) {
            throw new iDBError("Database not connected");
        }
        if (!this.db.objectStoreNames.contains(storeName)) {
            throw new iDBError("Store does not exist");
        }
    }

    add(storeName, data) {
        return new Promise((resolve, reject) => {
            this.checkConnStore(storeName);

            const transaction = this.db.transaction(storeName, "readwrite");
            const store = transaction.objectStore(storeName);

            const req = store.add(data);

            req.onsuccess = (event) => {
                resolve(event);
            };

            req.onerror = (event) => {
                reject(new iDBError(event.target.error));
            };
        });
    }

    get(storeName, key) {
        return new Promise((resolve, reject) => {
            this.checkConnStore(storeName);

            const transaction = this.db.transaction(storeName, "readonly");
            const store = transaction.objectStore(storeName);

            const req = store.get(key);

            req.onsuccess = (event) => {
                resolve(event.target.result);
            };

            req.onerror = (event) => {
                reject(new iDBError(event.target.error));
            };
        });
    }

    getAll(storeName) {
        return new Promise((resolve, reject) => {
            this.checkConnStore(storeName);

            const transaction = this.db.transaction(storeName, "readonly");
            const store = transaction.objectStore(storeName);

            const req = store.getAll();

            req.onsuccess = (event) => {
                resolve(event.target.result);
            };

            req.onerror = (event) => {
                reject(new iDBError(event.target.error));
            };
        });
    }

    put(storeName, data) {
        return new Promise((resolve, reject) => {
            this.checkConnStore(storeName);

            const transaction = this.db.transaction(storeName, "readwrite");
            const store = transaction.objectStore(storeName);

            const req = store.put(data);

            req.onsuccess = (event) => {
                resolve(event);
            };

            req.onerror = (event) => {
                reject(new iDBError(event.target.error));
            };
        });
    }

    puts(storeName, dataArr) {
        return new Promise((resolve, reject) => {
            this.checkConnStore(storeName);

            const transaction = this.db.transaction(storeName, "readwrite");
            const store = transaction.objectStore(storeName);

            dataArr.forEach(data => {
                store.put(data);
            });

            transaction.oncomplete = (event) => {
                resolve(event);
            };

            transaction.onerror = (event) => {
                reject(new iDBError(event.target.error));
            };
        });
    }

    delete(storeName, key) {
        return new Promise((resolve, reject) => {
            this.checkConnStore(storeName);

            const transaction = this.db.transaction(storeName, "readwrite");
            const store = transaction.objectStore(storeName);

            const req = store.delete(key);

            req.onsuccess = (event) => {
                resolve(event);
            };

            req.onerror = (event) => {
                reject(new iDBError(event.target.error));
            };
        });
    }

    clear(storeName) {
        return new Promise((resolve, reject) => {
            this.checkConnStore(storeName);

            const transaction = this.db.transaction(storeName, "readwrite");
            const store = transaction.objectStore(storeName);

            const req = store.clear();

            req.onsuccess = (event) => {
                resolve(event);
            };

            req.onerror = (event) => {
                reject(new iDBError(event.target.error));
            };
        });
    }
}

export { iDB, iDBEvent };
export default iDB;