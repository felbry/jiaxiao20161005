<%@ WebHandler Language="C#" Class="AjaxUserIsExist" %>

using System;
using System.Web;
using jiaxiao.sql;
using jiaxiao.dll;
using System.Web.SessionState;
public class AjaxUserIsExist : IHttpHandler, IRequiresSessionState
{

    public void ProcessRequest(HttpContext context)
    {
        //Request.QueryString["id"]
        context.Response.ContentType = "text/plain";
        context.Session["username"] = "";
        context.Session["password"] = "";
        context.Session["typename"] = "";
        string username = context.Request.QueryString["username"].ToString();
        string password = context.Request.QueryString["password"].ToString();
        string typename = context.Request.QueryString["typename"].ToString();
        if (typename == "student")
        {
            if (!DLL.stuIsExit(username, password))
            {
                context.Response.Write("用户名或密码不正确");
            }
            else
            {
                context.Session["username"] = username;
                context.Session["password"] = password;
                context.Session["typename"] = typename;
                context.Response.Write("ok");
            }
        }
        else if (typename == "admin")
        {
            if (!DLL.adminIsExit(username, password))
            {
                context.Response.Write("用户名或密码不正确");
            }
            else
            {
                context.Session["username"] = username;
                context.Session["password"] = password;
                context.Session["typename"] = typename;
                context.Response.Write("ok");
            }
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