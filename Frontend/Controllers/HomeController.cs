using Frontend.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Mvc;

namespace Frontend.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            if (Session["UserID"] != null)
            {
                return View();
            }
            else
            {
                return RedirectToAction("Login");
            }
        }


        public ActionResult Salir()
        {
            Session.Clear();

            return RedirectToAction("Login");
        }


        public ActionResult Login()
        {
            if (Session["UserID"] != null)
            {
                return RedirectToAction("MiPagina");
            }
            else
            {
                return View();
            }
        }


        /// <summary>
        /// Metodo Post MVC para Login
        /// </summary>
        /// <param name="login"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Login(login login)
        {
            if (ModelState.IsValid)
            {
                if (String.IsNullOrEmpty(login.usuario) || String.IsNullOrEmpty(login.clave))
                {
                    ViewBag.Message = "Por favor Ingrese usuario y clave.";
                    return View(login);
                }

                var client = new HttpClient();

                try
                {
                    var uriBuilder = new UriBuilder(System.Configuration.ConfigurationManager.AppSettings["ServerBackend"].ToString() +
                        "/api/Login/login?type=json");

                    var paramValues = HttpUtility.ParseQueryString(uriBuilder.Query);
                    paramValues.Add("usuario", login.usuario);
                    paramValues.Add("clave", login.clave);

                    uriBuilder.Query = paramValues.ToString();

                    var response = client.GetAsync(uriBuilder.Uri).Result;

                    if (response.IsSuccessStatusCode)
                    {
                        var retorno = response.Content.ReadAsStringAsync().Result.Trim();

                        retorno = retorno.Replace("\"", "");

                        if (retorno == "0|0" )
                        {
                            ViewBag.Message = "Se presentaron fallas en el ingreso. Por favor verifique";
                            return View(login);

                        }
                        else
                        {
                            var tempo = retorno.Split('|');

                            Session["UserID"] = tempo[0];
                            Session["UserName"] = tempo[1];
                            return RedirectToAction("MiPagina");
                        }
                    }

                }
                catch (Exception e)
                {

                }

            }

            ViewBag.Message = "Se presentaron fallas en el ingreso. Por favor verifique";
            return View(login);
        }

        public ActionResult MiPagina()
        {
            if (Session["UserID"] != null)
            {
                ///Se envia id de usuario por Viewbag, para recibirlo en la vista y en el Javascript, para posteriormente realizar consultas Por medio 
                ///del angularjs al backend.
                
                ViewBag.id_usuario = Session["UserID"];
                return View();
            }
            else
            {
                return RedirectToAction("Login");
            }
        }

        public ActionResult Transaccion()
        {
            if (Session["UserID"] != null)
            {
                ///Se envia id de usuario por Viewbag, para recibirlo en la vista y en el Javascript, para posteriormente realizar consultas Por medio 
                ///del angularjs al backend.
                
                ViewBag.id_usuario = Session["UserID"];
                return View();
            }
            else
            {
                return RedirectToAction("Login");
            }
        }


    }
}