import Picture from "./pictures/Picture";

export default class ProviderServiceResult {

    constructor() {

        /**
         * @member
         * @public
         * @type {Array<Picture>}
         */
        this.pictures = [];

        /**
         * @member
         * @public
         * @type {Array<String>}
         */
        this.errors = [];

        /**
         * @member
         * @public
         * @type {Array<String>}
         */
        this.finishedProviders = [];
    }
}