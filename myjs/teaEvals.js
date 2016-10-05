$(function () {
    $(':input').labelauty();
    $('button').click(function () {
        var attitude = $('input[name="attitude"]:checked').attr('data-flag');
        var skill = $('input[name="skill"]:checked').attr('data-flag');
        var attendance = $('input[name="attendance"]:checked').attr('data-flag');
        var steal = $('input[name="steal"]:checked').attr('data-flag');
        var attack = $('input[name="attack"]:checked').attr('data-flag');
        var comprehensive = $('input[name="comprehensive"]:checked').attr('data-flag');
        var suggestion = $('textarea').val();
        var arr = [],
            isNull = 0;
        arr.push(attitude, skill, attendance, steal, attack, comprehensive);
        for (var i = 0, len = arr.length; i < len; i++) {
            if (arr[i] == undefined)
                isNull++;
        }
        if (isNull != 0) {
            $('.warning').css('display', 'block');
            return false;
        } else {
            var fuwutaidu = attitude; //服务态度
            var jiaxuejineng = skill; //教学技能
            var chidaoqueqin = attendance; //有无无故迟到或缺勤情况
            var chinakayaodis = steal; //有无吃拿卡要情况
            var eyaneyuzhongshang = attack; //有无恶言恶语、中伤学员情况
            var zonghepingjia = comprehensive; //综合评价
            var qitajianyi = suggestion; //其他建议
            var parames = "";
            var url = "TeaEvalHandler.ashx?flags=1&fuwutaidu=" + fuwutaidu + "&jiaxuejineng=" + jiaxuejineng + "&chidaoqueqin=" + chidaoqueqin + "&chinakayaodis=" + chinakayaodis
             + "&eyaneyuzhongshang=" + eyaneyuzhongshang + "&zonghepingjia=" + zonghepingjia + "&qitajianyi=" + qitajianyi
             + "&teaEvalId=" + teaEvalId;
            myAjax("POST", url, parames, function (data) {
                var str = data.toString();
                if (str == "404") {
                    alert("你还没有登录！");
                    window.location.href = "index.htm";
                } else if (str === "1") {
                    alert("评教成功!");
                } else if (str === "-1") {
                    alert("数据有误，请重新尝试！");
                } else if (str === "-2") {
                    alert("输入存在空");
                } else if (str === "-3") {
                    alert("已经进行过评价了");
                }
                else {
                    alert('系统繁忙，请重新尝试！');
                }
            })
        }
    })
})

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