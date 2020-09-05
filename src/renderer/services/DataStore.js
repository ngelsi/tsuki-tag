import fs from 'fs';
import path from 'path';
import DataStoreMigration from '../model/migrations/DataStoreMigration';

import {
    remote
} from 'electron';

let DataCache = {};
let Defaults = {};
let Migrations = {
    'appsettings': [

    ]
};

export default class DataStore {

    constructor() {

        /** @type {String} */
        this._userDataPath = (remote.app).getPath('userData');
    }

    /**
     * @static
     * @public
     * @type {Object}
     */
    static get cache() {
        return DataCache;
    }

    /**
     * @static
     * @public
     * @type {Object}
     */
    static get defaults() {
        return Defaults;
    }

    /**
     * @protected
     * @param {String} key 
     * @returns {String}
     */
    getPath(key) {
        return path.join(this._userDataPath, 'data', key + '.json');
    }

    /**
     * @protected
     * @param {String} key 
     * @param {Object} data 
     */
    checkMigration(key, data) {

        /** @type {Array<DataStoreMigration>} */
        const migrations = Migrations[key];

        migrations.forEach(/** @type {DataStoreMigration} */ migration => {
            if (migration.version > data.version) {
                migration.apply(data);
            }
        });
    }

    /**
     * @public
     * @param {String} key
     * @returns {Promise}
     */
    get(key) {
        return new Promise((resolve, reject) => {

            if (DataCache[key]) {
                resolve(DataCache[key]);
            }
            else {
                const filePath = this.getPath(key);
                fs.readFile(filePath, (err, data) => {
                    if (err) {
                        if (err.code === "ENOENT") {
                            if (Defaults[key]) {
                                resolve(Defaults[key]);
                            }
                            else {
                                resolve(null);
                            }
                        }
                        else {
                            reject(err);
                        }
                    }
                    else {
                        if (data) {
                            const obj = JSON.parse(data);

                            this.checkMigration(key, obj);

                            DataCache[key] = obj;

                            resolve(obj);
                        } else {
                            if (Defaults[key]) {
                                resolve(Defaults[key]);
                            }
                            else {
                                resolve(null);
                            }
                        }
                    }
                });
            }
        });
    }

    /**
     * @public
     * @param {String} key
     * @param {Object} val
     * @returns {Promise}
     */
    set(key, val) {
        return new Promise((resolve, reject) => {

            const filePath = this.getPath(key);
            const directory = path.dirname(filePath);
            const data = JSON.stringify(val);

            fs.exists(directory, (exists) => {
                if (!exists) {
                    fs.mkdir(directory, (err) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            fs.writeFile(filePath, data, (err) => {
                                if (err) {
                                    reject(err);
                                }
                                else {
                                    DataCache[key] = val;
                                    resolve();
                                }
                            });
                        }
                    });
                }
                else {
                    fs.writeFile(filePath, data, (err) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            DataCache[key] = val;
                            resolve();
                        }
                    });
                }
            });
        });
    }

    /**
     * @public
     * @param {String} key 
     * @param {Object} val      
     */
    setSync(key, val) {
        const filePath = this.getPath(key);
        const data = JSON.stringify(val);

        fs.writeFileSync(filePath, data);
        DataCache[key] = val;
    }
}
