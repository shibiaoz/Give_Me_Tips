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
var SETTINGS = {
                    trigger:'click',
                    title:'Pop Title',
                    content:'<p>This is webui popover demo.</p><p>just enjoy it and have fun !</p>',
                    width:600,
                    height:200,                      
                    multi:true,                     
                    closeable:true,
                    style:'',
                    padding:true,
                    multi:false,
                };
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
	//var oDiv = document.getElementById('data');
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
        var str = "";
        //oDiv.innerHTML = CONF.FORM_KEY_TYPE[officialType] || '非官方属性吧！';
        //$('#data').addClass('fadeInUpBig');
        var platformTypeStr = '';
        if (GlobalData.isPlatfrom){
            platformTypeStr ='本吧是' + (CONF.FORM_KEY_TYPE[officialType] || '普通吧') + ',隶属于运营中心的吧';
        }
        else {
            // 非运营中心的吧
            platformTypeStr = '本吧隶属于产品中心的吧';
        }
        $('#platform_type').html(platformTypeStr);
        GlobalData.isPlatfrom ? '' : $('#data-content').hide();
        if(!GlobalData.isPlatfrom){
            return;
        }
        if (officialType === undefined) {
            // 平台化非官方吧
            $('.j_forum_description').hide().siblings('.tab-wraper').hide();
            return;
        }
        renderAllOfficialType();// 渲染所有的官方吧类型，并且高亮当前官方吧
        officialSpecialItem(officialType);
        bindEvents();
        /*var list = (CONF.CONTENT_TIPS && CONF.CONTENT_TIPS[officialType]) || [];
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
        });*/
        /*$('#forum_description').on('mouseleave',function  () {
             $(this).parent().find('.flow-tips,.flow-img').addClass('display-hide').removeClass('swing');
        });
        $('#data').hover(function (event) {
            var that = this;
            $(this).removeClass('fadeInUpBig').removeClass('shake');
            setTimeout(function() {
                $(that).addClass('shake');
            }, 10);
        });*/
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
 * 渲染所有的官方吧类型，并且高亮当前官方吧
 */
function renderAllOfficialType () {
    var keyTypes = CONF && CONF['FORM_KEY_TYPE'] || [];
    var officialType = parseInt(GlobalData && GlobalData.officialType);
    var str = '';
    var tmpObj = {};
    keyTypes.forEach(function (value, index) {
         tmpObj['isActive'] = ''
        if (index === officialType) {
            // 当前官方吧
            tmpObj['isActive'] = 'active';
        }
        tmpObj['officialName'] = value;
        str += tplFormat(officialTypeTpl(), tmpObj);
    });
    $('#official-type-name').html(str);
}

function officialTypeTpl () {
      var str = '<li  class="<%=isActive%>"><span><%=officialName%><span></li>';
      return str;
}
function tplFormat (str, obj) {
    var tpl = str ||'';
    tpl = tpl.replace(/<%=[\s]?([^%>]+)?%>/igm, function  (s0,s1) {
        return obj[s1];
    });
    return tpl;
}
function officialSpecialItem (toRenderType) {
    var list = (CONF.CONTENT_TIPS && CONF.CONTENT_TIPS[toRenderType]) || [];
    var strList = '';
    list.forEach(function  (value,index) {
        strList += new domCreate(value).getHtmlStr();
    });
    $('#forum_description').html(strList);
    itemBindpopover();
    // $('body').on('mouseenter','.j-function-item',function  (event) {
    //    var that = this;
    //     $(this).parent().find('.flow-tips,.flow-img').addClass('display-hide').removeClass('swing');
    //     setTimeout(function() {
    //         $(that).find('.flow-tips,.flow-img').removeClass('display-hide').addClass('swing');
    //     }, 10);
    // });
}
/**
 * 绑定事件
 */
function bindEvents () {
    $('#official-type-name').on('click', 'li', function  () {
       debugger;
       var index = $(this).index();
       $(this).addClass('active').siblings('li').removeClass('active');
       officialSpecialItem(index); 
    });
   // $('#testtestsets').webuiPopover('destroy').webuiPopover(SETTINGS);
}
function itemBindpopover () {
   $.each($('#forum_description').find('.j-function-item'), function  (index, value) {
        $(value).data('placement','top');
        //data-placement="top"
        if (index ===0) {
            $(value).data('placement', 'top-right')
        }
        var title =  $(value).find('.flow-tips').html();
        var content = $(value).find('.flow-img').html(); 
        if ($(value).find('a').size()) {
            content = $(value).find('a').prop('outerHTML') + content;
        }
        var obj = {
            title: title,
            content: content
        };
        var settings = $.extend({},SETTINGS,obj);
        $(this).webuiPopover('destroy').webuiPopover(settings);
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
        '<li class="function-item j-function-item function-item-light" title="<%=tips%>">',
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
        '<li class="function-item j-function-item function-item-light" title="<%=tips%>">',
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