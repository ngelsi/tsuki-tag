export default class StringUtils {

    /**
     * C#-like string formatting e.g. {0} {1} {2} {n} where the n is replaced to the
     * n-th element in parameters.
     * @public
     * @static
     * @param {String} template 
     * @param  {...any} parameters 
     * @returns {String}
     */
    static cformat(template, ...parameters) {
        for (let i = 0; i < parameters.length; ++i) {
            const reg = new RegExp('\\{' + i + '\\}', 'gm');
            template = template.replace(reg, arguments[i + 1]);
        }
        return template;
    }

    /**
     * String formatting where template {propertyname} gets replaced to o.propertyname value.
     * @public
     * @static
     * @param {String} template 
     * @param {Object} o 
     * @returns {String}
     */
    static format(template, o) {
        for (const obj in o) {
            if (o.hasOwnProperty(obj)) {
                if (typeof (o[obj]) === 'function') {
                    template = template.replace(new RegExp('{' + obj + '}', 'g'), o[obj](o) || '');
                } else {
                    template = template.replace(new RegExp('{' + obj + '}', 'g'), o[obj] || '');
                }
            }
        }

        return template;
    }

}