<%@ WebHandler Language="C#" Class="StuBookingHandler" %>

using System;
using System.Web;
using jiaxiao.dll;
using jiaxiao.sql;
using System.Data;
using System.Web.SessionState;

public class StuBookingHandler : IHttpHandler, IRequiresSessionState
{


    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "text/plain";
        string username = "";
        string password = "";
        string typename = "";
        try {
            username = context.Session["username"].ToString();
            password = context.Session["password"].ToString();
            typename = context.Session["typename"].ToString();
        }
        catch {
           username = "";
           password = "";
           typename = "";
        }

        if (username != null && username != "")
        {
            int flags = 0;
            try
            {
                flags=Convert.ToInt32( context.Request.Params["flags"]);
            }
            catch {
                flags = 0;
            }
            if (flags == 1)
            {
                #region 
                string bookingstatus = "";
                DateTime bookingtime;
                DateTime time = DateTime.MaxValue;
                DateTime date = DateTime.MaxValue;
                DataTable dt = DLL.stuBookingStatus(username);
                if (dt == null | dt.Rows.Count <= 0)
                {
                    context.Response.Write("1");
                }
                else
                {
                    int flag = 1;
                    foreach (DataRow row in dt.Rows)
                    {
                        int i = 0;
                        string temstr = "";
                        foreach (DataColumn column in dt.Columns)
                        {
                            i++;
                            if (i == 2)
                            {
                                temstr = temstr + DLL.getStuName(row[column].ToString()) + ",";
                            }
                            if (i == 3)
                            {
                                temstr = temstr + DLL.getTeaName(row[column].ToString()) + ",";
                            }
                            if (i == 6)
                            {
                                temstr = temstr + DLL.getTimeName(Convert.ToInt32(row[column].ToString())) + ".";
                                string gettime = DLL.getTimeName(Convert.ToInt32(row[column].ToString()));
                                //8:30-9:40
                                string temptime = DLL.getThisTimeById(Convert.ToInt32(row[column].ToString()));
                                string[] times = temptime.Split('-');
                                time = Convert.ToDateTime(times[1]);
                                bookingtime = new DateTime(date.Year, date.Month, date.Day, time.Hour, time.Minute, time.Second);
                                if (DateTime.Compare(DateTime.Now, bookingtime) > 0)
                                {
                                    flag = 0;
                                }
                                else
                                {

                                }
                            }
                            if (i == 1 || i == 4 || i == 5)
                            {
                                temstr = temstr + row[column].ToString() + ",";
                                if (i == 5)
                                {
                                    date = Convert.ToDateTime(row[column].ToString());
                                }
                            }
                        }
                        if (flag == 1)
                        {
                            bookingstatus = bookingstatus + temstr;
                        }
                    }
                    //else
                    if (bookingstatus == "")
                    {
                        context.Response.Write("2");
                    }
                    else
                    {
                        context.Response.Write(bookingstatus);
                    }
                }
                #endregion
            }
            else if (flags == 2)
            {
                int id = Convert.ToInt32( context.Request.Params["id"]);
                DateTime bookingtime = Convert.ToDateTime(context.Request.Params["datetime"]);
                if (bookingtime.AddDays(-1).AddHours(12).CompareTo(DateTime.Now) < 0)
                {
                    //取消预约需要在预约日期前一天12：00之前完成
                    context.Response.Write("1");
                }
                else
                {
                    if (DLL.deleteThisBookingMessage(id))
                    {
                        //取消预约信息成功
                        context.Response.Write("2");
                    }
                    else {
                        //取消预约信息失败
                        context.Response.Write("3");
                    }
                }
            }
            else
            { 
                
            }
           
        }
        else
        { 
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