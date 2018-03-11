let obj={
    port:8888,
    views:"views",
    staticType:".jpg,.png,.gif,.css,.jpeg,.js",
    type:{
        ".jpg":"image/jpeg",
        ".jpeg":"image/jpeg",
        ".png":"image/png",
        ".gif":"image/gif",
        ".css":"text/css",
        ".js":"application/x-javascript"
    },
    staticDir:"static"
}
module.exports=obj;