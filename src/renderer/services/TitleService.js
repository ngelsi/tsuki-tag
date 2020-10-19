const defaultTitle = 'Tsuki-tag';

class TitleService {

    constructor() {
        /** 
         * @member
         * @protected
         * @type {String}
         */
        this._title = defaultTitle;

        /**
         * @member
         * @protected
         * @type {Array<Function>}
         */
        this._handlers = [];
    }

    /**
     * @property
     * @public
     * @type {String}
     */
    get title() {
        return this._title;
    }

    /**
     * @param {String} title
     */
    set title(title) {
        this._title = title;
        this._titleChanged();
    }

    resetTitle() {
        this._title = defaultTitle;
        this._titleChanged();
    }

    /**     
     * @param {String} title 
     */
    appendTitle(title) {
        this._title = `${defaultTitle} - ${title}`;
        this._titleChanged();
    }

    /**     
     * @param {Function} handler 
     */
    addHandler(handler) {
        this._handlers.push(handler);
    }

    /**
     * @protected
     */
    _titleChanged() {
        if (this._handlers && this._handlers.length) {
            this._handlers.forEach(handler => {
                handler(this._title);
            });
        }
    }
}

const titleService = new TitleService();
export { titleService };
