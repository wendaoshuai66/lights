var crypto=require('crypto');
module.exports=function (pass) {
    return function (req,res,reslove) {
        res.md5=function (pass) {
            var ext=crypto.createHash("md5").update(pass).digest("hex");
            return ext;
        }
        res.cookies=[];
        res.cookie=function (key,val) {
            var cipher = crypto.createCipher('aes-256-cbc', pass);
            var str = cipher.update(val, 'utf8', 'hex');
            str += cipher.final('hex');

            req.sign=res.md5(pass);
            res.cookies.push(key+'='+str+req.sign);
            res.setHeader("set-cookie",res.cookies);
        };

        var cookies=req.headers.cookie;
        req.cookies={};
        if(cookies){
            var arr=cookies.split('; ');
            for(var i=0;i<arr.length;i++){
                var arr1=arr[i].split('=');
                if(arr1[1].substr(32)==res.md5(pass)){
                    var Decipher = crypto.createDecipher('aes-256-cbc', pass);
                    var str = Decipher.update(arr1[1].substr(0,32), 'hex', 'utf8');
                    str += Decipher.final('utf8');
                    req.cookies[arr1[0]]=str;
                }
            }
        }
        reslove();
    }
}
