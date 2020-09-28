import PictureProviderService from "./PictureProviderService";
import DataStore from '../DataStore';
import FavoritePictures from "../../model/FavoritePictures";
import ProviderFilter from "../../model/ProviderFilter";
import ProviderServiceResult from "../../model/ProviderServiceResult";
import Picture from "../../model/pictures/Picture";

export default class FavoritePictureProviderService extends PictureProviderService {

    constructor() {
        super();

        /**
         * @member
         * @protected
         * @override
         * @type {Array<PictureProvider>}
         */
        this._providers = [
        ];

        /**
         * @member
         * @protected
         * @override
         * @type {String}
         */
        this._name = 'favorites';
    }

    /**
     * @property
     * @public
     * @override
     * @type {Array<String>}
     */
    get providerNames() {
        return [];
    }

    /**
     * Retrieves pictures using the providers specified by the filter object.     
     * @function
     * @override
     * @param {ProviderFilter} filter The filter object to be passed to the specified picture providers.
     * @returns {Promise<ProviderServiceResult>}
     */
    get(filter) {
        const dataStore = new DataStore();
        DataStore.defaults[FavoritePictures.name] = FavoritePictures.default;

        return new Promise((resolve, reject) => {
            dataStore.get(FavoritePictures.name)
                .then((/** @type {FavoritePictures} */ favoritePictures) => {

                    const pictures = [];
                    favoritePictures.pictures.forEach((picture) => {

                        let eligible = true;
                        filter.tags.forEach((tag) => {
                            if (!picture._tags.includes(tag)) {
                                eligible = false;
                            }
                        });

                        if (eligible) {
                            pictures.push(picture);
                        }
                    });

                    const resultPictures = pictures.slice(filter.page * filter.limit, (filter.page * filter.limit) + filter.limit);
                    const result = new ProviderServiceResult();

                    result.pictures = resultPictures.map(p => Object.assign(new Picture(), p));
                    resolve(result);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
}