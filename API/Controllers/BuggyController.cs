using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BuggyController : BaseApiController
    {
        private readonly DataContext _ctx;

        public BuggyController(DataContext ctx)
        {
            _ctx = ctx;
        }

        [Authorize]
        [HttpGet("auth")]
        public ActionResult<string> getSecret(){
            return "Secret Test";
        }

        [HttpGet("not-found")]
        public ActionResult<AppUser> getNotFound(){
            var thing = _ctx.AppUsers.Find(-1);
            if( thing is null){
                return NotFound("User not Found!");
            }

            return Ok(thing);
        }
        [HttpGet("server-error")]
        public ActionResult<string> getServerError(){
            var thing = _ctx.AppUsers.Find(-1);//null in returned
            var thingToReturn = thing.ToString();// error null to-> string
            return thingToReturn;
        }
        [HttpGet("bad-request")]
        public ActionResult<string> getBadRequest(){
             return BadRequest(" Bad request");
        }

    }
}