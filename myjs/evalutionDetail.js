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
                //console.log('arr: ' + arr);
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
            
            //先计算表头宽度
            var wid = 90 / teaInfo.length;
            for (var m = 0; m < teaInfo.length; m++) {
                //表头填充
                var td = $('<td class="info" style="width:' + wid + '%">' + teaInfo[m][1] + '</td>');
                $('#theader').append(td);
                //人数填充
                var tdPerson = $('<td>' + teaInfo[m][0] + '</td>');
                $('#persons').append(tdPerson);
                //服务态度
                var tdAttitude = $('<td><canvas class="attitude"></canvas></td>');
                $('#attitude').append(tdAttitude);
                //教学技能
                var tdSkill = $('<td><canvas class="skill"></canvas></td>');
                $('#skill').append(tdSkill);
                //考勤
                var tdAttendance = $('<td><canvas class="attendance"></canvas></td>');
                $('#attendance').append(tdAttendance);
                //吃拿卡要
                var tdSteal = $('<td><canvas class="steal"></canvas></td>');
                $('#steal').append(tdSteal);
                //恶语中伤
                var tdAttack = $('<td><canvas class="attack"></canvas></td>');
                $('#attack').append(tdAttack);
                //综合评价
                var tdComprehensive = $('<td><canvas class="comprehensive"></canvas></td>');
                $('#comprehensive').append(tdComprehensive);
                //其他建议
                $('#suggestion').html('<td class="active">其他建议</td>');
                for (var n = 0; n < suggestion.length; n++) {
                    var num = 0;
                    if (suggestion[n][0])
                        num = suggestion[n][0];
                    var tdSuggestion = $('<td class="comments" style="padding-left: 15px"></td>').html('<b style="display:block">共' + num + '条建议：</b>');
                    //限制只显示五条评论
                    for (var t = 1; t < suggestion[n].length && t < 4; t++) {
                        var p = $('<p></p>').text(t + '：' + suggestion[n][t]);
                        tdSuggestion.append(p);
                    }
                    if (suggestion[n].length >= 4) {
                        var p = $('<p></p>').html('<a href="#" data-id="' + n + '" class="lookAll">查看更多</a>');
                        tdSuggestion.append(p);
                    }
                    $('#suggestion').append(tdSuggestion);
                }
                $('.lookAll').on('click', function () {
                    var id = $(this).attr('data-id');
                    $('#comments').html('');
                    for (var i = 1; i < suggestion[id].length; i++) {
                        var div = $('<div class="well well-sm"></div>').text(suggestion[id][i]);
                        $('#comments').append(div);
                    }
                    return false;
                })
            }

            //var testData = [[20, 20, 20, 20, 20], [10, 20, 30, 20, 10], [30, 10, 10, 20, 30]];
            //canvas
            var labelFirst = ["优", "良", "中", "合格", "差"],
                labelSecond = ["有", "无"],
                bg1 = ["#FF6384", "#36A2EB", "#FFCE56", "green", "pink"],
                bg2 = ["#FF6384", "#36A2EB"];
            $('.attitude').each(function (i) {
                var ctx = $(this);
                var data = {
                    labels: labelFirst,
                    datasets: [
                        {
                            data: attitude[i],
                            backgroundColor: bg1
                        }
                    ]
                };
                var myPieChart = new Chart(ctx, {
                    type: 'doughnut',
                    data: data,
                });
            })

            $('.skill').each(function (i) {
                var ctx = $(this);
                var data = {
                    labels: labelFirst,
                    datasets: [
                        {
                            data: skill[i],
                            backgroundColor: bg1
                        }
                    ]
                };
                var myPieChart = new Chart(ctx, {
                    type: 'doughnut',
                    data: data,
                });
            })

            $('.attendance').each(function (i) {
                var ctx = $(this);
                var data = {
                    labels: labelSecond,
                    datasets: [
                        {
                            data: attendance[i],
                            backgroundColor: bg2
                        }
                    ]
                };
                var myPieChart = new Chart(ctx, {
                    type: 'pie',
                    data: data,
                });
            })

            $('.steal').each(function (i) {
                var ctx = $(this);
                var data = {
                    labels: labelSecond,
                    datasets: [
                        {
                            data: steal[i],
                            backgroundColor: bg2
                        }
                    ]
                };
                var myPieChart = new Chart(ctx, {
                    type: 'pie',
                    data: data,
                });
            })

            $('.attack').each(function (i) {
                var ctx = $(this);
                var data = {
                    labels: labelSecond,
                    datasets: [
                        {
                            data: attack[i],
                            backgroundColor: bg2
                        }
                    ]
                };
                var myPieChart = new Chart(ctx, {
                    type: 'pie',
                    data: data,
                });
            })

            $('.comprehensive').each(function (i) {
                var ctx = $(this);
                var data = {
                    labels: labelFirst,
                    datasets: [
                        {
                            data: comprehensive[i],
                            backgroundColor: bg1
                        }
                    ]
                };
                var myPieChart = new Chart(ctx, {
                    type: 'doughnut',
                    data: data,
                });
            })

            /*
            console.log(teaInfo);
            console.log(attitude);
            console.log(skill);
            console.log(attendance);
            console.log(steal);
            console.log(attack);
            console.log(comprehensive);
            console.log(suggestion);
            */
            
            /*
            //综合分析绘图
            var la = ['服务态度', '教学技能', '考勤', '吃拿卡要', '恶言恶语', '综合评价'];
            var teaLabel = [];
            teaInfo.forEach(function (v) { teaLabel.push(v[1]); });
            var allData = [];   //以数组形式保存N个教练的各项占比
            //attitude.forEach(function (v) { allData[0].push(v[1]); });
            $('.compre').each(function (i) {
                var ctx = $(this);
                var data = {
                    labels: teaLabel,
                    datasets: [
                        {
                            label: la[i],
                            backgroundColor: bg1,
                            borderColor: bg1,
                            borderWidth: 1,
                            data: [65, 59, 80],
                        }
                    ]
                };
                var myBarChart = new Chart(ctx, {
                    type: 'bar',
                    data: data
                });
            })
            */
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