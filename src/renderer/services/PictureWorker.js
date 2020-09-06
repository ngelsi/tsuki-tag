import {
    remote
} from 'electron';

import fs from 'fs';
import Picture from "../model/picture/Picture";

export default class PictureWorker {

    /** 
     * @param {String} url
     * @returns {Promise}
     */
    downloadPicture(url) {
        return new Promise((resolve, reject) => {
            const request = remote.net.request(url);
            let buffer = null;
            console.log("url", url);

            request.on("response", (response) => {
                if (response.statusCode === 200) {
                    response.on("end", () => {
                        resolve(buffer);
                    });
                    response.on("data", (/** @type {Buffer} */ data) => {
                        if (!buffer) {
                            buffer = data;
                        } else {
                            buffer = Buffer.concat([buffer, data]);
                        }
                    });
                } else {
                    reject(response.statusMessage);
                }
            });

            request.end();
        });
    }

    /**
     *  @param {String} extension
     *  @param {Buffer} buffer     
     *  @returns {String}     
     */
    convertToSrc(extension, buffer) {
        const base64 = this.convertToBase64(buffer);
        return 'data:' + `image/${extension}` + ';base64,' + base64;
    }

    /**
     *  @param {Buffer} buffer
     *  @returns {String}     
     */
    convertToBase64(buffer) {

        var mime;
        var a = new Uint8Array(buffer);
        var nb = a.length;

        if (nb < 4) {
            return null;
        }

        var b0 = a[0];
        var b1 = a[1];
        var b2 = a[2];
        var b3 = a[3];

        if (b0 == 0x89 && b1 == 0x50 && b2 == 0x4E && b3 == 0x47) {
            mime = 'image/png';
        }
        else if (b0 == 0xff && b1 == 0xd8) {
            mime = 'image/jpeg';
        }
        else if (b0 == 0x47 && b1 == 0x49 && b2 == 0x46) {
            mime = 'image/gif';
        }
        else {
            return null;
        }

        var binary = "";
        for (var i = 0; i < nb; i++) {
            binary += String.fromCharCode(a[i]);
        }

        var base64 = window.btoa(binary);
        return base64;
    }

    /**     
     * @param {String} path 
     * @param {Buffer} buffer 
     * @returns {Promise}
     */
    savePicture(path, buffer) {
        return new Promise((resolve, reject) => {
            fs.open(path, 'w', function (err, fd) {
                if (err) {
                    reject(err);
                }
                else {
                    fs.write(fd, buffer, 0, buffer.length, null, function (err) {
                        if (err) {
                            reject(err);
                        }
                        else {
                            fs.close(fd, (err) => {
                                if (err) {
                                    reject(err);
                                }
                                else {
                                    resolve();
                                }
                            });
                        }
                    });
                }
            });
        });
    }
}