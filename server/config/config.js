/**
 * default app properties - can be overridden on test or production environment with same name environment variables
 * e.g. export MAX_DRIVERS_RETURNED=5 on linux or set MAX_DRIVERS_RETURNED=5 on windows
 *
 */

var baseProperties = {
    gmail:{
        user: 'demo',
        password: 'demo'
    }
};


module.exports = function(){
    Object.keys(baseProperties).forEach(function(key){
        if (process.env[key]){
            baseProperties[key] = process.env[key];
        }
    });
    return baseProperties;
}();
