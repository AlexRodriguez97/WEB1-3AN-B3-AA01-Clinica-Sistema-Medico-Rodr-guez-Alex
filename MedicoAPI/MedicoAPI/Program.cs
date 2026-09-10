using MedicoAPI.Data_Rest;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 1. Conectar base de datos ClinicaDB
builder.Services.AddDbContext<MedicoDBContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("ClinicaConnection")
    )
);

// 2. Agregar Controllers
builder.Services.AddControllers();

// 3. Configurar Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new()
    {
        Title = "MedicoAPI",
        Version = "v1",
        Description = "API REST para gestión de Médicos - ClinicaDB"
    });
});

// 4. CORS para Angular frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// 5. Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AngularFrontend");
app.UseAuthorization();
app.MapControllers();

app.Run();

