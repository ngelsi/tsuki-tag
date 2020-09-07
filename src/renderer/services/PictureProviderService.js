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
     * @returns {Promise<Array<Picture>>}
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
     * @returns {Promise<Array<Picture>>}
     */
    get(filter) {

        return new Promise((resolve, reject) => {

            /** @type {Array<Promise>} */
            const promises = [];

            this._providers.forEach(provider => {
                if (filter.providers.indexOf(provider.name) >= 0) {
                    promises.push(provider.get(filter));
                }
            });

            Promise.all(promises)
                .then( /** @type {Array<Array<Picture>>} */ imageCollections => {

                    /** @type {Array<Picture>} */
                    const imageList = [];

                    imageCollections.forEach( /** @type {Array<Picture>} */ images => {
                        images.forEach( /** @type {Picture} */ image => {
                            if (image && image instanceof Picture && image.md5) {
                                imageList.push(image);
                            }
                        });
                    });

                    resolve(imageList);
                })
                .catch(errors => {
                    reject(errors);
                });
        });
    }

}