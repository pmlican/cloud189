

/**
 * 查看别人分享链接目录 GET请求
 * https://cloud.189.cn/v2/listShareDirByShareIdAndFileId.action?fileId=21427311650347673&shortCode=yIbuMnUFjmYz&accessCode=c8hx&verifyCode=685350&orderBy=1&order=ASC&pageNum=1&pageSize=60&noCache=0.3872111305993744
 * 
 * 查看自己目录 POST
 * https://cloud.189.cn/t/getObjectFolderNodes.action?pageNum=1&pageSize=500
 参数：
 id	21496312729268087
 orderBy	1
 order	ASC
 * 
 * 转存文件 POST
 * https://cloud.189.cn/createBatchTask.action
 参数：
 type	SHARE_SAVE
 taskInfos	[{"fileId":"21427311650348465","fileName":"05-趣谈","isFolder":1,"srcParentId":"71463311655571945"}]
 targetFolderId	51333312748052447
 noCache	0.038462644184295236
 shareId	170056030

 * 检测批量转存状态
 * https://cloud.189.cn/checkBatchTask.action
 参数:
 taskId	202102222052307569
 type	SHARE_SAVE
 noCache	0.4408707487547301

 响应参数
 成功：
 {
	"failedCount": 0,
	"skipCount": 0,
	"subTaskCount": 1,
	"successedCount": 1,
	"taskId": "202102222055305620",
	"taskStatus": 4
 }
 失败：
 {
	"errorCode": "ShareDumpFileOverload",
	"failedCount": 1,
	"skipCount": 0,
	"subTaskCount": 1,
	"successedCount": 0,
	"taskId": "202102222057272224",
	"taskStatus": 4
 }
 原始链接： https://cloud.189.cn/t/yIbuMnUFjmYz   访问码: c8hx
 shortCode：yIbuMnUFjmYz
 accessCode	c8hx
 verifyCode	685350  //https://cloud.189.cn/t/yIbuMnUFjmYz  在这个html获取var _verifyCode = '685350';
orderBy	1
order	ASC
pageNum	1
pageSize	60
noCache	0.9789658309583198
 */


const $ = new Env('天翼云批量转存');
const shareUrl = 'https://cloud.189.cn/t/yIbuMnUFjmYz'
const accessCode = 'c8hx'

const baseUrl = 'https://cloud.189.cn/'
const shareDirListPath = 'v2/listShareDirByShareIdAndFileId.action'
const batchTaskPath = 'createBatchTask.action'
const cookie = 'edrive_view_mode=icon; COOKIE_LOGIN_USER=61013D668A05C45519BA4C94B029B0E1E0C583C0F1F9E0111F4E06649274BE7470876D74CB07355E9FED3239BF8232EF5147FF90D02476C8A8813940; Login_Hash=; COOKIE_CTWAP_LOGOUT=COOKIE_CTWAP_LOGOUT; offline_Pic_Showed=true; shareId_170056030=c8hx; apm_ct=20210222214217101; apm_ip=4A889674D4AD6B60ED12595864ADCB6FB1920EFA; apm_sid=897B2B6D3E4A11362A432A7AB3F68187; apm_ua=C8BBA35ABCC04F19E345178B29921446; apm_uid=A447087FFD6134CBBDC1176D56D871B8; validCodeTimestamp=aaazYeq6bB015bu7REqDx; JSESSIONID=aaazYeq6bB015bu7REqDx; JSESSIONID=aaa8XZ46iGA3N9XkupwDx; COOKIE_CTWAP_LOGOUT=COOKIE_CTWAP_LOGOUT; COOKIE_LOGIN_USER=A75CBA164B948CC3'

getShareDirParam = {
    'shortCode': 'yIbuMnUFjmYz',
    'accessCode': accessCode,
    'verifyCode' : '685350',
    'orderBy': 1,
    'order': 'ASC',
    'pageNum': 1,
    'pageSize': 60,
}

async function getShareDirList() {
    return new Promise((resolve) => {
        $.get({
            url: baseUrl + shareDirListPath + '?' + parseParams(getShareDirParam),
            headers: {

            }
        }, (err, resp, data) => {
            try {
                if(err) {
                    console.log(`${JSON.stringify(err)}`)
                } else {
                  var dirData = JSON.parse(data)
                  $.dirList = dirData.data
                //   console.log(jsonStr)
                }
            }catch(e) {
                $.logErr(e, resp)
            }finally {
                resolve();
            }
        })
    })
}

async function viewOwnDir() {
    return new Promise((resolve) => {

    })
}

async function batchTransferFiles(batchBody) {
    return new Promise((resolve) => {
        $.post({
            url: baseUrl + batchTaskPath,
            body: batchBody,
            headers: {
                'cookie': cookie,
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        },(err, resp, data) => {
            try {
                if(err) {
                    console.log(`${JSON.stringify(err)}`)
                } else {
                    // var json = JSON.parse(data)
                //   console.log(jsonStr)
                    // $.taskId = json
                    console.log(data)
                }
            }catch(e) {
                $.logErr(e, resp)
            }finally {
                resolve();
            }
        })
    })
}

async function checkBatchTask(taskId) {
    return new Promise((resolve) => {
        $.post({
            url: baseUrl,
            body: {
                'taskId': taskId,
                'type':	'SHARE_SAVE'
            },
            headers: {
                'cookie': cookie
            }
        }, (err, resp, data) => {
            try {
                if(err) {
                    console.log(`${JSON.stringify(err)}`)
                } else {
                    var json = JSON.parse(data)
                    $.checkData = json
                    console.log(json)
                }
            }catch(e) {
                $.logErr(e, resp)
            }finally {
                resolve();
            }
        })
    })
}

async function doWork() {
   await getShareDirList()
    for (let index = 0; index < $.dirList.length; index++) {
        const item = $.dirList[index];
        const taskInfos = [{"fileId":item.fileId,"fileName":item.fileName,"isFolder":item.isFolder,"srcParentId":item.parentId}]
        // console.log(JSON.stringify(taskInfos))
        const batchBody = {
            'type':	'SHARE_SAVE',
            'taskInfos': taskInfos,
            'targetFolderId':	'-11', // -11全部
            'shareId':	'170056030',
        }
        // console.log(JSON.stringify(batchBody))
        // let test = encodeURIComponent(JSON.stringify(batchBody))
        // console.log(test)
        let test = 'type=SHARE_SAVE&taskInfos=%5B%7B%22fileId%22%3A%2271463311655571945%22%2C%22fileName%22%3A%2201%20%E4%B8%93%E9%A2%98%E8%AF%BE%22%2C%22isFolder%22%3A1%2C%22srcParentId%22%3A%2211301311111819940%22%7D%5D&targetFolderId=-11&shareId=170056030'
        await batchTransferFiles(test)
        // await checkBatchTask($.taskId)

        //请求成功就重复调
        // while ($.checkData.taskStatus !== '4') {
        //     await checkBatchTask($.taskId)
        //     if (checkData.taskStatus === '4' && checkData.errorCode === undefined) {
        //         console.log('转存成功')
        //     } else {
        //         console.log(checkData.errorCode)
        //     }
        // }
        if (index == 0) {
            break
        }
    }
}

doWork()

function parseParams(data) {
    try {
        var tempArr = [];
        for (var i in data) {
            var key = encodeURIComponent(i);
            var value = encodeURIComponent(data[i]);
            tempArr.push(key + '=' + value);
        }
        var urlParamsStr = tempArr.join('&');
        return urlParamsStr;
    } catch (err) {
        return '';
    }
}



// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}