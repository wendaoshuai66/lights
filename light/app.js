let light=require('./light');
let child=require('child_process')
let query=require('./query');
let post=require('./post');
let cookie=require('./cookie');
let app=light();

app.use(query());
app.use(post());
app.use(cookie('liushuai'));
/*接受能力 响应能力*/
app.listen(1115,function () {
    console.log('启动成功')
    /*child.exec("open http://localhost"+app.port);*/
})
app.get("/",function(req,res){
    res.render("2.html",{name:"zhangsan"})
})
app.get('/list/:id',function (req,res) {
    res.sent(req.params.id)
})

app.get('/aa',function (req,res) {
    /*res.cookie('name','zhangsan');
    res.cookie('sex','nv');
    console.log(req.cookies.name)*/
    res.sentfill('1.html')
})
app.get('/abc/:list',function (req,res) {
    res.sent(req.params.list);
})
app.get('/from',function (req,res) {
    res.end("ok");
    /*res.redirect('/')*/
})
/*var url='/list/zhangsan'*/
/* console.log(/\/list\/([^\/]+)/.exec(url));*/
/*var mode='/list/:id';
var str=mode.replace(/:[^\/]+/g,"([^\/]+)");
str=str.replace(/\//g,"\\/");
str="/"+str+"/";
var results=eval(str).exec(url);*/


