using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CardManagementSystem.Api.Data;
using CardManagementSystem.Api.DTOs;
using CardManagementSystem.Api.Services;

namespace CardManagementSystem.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly JwtService _jwtService;

        public AuthController(AppDbContext db, JwtService jwtService)
        {
            _db = db;
            _jwtService = jwtService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDto>> Login(LoginRequestDto request)
        {
            var user = await _db.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.NationalId == request.NationalId && u.IsActive);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return Unauthorized(new { message = "رقم الهوية أو كلمة المرور غير صحيحة" });
            }

            var roleName = user.Role?.RoleName ?? "Unknown";
            var token = _jwtService.GenerateToken(user, roleName);

            return Ok(new LoginResponseDto
            {
                Token = token,
                UserId = user.UserId,
                FullNameAr = user.FullNameAr,
                RoleName = roleName
            });
        }
    }
}