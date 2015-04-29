console.log('ok');


var View = View;
if (!View) {
    var VIEW_STATU_SHOW = 2, 
        VIEW_STATU_MIN = 1, 
        VIEW_STATU_HIDE = 0, 
        VIEW_IFRAME_URL = chrome.extension.getURL("page/view.html");
    console.log('ok1');
    View = function (a) {
        if ("object" == typeof View.instance)return View.instance;
         console.log('ok2');
        var b = document.createElement("iframe");
        document.body.appendChild(b);
        this.viewIframe = b;
        b.setAttribute("class", "SMTD-view");
        b.setAttribute("frameBorder", "0");
        b.setAttribute("allowTransparency", "true");
        b.setAttribute("scrolling", "auto");
        b.setAttribute("height", "100%");
        b.setAttribute("width", "100%");
        this._setPostion();
        this.fetchCodeFromUrl(a);
        this.statu = VIEW_STATU_HIDE;
        View.instance = this;
         console.log('ok3');
    };
     View.prototype = {
        fetchCodeFromUrl: function (a) {
            this.viewIframe.setAttribute("src", VIEW_IFRAME_URL + "?url=" + encodeURIComponent(a))
        }, 
        _setPostion: function () {
        }, 
        show: function () {
            var a = this;
            window.setTimeout(function () {
                document.body.className = document.body.className + " SMTD", a.viewIframe.style.top = 0
            }, 0), a.statu = VIEW_STATU_SHOW
        }, 
        hide: function () {
            var a = this;
            window.setTimeout(function () {
                document.body.className = document.body.className.replace(" SMTD", " "), a.viewIframe.style.top = "100%"
            }, 0), a.statu = VIEW_STATU_HIDE
        }, 
        minimize: function () {
            self.statu = VIEW_STATU_MIN
        }, 
        toggle: function () {
            this.statu == VIEW_STATU_HIDE ? this.show() : this.hide()
        }
    };

  
function handleMessage(a) {
    a.data ? chrome.runtime.sendMessage(a.data) : console.log("unrecognized message recieved: ", a)
} 
    window.addEventListener("message", handleMessage, !1);

    //esc 
    document.addEventListener("keyup", function (a) {
        27 == a.keyCode && chrome.runtime.sendMessage({code: "close"})
    }, !1);
}