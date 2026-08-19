using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using CardManagementSystem.Api.Data;
using CardManagementSystem.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<JwtService>();

var jwtKey = builder.Configuration["Jwt:Key"]!;
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});

builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Seed بيانات تجريبية عند أول تشغيل
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    if (!db.Roles.Any())
    {
        db.Roles.AddRange(
            new CardManagementSystem.Api.Models.Role { RoleName = "Employee" },
            new CardManagementSystem.Api.Models.Role { RoleName = "DirectManager" },
            new CardManagementSystem.Api.Models.Role { RoleName = "CommStaff" }
        );
        db.SaveChanges();
    }

    if (!db.Users.Any())
    {
        var employeeRole = db.Roles.First(r => r.RoleName == "Employee");
        var managerRole = db.Roles.First(r => r.RoleName == "DirectManager");
        var commStaffRole = db.Roles.First(r => r.RoleName == "CommStaff");

        var manager = new CardManagementSystem.Api.Models.User
        {
            FullNameAr = "سعد عبدالله القحطاني",
            FullNameEn = "Saad Abdullah AlQahtani",
            NationalId = "1010304050",
            EmployeeNumber = "7000111",
            Email = "saad@test.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Test@1234"),
            JobTitle = "مدير الإدارة العامة لتقنية المعلومات",
            Department = "الادارة العامة لتقنية المعلومات",
            RoleId = managerRole.RoleId
        };
        db.Users.Add(manager);
        db.SaveChanges();

        db.Users.AddRange(
            new CardManagementSystem.Api.Models.User
            {
                FullNameAr = "فاطمة محمد المحيميد",
                FullNameEn = "Fatimah Mohammed AlMohaimeed",
                NationalId = "1010223377",
                EmployeeNumber = "6615933",
                Email = "fatimah@test.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Test@1234"),
                JobTitle = "مطور برامج متقدم أول",
                Department = "الادارة العامة لتقنية المعلومات",
                RoleId = employeeRole.RoleId,
                ManagerId = manager.UserId
            },
            new CardManagementSystem.Api.Models.User
            {
                FullNameAr = "روى الحمّاد",
                FullNameEn = "Roaa Alhammad",
                NationalId = "1000000001",
                EmployeeNumber = "1001",
                Email = "roaa@test.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Test@1234"),
                JobTitle = "موظف تواصل داخلي",
                Department = "إدارة التواصل الداخلي",
                RoleId = commStaffRole.RoleId
            }
        );
        db.SaveChanges();
    }
}

app.Run();