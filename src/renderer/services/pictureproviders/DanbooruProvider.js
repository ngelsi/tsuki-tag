import {
    ProviderFilter
} from "../../model/ProviderFilter";
import {
    OnlinePictureProvider
} from './PictureProvider';
import DanbooruPicture from "../../model/pictures/DanbooruPicture";
import ProviderResult from "../../model/ProviderResult";

/**
 * @class
 * @classdesc Represents an online source which can return picture objects
 * based on a set of filter options using HTTP from safebooru.org . 
 * @extends {OnlinePictureProvider}
 */
export class DanbooruProvider extends OnlinePictureProvider {

    /**
     * Returns the name of the provider
     * @public
     * @static
     * @function
     * @returns {String}     
     */
    static getName() {
        return "danbooru";
    }

    constructor() {
        super();

        /**
         * @member
         * @protected
         * @override
         * @type {String}
         */
        this._baseUrl = 'https://danbooru.donmai.us/posts.json';

        /**
         * @member
         * @protected
         * @override
         * @type {string}
         */
        this._name = DanbooruProvider.getName();
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
        let queries = [];

        if (filter.page) {
            queries.push(`page=${filter.page + 1}`);
        }

        if (filter.limit) {
            queries.push(`limit=${filter.limit}`)
        }

        if (filter.tags && filter.tags.length) {
            queries.push(`tags=${encodeURI(filter.tagString)}`);
        }

        url += `?${queries.join("&")}`;

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
            try {
                const data = JSON.parse(rawData);
                resolve(data);
            }
            catch (err) {
                reject(err);
            }
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
        const picture = new DanbooruPicture();
        picture.fromData(rawDataItem);

        return picture;
    }

    /**
     * The providers can try to process the returned error here.
     * @function
     * @override
     * @param {*} err
     * @param {ProviderResult} result
     */
    processError(err, result) {

        //Can't have more than 2 tags for Danbooru 
        if (err.toString().indexOf("422") !== -1) {
            result.errorcode = "danbooru.taglimit";
            result.end = true;
        }
    }
}