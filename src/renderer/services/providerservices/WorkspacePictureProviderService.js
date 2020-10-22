import {
    SafebooruProvider
} from "../pictureproviders/SafebooruProvider";
import {
    KonachanProvider
} from '../pictureproviders/KonachanProvider';
import {
    DanbooruProvider
} from '../pictureproviders/DanbooruProvider';
import {
    GelbooruProvider
} from "../pictureproviders/GelbooruProvider";
import {
    PictureProvider
} from "../pictureproviders/PictureProvider";
import {
    ProviderFilter
} from "../../model/ProviderFilter";

import Picture from "../../model/pictures/Picture";
import ProviderResult from "../../model/ProviderResult";
import PictureProviderService from './PictureProviderService';
import ProviderServiceResult from "../../model/ProviderServiceResult";
import DataStore from '../DataStore';
import { t } from "../Localizer";
import StringUtils from '../StringUtils';
import AppSettings from "../../model/AppSettings";
import WorkspaceProvider from "../pictureproviders/WorkspaceProvider";

export default class WorkspacePictureProviderService extends PictureProviderService {

    constructor() {
        super();

        /**
         * @member
         * @protected
         * @override
         * @type {Array<PictureProvider>}
         */
        this._providers = [
        ];

        /**
         * @member
         * @protected
         * @override
         * @type {String}
         */
        this._name = 'workspaces';

        /**
         * Create providers for workspaces
         */
        this._initializeProviders();
    }

    /**
     * @property
     * @public
     * @override
     * @type {Array<String>}
     */
    get providerNames() {
        const providers = [];
        this._providers.forEach(provider => {
            providers.push(provider.name);
        });

        return providers;
    }

    /**
     * Create a workspace provider for each workspace
     * @method
     * @protected     
     */
    _initializeProviders() {
        
        const dataStore = new DataStore();
        DataStore.defaults[AppSettings.name] = AppSettings.default;

        /** @type {AppSettings} */
        const data = dataStore.getSync(AppSettings.name);

        data.workspaces.forEach((workspace) => {
            this._providers.push(new WorkspaceProvider(workspace));
        });
    }

    /**
     * Retrieves pictures using the providers specified by the filter object.     
     * @function
     * @override
     * @param {ProviderFilter} filter The filter object to be passed to the specified picture providers.
     * @returns {Promise<ProviderServiceResult>}
     */
    get(filter) {

        return new Promise((resolve, reject) => {

            /** @type {Array<Promise>} */
            const promises = [];

            this._providers.forEach((provider) => {
                if (filter.providers.indexOf(provider.name) >= 0) {
                    promises.push(provider.get(filter));
                }
            });

            Promise.all(promises)
                .then( /** @param {Array<ProviderResult>} results */ results => {

                    const serviceResult = new ProviderServiceResult();

                    results.forEach(/** @param {ProviderResult} result */ result => {

                        if (result.pictures && result.pictures.length) {
                            result.pictures.forEach(/** @param {Picture} image */ image => {
                                if (image && image instanceof Picture && image.md5) {
                                    serviceResult.pictures.push(image);
                                }
                            });
                        }

                        if (!result.succeeded || result.end) {
                            serviceResult.finishedProviders.push(result.provider);
                        }

                        if (result.errorcode) {
                            serviceResult.errors.push(
                                StringUtils.format(t(result.errorcode), {
                                    provider: t(result.provider)
                                })
                            );
                        }

                    });

                    console.log('service result');
                    console.log('picture count ', serviceResult.pictures.length);
                    console.log('finished providers ', serviceResult.finishedProviders);
                    console.log('errors ', serviceResult.errors);

                    resolve(serviceResult);
                })
                .catch(errors => {
                    reject(errors);
                });
        });
    }

}