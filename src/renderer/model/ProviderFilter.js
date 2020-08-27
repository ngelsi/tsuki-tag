export default class ProviderFilter {
    constructor() {

        /**
         * @private
         * @type {String}
         */
        this._tags = null;

        /**
         * @private
         * @type {Number}
         */
        this._limit = 30;

        /**
         * @private
         * @type {Number}
         */
        this._page = 0;

        /**
         * @private
         * @type {Array<String>}
         */
        this._providers = [];
    }

    /**
     * @property
     * @public
     * @type {Array<string>}
     */
    get providers() {
        return this._providers;
    }

    /**
     * @param {Array<String>} providers
     */
    set providers(providers) {
        this._providers = providers;
    }

    /**
     * @property
     * @public
     * @type {String}
     */
    get tagString() {
        return this._tags;
    }

    /**
     * @property
     * @public
     * @type {Array<String>}
     */
    get tags() {
        return this._tags ? this._tags.trim().split(' ') : [];
    }

    /**
     * @param {Array<String> | String} tagStr 
     */
    set tags(tagStr) {

        if (!tagStr) {
            this._tags = [];
        } else {
            if (tagStr instanceof Array) {
                this._tags = tagStr.join(' ');
            } else {
                this._tags = tagStr;
            }
        }
    }

    /**
     * @property
     * @public
     * @type {Number}
     */
    get limit() {
        return this._limit;
    }

    /**
     * @param {Number} limit
     */
    set limit(limit) {
        this._limit = limit;
    }

    /**
     * @property
     * @public
     * @type {Number}
     */
    get page() {
        return this._page;
    }

    /**
     * @param {Number} page
     */
    set page(page) {
        this._page = page;
    }
}