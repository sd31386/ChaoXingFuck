// ==UserScript==
// @name         超星学习通做题
// @namespace    sd31386@163.com
// @version      9.99
// @description  超星学习通做题
// @author       HonHorD
// @match        *://mooc1.chaoxing.com/mycourse/studentstudy?*
// @match        *://mooc1.chaoxing.com/mycourse/studentstudy?*
// @match        *://mooc1.chaoxing.com/mooc2/work/dowork?*
// @match        *://mooc1.chaoxing.com/exam/test/*
// @match        *://mooc1.chaoxing.com/mooc2/exam/pr*        
// @grant        GM_xmlhttpRequest
// @require      https://unpkg.byted-static.com/xgplayer/2.31.2/browser/index.js
// @require      https://cdn.jsdelivr.net/npm/flv.js@1.6.2/dist/flv.min.js
// @require      https://cdn.bootcss.com/jquery/1.7.2/jquery.min.js
// ==/UserScript==

var url=document.location.toString();
setInterval(()=>{//检测章节变化
    let url_new=document.location.toString();
    if(url!=url_new){
        location.reload();
        url=url_new;
    }
},500)
var video_now=false;//视频完成标记
var video_now_name='';
var video_fl=0;
var video_list=[];
var config = {
all_video:true,//默认刷视频
auto_document:true,
answer_ignore: false, //忽略题目,勾选此处将不会答题
auto: true, //全自动挂机,无需手动操作,即可自动观看视频等
interval: 1, //时间间隔,当任务点完成后,会等待1分钟然后跳转到下一个任务点
rate: 1, //视频播放倍速,视频播放的倍数,建议不要改动,为1即可,这是危险的功能
vtoken: "zuduIRJYJSWmmqDX",
};


function fuckcopy(){
    document.body.onselectstart=null
   
}
setInterval(fuckcopy,500);
function showbox(){
    if ($('#HonHorDbox')[0] == undefined) {
        let img_url='https://cs-ans.chaoxing.com/download/0e156063203bc824d78bdf9ebdc3a671';
        var box_html = `
        <div id="HonHorDbox" style="border-radius: 10px;background-color: hsla(198, 83%, 79%, 0.9); width: 330px; position: fixed; top: 5%; right: 20%; z-index: 99999;  ">
        <h3 id="HonHorDTitle" style="text-align: center;font-family:'黑体';font-size: 20px;">Fuck ChaoXing<span style="color:red;font-size: 12px">(K键隐藏面板)</span></h3>
        <div id="HonHorDlog" style="max-height:235px;font-family:'宋体';font-size: 14px;overflow-x: auto;"></div>
        </div>`;
        $(box_html).appendTo('body');
    }
    $(document).keydown(function (e) {
        if (e.keyCode == 75) {
            let show = $('#HonHorDbox').css('display');
            $('#HonHorDbox').css('display', show == 'block' ? 'none' : 'block');
        }
    })
}
function exportPdf(frame) {
    
}
function add_log(str,color){
    if(color==undefined)color='black';
    var _time = new Date().toLocaleTimeString();
    $('#HonHorDlog').prepend('<div style="padding:3px 4px;margin:3px;border: 2px solid rgb(255, 81, 81);border-radius: 5px;color: ' + color + ';"><div align="center" >' + _time  +'</div>'+ str + '</div>');
    
}
function change_frameHigh(){
    function changeheigh(iframe){
        if(iframe.style.height != iframe.contentWindow.document.scrollingElement.scrollHeight +'px')
        iframe.style.height = iframe.contentWindow.document.scrollingElement.scrollHeight +'px';
    }
    var main_iframe=document.getElementsByTagName('iframe');
    for(let i=0;i<main_iframe.length;i++){
        var son_iframe=$(main_iframe[i].contentWindow.document).find('iframe#ifd');
        for(let j=0;j<son_iframe.length;j++){
            var true_frame=son_iframe[j];
            changeheigh(true_frame);
            }
        }
}
function httppost(url,body,info){
    function errorCode(ret){
        if (!ret.code) {
            return false;
        }
        switch (ret.code) {
            case -1: {
                console.log(ret.msg);
                break;
            }
            case -2: {
                console.log(ret.msg);
                break;
            }
            case 1: {
                console.log(ret.msg);
                return false;
            }
            default: {
                return false;
            }
        }
        return true;
    }
    info.url = url;
    info.body = body;
    if (!info.headers) {
        info.headers = {};
    }
    if (!info.headers["Content-Type"]) {
        info.headers["Content-Type"] = "application/x-www-form-urlencoded";
    }
    info.method = "POST";
    //兼容油猴
    info.data = info.body;
    info.onreadystatechange = function (response) {
        console.log('请求onread',info);
        if (response.readyState == 4) {
            if (response.status == 200) {
                if (info.json) {
                    var ret = JSON.parse(response.responseText);
                    if (errorCode(ret)) {
                        info.error && info.error();
                        return;
                    }
                    info.success && info.success(ret);
                }
                else {
                    info.success && info.success(response.responseText);
                }
            }
            else {
                info.error && info.error();
            }
        }
    };
    console.log('发生给服务器',info);
    GM_xmlhttpRequest(info);
    }
