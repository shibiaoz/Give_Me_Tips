var url = '';
function checkForValidUrl( tabId,  changeInfo,  tab) {
    tab.url.indexOf("baidu.com") > -1 && chrome.pageAction.show(tabId);
}
function showDataPage(a) {
console.log("showDataPageInNewTab ", a);

    var b = function () {
        showDataPageIframe(a)
    };
    _timestamp > Date.now() - 500 && (b = function (b) {
        chrome.tabs.executeScript(null, {code: "(new View()).hide()"}), showDataPageInNewTab(b, a)
    });
    getKey(b);
    //Cache.getKey(b);
    _timestamp = Date.now();
}
function showDataPageInNewTab(a, b) {
    var c='http://tieba.baidu.com/?__qa=ea51d5046510dd06885a2b6edc40b613&__type=json&';
    void 0 !== b && (c = "string" == typeof b ? b : b.url, c = new Uri(c), c.replaceQueryParam(PARAM_KEY, a), window.open(c.toString()))
}

function getKey(a) {
        var b = new XMLHttpRequest;
        b.onreadystatechange = function (b) {
            if (4 === b.srcElement.readyState) {
                var c = b.srcElement.response;
                url = 'http://tieba.baidu.com/?__type=json&__qa='+c;
                localStorage.setItem('__pp_code',c);
                a(c);
            }
        };
        b.open("GET", "http://liye04.fe.baidu.com/key.php", !0);
        b.send();
    }

function showDataPageIframe(tab) {

    /*chrome.tabs.insertCSS(integer tabId, object details, function callback)向页面注入CSS。*/
    chrome.tabs.insertCSS(null, {file: "css/view_iframe.css"}), 

    /* chrome.tabs.executeScript(integer tabId, object details, function callback)向页面注入JavaScript 脚本执行。要了解详情，请查阅内容脚本文档的 programmatic injection 部分。*/
    chrome.tabs.executeScript(null, 
        {file: "js/view_iframe_init.js"}, 
        function () {
        chrome.tabs.executeScript(null, {code: "var view = new View('" + tab.url + "');view.toggle();"})
    });
}
var _timestamp;
chrome.runtime.onMessage.addListener(function (a) {
    switch (a.code) {
        case"close":
            chrome.tabs.executeScript(null, {code: "(new View()).hide()"});
            break;
        case"newtab":
            Cache.getKey(function (b) {
                showDataPageInNewTab(b, a.data.url)
            });
            break;
        default:
            console.log("unrecognized message recieved: ", a);
    }
});

//chrome.tabs.onUpdated.addListener(function(integer tabId, object changeInfo, Tab tab) {...});
//当标签更新时，此事件被触发。
chrome.tabs.onUpdated.addListener(checkForValidUrl);

//chrome.pageAction.onClicked.addListener(function(Tab tab) {...});
//当page action图标被点击的时候调用，如果page action是一个popup，这个事件将不会触发。
chrome.pageAction.onClicked.addListener(showDataPage);