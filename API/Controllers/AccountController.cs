using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;

        public AccountController(UserManager<AppUser> userManager, ITokenService tokenService, IMapper mapper)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _mapper = mapper;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {

            //check for uniqueness of username
            if (await UserExist(registerDto.Username)) return BadRequest("Username is taken");

            var user = _mapper.Map<AppUser>(registerDto);
            // create new user 
            user.UserName = registerDto.Username.ToLower();

            //add the user
            var result = await _userManager.CreateAsync(user, registerDto.Password);
            if (!result.Succeeded) return BadRequest(result.Errors);

            var roleResult = _userManager.AddToRoleAsync(user, "Member");

            if (!roleResult.IsCompletedSuccessfully) return BadRequest(result.Errors);
            return new UserDto
            {
                Username = user.UserName,
                Token = await _tokenService.CreateToken(user),
                KnownAs = user.KnownAs,
                Gender = user.Gender
            };
        }
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.Users
                .SingleOrDefaultAsync(x => x.UserName == loginDto.Username);
            if (user is null) return Unauthorized("Invalid Username");

            var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);
            if (!result) return Unauthorized();

            return new UserDto
            {
                Username = user.UserName,
                Token = await _tokenService.CreateToken(user),
                KnownAs = user.KnownAs,
                Gender = user.Gender
            };
        }
        private async Task<Boolean> UserExist(string username)
        {
            return await _userManager.Users.AnyAsync(x => x.UserName == username.ToLower());
        }

    }
}