using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using CycleRetailShop.API.Models;
using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using CycleRetailShop.API.Data;


namespace CycleRetailShop.API.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        public AuthController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // Register
        [HttpPost("register/{username}/{password}/{role?}")]
        [Authorize(Roles = "Admin")]
        public IActionResult RegisterUser(string username, string password, string role)
        {
            role = role?.Trim().ToLower();

            if (_context.Users.Any(u => u.Username == username))
                return BadRequest("User already exists");

            if (role != "admin" && role != "employee")
                return BadRequest("Invalid role. Choose 'Admin' or 'Employee'");

            role = char.ToUpper(role[0]) + role.Substring(1).ToLower();

            bool isFirstAdmin = !_context.Users.Any(u => u.Role == "Admin");

            var user = new User
            {
                Username = username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                Role = role
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            var token = GenerateJwtToken(user);
            return Ok(new { token });
        }

    
        //login
        [HttpPost("login/{username}/{password}/{role}")]
        public IActionResult Login(string username, string password, string role)
        {
            // Hardcoded first admin login
            User user;
            if (username == "vaishnavi" && password == "vaishnavi@123" && role == "Admin" && !_context.Users.Any(u => u.Role == "Admin"))
            {
                user = new User
                {
                    Username = "vaishnavi",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("vaishnavi@123"),
                    Role = "Admin"
                };
                _context.Users.Add(user);
                _context.SaveChanges();
            }
            else
            {
                user = _context.Users.FirstOrDefault(u => u.Username == username && u.Role==role);
                if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
                    return Unauthorized("Invalid username or password");
            }
            

            string token = GenerateJwtToken(user);
            return Ok(new { token });
        }

        //Admin can get all the employee details
        [HttpGet("employees")]
        [Authorize(Roles = "Admin")]
        public IActionResult GetAllEmployees()
        {
            var employees = _context.Users
                .Where(u => u.Role == "Employee")
                .Select(u => new {
                    u.Id,
                    u.Username,
                    u.Role
                })
                .ToList();

            return Ok(employees);
        }

        // Admin can delete the employees
        [HttpDelete("delete/{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult DeleteCycle(int id)
        {
            var employee = _context.Users.Find(id);
            if (employee == null) return NotFound();

            _context.Users.Remove(employee);
            _context.SaveChanges();
            return Ok("Cycle deleted successfully.");
        }
        
        private string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:Key"]));
            Console.WriteLine("JWT Secret Key: " + _configuration["JwtSettings:Key"]);

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var token = new JwtSecurityToken(
                _configuration["JwtSettings:Issuer"],
                _configuration["JwtSettings:Audience"],
                claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
