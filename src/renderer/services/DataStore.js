import fs from 'fs';
import path from 'path';
import DataStoreMigration from '../model/migrations/DataStoreMigration';

import {
    remote
} from 'electron';
import AppSettingsMigration2Pagination from '../model/migrations/AppSettingsMigration2Pagination';
import AppSettingsMigration3WorkspaceProviders from '../model/migrations/AppSettingsMigration3WorkspaceProviders';
import AppSettingsMigration4MetadataProcessing from '../model/migrations/AppSettingsMigration4MetadataProcessing';

let DataCache = {};
let Defaults = {};
let Migrations = {
    'appsettings': [
        new AppSettingsMigration2Pagination(),
        new AppSettingsMigration3WorkspaceProviders(),
        new AppSettingsMigration4MetadataProcessing()
    ],
    'favorites': [

    ],
    'workspacepictures': [

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

                data.version = migration.version;
            }
        });
    }

    /**
     * @public
     * @param {String} key 
     * @returns {Object}
     */
    getSync(key) {
        if (DataCache[key]) {
            return DataCache[key];
        }
        else {
            const fileContent = fs.readFileSync(this.getPath(key));
            if (!fileContent) {
                if (Defaults[key]) {
                    return Defaults[key];
                } else {
                    return null;
                }
            } else {
                const obj = JSON.parse(fileContent);
                this.checkMigration(key, obj);

                DataCache[key] = obj;
                return obj;
            }
        }
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
