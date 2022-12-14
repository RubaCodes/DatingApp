using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
//using System.Security.Cryptography;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly DataContext _cxt;
        private readonly ITokenService _tokenService;

        public AccountController(DataContext context, ITokenService tokenService)
        {
            _tokenService = tokenService;
            _cxt = context;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {

            using var hmac = new HMACSHA512(); //alg cript, con dispose della classe al temine dell'istanza
            //check for uniqueness of username
            if (await UserExist(registerDto.Username)) return BadRequest("Username is taken");
            // create new user 
            var user = new AppUser
            {
                UserName = registerDto.Username.ToLower(),
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
                PasswordSalt = hmac.Key
            };
            //add the user
            _cxt.AppUsers.Add(user);
            //save changes async            
            await _cxt.SaveChangesAsync();

            return new UserDto{
                Username = user.UserName,
                Token = _tokenService.CreateToken(user)
            };
        }
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _cxt.AppUsers
                .SingleOrDefaultAsync(x => x.UserName == loginDto.Username);
            if (user is null) return Unauthorized("Invalid Username");
            //recupera la chiave di cifratura
            using var hmac = new HMACSHA512(user.PasswordSalt);
            //calcola l'has della pasword in arrivo
            var ComputeHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));
            //compara i due hash DB<-> Dto => se uguali ok , altrimenti password errata
            for (int i = 0; i < ComputeHash.Length; i++)
            {
                if (ComputeHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid Password");
            }

            return new UserDto{
                Username = user.UserName,
                Token = _tokenService.CreateToken(user)
            };
        }
        private async Task<Boolean> UserExist(string username)
        {
            return await _cxt.AppUsers.AnyAsync(x => x.UserName == username.ToLower());
        }

    }
}