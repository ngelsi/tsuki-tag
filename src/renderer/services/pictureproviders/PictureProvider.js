import axios from 'axios';

import {
    ProviderFilter
} from "../../model/ProviderFilter";

import {
    Picture
} from "../../model/pictures/Picture";

import {
    remote
} from 'electron';

/** 
 * @class
 * @classdesc Represents a source which can return picture objects
 * based on a set of filter options.
 * @abstract
 */
export class PictureProvider {

    constructor() {

        /**
         * @member
         * @protected
         * @abstract
         * @type {string}
         */
        this._name = null;
    }

    /**
     * @property
     * @public
     * @type {String}
     */
    get name() {
        return this._name;
    }

    /**
     * Retrieves pictures using the provider by the specified
     * filter options.
     * @function
     * @abstract
     * @param {ProviderFilter} filter The filter object.
     * @returns {Promise<Array<Picture>>}
     */
    get(filter) { }
}

/**
 * @class
 * @classdesc Represents an online source which can return picture objects
 * based on a set of filter options using HTTP. 
 * @abstract
 * @extends {PictureProvider}
 */
export class OnlinePictureProvider extends PictureProvider {

    constructor() {
        super();

        /**
         * @member
         * @protected
         * @abstract
         * @type {String}
         */
        this._baseUrl = null;
    }

    /**
     * Retrieves pictures using the provider by the specified
     * filter options.     
     * @function
     * @override
     * @param {ProviderFilter} filter The filter object.
     * @returns {Promise<Array<Picture>>}
     */
    get(filter) {

        return new Promise((resolve, reject) => {
            const url = this.constructUrl(filter);
            const request = remote.net.request(url);
            let completeData = "";

            console.log('url', url);

            request.on('response', (response) => {
                console.log(`STATUS: ${response.statusCode}`);
                // console.log(`HEADERS: ${JSON.stringify(response.headers)}`);

                if (response.statusCode === 200) {
                    response.on('end', () => {

                        this.transformRawData(completeData)
                            .then(( /** @type {Array<object>} */ objs) => {

                                /**
                                 * @type {Array<Picture>}
                                 */
                                const pictures = [];

                                objs.forEach(obj => {

                                    /** @type {Picture} */
                                    let picture = this.transformRawDataItem(obj);

                                    if (picture) {
                                        pictures.push(picture);
                                    }
                                });

                                resolve(pictures);
                            })
                            .catch(error => {
                                reject(error);
                            });
                    });
                    response.on('data', (data) => {
                        completeData += data;
                    });
                } else {
                    reject(response.statusMessage);
                }
            });

            request.end();
        });
    }

    /**
     * Constructs the current request URL based on the current filter.
     * @function
     * @abstract
     * @param {ProviderFilter} filter The filter object.
     * @returns {String}
     */
    constructUrl(filter) { }

    /**
     * Transforms the received raw data string (XML/JSON/HTML) into an array of objects.
     * @function
     * @abstract
     * @param {String} rawData The raw data received in the response.
     * @returns {Promise<Array<Object>>}
     */
    transformRawData(rawData) { }

    /**
     * Transforms the raw object item into a picture class instance.
     * @function
     * @abstract
     * @param {Object} rawDataItem 
     * @returns {Picture}
     */
    transformRawDataItem(rawDataItem) { }
}