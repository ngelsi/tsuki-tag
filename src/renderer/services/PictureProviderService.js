import {
    SafebooruProvider
} from "./pictureproviders/SafebooruProvider";
import {
    KonachanProvider
} from './pictureproviders/KonachanProvider';
import {
    DanbooruProvider
} from './pictureproviders/DanbooruProvider';
import {
    PictureProvider
} from "./pictureproviders/PictureProvider";
import {
    ProviderFilter
} from "../model/ProviderFilter";
import Picture from "../model/pictures/Picture";
import { GelbooruProvider } from "./pictureproviders/GelbooruProvider";
import ProviderResult from "../model/ProviderResult";
import ProviderServiceResult from "../model/ProviderServiceResult";
import { t } from "./Localizer";
import StringUtils from './StringUtils';

/**
 * @class
 * @classdesc Represents a collection of picture providers which will individually be called by the
 * service when new pictures are requested by the caller.
 * @abstract
 */
class PictureProviderService {

    constructor() {

        /**
         * @member
         * @protected
         * @abstract
         * @type {Array<PictureProvider>}
         */
        this._providers = [];
    }

    /**
     * @property
     * @public
     * @abstract
     * @type {Array<String>}
     */
    get providerNames() { }

    /**
     * Retrieves pictures using the providers specified by the filter object.     
     * @function
     * @abstract
     * @param {ProviderFilter} filter The filter object to be passed to the specified picture providers.
     * @returns {Promise<ProviderServiceResult>}
     */
    get(filter) { }

}

export class OnlinePictureProviderService extends PictureProviderService {

    constructor() {
        super();

        /**
         * @member
         * @protected
         * @override
         * @type {Array<PictureProvider>}
         */
        this._providers = [
            new SafebooruProvider(),
            new KonachanProvider(),
            new DanbooruProvider(),
            new GelbooruProvider()
        ];
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