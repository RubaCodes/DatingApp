using API.Interfaces;
using System.Security.Claims;
using API.DTOs;
using API.Extensions;
using API.Helpers;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using API.Entities;

namespace API.Controllers
{
    public class LikesController : BaseApiController
    {
        private readonly ILikesRepository _likesRepository;
        private readonly IUserRepository _userRepository;
        public LikesController(IUserRepository userRepository, ILikesRepository likesRepository)
        {
            _userRepository = userRepository;
            _likesRepository = likesRepository;
        }

        [HttpPost("{username}")]
        public async Task<ActionResult> AddLike(string username)
        {
            var sourceUserId = User.GetUserId();
            var targetUser = await _userRepository.GetUserByUsernameAsync(username);
            var sourceUser = await _likesRepository.GetUserWithLikes(sourceUserId);

            if (targetUser is null)
            {
                return NotFound();
            }
            if (sourceUser.UserName == username)
            {
                return BadRequest("You cannot like yourself ");
            }

            var userLike = await _likesRepository.GetUserLike(sourceUserId, targetUser.Id);
            if (userLike is not null)
            {
                return BadRequest("You alredy liked that user");
            }

            userLike = new UserLike
            {
                SourceUserId = sourceUserId,
                TargetUserId = targetUser.Id
            };

            sourceUser.LikedUsers.Add(userLike);
            if (await _userRepository.SaveAllAsync()) return Ok();
            return BadRequest("Failed to like user");
        }
        [HttpGet]
        public async Task<ActionResult<PagedList<LikeDto>>> getUserLikes([FromQuery] LikesParams likesParams)
        {
            likesParams.UserId = User.GetUserId();
            var users = await _likesRepository.GetUserLike(likesParams);

            Response.AddPaginationHeader(new PaginationHeader(users.Currentpage, users.PageSize, users.TotalCount, users.TotalPages));
            return Ok(users);
        }
    }
}