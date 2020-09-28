import {
    PictureProvider
} from "../pictureproviders/PictureProvider";
import {
    ProviderFilter
} from "../../model/ProviderFilter";
import ProviderServiceResult from "../../model/ProviderServiceResult";

/**
 * @class
 * @classdesc Represents a collection of picture providers which will individually be called by the
 * service when new pictures are requested by the caller.
 * @abstract
 */
export default class PictureProviderService {

    constructor() {

        /**
         * @member
         * @protected
         * @abstract
         * @type {Array<PictureProvider>}
         */
        this._providers = [];

        /**
         * @member
         * @protected
         * @abstract
         * @type {String}
         */
        this._name = "";
    }

    /**
     * @property
     * @public
     * @abstract
     * @type {Array<String>}
     */
    get providerNames() { }

    /**
     * @property
     * @public
     * @type {String}
     */
    get name() {
        return this._name;
    }

    /**
     * Retrieves pictures using the providers specified by the filter object.     
     * @function
     * @abstract
     * @param {ProviderFilter} filter The filter object to be passed to the specified picture providers.
     * @returns {Promise<ProviderServiceResult>}
     */
    get(filter) { }
}