import xml2js from 'xml2js';
import {
    ProviderFilter
} from "../../model/ProviderFilter";
import {
    OnlinePictureProvider
} from './PictureProvider';
import SafebooruPicture from '../../model/pictures/SafebooruPicture';

/**
 * @class
 * @classdesc Represents an online source which can return picture objects
 * based on a set of filter options using HTTP from safebooru.org . 
 * @extends {OnlinePictureProvider}
 */
export class SafebooruProvider extends OnlinePictureProvider {

    /**
     * Returns the name of the provider
     * @public
     * @static
     * @function
     * @returns {String}     
     */
    static getName() {
        return "safebooru";
    }

    constructor() {
        super();

        /**
         * @member
         * @protected
         * @override
         * @type {String}
         */
        this._baseUrl = 'https://safebooru.org/index.php?page=dapi&s=post&q=index';

        /**
         * @member
         * @protected
         * @override
         * @type {string}
         */
        this._name = SafebooruProvider.getName();
    }

    /**
     * Constructs the current request URL based on the current filter.
     * @function
     * @override
     * @param {ProviderFilter} filter The filter object.
     * @returns {String}
     */
    constructUrl(filter) {
        let url = "" + this._baseUrl;

        if (filter.tags && filter.tags.length) {
            url += `&tags=${encodeURI(filter.tagString)}`;
        }

        if (filter.page) {
            url += `&pid=${filter.page}`;
        }

        if (filter.limit) {
            url += `&limit=${filter.limit}`;
        }

        return url;
    }

    /**
     * Transforms the received raw data string (XML/JSON/HTML) into an array of objects.
     * @function
     * @override
     * @param {String} rawData The raw data received in the response.
     * @returns {Promise<Array<Object>>}
     */
    transformRawData(rawData) {
        return new Promise((resolve, reject) => {
            const parser = new xml2js.Parser();
            parser.parseStringPromise(rawData).then((data) => {

                /** @type {Array<Object>} */
                const processedItems = [];

                /** @type {Array<Object>} */
                const posts = data.posts.post;

                if (posts && posts.length) {
                    posts.forEach(post => {
                        const innerPost = post.$;
                        processedItems.push(innerPost);
                    });
                }

                resolve(processedItems);
            })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    /**
     * Transforms the raw object item into a picture class instance.
     * @function
     * @override
     * @param {Object} rawDataItem 
     * @returns {Picture}
     */
    transformRawDataItem(rawDataItem) {
        const picture = new SafebooruPicture();
        picture.fromData(rawDataItem);

        return picture;
    }
}