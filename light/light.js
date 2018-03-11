var http=require('http');
var config=require('./config.js');
var path=require('path');
var fs=require('fs');
var Url=require('url');
var ejs=require("./ejs");

class light{
    constructor (){
        this.getInfo=[];
        this.postInfo=[];
        this.useInfo=[];
        this.rootUrl=process.cwd();
      }
    listen(port,fn){
        if(arguments.length==0){
            var port=config.port;
            var fn=function () {
                console.log(port);
            }
        }else if(arguments.length==1){
            if(typeof port=='number'){
                var port=port;
                var fn=function(){
                    console.log(port)
                }
            }else if(typeof port=="function"){
                var fn=port;
                var port=config.port;
            }else {
                var port=config.port;
                var fn=function () {
                    console.log(port);
                }
            }
        }else if(arguments.length==2){
               var  poor=port;
               var  fn=fn;
        }
        this.port=port;
       http.createServer((req,res)=> {
           var ext=path.extname(req.url);
           if(ext && config.staticType.indexOf(ext)>-1 ){
               var dir=path.join(path.resolve(config.staticDir),req.url);
               res.setHeader("content-type",config.type[ext]+";charset=utf-8");
               fs.stat(dir,function (err) {
                   if(err){
                       res.writeHead(404);
                       res.end("err");
                   }else {
                       fs.createReadStream(dir).pipe(res);
                   }
               })
           }else {
               this.run(req.method,req,res);
           }

       }).listen(port,function () {
           if(fn){
               fn();
           }
       })

    }
    run(type,req,res){
        var url=req.url;
        if(url=="/favicon.ico"){
            res.end();
        }else {
           new Promise( (reslove,reject)=> {
               var num=0;
               if(this.useInfo.length==0){
                   var num=-1;
               }
               for(var i=0;i<this.useInfo.length;i++){
                   new Promise( (reslove1,reject1)=> {
                       this.useInfo[i](req,res,reslove1);
                   }).then(()=>{
                       num++;
                       if(num==i){
                           reslove();
                       }
                   })
               }

           }).then(()=>{
               this.extent(req,res);
               this.request(req,res,type,url);
           })
        }
    }
    request(req,res,type,url){
        res.sendState='ok';
        if(type=="GET"){
            var arr=this.getInfo;
        }else {
            var arr=this.postInfo;
        }
        var flag=true;
        for(var i=0;i<arr.length;i++){
            var reg=eval(arr[i].url);
            if(reg.test(url)){
                this.current=i;
                flag=false;
                req.params={};
                var results=reg.exec(url);
                for(var j=0;j<results.length;j++){
                    req.params[arr[i].attr[j]]=results[j+1];
                }
                arr[i].callback(req,res);
                break;
            }
        }
        if(flag){
            res.end('error');
        }
    }
    next(req,res){
        var Indexfo=this.current+1;
        var nextInfo=this.getInfo[Indexfo];
        res.writeHeader(302,{"location":nextInfo.originUrl});
        res.end();
    }
    extent(req,res){
        res.redirect=function (url) {
            res.writeHeader(302,{
                "location":url
            })
            res.end()
        }
        res.sent=function (message) {
            res.setHeader("content-type","text/html;charset=utf-8");
            res.end(message)
        }
        res.sentfill= (url)=> {
            var fullPath=path.join(this.rootUrl,url)
            fs.stat(fullPath,function (err) {
                if(err){
                    res.end(err.toString());
                }else {
                    fs.createReadStream(fullPath).pipe(res);
                }
            })
        }
        res.render=function (url,data) {
            var url=path.join(path.resolve(config.views),url)
            fs.readFile(url,function (err,data1) {
                if(err){
                    res.writeHead(404)
                    res.end();
                }else {
                    res.end(ejs(data1.toString(),data));
                }
            })
        }
    }
    saveInfo(url,fn,type){
        var infoArr=type=='get' ?this.getInfo :this.postInfo;
        //路由的匹配
        var arr=url.match(/:([^\/]+)/g)||[];
        arr=arr.map(function (item) {
            return item.substr(1);
        })
        var str=url.replace(/:[^\/]+/g,"([^\/]+)");
        str=str.replace(/\//g,"\\/");
        str="/^"+str+"[\\/]?(?:\\?.*)?$/";
        var obj={};
        obj["url"]=str;
        obj["originUrl"]=url;
        obj.callback=fn;
        obj.attr=arr;
        infoArr.push(obj);
    }
    get(url,fn){
        this.saveInfo(url,fn,'get')
    }
    post(url,fn){
        this.saveInfo(url,fn,'post')
    }
    use(fn){
        this.useInfo.push(fn);
    }
}
module.exports=function () {
    return new light();
}