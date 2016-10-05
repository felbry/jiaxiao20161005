$(function () {
    var id = opener.document.getElementById('detailId').textContent;
    var teaevaluationid = id; //评教活动的唯一id
    var parames = "";
    var url = "TeaEvalHandler.ashx?flags=3&teaevaluationid=" + teaevaluationid;
    myAjax("POST", url, parames, function (data) {
        var str = data.toString();
        if (str == "404") {
            alert("你还没有登录！");
            window.location.href = "index.htm";
        }
        else {
            //评教数据详细展示

            //一、服务态度
            //优（90分以上）  良（80-89）  中（70-79）  合格（60-69） 差（60分以下）
            //二、教学技能
            //优（90分以上）  良（80-89）  中（70-79）  合格（60-69） 差（60分以下）
            //三、纪律情况
            //有无无故迟到或缺勤情况   有  无
            //有无吃拿卡要情况         有  无
            //有无恶言恶语、中伤学员情况   有  无
            //四、综合评价
            //优（90分以上）  良（80-89）  中（70-79）  合格（60-69） 差（60分以下）
            //五、其他建议（选填）

            //格式说明：评教总人数（0：表示还没有进评价该教练，>0表示评价该教练的总人数），
            //教练名，教练id，服务态度百分比（优，良，中，合格，差），
            //教学技能百分比（优，良，中，合格，差），
            //有无无故迟到或缺勤情况百分比（有，无），
            //有无吃拿卡要情况百分比（有，无）,
            //有无恶言恶语,中伤百分比（有，无）,
            //综合评价百分比（优，良，中，合格，差），
            //对该教练的提出的建议的个数（0表示没有人对该教练提出建议，>0表示有提出建议的总数），
            //后面依次罗列若干的建议，;
            //2,于文翔,1,100.00%,0.00%,0.00%,0.00%,0.00%,100.00%,0.00%,0.00%,0.00%,0.00%,0.00%,100.00%,0.00%,100.00%,0.00%,100.00%,100.00%,0.00%,0.00%,0.00%,0.00%,2,ni,mei,;

            //2,吴教练,2,100.00%,0.00%,0.00%,0.00%,0.00%,100.00%,0.00%,0.00%,0.00%,0.00%,0.00%,100.00%,0.00%,100.00%,0.00%,100.00%,100.00%,0.00%,0.00%,0.00%,0.00%,2,la,yu,;

            //1,张教练,5,100.00%,0.00%,0.00%,0.00%,0.00%,100.00%,0.00%,0.00%,0.00%,0.00%,0.00%,100.00%,0.00%,100.00%,0.00%,100.00%,100.00%,0.00%,0.00%,0.00%,0.00%,1,没有,;
            var teaArr = str.split(';');
            var teaInfo = [],
                attitude = [],
                skill = [],
                attendance = [],
                steal = [],
                attack = [],
                comprehensive = [],
                suggestion = [],
                suggestionTemp = [];
            for (var i = 0, len = teaArr.length - 1; i < len; i++) {
                var arr = teaArr[i].split(',');
                console.log('arr: ' + arr);
                teaInfo.push([arr[0], arr[1], arr[2]]); //评教总人数，教练名，教练id
                attitude.push([arr[3], arr[4], arr[5], arr[6], arr[7]]);
                skill.push([arr[8], arr[9], arr[10], arr[11], arr[12]]);
                attendance.push([arr[13], arr[14]]);
                steal.push([arr[15], arr[16]]);
                attack.push([arr[17], arr[18]]);
                comprehensive.push([arr[19], arr[20], arr[21], arr[22], arr[23]]);
                for (var j = 24; j < arr.length - 1; j++) {
                    suggestionTemp.push(arr[j]);
                }
                suggestion.push(suggestionTemp);
                suggestionTemp = [];
            }
            console.log(teaInfo);
            console.log(attitude);
            console.log(skill);
            console.log(attendance);
            console.log(steal);
            console.log(attack);
            console.log(comprehensive);
            console.log(suggestion);
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