import Picture from "./pictures/Picture";

export default class ProviderResult {
    constructor() {

        /** 
         * @member
         * @public
         * @type {String}         
         */
        this.provider = null;

        /** 
         * @member
         * @public
         * @type {Array<Picture>}         
         */
        this.pictures = [];

        /** 
         * @member
         * @public
         * @type {Boolean}         
         */
        this.succeeded = true;

        /** 
         * @member
         * @public
         * @type {String}         
         */
        this.errorcode = null;

        /**
         * @member
         * @public
         * @type {Boolean}
         */
        this.end = false;
    }
}