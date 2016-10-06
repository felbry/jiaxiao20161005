<%@ WebHandler Language="C#" Class="TeaEvalHandler" %>

using System;
using System.Web;
using jiaxiao.dll;
using System.Data;
public class TeaEvalHandler : IHttpHandler
{
    //学生评教系统
    //评价等级划分
    public enum Grades
    {
        You = 1, //优（90分以上）   
        Liang, //良（80-89） 
        Zhong, //中（70-79） 
        HeGe, //合格（60-69）
        Cha //差（60分以下）
    };
    //有没选项
    public enum HaveOrNoHave
    {
        NoHave = 0,//无
        Hava//有
    };
    //判断等级是否正确
    public bool GradeIsRight(int num)
    {
        if (num != 1 || num != 2 || num != 3 || num != 4 || num != 5)
        {
            return true;
        }
        else return false;
    }
    //判断是否得正确性
    public bool HaveIsRight(int num)
    {
        if (num != 0 || num != 1)
        {
            return true;
        }
        else return false;
    }
    //将2个整数相除得到百分数
    public string ConvertIntToDouble(int i, int j)
    {
        return (((double)i / (double)j) * 100).ToString("0.00");    //去掉了 +"%"
    }

    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "text/plain";
        //string username = "";
        //string password = "";
        //string typename = "";
        //try
        //{
        //    username = context.Session["username"].ToString();
        //    password = context.Session["password"].ToString();
        //    typename = context.Session["typename"].ToString();
        //}
        //catch
        //{
        //    username = "";
        //    password = "";
        //    typename = "";
        //}
        string username = "1";
        string password = "123";
        string typename = "admin";
        if (username != "" && password != "" && typename != "")
        {
            int flags = 0;
            flags = Convert.ToInt32(context.Request.Params["flags"]);
            if (typename == "student")
            {
                if (flags == 1)
                {
                    //学员进行评教
                    //预约唯一id(自动增长),服务态度，教学技能，纪律情况（有无无故迟到或缺勤情况，有无吃拿卡要情况，有无恶言恶语、中伤学员情况），综合评价，其他建议，教练唯一id,学生唯一id,评价结束时间，评价开始时间，评教时间
                    //id, fuwutaidu, jiaxuejineng, chidaoqueqin, chinakayaodis, eyaneyuzhongshang, zonghepingjia, qitajianyi, teaevaluationid, stuid, isdelete, starttime, endtime, evalutiontime
                    //fuwutaidu, jiaxuejineng, chidaoqueqin, chinakayaodis, eyaneyuzhongshang, zonghepingjia, qitajianyi, teaevaluationid, stuid, starttime, endtime, evalutiontime
                    int fuwutaidu,
                        jiaxuejineng,
                        chidaoqueqin,
                        chinakayaodis,
                        eyaneyuzhongshang,
                        zhongshangxueyuan,
                        zonghepingjia,
                        teaevaluationid,
                        teaid;
                    string qitajianyi;
                    DateTime starttime;
                    DateTime endtime;
                    fuwutaidu = Convert.ToInt32(context.Request.Params["fuwutaidu"]);
                    jiaxuejineng = Convert.ToInt32(context.Request.Params["jiaxuejineng"]);
                    chidaoqueqin = Convert.ToInt32(context.Request.Params["chidaoqueqin"]);
                    chinakayaodis = Convert.ToInt32(context.Request.Params["chinakayaodis"]);
                    eyaneyuzhongshang = Convert.ToInt32(context.Request.Params["eyaneyuzhongshang"]);
                    zonghepingjia = Convert.ToInt32(context.Request.Params["zonghepingjia"]);
                    teaevaluationid = DLL.GetTeaEvalId();
                    teaid = DLL.getTeaidByStuid(username);
                    qitajianyi = context.Request.Params["qitajianyi"].Trim().ToString();
                    starttime = DLL.getTeaValueStartTime(teaevaluationid);
                    endtime = DLL.getTeaValueEndTime(teaevaluationid);
                    DateTime evalutiontime = DateTime.Now;
                    //--------判断输入是否合法
                    if (!GradeIsRight(fuwutaidu) || !GradeIsRight(jiaxuejineng) || !HaveIsRight(chidaoqueqin) ||
                        !HaveIsRight(chinakayaodis)
                        || !HaveIsRight(eyaneyuzhongshang) || !GradeIsRight(zonghepingjia)
                        )
                    {
                        //输入存在空!
                        context.Response.Write("-2");
                        return;
                    }
                    else
                    {
                        if (DLL.IsHaveTeaEval(teaevaluationid, username))
                        {
                            //已经进行过评价了
                            context.Response.Write("-3");
                            return;
                        }
                        else if (DLL.addEvalTeaInfo(fuwutaidu, jiaxuejineng, chidaoqueqin, chinakayaodis, eyaneyuzhongshang,
                                         zonghepingjia, qitajianyi, teaid, username, teaevaluationid, starttime, endtime,
                                         evalutiontime))
                        {
                            //评教成功
                            context.Response.Write("1");
                            return;
                        }
                        else
                        {
                            //插入数据出现错误
                            context.Response.Write("-1");
                            return;
                        }
                    }
                }
                ;
            }
            else if (typename == "admin")
            {

                //评教系统管理
                if (flags == 2)
                {
                    int start_year = Convert.ToInt32(context.Request.Params["start_year"]);
                    int start_month = Convert.ToInt32(context.Request.Params["start_month"]);
                    int start_day = Convert.ToInt32(context.Request.Params["start_day"]);
                    int end_year = Convert.ToInt32(context.Request.Params["end_year"]);
                    int end_month = Convert.ToInt32(context.Request.Params["end_month"]);
                    int end_day = Convert.ToInt32(context.Request.Params["end_day"]);
                    DateTime starttime = Convert.ToDateTime("2000/10/1"), endtime = Convert.ToDateTime("2000/10/2");
                    try
                    {
                        starttime = new DateTime(start_year, start_month, start_day);
                        endtime = new DateTime(end_year, end_month, end_day);
                    }
                    catch
                    {
                        //时间段输入有误，请重新输入
                        context.Response.Write("-3");
                        return;
                    }
                    if (DateTime.Compare(new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day), starttime) > 0)
                    {
                        //当前评价开始时间有误，请输入从今天开始往后的时间作为开始时间
                        context.Response.Write("-4");
                        return;
                    }
                    if (DateTime.Compare(starttime, endtime) > 0)
                    {
                        //当前评价开始时间小于结束时间，请重新输入
                        context.Response.Write("-5");
                        return;
                    }
                    if (DateTime.Compare(DateTime.Now, starttime) < 0)
                    {
                        //当前评价开始时间有误，请输入从今天开始往后的时间作为开始时间
                        context.Response.Write("-4");
                        return;
                    }
                    //增加一个评教阶段
                    //DateTime starttime = Convert.ToDateTime("2016/9/30");
                    // DateTime endtime = Convert.ToDateTime("2016/10/10");
                    if (!DLL.IsOpenTeaEval())
                    {
                        //添加一个评教时间段
                        if (DLL.OpenTeaEval(starttime, endtime))
                        {
                            //评教系统添加一个新的评价成功
                            context.Response.Write("1");
                            return;
                        }
                        else
                        {
                            //评教系统添加一个新的评价失败
                            context.Response.Write("-2");
                            return;
                        }
                    }
                    else
                    {
                        //评教系统正在开放，请在当前系统评价进行完再进行下一次评教
                        context.Response.Write("-1");
                        return;
                    }
                }
                //评教系统数据统计
                if (flags == 3)
                {
                    //根据评价系统id,筛选相应的数据
                    int teaevaluationid = Convert.ToInt32(context.Request.Params["teaevaluationid"]);//评教系统id
                    //  DataTable teaEvalData = DLL.GetTeaEvalData(teaevaluationid);
                    int peoplenum;
                    int teanum;
                    //加权平均计算？还是总分制？平均分？
                    //优（90分以上）  良（80-89）  中（70-79）  合格（60-69） 差（60分以下）
                    DataTable teas = DLL.GetTeas();
                    if (teas == null || teas.Rows.Count <= 0)
                    {
                        //没有相关教练
                        context.Response.Write("-1");
                        return;
                    }
                    else if (DLL.GetTeaEvalDataCount(teaevaluationid) <= 0)
                    {
                        //还没有相关数据
                        context.Response.Write("-2");
                        return;
                    }
                    else
                    {
                        teanum = teas.Rows.Count;
                        string[] teaids = new string[teanum];
                        int i = 0;

                        string teaEvalDatas = "";
                        foreach (DataRow row in teas.Rows)
                        {
                            foreach (DataColumn column in teas.Columns)
                            {
                                teaids[i++] = row[column].ToString();
                            }
                        }
                        for (int j = 0; j < teaids.Length; j++)
                        {
                            DataTable teaEvalData = DLL.GetTeaEvalDataByTeaid(teaevaluationid, teaids[j]);
                            int[] fuwutaidu = { 0, 0, 0, 0, 0 };//new int[5];
                            int[] jiaoxuejineng = { 0, 0, 0, 0, 0 };// new int[5];
                            int[] chidaoqueqin = { 0, 0 };//new int[2]};
                            int[] chinakayao = { 0, 0 };// new int[2];
                            int[] eyuzhongshang = { 0, 0 };// new int[2];
                            int[] zonghepingjia = { 0, 0, 0, 0, 0 }; //new int[5];
                            int count = 0;
                            string fuwutaidus = "", jiaoxuejinengs = "", chidaoqueqins = "", chinakayaos = "", eyuzhongshangs = "", zonghepingjias = "";
                            string qitajianyi = "";
                            if (teaEvalData.Rows.Count <= 0)
                            {
                                //该教练下还没有评教信息
                                teaEvalDatas = teaEvalDatas + "0" + "," + DLL.getTeaName(teaids[j]) + "," + teaids[j] + ";";
                            }
                            else
                            {

                                //一、服务态度
                                //优（90分以上）  良（80-89）  中（70-79）  合格（60-69） 差（60分以下）
                                foreach (DataRow row in teaEvalData.Rows)
                                {
                                    int m = 0;
                                    // int[] EachteaEvalData = new int[22];//每个教练的数据统计

                                    foreach (DataColumn column in teaEvalData.Columns)
                                    {
                                        // 服务态度，教学技能，纪律情况（有无无故迟到或缺勤情况，有无吃拿卡要情况，
                                        //有无恶言恶语、中伤学员情况），综合评价，其他建议
                                        // fuwutaidu, jiaxuejineng, chidaoqueqin, chinakayaodis, eyaneyuzhongshang, zonghepingjia, qitajianyi


                                        m++;
                                        if (m == 1)
                                        {
                                            fuwutaidu[(int)row[column] - 1]++;
                                        }
                                        else if (m == 2)
                                        {
                                            jiaoxuejineng[(int)row[column] - 1]++;
                                        }
                                        else if (m == 3)
                                        {
                                            chidaoqueqin[(int)row[column]]++;
                                        }
                                        else if (m == 4)
                                        {
                                            chinakayao[(int)row[column]]++;
                                        }
                                        else if (m == 5)
                                        {
                                            eyuzhongshang[(int)row[column]]++;
                                        }
                                        else if (m == 6)
                                        {
                                            zonghepingjia[(int)row[column] - 1]++;
                                        }
                                        else if (m == 7)
                                        {
                                            if ((string)row[column] != "")
                                            {
                                                qitajianyi = qitajianyi + (string)row[column] + ",";
                                                count++;
                                            }
                                        }
                                    }
                                    //格式说明：评教总人数（0：表示还没有进评价该教练，>0表示评价该教练的总人数），教练名，教练id，服务态度百分比（优，良，中，合格，差），教学技能百分比（优，良，中，合格，差）
                                    //，有无无故迟到或缺勤情况百分比（有，无），有无吃拿卡要情况百分比（有，无）,有无恶言恶语,中伤百分比（有，无）
                                    //,综合评价百分比（优，良，中，合格，差），对该教练的提出的建议的个数（0表示没有人对该教练提出建议，>0表示有提出建议的总数），后面依次罗列若干的建议，
                                    //评教总人数,教练名，教练id，服务态度百分比（优，良，中，合格，差），教学技能百分比（优，良，中，合格，差）
                                    //，有无无故迟到或缺勤情况百分比（有，无），有无吃拿卡要情况百分比（有，无）,有无恶言恶语,中伤百分比（有，无）
                                    //,综合评价百分比（优，良，中，合格，差），平均分,其他建议，
                                    //fuwutaidus,jiaoxuejinengs,chidaoqueqins,chinakayaos,eyuzhongshangs,zonghepingjias
                                    //2,于文翔,1,100.00%,0.00%,0.00%,0.00%,0.00%,100.00%,0.00%,0.00%,0.00%,0.00%,0.00%,100.00%,0.00%,100.00%,0.00%,100.00%,100.00%,0.00%,0.00%,0.00%,0.00%,2,ni,mei,;2,吴教练,2,100.00%,0.00%,0.00%,0.00%,0.00%,100.00%,0.00%,0.00%,0.00%,0.00%,0.00%,100.00%,0.00%,100.00%,0.00%,100.00%,100.00%,0.00%,0.00%,0.00%,0.00%,2,la,yu,;1,张教练,5,100.00%,0.00%,0.00%,0.00%,0.00%,100.00%,0.00%,0.00%,0.00%,0.00%,0.00%,100.00%,0.00%,100.00%,0.00%,100.00%,100.00%,0.00%,0.00%,0.00%,0.00%,1,没有,;
                                }
                                for (int n = 0; n <= 4; n++)
                                {
                                    fuwutaidus += ConvertIntToDouble(fuwutaidu[n], teaEvalData.Rows.Count) + ",";
                                    jiaoxuejinengs += ConvertIntToDouble(jiaoxuejineng[n], teaEvalData.Rows.Count) + ",";
                                    zonghepingjias += ConvertIntToDouble(zonghepingjia[n], teaEvalData.Rows.Count) + ",";
                                }
                                for (int w = 0; w <= 1; w++)
                                {
                                    chidaoqueqins += ConvertIntToDouble(chidaoqueqin[w], teaEvalData.Rows.Count) + ",";
                                    chinakayaos += ConvertIntToDouble(chinakayao[w], teaEvalData.Rows.Count) + ",";
                                    eyuzhongshangs += ConvertIntToDouble(eyuzhongshang[w], teaEvalData.Rows.Count) + ",";
                                }
                                teaEvalDatas = teaEvalDatas + teaEvalData.Rows.Count + "," + DLL.getTeaName(teaids[j]) + "," + teaids[j] + ","
                                        + fuwutaidus + jiaoxuejinengs + chidaoqueqins + chinakayaos + eyuzhongshangs + zonghepingjias +count+","+ qitajianyi + ";";

                            }
                        }
                        context.Response.Write(teaEvalDatas);
                        return;
                    }
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
                }
                if (flags == 4)
                {
                    //动态加载评教系统详细情况
                    DataTable teaEvals = DLL.GetAllTeaEvals();
                    string teaEval = "";
                    if (teaEvals.Rows.Count <= 0)
                    {
                        //还没有发起过评教
                        context.Response.Write("-1");
                    }
                    else
                    {
                        foreach (DataRow row in teaEvals.Rows)
                        {
                            string starttime, endtime;
                            //id, starttime, endtime, isdelete
                            starttime = ((DateTime)row["starttime"]).Year + "/" + ((DateTime)row["starttime"]).Month +"/"+ ((DateTime)row["starttime"]).Day;
                            endtime = ((DateTime)row["endtime"]).Year + "/" + ((DateTime)row["endtime"]).Month + "/" + ((DateTime)row["endtime"]).Day;
                            teaEval += row["id"].ToString() + "," + starttime + "," + endtime + "," + row["isdelete"].ToString() + ";";
                        }
                        //返回格式说明：每次评教的唯一id,改次评教开始时间，改次评教结束时间，评教状态（1：正在进行评教，2：已经进行完的评教）
                        //7,2016/9/30,2016/10/30,1;6,2016/9/29,2016/10/3,0;5,2016/9/30,2016/10/3,0;4,2016/9/30,2016/10/3,0;3,2016/9/30,2016/10/3,0;2,2016/9/1,2016/10/10,0;
                        context.Response.Write(teaEval);
                    }
                }
            }

        }
        else
        {
            //用户名或者密码为空
            context.Response.Write("404");
        }
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}