function add_search_div(timu_div,div_type){
    var qu_type=timu_div.innerText;
    if(qu_type.includes("单选题")==true)qu_type="1";
    else if(qu_type.includes("多选题")==true)qu_type="2";
    else if(qu_type.includes("判断题")==true)qu_type="3";
    else if(qu_type.includes("填空题")==true)qu_type="4";
    else qu_type="5";//不支持的类型
    var title="";//搜索内容
    
    if(div_type=='homework'){
        let fl=timu_div.getElementsByClassName('mark_name colorDeep');
       
        let ti=fl[0].getElementsByTagName('span');
    
        for (var kk=1;kk<ti.length;kk++){
                title+=ti[kk].innerText;
        }
        if(title=='')
        title=fl[0].innerText;
    }else if(div_type=='exam'){
        let fl=timu_div.getElementsByClassName('mark_name colorDeep');
       
        let ti=fl[0].getElementsByTagName('p');
   
        for (var kk=0;kk<ti.length;kk++){
                title+=ti[kk].innerText;
        }
        if(title=='')
        title=fl[0].innerText;
    }else if(div_type=='work'){
        let fl=timu_div.getElementsByClassName('Py-m1-title fs16');
        let ti=fl[0].getElementsByTagName('p');
      
        for (var kk=0;kk<ti.length;kk++){
            
            title+=ti[kk].innerText;
        }
        if(fl[0].getElementsByTagName('img')[0]!=undefined){
            let imgg=fl[0].getElementsByTagName('img')
            console.log('img',fl[0].getElementsByTagName('img'))
            for(let i=0;i<imgg.length;i++){
                title+=imgg[i].getAttribute('src');
            }
        }
        if(title=='') title=fl[0].innerText;
    }
    
    var allwork = eval("\x64\x6f\x63\x75\x6d\x65\x6e\x74\x2e\x63\x72\x65\x61\x74\x65\x45\x6c\x65\x6d\x65\x6e\x74\x28\x22\x64\x69\x76\x22\x29");
    allwork.setAttribute("class","cx_ct");
    allwork.setAttribute("style","margin-left:8px;margin-right:8px;margin-bottom:5px");
    allwork.innerHTML="\n<div style=\"border: 3px solid #9a95fa;border-radius: 10px;background-color: #cad7fb92;\" > \
    <div contenteditable=\"true\" class=\"ok_timu\" style=\"width:95%;font-size: 14px;padding:3px 4px;margin:10px;border: 2px solid #f3931e;border-radius: 10px;\">"+title+"</div>   \n\
    <input type=\"button\" class=\"submit\" value=\"搜索答案\" style=\"border: 1px solid #9a95fa;border-radius: 10px;padding:3px 4px;margin:15px; margin-top: 0px;font-family:'华文中宋';\" /> \n </div>           ";
    $(allwork).find('.submit')[0].onclick=function (){
        getAnswer(this.parentNode.parentNode.parentNode);
    }
    $(allwork).find('.submit')[0].setAttribute('timu_type',qu_type);
    if(qu_type=='5'){
        allwork.innerHTML='不支持的类型'
        allwork.setAttribute("style","color:red;font-Size:12px");
    }

    if(div_type=='homework'||div_type=='exam'){
        let steam_answer=$(timu_div).find('div.stem_answer');
        if(steam_answer[0]==undefined){
            steam_answer=$(timu_div).find('stem_answer exam_answer')
        }
        steam_answer[0].parentNode.appendChild(allwork);
    }else if(div_type=='work'){
        let answer=$(timu_div).find('ul')[0]
        try{
            answer.parentNode.appendChild(allwork);
        }catch(e){
            answer=$(timu_div).find('.jdt')[0]
            answer.parentNode.appendChild(allwork);
            add_log('发生错误'+e,'red')
        }
        
    }
    
}
function getAnswer(timu_div){
    function add_answer_div(timu_div,answer){//题目div answer[题目，答案] 
        var div_answer="";var div_timu="";var div_type="";
        if(answer.length==0){
            div_timu="题库中没有相应题目，请检查搜索框内容是否正确"
            div_answer="没有找到答案";
        }else  {
            div_answer=answer[2];
            div_timu=answer[0];
        }
        div_type=answer[1];
     
        add_log(div_timu+'<br>\t'+div_answer,'blue');
        var div_div = eval("\x64\x6f\x63\x75\x6d\x65\x6e\x74\x2e\x63\x72\x65\x61\x74\x65\x45\x6c\x65\x6d\x65\x6e\x74\x28\x22\x64\x69\x76\x22\x29");
        div_div.setAttribute("class","div_answer");
        div_div.setAttribute("style","margin-left:8px;margin-right:8px;margin-bottom:5px");
        div_div.innerHTML="\n\
        <div style=\"border: 3px solid #9a95fa;border-radius: 10px;background-color: #f7efb892;\" > \n \
        <div  class=\"question\" style=\"width:95%;font-size: 12px;padding:3px 4px;margin:10px;border: 2px solid #f3931e;border-radius: 10px;\">"+div_timu+"</div>   \n\
        <div  class=\"answer\" style=\"width:95%;font-size: 12px;padding:3px 4px;margin:10px;border: 2px solid #f3931e;border-radius: 10px;\">"+div_answer+"</div>   \n\
        </div>           ";
        if(timu_div.getElementsByClassName("div_answer").length!=0)
            timu_div.getElementsByClassName("div_answer")[0].remove();
        var cx_ct=timu_div.getElementsByClassName("cx_ct")[0];
        cx_ct.parentNode.insertBefore(div_div,cx_ct)
    }
    function answer(timu_div,qustion,typee){
        var answer="";
        var result0=[];
        var enc=encodeURIComponent(qustion);
        var url="https://cx.icodef.com/v2/answer?platform=cx";
        var body='topic[0]='+enc+'&type[0]='+typee+'&';
        $.ajax({
            type:'post',
            url:url,
            data:body,
            beforeSend: function(request) {
                request.setRequestHeader('Access-Control-Allow-Origin:*'); 
                request.setRequestHeader('Access-Control-Allow-Method:POST,GET');
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                request.setRequestHeader("X-Version", "2.5");
                request.setRequestHeader("Authorization", config.vtoken);
            },
            success:function(result){
              
                if(result['code']==-2){
                    answer='not_answer';
                }
                if(result[0]['result'].length==0){
                    answer='not_answer';
                }
                else{
              
                    var current=[].concat(result[0]['result'][0]['correct']);
                    var current_topic=result[0]['result'][0]['topic'];
                    result0.push(current_topic);
                    var current_type=result[0]['result'][0]['type'];
                    result0.push(current_type);
                    if(current[0]['option']==true)answer='正确√';
                    else if(current[0]['option']==false)answer='错误×';
                    else{
                        for(var lei=0;lei<current.length;lei++){
                            answer+=current[lei]['option']+'<br>'+current[lei]['content']
                        }
                    }
                    console.log(current_topic+'\n答案\n'+answer);
                    result0.push(answer);
                }
                add_answer_div(timu_div,result0);
            },
            error:function(){
                console.log('error');
                result0.push('题库错误');
                result0.push('1');
                result0.push('题库错误');
                add_answer_div(timu_div,result0)
            },
        });
    }
    var qu_type=timu_div.getElementsByClassName("ok_timu")[0].getAttribute('timu_type');
    var timu=timu_div.getElementsByClassName("ok_timu")[0].innerText;
  
    answer(timu_div,timu,qu_type);
}
function dispose_document(obj){
    let jobId = obj['property']['jobid'],
        name = obj['property']['name'],
        jtoken = obj['jtoken'],
        knowledgeId = obj['knowledgeid'],
        courseId = obj['courseid'],
        clazzId = obj['clazzId'];
    $.ajax({
        url: "https://mooc1.chaoxing.com" + '/ananas/job/document?jobid=' + jobId + '&knowledgeid=' + knowledgeId + '&courseid=' + courseId + '&clazzid=' + clazzId + '&jtoken=' + jtoken + '&_dc=' + String(Math.round(new Date())),
        method: 'GET',
        success: function (res) {
            if (res.status) {
                add_log('文档：' + name + "完成", 'green')
            } else {
                add_log('文档：' + name + '处理异常,跳过。', 'red')
            }
        },
    })
}
function getStr(str, start, end) {
    let res = str.match(new RegExp(`${start}(.*?)${end}`))
    return res ? res[1] : null
}
function getTaskParams() {
    try {
        var _iframeScripts = $('#iframe')[0].contentDocument.scripts,
            marg = null;
        for (let i = 0; i < _iframeScripts.length; i++) {
            if (_iframeScripts[i].innerHTML.indexOf('mArg = "";') != -1 && _iframeScripts[i].innerHTML.indexOf('==UserScript==') == -1) {
                marg = getStr(_iframeScripts[i].innerHTML.replace(/\s/g, ""), 'try{mArg=', ';}catch');
                return marg
            }
        }
        return marg
    } catch (e) {
        return null
    }

}
function dispose_vedio(frame,video_type){
    
    let reader=$(frame.contentWindow.document).find('#reader')[0]
    //$(reader).attr('style','margin: 1px 2px;width: 676px;height: 500px;')
    //console.log('margin',)
    var video=frame.contentWindow.document.querySelector('video');
    var video_next=$(video).next()[0];
    let height=$(video).height();
    let width=$(video).width();
    let src=$(video).attr('src');
    let ddiv=document.createElement('video')
    ddiv.setAttribute('id','mse')
    $(ddiv).attr("style",'height:'+height+"px;width:100%")
    ddiv.setAttribute('controls',"true")
    
    //ddiv.setAttribute('src',src)
    // var style = document.createElement('link');
    // style.href = "https://cdn.jsdelivr.net/npm/video.js@7.10.2/dist/video-js.min.css";
    // style.rel = "stylesheet";
    // style.type = "text/css";
    video.parentNode.remove();
    reader.appendChild(ddiv)
    //frame.parentNode.insertBefore(ddiv,frame)
    //frame.remove();
    $(reader).after('<progress id="vedio_progress" style="margin-bottom:5px;margin-left:2.5%;width: 95%;height:30px" max="100" value="0"></progress>');
    let player = flvjs.createPlayer(
        {
          type: video_type, // 类型只有 flv 和 mp4
          url: src,
        },
        {
            enableStashBuffer:true,
        }
      )
    player.attachMediaElement(ddiv)
    player.load()
    return $(reader).next()[0];
}
function getEnc(a, b, c, d, e, f, g) {
    return new Promise((resolve, reject) => {
        try {
            GM_xmlhttpRequest({
                url: "https://api.gocos.cn/index.php/cxapi/out/enc?a=" + a + '&b=' + b + '&c=' + c + '&d=' + d + '&e=' + e + '&f=' + f + '&g=' + g,
                method: 'GET',
                timeout: 3000,
                onload: function (xhr) {
                    let res = $.parseJSON(xhr.responseText)
                    if (res['code'] == 1) {
                        enc = res['enc']
                        if (enc.length != 32) {
                            add_log('获取enc出错！' + enc, 'red')
                            reject()
                        } else {
                            resolve(enc)
                        }
                    }
                }
            })
        } catch (e) {
            add_log('获取enc出错！' + e, 'red')
            reject()
        }
    })
}
function updateVideo(reportUrl, dtoken, classId, playingTime, duration, clipTime, objectId, otherInfo, jobId, userId, isdrag) {
    return new Promise((resolve, reject) => {
        getEnc(classId, userId, jobId, objectId, playingTime, duration, clipTime).then((enc) => {
            $.ajax({
                url: reportUrl + '/' + dtoken + '?clazzId=' + classId + '&playingTime=' + playingTime + '&duration=' + duration + '&clipTime=' + clipTime + '&objectId=' + objectId + '&otherInfo=' + otherInfo + '&jobid=' + jobId + '&userid=' + userId + '&isdrag=' + isdrag + '&view=pc&enc=' + enc + '&rt=0.9&dtype=Video&_t=' + String(Math.round(new Date())),
                type: 'GET',
                success: function (res) {
                    try {
                        if (res['isPassed']) {
                            if (playingTime != duration) {
                                resolve(1)
                            } else {
                                resolve(2)
                            }
                        } else {
                            if (config.rate == 0 && playingTime == duration) {
                                resolve(2)
                            } else {
                                resolve(1)
                            }
                        }
                    } catch (e) {
                        add_log('发生错误：' + e, 'red')
                        resolve(0)
                    }
                }
            })
        })
    })
}
function flash_vedio(li,is_flash){//li内包含 视频obj信息  视频对应进度条
    
    let obj=li[0]
    let progress=li[1]
    let classId = obj['clazzId'],
        userId = obj['userid'],
        fid = obj['fid'],
        reportUrl = obj['reportUrl'],
        isPassed = obj['isPassed'],
        otherInfo = obj['otherInfo'],
        jobId = obj['property']['_jobid'],
        name = obj['property']['name'],
        objectId = obj['property']['objectid'];
    if(isPassed==true){
        if(is_flash==undefined){
            add_log('视频：' + name+ '已完成', 'green')
            video_fl++;
            $(progress).attr('value',100)
        }
        else{
            add_log('视频： '+name+'<br>开始刷取学习时长','blue')
        }
    }else is_flash=true;
    if(is_flash==true){
        video_now=true;
        video_now_name=name;
        $.ajax({
            url: location.protocol + '//' + location.host + "/ananas/status/" + objectId + '?k=' + fid + '&flag=normal&_dc=' + String(Math.round(new Date())),
            type: "GET",
            success: function (res) {
                try {
                    let duration = res['duration'],
                        dtoken = res['dtoken'],
                        clipTime = '0_' + duration,
                        playingTime = 0,
                        isdrag = 0;
                    if (config.rate == 0) {
                        add_log('已开启视频秒过，可能会导致进度重置、挂科等问题。', 'red')
                    } else if (config.rate > 1 && config.rate <= 16) {
                        add_log('已开启视频倍速，当前倍速：' + config.rate + ',可能会导致进度重置、挂科等问题。', 'red')
                    } else if (config.rate > 16) {
                        config.rate = 1
                        add_log('超过允许设置的最大倍数，已重置为1倍速。', 'red')
                    }
                    add_log("视频：" + name + "<br>  开始播放")
                    let _loop = setInterval(() => {
                        if(!video_now){
                            add_log('视频'+name+'暂停');
                            clearInterval(_loop);
                            return;
                        }
                        playingTime += 40 * config.rate
                        if (playingTime >= duration || config.rate == 0) {
                            clearInterval(_loop)
                            playingTime = duration
                            isdrag = 4
                        }
                        updateVideo(reportUrl, dtoken, classId, playingTime, duration, clipTime, objectId, otherInfo, jobId, userId, isdrag).then((status) => {
                            switch (status) {
                                case 0:
                                    playingTime -= 40
                                    break
                                case 1:
                                    //add_log('value:'+(playingTime / duration),'red')
                                    $(progress).attr('value',(playingTime / duration)*100)
                                    let jd=String(parseInt(playingTime/60))+':' +String(playingTime%60)+' / '+String(parseInt(duration/60))+':' +String(duration%60)
                                    add_log("视频：" + name + "<br>  已播放:  " + jd, 'purple')
                                    break
                                case 2:
                                    clearInterval(_loop)
                                    $(progress).attr('value',100)
                                    video_fl++;
                                    video_now=false;
                                    add_log("视频：" + name + "<br>  播放完毕", 'green')
                                    break
                                default:
                                    console.log(status)
                            }
                        })
                    }, 40000)
                } catch (e) {
                    add_log('发生错误：' + e, 'red')
                }
            }
        });
    }
    

    if(video_fl<video_list.length&&!video_now){
        flash_vedio(video_list[video_fl]);
    }
    
}

