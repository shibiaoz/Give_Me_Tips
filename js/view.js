var KEY = localStorage.getItem('__pp_code') || '';
//var CONF_URL = 'http://fedev.baidu.com/~zhangshibiao/forum_conf.json?';
var CONF_URL = 'http://fedev.baidu.com/~zhangshibiao/give_me_tips/tmp.json?';
var GlobalData = {
    official:{},
    officialType:null,
    isPlatfrom:false
}
var CONF = {
   /* FORM_KEY_TYPE:{
        0: '企业官方吧',
        2: '企业官方吧 and 是小微官方吧',
        1: '明星官方吧',
        3: '地方商业吧',
        4: '人文商业吧',
        5: '垂直化数码类目',
        6: '垂直化美容类目',
        7: '垂直化宠物类目 ',
        8: '垂直化普通类目'
    }*/
}
var frameUrl = new Uri(location.href);
var currentUrl = new Uri(decodeURIComponent(frameUrl.getQueryParamValue('url')));
    currentUrl += '&__type=json&__qa=' + KEY;
function getData(url,callback) {
    var b = new XMLHttpRequest;
    b.onreadystatechange = function (b) {
        if (4 === b.srcElement.readyState) {
            var c = b.srcElement.response;
            callback(c);
        }
    };
    url += '&time='+Date.now();
    b.open("GET", url, !0);
    b.send();
}
function getConf (url,callback) {
    var b = new XMLHttpRequest;
    b.onreadystatechange = function (b) {
        if (4 === b.srcElement.readyState) {
            var c = b.srcElement.response;
            callback(c);
        }
    };
    url += '&time='+Date.now();
    b.open("GET", url, !0);
    b.send();
}
function renderData () {
	var oDiv = document.getElementById('data');
	var callback = function  (data) {
        $('#loading').hide();
        $('#data-wraper').show();
        var data = (typeof data == 'string') ? JSON.parse(data) : data;
        var frsOfficial = data && data.forumex  && data.forumex.fstyle && data.forumex.fstyle.official;
        var pbOfficial = data && data.forum  && data.forum.attrs && data.forum.attrs.official;
        var official = frsOfficial || pbOfficial;
        var frsStsyle = data && data.forumex  && data.forumex.fstyle && data.forumex.fstyle;
        var pbStyle = data && data.forum  && data.forum.attrs && data.forum.attrs;
        var dataStyle = frsStsyle || pbStyle || {};
        GlobalData.official = frsOfficial || pbOfficial || {};
        GlobalData.officialType = official && official['official_type'];
        GlobalData.isPlatfrom = dataStyle.pt_operation_center ? true : false;
        if(!CONF.FORM_KEY_TYPE){
            //第一次数据还没有拉回来，在拉一次
            $('#loading').show();
            $('#data-wraper').hide();
            getConf(CONF_URL,function  (result) {
                typeof result == 'string' ? (result = JSON.parse(result)) : result; 
                result &&  (CONF = result);
                showTips();
                return result;
            })
        }
        else {
            showTips();
        }
        return ;
	}
    var showTips = function  () {
        var officialType =  GlobalData.officialType;
        oDiv.innerHTML = CONF.FORM_KEY_TYPE[officialType] || '非官方属性吧！';
        $('#data').addClass('fadeInUpBig');
        var platformTypeStr = GlobalData.isPlatfrom ? '运营中心的吧' : '非运营中心吧，ps:主要功能提示是针对运营中心的，你可以关闭了！'
        $('#platform_type').html(platformTypeStr);
        GlobalData.isPlatfrom ? '' : $('#data-content').hide();
        if(!GlobalData.isPlatfrom){
            return;
        }
        var list = (CONF.CONTENT_TIPS && CONF.CONTENT_TIPS[officialType]) || [];
        var strList = '';
        list.forEach(function  (value,index) {
            strList += new domCreate(value).getHtmlStr();
        });
        $('#forum_description').html(strList);
        $('body').on('mouseenter','.j-function-item',function  (event) {
            var that = this;
           $(this).parent().find('.flow-tips,.flow-img').addClass('display-hide').removeClass('swing');
           setTimeout(function() {
                $(that).find('.flow-tips,.flow-img').removeClass('display-hide').addClass('swing');
           }, 10);
        });
        $('#forum_description').on('mouseleave',function  () {
             $(this).parent().find('.flow-tips,.flow-img').addClass('display-hide').removeClass('swing');
        });
        $('#data').hover(function (event) {
            var that = this;
            $(this).removeClass('fadeInUpBig').removeClass('shake');
            setTimeout(function() {
                $(that).addClass('shake');
            }, 10);
        });
    }
	getData(currentUrl,callback);
}

getConf(CONF_URL,function  (result) {
    typeof result == 'string' ? (result = JSON.parse(result)) : result; 
    result &&  (CONF = result);
    return result;
});

window.addEventListener('load',function  () {
	renderData();
    closeIframe();
},false);

function closeIframe () {
    var $btn = $('.btn-close');
    $btn.on('click',function  () {
        chrome.runtime.sendMessage({code:'close'});
    });
}



/**
 * domCreate dom节点生成
 * format 模板
 */
function  domCreate (obj) {
    this.name  = obj.name || '';
    this.text = obj.text || '';
    this.showPic = obj.showPic || '';
    this.link = obj.link || '';
    this.tips = obj.tips || '';
}
domCreate.prototype.config = {
    link:[
        '<li class="function-item j-function-item" title="<%=tips%>">',
            '<a href="<%=link%>" target="_blank" title="<%=text%>">',
                '<%= text%>',
            '</a>',
            '<div class="flow-tips display-hide animated swing"><%=tips%></div>',
            '<div class="tips flow-img display-hide animated">',
                '<img src="<%=showPic%>"/>',
            '</div>',
        '</li>'
    ].join(''),
    text:[
        '<li class="function-item j-function-item" title="<%=tips%>">',
            '<span  title="<%=text%>">',
                '<%= text%>',
            '</span>',
            '<div class="flow-tips display-hide animated "><%= tips%></div>',
            '<div class="tips flow-img display-hide animated">',
                '<img src="<%=showPic%>"/>',
            '</div>',
        '</li>'
    ].join('')

};
domCreate.prototype.getHtmlStr = function  (name, showPic,text,link,tips) {
    var str = '';
    var name = name || this.name;
    var showPic =  showPic || this.showPic;
    var tpl = this.config[name];
    var text = text || this.text;
    var link = link || this.link;
    var tips = tips || this.tips;
    str = this.tplFormat(tpl,{
        text: text,
        showPic: showPic,
        link:link,
        tips:tips
    });
    return str;
}
domCreate.prototype.tplFormat = function  (str,obj) {
    var tpl = str ||'';
    tpl = tpl.replace(/<%=[\s]?([^%>]+)?%>/igm, function  (s0,s1) {
        return obj[s1];
    });
    return tpl;
}
domCreate.prototype.addClass = function  (selector) {
    
}