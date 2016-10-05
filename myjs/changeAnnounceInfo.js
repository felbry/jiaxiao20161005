var str1 = document.getElementById("1");
var str2 = document.getElementById("2");
var str3 = document.getElementById("3");
var str4 = document.getElementById("4");
var btn = document.getElementById("sub");
var noticeflags = 1;
var urlstr = "AdminHandler.ashx?flags=15" + "&noticeflags=" + noticeflags;

myAjax("POST", urlstr, "", function (data) {
    //alert(data.toString());
    if (data.toString() == "404") {
        alert("你还没有登录！");
        window.location.href = "index.htm";
    }
    else {
        //alert(data.toString());
        var str = data.toString().split(',');
        if (str[0] == 0) {
            str1.value = "";
            str2.value = "";
            str3.value = "";
            str4.value = "";
        } else {
            for (var i = 1; i < str.length; i++) {
                if (i == 1) {
                    str1.value = str[i];
                }
                if (i == 2) {
                    str2.value = str[i];
                }
                if (i == 3) {
                    str3.value = str[i];
                }
                if (i == 4) {
                    str4.value = str[i];
                }
            }
        }
    }
})

btn.onclick = function () {
    //    str1.value
    //    str2.value
    //    str3.value
    //    str4.value
    var changeMark = confirm("确认修改吗？");
    if(changeMark){
        var noticeflags = 2;
        var firstnotice = str1.value;
        var secondnotice = str2.value;
        var thirdnotice = str3.value;
        var forthnotice = str4.value;
        var urlstr = "AdminHandler.ashx?flags=15" + "&noticeflags=" + noticeflags + "&firstnotice=" + firstnotice + "&secondnotice=" + secondnotice + "&thirdnotice=" + thirdnotice + "&forthnotice=" + forthnotice;
        //alert(urlstr);
        myAjax("POST", urlstr, "", function (data) {
            //alert(data.toString());
            if (data.toString() == "404") {
                alert("你还没有登录！");
                window.location.href = "index.htm";
            } else if (data.toString() == "0") {
                alert("输入为空,发布失败");
            } else if (data.toString() == "1") {
                alert("发布成功！");
            }
            else {
                // alert(data.toString());
            }
        })
    }
};
function myAjax(httpMethod, url, parames, callback) {
    var xhr;
    if (XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    }
    else {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhr.open(httpMethod, url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(parames);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                callback(xhr.responseText);
            }
        }
    };
}