function main(){
    showbox();
    setTimeout(()=>{
    if(url.includes('mycourse/studentstudy?')){//学习页面 
        $('#HonHorDTitle')[0].innerHTML='Fuck ChaoXing学习版<span style="color:red;font-size: 12px">(K键隐藏面板)</span>';
        function getid(src){
            var temp='';
            var str='';
            let d=new Array();

            temp=src.split("clazzId=")[1]+"";
            str=temp.split("&")[0];
            d['clazzid']=str;

            str=src.split("courseid=")[1];
            d['courseid']=str;

            temp=src.split("knowledgeid=")[1]+"";
            str=temp.split("&")[0];
            d['knowledgeid']=str;

            temp=src.split("enc=")[1]+"";
            str=temp.split("&")[0];
            d['enc']=str;

            temp=src.split("workId=")[1]+"";
            str=temp.split("&")[0];
            d['workid']=str;

            temp=src.split("jobid=")[1]+"";
            str=temp.split("&")[0];
            d['jobid']=str;

            return d;
        }

        var params = getTaskParams();
        let xx_list = $.parseJSON(params)['attachments']
        let _defaults = $.parseJSON(params)['defaults']
        var havework=false;
        var havevedio=false;
        let video_ff=0;
        
        //父 iframe document.getElementsByTagName("iframe")[0].contentWindow.document.getElementsByTagName("iframe")
        var if2rames=eval("\x64\x6f\x63\x75\x6d\x65\x6e\x74\x2e\x67\x65\x74\x45\x6c\x65\x6d\x65\x6e\x74\x73\x42\x79\x54\x61\x67\x4e\x61\x6d\x65\x28\x22\x69\x66\x72\x61\x6d\x65\x22\x29");
        //查找题目
        for(var i=0;i<if2rames.length;i++){
            var frames=eval("\x69\x66\x32\x72\x61\x6d\x65\x73\x5b\x69\x5d\x2e\x63\x6f\x6e\x74\x65\x6e\x74\x57\x69\x6e\x64\x6f\x77\x2e\x64\x6f\x63\x75\x6d\x65\x6e\x74\x2e\x67\x65\x74\x45\x6c\x65\x6d\x65\x6e\x74\x73\x42\x79\x54\x61\x67\x4e\x61\x6d\x65\x28\x22\x69\x66\x72\x61\x6d\x65\x22\x29");
            for(var j=0;j<frames.length;j++){
                //子irame
                var frame=frames[j];
                let xx=JSON.parse($(frame).attr('data'));
                
                //刷文档
                if(xx['type']==".ppt"||xx['type']==".pptx"||xx['type']==".pdf"||xx['type']==".doc"||xx['type']==".docx"){
                    if(frame.parentNode.getAttribute('class')=='ans-attach-ct ans-job-finished')continue;
                    else if(xx['jobid']==undefined)continue;
                    else{
                        add_log('发现未完成文档:'+xx['name'],'blue');
                        for(let i in xx_list){
                            if(xx['jobid']==xx_list[i]['jobid']){
                                let obj=xx_list[i];
                                obj['clazzId']=_defaults['clazzId'];
                                obj['courseid']=_defaults['courseid'];
                                obj['knowledgeid']=_defaults['knowledgeid'];
                                obj['reportUrl']=_defaults['reportUrl'];
                                obj['fid']=_defaults['fid'];
                                dispose_document(obj);
                            }
                        }
                        continue
                    }
                }//刷视频
                else if(xx['type']==".mp4"||xx['type']==".flv"||xx['type']==".avi"||xx['type']==".wmv"||xx['type']==".mpg"||xx['type']==".mpeg"){   
                    
                    let progress=dispose_vedio(frame,xx['type'].substring(1));
                    //j-=1;
                    for(let i in xx_list){
                        if(xx['jobid']==xx_list[i]['jobid']){
                            let obj=xx_list[i];
                            obj['clazzId']=_defaults['clazzId'];
                            obj['courseid']=_defaults['courseid'];
                            obj['userid']=_defaults['userid'];
                            obj['knowledgeid']=_defaults['knowledgeid'];
                            obj['reportUrl']=_defaults['reportUrl'];
                            obj['fid']=_defaults['fid'];
                            $(progress).after('<button id="video_button" video_fl="'+video_ff+'" type="button">点击刷取视频学习时长</button>');
                           
                            let buu=$(progress).next()[0]
                            buu.onclick=()=>{
                                if(video_now){alert('有视频正在刷取时长，请等待');return;}
                                let fl=$(buu).attr('video_fl');
                                console.log('点击',fl)
                                video_now=false;
                                flash_vedio(video_list[fl],true);
                            }
                            video_ff++;
                            let video_li=[obj,progress];
                            havevedio=true
                            video_list.push(video_li);
                        }
                    }
                    continue;
                }
                if(frame.getAttribute('_src')==null) continue;//检测是否测试
                if(frame.parentNode.getAttribute('class')=='ans-attach-ct ans-job-finished'){//检测是否是已完成的章节
                    var asPdf = eval("\x64\x6f\x63\x75\x6d\x65\x6e\x74\x2e\x63\x72\x65\x61\x74\x65\x45\x6c\x65\x6d\x65\x6e\x74\x28\x22\x64\x69\x76\x22\x29");
                    asPdf.setAttribute("class","as_Pdf");
                    asPdf.setAttribute("style","margin-left:8px;margin-right:8px;margin-bottom:5px");
                    asPdf.innerHTML="\n<button class='as_Pdf' style=\"font-size: 8px;padding:1px 2px;width:60px;border: 2px solid #9a95fa;border-radius: 10px;background-color: #cad7fb92;\" > \n \
                    保存作业</button>           ";
                    frame.parentNode.insertBefore(asPdf,frame);
                    asPdf.onclick=function (){
                        //exportPdf($(this).next()[0]) ;
                    }
                    continue;
                }//改变测验为手机版
                else{   
                    havework=true;//有测验
                    add_log('找到测验，添加搜索框','black');
                    // https://mooc1.chaoxing.com/work/phone/work?workId=*jobid(-work)*&courseId=*courseid*&clazzId=*clazzId*&knowledgeId=*knowledgeid*&jobId=*jobid*&enc=*'enc'*
                    var _src="";
                    _src+=frame.getAttribute('_src');
                    let id_arrary=getid(_src);
                    let phoneUrl=location.protocol+'//'+location.host +'/work/phone/work?workId=' + id_arrary['workid'] + '&courseId=' + id_arrary['courseid'] + '&clazzId=' + id_arrary['clazzid'] + '&knowledgeId=' + id_arrary['knowledgeid'] + '&jobId=' + id_arrary['jobid'] + '&enc=' + id_arrary['enc']
                    console.log(phoneUrl);
                    frame.setAttribute('id','ifd');//别改千万别！！
                    frame.setAttribute('width','420');
                    frame.setAttribute('scrolling','no');
                    var t=frame.getAttribute('style');
                    let old_sty=frame.getAttribute('style');
                    var style=t+';margin-left:138px;margin-right:138px;margin-bottom:20px;margin-top:20px'
                    frame.setAttribute('style',style);
                    $(frame).on("load", function(){
                        let timu_li=$($(this)[0].contentWindow.document).find('.Py-mian1')
                        if(timu_li[0]==undefined)return;
                        for(let i=0;i<timu_li.length;i++){
                            add_search_div(timu_li[i],'work');
                        }
                    });
                    frame.src=phoneUrl;
                    //添加切换按钮
                    var backtoOld = eval("\x64\x6f\x63\x75\x6d\x65\x6e\x74\x2e\x63\x72\x65\x61\x74\x65\x45\x6c\x65\x6d\x65\x6e\x74\x28\x22\x64\x69\x76\x22\x29");
                    backtoOld.setAttribute("class","backto");
                    backtoOld.setAttribute("new_style",style);
                    backtoOld.setAttribute("old_style",old_sty);
                    backtoOld.setAttribute('new_src',phoneUrl)
                    backtoOld.setAttribute('old_src','https://mooc1.chaoxing.com'+_src)
                    backtoOld.setAttribute("style","margin-left:8px;margin-right:8px;margin-bottom:5px");
                    backtoOld.innerHTML="\n<button class='back' style=\"font-size: 8px;padding:1px 2px;width:60px;border: 2px solid #9a95fa;border-radius: 10px;background-color: #cad7fb92;\" > \n \
                    回到旧版</button>           ";
                    frame.parentNode.insertBefore(backtoOld,frame);
                    backtoOld.onclick=function (){
                        if($(this).next()[0].getAttribute('src')==this.getAttribute('new_src')){
                            $(this).find('button.back')[0].innerText='回到新版';
                            $(this).next()[0].setAttribute('width','100%');
                            $(this).next()[0].setAttribute('style',this.getAttribute('old_style'));
                            $(this).next()[0].setAttribute('src',this.getAttribute('old_src'));

                        }else{
                            $(this).find('button.back')[0].innerText='回到旧版';
                            $(this).next()[0].setAttribute('style',this.getAttribute('new_style'));
                            $(this).next()[0].setAttribute('width','420');
                            $(this).next()[0].setAttribute('src',this.getAttribute('new_src'))
                        }

                    }

                }
                
            }
        }//实时改变测验iframe高度
        if(havework){
            setInterval(change_frameHigh,1000);
        }//处理视频
        if(havevedio){
            add_log('发现'+video_list.length+'个视频');
            flash_vedio(video_list[video_fl]);
            //video_fl++;
            return;
        }
        // haveworkfine=false;
        // if(haveworkfine){

        //     function check_course(){
        //         let info=[{
        //                     'json':true,
        //                     "refer": "https://mooc1.chaoxing.com/knowledge/cards?clazzid=53872728&courseid=224001233&knowledgeid=547097712&num=0&ut=s&cpi=154871698&v=20160407-1",
        //                     "id": "1d6aa1f2cb534ceda1fba54443c9f2f2",
        //                     "info": "1d6aa1f2cb534ceda1fba54443c9f2f2"
        //                 }];
        //         let body="info=" + encodeURIComponent(JSON.stringify(info))
        //         body='info=&data=%5B%7B%22topic%22%3A%22%3Cp%3E%3Cbr%3E%3Cspan%20style%3D%5C%22color%3A%20rgb(32%2C%2032%2C%2032)%3B%20font-family%3A%20%E9%BB%91%E4%BD%93%3B%20%20background-color%3A%20rgb(255%2C%20255%2C%20255)%3B%5C%22%3E%E5%9C%A8%E5%9E%84%E6%96%AD%E8%B5%84%E6%9C%AC%E4%B8%BB%E4%B9%89%E9%98%B6%E6%AE%B5%E5%8D%A0%E7%BB%9F%E6%B2%BB%E5%9C%B0%E4%BD%8D%E7%9A%84%E8%B5%84%E6%9C%AC%E6%98%AF%EF%BC%88%26nbsp%3B%20%26nbsp%3B%20%EF%BC%89%3C%2Fspan%3E%3C%2Fp%3E%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%3C%2Fdiv%3E%5Cn%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%3Cdiv%20style%3D%5C%22width%3A20%25%3Bheight%3A100%25%3Bfloat%3Aright%3B%5C%22%3E%5Cn%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%5Cn%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%3C%2Fdiv%3E%5Cn%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%22%2C%22type%22%3A1%2C%22correct%22%3A%5B%7B%22option%22%3A%22A%22%2C%22content%22%3A%22%3Cp%3E%3Cspan%20style%3D%5C%22color%3A%20rgb(85%2C%2085%2C%2085)%3B%20font-family%3A%20%26quot%3BMicrosoft%20Yahei%26quot%3B%2C%20Arial%2C%20Helvetica%2C%20sans-serif%3B%20font-size%3A%2012px%3B%20%20background-color%3A%20rgb(255%2C%20255%2C%20255)%3B%5C%22%3E%E9%87%91%E8%9E%8D%E8%B5%84%E6%9C%AC%3C%2Fspan%3E%3C%2Fp%3E%22%7D%5D%2C%22answers%22%3A%5B%7B%22option%22%3A%22A%22%2C%22content%22%3A%22%3Cp%3E%3Cspan%20style%3D%5C%22color%3A%20rgb(85%2C%2085%2C%2085)%3B%20font-family%3A%20%26quot%3BMicrosoft%20Yahei%26quot%3B%2C%20Arial%2C%20Helvetica%2C%20sans-serif%3B%20font-size%3A%2012px%3B%20%20background-color%3A%20rgb(255%2C%20255%2C%20255)%3B%5C%22%3E%E9%87%91%E8%9E%8D%E8%B5%84%E6%9C%AC%3C%2Fspan%3E%3C%2Fp%3E%22%7D%2C%7B%22option%22%3A%22B%22%2C%22content%22%3A%22%3Cp%3E%3Cspan%20style%3D%5C%22color%3A%20rgb(85%2C%2085%2C%2085)%3B%20font-family%3A%20%26quot%3BMicrosoft%20Yahei%26quot%3B%2C%20Arial%2C%20Helvetica%2C%20sans-serif%3B%20font-size%3A%2012px%3B%20%20background-color%3A%20rgb(255%2C%20255%2C%20255)%3B%5C%22%3E%E9%93%B6%E8%A1%8C%E8%B5%84%E6%9C%AC%3C%2Fspan%3E%3C%2Fp%3E%22%7D%2C%7B%22option%22%3A%22C%22%2C%22content%22%3A%22%3Cp%3E%3Cspan%20style%3D%5C%22color%3A%20rgb(85%2C%2085%2C%2085)%3B%20font-family%3A%20%26quot%3BMicrosoft%20Yahei%26quot%3B%2C%20Arial%2C%20Helvetica%2C%20sans-serif%3B%20font-size%3A%2012px%3B%20%20background-color%3A%20rgb(255%2C%20255%2C%20255)%3B%5C%22%3E%E5%86%9C%E4%B8%9A%E8%B5%84%E6%9C%AC%3C%2Fspan%3E%3C%2Fp%3E%22%7D%2C%7B%22option%22%3A%22D%22%2C%22content%22%3A%22%3Cp%3E%3Cspan%20style%3D%5C%22color%3A%20rgb(85%2C%2085%2C%2085)%3B%20font-family%3A%20%26quot%3BMicrosoft%20Yahei%26quot%3B%2C%20Arial%2C%20Helvetica%2C%20sans-serif%3B%20font-size%3A%2012px%3B%20%20background-color%3A%20rgb(255%2C%20255%2C%20255)%3B%5C%22%3E%E5%B7%A5%E4%B8%9A%E8%B5%84%E6%9C%AC%3C%2Fspan%3E%3C%2Fp%3E%22%7D%5D%7D%2C%7B%22topic%22%3A%22%3Cp%3E%3Cspan%20style%3D%5C%22color%3A%20rgb(32%2C%2032%2C%2032)%3B%20font-family%3A%20%26quot%3BMicrosoft%20Yahei%26quot%3B%2C%20Arial%2C%20Helvetica%2C%20sans-serif%3B%20font-size%3A%2014px%3B%20%20background-color%3A%20rgb(255%2C%20255%2C%20255)%3B%5C%22%3E%E9%98%B2%E7%83%9F%E5%88%86%E5%8C%BA%E5%9C%A8%E9%98%B2%E7%81%AB%E5%88%86%E5%8C%BA%E4%B8%AD%E5%88%86%E9%9A%94.%3C%2Fspan%3E%3C%2Fp%3E%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%3C%2Fdiv%3E%5Cn%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%3Cdiv%20style%3D%5C%22width%3A20%25%3Bheight%3A100%25%3Bfloat%3Aright%3B%5C%22%3E%5Cn%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%5Cn%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%3C%2Fdiv%3E%5Cn%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%22%2C%22type%22%3A3%2C%22correct%22%3A%5B%7B%22option%22%3Atrue%2C%22content%22%3Atrue%7D%5D%2C%22answers%22%3A%5B%5D%7D%5D';
        //         let url='https://cx.icodef.com/v2/answer?platform=cx';
        //         httppost(url,body,{
        //             headers: {
        //                 "Authorization": 'zuduIRJYJSWmmqDX',
        //                 "X-Version": '2.5',
        //             },
        //             success: function (result) {
        //                 console.log('this',result);
        //             }, error: function () {
        //                 console.log('了');
        //             }
        //         })
        //     }
        //     function sendAnswer(test_frame,fin_test_list){
        //         console.log(fin_test_list);
        //         let body='';
        //         body='info=&data='+encodeURIComponent(JSON.stringify(fin_test_list));
        //         //body='info=%7B%22refer%22%3A%22https%3A%2F%2Fmooc1.chaoxing.com%2Fknowledge%2Fcards%3Fclazzid%3D53872728%26courseid%3D224001233%26knowledgeid%3D547097706%26num%3D0%26ut%3Ds%26cpi%3D154871698%26v%3D20160407-1%22%2C%22id%22%3A%22392e3f7718114374a813f74df0f0a3f3%22%2C%22info%22%3A%22392e3f7718114374a813f74df0f0a3f3%22%7D&data=%5B%7B%22topic%22%3A%22%3Cp%3E%E5%B0%8F%E6%98%8E%E5%93%A5%E5%93%A5%E5%9C%A8%E5%BA%90%E5%B1%B1%E4%B8%8E%E4%BA%BA%E5%8F%91%E9%80%81%E8%87%AA%E5%B7%B1%3C%2Fp%3E%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%3C%2Fdiv%3E%5Cn%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%3Cdiv%20style%3D%5C%22width%3A20%25%3Bheight%3A100%25%3Bfloat%3Aright%3B%5C%22%3E%5Cn%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%5Cn%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%3C%2Fdiv%3E%5Cn%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%22%2C%22type%22%3A1%2C%22correct%22%3A%5B%7B%22option%22%3A%22A%22%2C%22content%22%3A%22%3Cp%3E%E5%87%86%E5%A4%87%3C%2Fp%3E%22%7D%5D%2C%22answers%22%3A%5B%7B%22option%22%3A%22A%22%2C%22content%22%3A%22%3Cp%3E%E5%87%86%E5%A4%87%3C%2Fp%3E%22%7D%2C%7B%22option%22%3A%22B%22%2C%22content%22%3A%22%3Cp%3E%E8%80%83%E8%AF%95%3C%2Fp%3E%22%7D%2C%7B%22option%22%3A%22C%22%2C%22content%22%3A%22%3Cp%3E%E5%BC%80%E5%A7%8B%3C%2Fp%3E%22%7D%2C%7B%22option%22%3A%22D%22%2C%22content%22%3A%22%3Cp%3E%E5%8F%AF%E6%98%AF%3C%2Fp%3E%22%7D%5D%7D%5D'
                
        //         let url0="https://cx.icodef.com/v2/answer?platform=cx";
        //         // $.ajax({
        //         //     type:'POST',
        //         //     url:url,
        //         //     data:body,
        //         //     dataType:"json",
        //         //     beforeSend: function(request) {
        //         //         request.setRequestHeader('Access-Control-Allow-Origin:*'); 
        //         //         request.setRequestHeader('Access-Control-Allow-Method:POST,GET');
        //         //         request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        //         //         request.setRequestHeader("X-Version", "2.5");
        //         //         request.setRequestHeader("Authorization", "zuduIRJYJSWmmqDX");
        //         //     },
        //         //     onreadystatechange : function (response) {
        //         //         if (response.readyState == 4) {
        //         //             if (response.status == 200) {
        //         //                 if (info.json) {
        //         //                     console.log('11');
        //         //                     var ret = JSON.parse(response.responseText);
        //         //                     if (false) {
        //         //                         console.log('111');
        //         //                         info.error && info.error();
        //         //                         return;
        //         //                     }
        //         //                     info.success && info.success(ret);
        //         //                 }
        //         //                 else {
        //         //                     console.log('12');
        //         //                     info.success && info.success(response.responseText);
        //         //                 }
        //         //             }
        //         //             else {console.log('2');
        //         //                 info.error && info.error();
        //         //             }
        //         //         }
        //         //     },
        //         //     success:function(result){
        //         //         console.log(result);
        //         //         } ,
        //         //     error:function(){
        //         //         console.log('error');
        //         //     },
        //         // });
        //         var ttt=true;
        //         //check_course();
        //         body='info=&data=%5B%7B%22topic%22%3A%22%3Cp%3E%3Cbr%3E%3Cspan%20style%3D%5C%22color%3A%20rgb(32%2C%2032%2C%2032)%3B%20font-family%3A%20%E9%BB%91%E4%BD%93%3B%20%20background-color%3A%20rgb(255%2C%20255%2C%20255)%3B%5C%22%3E%E5%9C%A8%E5%9E%84%E6%96%AD%E8%B5%84%E6%9C%AC%E4%B8%BB%E4%B9%89%E9%98%B6%E6%AE%B5%E5%8D%A0%E7%BB%9F%E6%B2%BB%E5%9C%B0%E4%BD%8D%E7%9A%84%E8%B5%84%E6%9C%AC%E6%98%AF%EF%BC%88%26nbsp%3B%20%26nbsp%3B%20%EF%BC%89%3C%2Fspan%3E%3C%2Fp%3E%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%3C%2Fdiv%3E%5Cn%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%3Cdiv%20style%3D%5C%22width%3A20%25%3Bheight%3A100%25%3Bfloat%3Aright%3B%5C%22%3E%5Cn%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%5Cn%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%3C%2Fdiv%3E%5Cn%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%22%2C%22type%22%3A1%2C%22correct%22%3A%5B%7B%22option%22%3A%22A%22%2C%22content%22%3A%22%3Cp%3E%3Cspan%20style%3D%5C%22color%3A%20rgb(85%2C%2085%2C%2085)%3B%20font-family%3A%20%26quot%3BMicrosoft%20Yahei%26quot%3B%2C%20Arial%2C%20Helvetica%2C%20sans-serif%3B%20font-size%3A%2012px%3B%20%20background-color%3A%20rgb(255%2C%20255%2C%20255)%3B%5C%22%3E%E9%87%91%E8%9E%8D%E8%B5%84%E6%9C%AC%3C%2Fspan%3E%3C%2Fp%3E%22%7D%5D%2C%22answers%22%3A%5B%7B%22option%22%3A%22A%22%2C%22content%22%3A%22%3Cp%3E%3Cspan%20style%3D%5C%22color%3A%20rgb(85%2C%2085%2C%2085)%3B%20font-family%3A%20%26quot%3BMicrosoft%20Yahei%26quot%3B%2C%20Arial%2C%20Helvetica%2C%20sans-serif%3B%20font-size%3A%2012px%3B%20%20background-color%3A%20rgb(255%2C%20255%2C%20255)%3B%5C%22%3E%E9%87%91%E8%9E%8D%E8%B5%84%E6%9C%AC%3C%2Fspan%3E%3C%2Fp%3E%22%7D%2C%7B%22option%22%3A%22B%22%2C%22content%22%3A%22%3Cp%3E%3Cspan%20style%3D%5C%22color%3A%20rgb(85%2C%2085%2C%2085)%3B%20font-family%3A%20%26quot%3BMicrosoft%20Yahei%26quot%3B%2C%20Arial%2C%20Helvetica%2C%20sans-serif%3B%20font-size%3A%2012px%3B%20%20background-color%3A%20rgb(255%2C%20255%2C%20255)%3B%5C%22%3E%E9%93%B6%E8%A1%8C%E8%B5%84%E6%9C%AC%3C%2Fspan%3E%3C%2Fp%3E%22%7D%2C%7B%22option%22%3A%22C%22%2C%22content%22%3A%22%3Cp%3E%3Cspan%20style%3D%5C%22color%3A%20rgb(85%2C%2085%2C%2085)%3B%20font-family%3A%20%26quot%3BMicrosoft%20Yahei%26quot%3B%2C%20Arial%2C%20Helvetica%2C%20sans-serif%3B%20font-size%3A%2012px%3B%20%20background-color%3A%20rgb(255%2C%20255%2C%20255)%3B%5C%22%3E%E5%86%9C%E4%B8%9A%E8%B5%84%E6%9C%AC%3C%2Fspan%3E%3C%2Fp%3E%22%7D%2C%7B%22option%22%3A%22D%22%2C%22content%22%3A%22%3Cp%3E%3Cspan%20style%3D%5C%22color%3A%20rgb(85%2C%2085%2C%2085)%3B%20font-family%3A%20%26quot%3BMicrosoft%20Yahei%26quot%3B%2C%20Arial%2C%20Helvetica%2C%20sans-serif%3B%20font-size%3A%2012px%3B%20%20background-color%3A%20rgb(255%2C%20255%2C%20255)%3B%5C%22%3E%E5%B7%A5%E4%B8%9A%E8%B5%84%E6%9C%AC%3C%2Fspan%3E%3C%2Fp%3E%22%7D%5D%7D%2C%7B%22topic%22%3A%22%3Cp%3E%3Cspan%20style%3D%5C%22color%3A%20rgb(32%2C%2032%2C%2032)%3B%20font-family%3A%20%26quot%3BMicrosoft%20Yahei%26quot%3B%2C%20Arial%2C%20Helvetica%2C%20sans-serif%3B%20font-size%3A%2014px%3B%20%20background-color%3A%20rgb(255%2C%20255%2C%20255)%3B%5C%22%3E%E9%98%B2%E7%83%9F%E5%88%86%E5%8C%BA%E5%9C%A8%E9%98%B2%E7%81%AB%E5%88%86%E5%8C%BA%E4%B8%AD%E5%88%86%E9%9A%94.%3C%2Fspan%3E%3C%2Fp%3E%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%3C%2Fdiv%3E%5Cn%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%3Cdiv%20style%3D%5C%22width%3A20%25%3Bheight%3A100%25%3Bfloat%3Aright%3B%5C%22%3E%5Cn%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%5Cn%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%3C%2Fdiv%3E%5Cn%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%5Ct%22%2C%22type%22%3A3%2C%22correct%22%3A%5B%7B%22option%22%3Atrue%2C%22content%22%3Atrue%7D%5D%2C%22answers%22%3A%5B%5D%7D%5D';
        //         setTimeout(httppost(url0,body,{
        //             headers: {
        //                 "Authorization": 'zuduIRJYJSWmmqDX',
        //                 "X-Version": '2.5',
        //             },
        //             json: true,
        //             success: function (result) {
        //                 console.log('success:',result);
        //                 var div_div = eval("\x64\x6f\x63\x75\x6d\x65\x6e\x74\x2e\x63\x72\x65\x61\x74\x65\x45\x6c\x65\x6d\x65\x6e\x74\x28\x22\x64\x69\x76\x22\x29");
        //                 div_div.setAttribute("class","replxe ok");
        //                 div_div.setAttribute("style","font-Size:15px;color:red");
        //                 div_div.innerHTML="采集答案成功";
        //                 test_frame.parentNode.insertBefore(div_div,test_frame)
                        
        //             },
        //             error: function () {
        //                 var div_div = eval("\x64\x6f\x63\x75\x6d\x65\x6e\x74\x2e\x63\x72\x65\x61\x74\x65\x45\x6c\x65\x6d\x65\x6e\x74\x28\x22\x64\x69\x76\x22\x29");
        //                 div_div.setAttribute("class","replxe ok");
        //                 div_div.setAttribute("style","font-Size:15px;color:red");
        //                 div_div.innerHTML="题库错误采集答案失败";
        //                 test_frame.parentNode.insertBefore(div_div,test_frame)
        //                 console.log('error');
        //             }
        //         }),0);

                
                


                

        //     }
        //     var all_fine=true;
        //     for(var i=0;i<fin_workframe.length;i++){
        //         let fin_test=[];
        //         if(fin_workframe[i].getAttribute('name')=='ok')continue;
        //         all_fine=false;
        //         var tt=fin_workframe[i].contentWindow.document.getElementsByTagName('iframe');
        //         var fine_timulist=$(tt[0]).contents().find('.TiMu');
        //         if(fine_timulist.length==0)continue;
        //         fin_workframe[i].setAttribute('name','ok');
        //         for(var j=0;j<fine_timulist.length;j++){
        //             let timu=fine_timulist[j];
        //             if(timu.getElementsByClassName('fr dui')[0]==undefined)continue;
        //             let qu_type=timu.getElementsByClassName('clearfix')[0].innerText;
        //             if(qu_type.includes("单选题")==true)qu_type="1";
        //             else if(qu_type.includes("多选题")==true)qu_type="2";
        //             else if(qu_type.includes("判断题")==true)qu_type="3";
        //             else if(qu_type.includes("填空题")==true)qu_type="4";
        //             else qu_type="5";//不支持的类型
        //             let dict={};
        //             let topic=timu.getElementsByClassName('clearfix')[0].getElementsByTagName('p')[0].innerHTML;
                    
        //             dict['topic']=topic;
        //             dict['type']=eval(qu_type);
                    
        //             //[fin_test(父集合)]=>{dict字典}=>type:int,topic:str,(正确答案)correct[]=>{"option":,'content':},{...};;answer[](选项)
        //             let answer=[];let correct=[];
        //             if(qu_type==1||qu_type==2||qu_type==4){
        //                 let ul=timu.getElementsByTagName('ul');
        //                 let li=ul[0].getElementsByTagName('li');
        //                 for(let i=0;i<li.length;i++){
        //                     let option=li[i].getElementsByTagName('i')[0].innerText.replace('、','');
        //                     let content=li[i].getElementsByTagName('p')[0].innerHTML;
        //                     answer.push({'option':option,'contnet':content});
        //                 }
        //                 let chos=timu.getElementsByClassName('Py_answer clearfix')[0].innerText.replace('我的答案、','')
        //                 for(let i=0;i<chos.length;i++){
        //                     if("ABCDEFG".includes(chos[i])){
        //                         for(let j=0;j<answer.length;j++){
        //                             if(answer[j]['option']==chos[i])
        //                             correct.push({'option':chos[i],'content':answer[j]['contnet']})
        //                         }
        //                     }
        //                 }
                        
        //             }
        //             else if(qu_type==3){
        //                 let option=true;
        //                 if(timu.getElementsByClassName('font20')[0].innerText!='√')option=false;
        //                 correct.push({'option':option,'content':option});
        //             }
        //             dict['correct']=correct;
        //             dict['answers']=answer;
        //             fin_test.push(dict);
        //         }

        //         sendAnswer(fin_workframe[i],fin_test)
        //     }
            
        // }
    }
    else if(url.includes("mooc2/work/dowork?")){//作业页面
        $('#HonHorDTitle')[0].innerHTML='Fuck ChaoXing作业版<span style="color:red;font-size: 12px">(K键隐藏面板)</span>';
        let timu_list=document.getElementsByClassName('padBom50 questionLi');
        for(let i=0;i<timu_list.length;i++){
            add_search_div(timu_list[i],'homework');
        }
    }
    else if(url.includes('/exam/test/')){//考试跳转到全卷预览
        document.getElementsByClassName('completeBtn fl')[0].onclick();
    }
    else if(url.includes('/exam/preview?')){//考试页面
        $('#HonHorDTitle')[0].innerHTML='Fuck ChaoXing考试版<span style="color:red;font-size: 12px">(K键隐藏面板)</span>';
        let timu_list=document.getElementsByClassName('whiteDiv');
        
        for(let i=0;i<timu_list.length;i++){
            let timu_li=timu_list[i].children;
            for(let j=1;j<timu_li.length;j++){
                
                add_search_div(timu_li[j],'exam');
            }
        }
    }
},500)
}
window.onload=()=>{
    main();
}

