using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class LikesRepository : ILikesRepository
    {
        public DataContext _ctx { get; }
        public LikesRepository(DataContext ctx)
        {
            _ctx = ctx;

        }
        public async Task<UserLike> GetUserLike(int sourceUserId, int targetuserId)
        {
            return await _ctx.Likes.FindAsync(sourceUserId, targetuserId);
        }

        public async Task<PagedList<LikeDto>> GetUserLike(LikesParams likeParams)
        {
            var users = _ctx.AppUsers.OrderBy(u => u.UserName).AsQueryable();
            var likes = _ctx.Likes.AsQueryable();

            if (likeParams.Predicate == "liked")
            {
                likes = likes.Where(like => like.SourceUserId == likeParams.UserId);
                users = likes.Select(like => like.TargetUser);
            }
            if (likeParams.Predicate == "likedBy")
            {
                likes = likes.Where(like => like.TargetUserId == likeParams.UserId);
                users = likes.Select(like => like.SourceUser);
            }

            var likedUsers = users.Select(user => new LikeDto
            {
                UserName = user.UserName,
                KnownAs = user.KnownAs,
                Age = user.DateOfBirth.CalculateAge(),
                PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain).Url,
                City = user.City,
                Id = user.Id
            });

            return await PagedList<LikeDto>.CreateAsync(likedUsers, likeParams.PageNumber, likeParams.Pagesize);
        }

        public async Task<AppUser> GetUserWithLikes(int userId)
        {
            return await _ctx.AppUsers.Include(x => x.LikedUsers)
            .FirstOrDefaultAsync(x => x.Id == userId);
        }
    }
}