
var DOMAIN = process.env.DOMAIN || 'http://localhost:9003';
var baseProperties = {
    gmail:{
        user: 'demo',
        password: 'demo'
    },
    xeroConsumerKey:'HEELXGWJJOASNFBAPBV8AO4M6CGDXO',
    xeroConsumerSecret:'UFHJXUWK2IEOBSQQ8CNGC9BLYMSQMS',
    xeroCallbackUrl: DOMAIN + '/api/xero/callback'
};


module.exports = function(){
    Object.keys(baseProperties).forEach(function(key){
        if (process.env[key]){
            baseProperties[key] = process.env[key];
        }
    });
    return baseProperties;
}();
