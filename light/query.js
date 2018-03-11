var Url=require('url');
var query=require('querystring');
module.exports=function () {
    return function (req,res,reslove) {
        req.query={};
        var url=Url.parse(req.url).query;
        var Qobj=query.parse(url);

        for(var i in Qobj){
            req.query[i]=Qobj[i];
        }
        reslove();
    }
}
