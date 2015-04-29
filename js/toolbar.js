function toolbar_demo(el){
    var today=new Date();
    var h=today.getHours();
    var m=today.getMinutes();
    var s=today.getSeconds();
    m=m>=10?m:('0'+m);
    s=s>=10?s:('0'+s);
    el.innerHTML = h+":"+m+":"+s;
    setTimeout(function(){toolbar_demo(el)}, 1000);
}

var toolbar_div = document.getElementById('toolbar_div');
toolbar_demo(toolbar_div);