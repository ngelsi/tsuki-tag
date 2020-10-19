import {
    remote
} from 'electron';

import fs from 'fs';
import path, { resolve } from 'path';
import ProviderFilter from "../../model/ProviderFilter";
import ProviderResult from "../../model/ProviderResult";
import Workspace from "../../model/Workspace";
import { PictureProvider } from "./PictureProvider";
import DataStore from '../DataStore';
import WorkspacePictures from '../../model/WorkspacePictures';
import WorkspacePicture from '../../model/pictures/WorkspacePicture';
import PictureWorker from '../PictureWorker';
import Picture from '../../model/pictures/Picture';
import { titleService } from '../TitleService';
import StringUtils from '../StringUtils';
import { t } from '../Localizer';
import AppSettings from '../../model/AppSettings';

export default class WorkspaceProvider extends PictureProvider {

    /** @param {Workspace} workspace */
    constructor(workspace) {
        super();

        /**
         * @member
         * @protected
         * @override
         * @type {string}
         */
        this._name = workspace.name;

        /**
         * @member
         * @protected         
         * @type {Workspace}
         */
        this._workspace = workspace;
    }

    /**
     * Retrieves pictures using the provider by the specified
     * filter options.
     * @function
     * @abstract
     * @param {ProviderFilter} filter The filter object.
     * @returns {Promise<ProviderResult>}
     */
    get(filter) {

        return new Promise((resolve, reject) => {
            const result = new ProviderResult();
            const dataStore = new DataStore();

            DataStore.defaults[AppSettings.name] = AppSettings.default;
            DataStore.defaults[WorkspacePictures.name] = WorkspacePictures.default;

            /** @type {AppSettings} */
            const settings = dataStore.getSync(AppSettings.name);

            dataStore.get(WorkspacePictures.name)
                .then((/** @type {WorkspacePictures} */ workspacePictures) => {

                    /** @type {Array<Promise>} */
                    const imagePromises = [];
                    /** @type {Array<Picture>} */
                    const pictures = [];
                    /** @type {Array<Picture>} */
                    const uneligiblePictures = [];
                    /** @type {PictureWorker} */
                    const worker = new PictureWorker();

                    /** @type {Array<string>} */
                    let filesCollection = [];
                    this._getFilesFromFolder(this._workspace.path, filesCollection);

                    filesCollection.forEach((file) => {
                        const existing = workspacePictures.pictures.filter(p => p._path === file);
                        if (existing && existing.length) {
                            let picture = new WorkspacePicture();
                            picture.fromData(existing[0]);

                            pictures.push(picture);
                        }
                        else {
                            if (settings.processNonexistingMetadata) {
                                imagePromises.push(worker.getLocalPicture(file, this._workspace));
                            }
                        }
                    });

                    const getPictures = async (done) => {
                        const data = [];
                        titleService.appendTitle(t("worker.processing"));
                        for (const p in imagePromises) {
                            const d = await imagePromises[p];
                            titleService.appendTitle(StringUtils.cformat(t("worker.processed"), d._path));
                            data.push(d);
                        }

                        titleService.resetTitle();
                        done(data);
                    };

                    getPictures((data) => {

                        if (data && data.length) {
                            data.forEach(d => {
                                pictures.push(d);
                                workspacePictures.pictures.push(d);
                            });
                        }

                        if (filter.tags && filter.tags.length) {
                            filter.tags.forEach(tag => {
                                pictures.forEach((picture) => {
                                    if (!picture.tags.includes(tag)) {
                                        uneligiblePictures.push(picture);
                                    }
                                });
                            });
                        }

                        pictures.forEach((picture) => {
                            if (picture.rating && !filter.ratings.includes(picture.rating)) {
                                uneligiblePictures.push(picture);
                            }
                        });

                        pictures.forEach((picture) => {
                            if (!uneligiblePictures.filter(p => p.md5 === picture.md5).length) {
                                result.pictures.push(picture);
                            }
                        });

                        result.succeeded = true;
                        result.provider = this._workspace.name;
                        result.pictures = result.pictures.slice(filter.page * filter.limit, (filter.page * filter.limit) + filter.limit);
                        result.end = result.pictures.length === 0;

                        console.log('WORKSPACE RESULT', result);

                        if (data && data.length) {
                            dataStore.set(WorkspacePictures.name, workspacePictures)
                                .then(() => {
                                    resolve(result);
                                });
                        }
                        else {
                            resolve(result);
                        }
                    });
                })
                .catch(err => {
                    console.log('ERR', err);
                    result.succeeded = false;
                    resolve(result);
                });
        });
    }

    /**
     * 
     * @param {String} folder 
     * @param {Array<string>} filesCollection      
     */
    _getFilesFromFolder(folder, filesCollection) {
        fs.readdirSync(folder).forEach((file) => {
            const absolutePath = path.join(folder, file);
            if (fs.statSync(absolutePath).isDirectory()) {
                this._getFilesFromFolder(absolutePath, filesCollection);
            }
            else {
                const index = absolutePath.lastIndexOf('.');
                const extension = absolutePath.substr(index + 1, absolutePath.length - index).toLowerCase();

                if (extension === 'jpg' || extension === 'jpeg' || extension === 'png') {
                    filesCollection.push(absolutePath);
                }
            }
        });
    }
}