using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Frontend.Models
{
    public class Models
    {
    }

    public class login
    {
        public string usuario { get; set; }
        public string clave { get; set; }
    }

    public class LoginEstado
    {
        public bool result { get; set; }
        public string error { get; set; }
    }
}