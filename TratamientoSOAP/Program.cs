using Tratamiento.Data;
using CoreWCF;
using CoreWCF.Configuration;
using CoreWCF.Description;
using Microsoft.EntityFrameworkCore;
using Tratamiento.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. Conectar base de datos (PacienteDBContext)
builder.Services.AddDbContext<PacienteDBContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("ClinicaConnection")
    )
);

// 2. Registrar servicio SOAP
builder.Services.AddScoped<IClinicaService, ClinicaService>();

// 3. Agregar Controllers REST + Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new()
    {
        Title = "ClinicaAPI",
        Version = "v1",
        Description = "API REST + SOAP para gestión de Citas y Pacientes - ClinicaDB"
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

// 5. WCF / SOAP
builder.Services
    .AddServiceModelServices()
    .AddServiceModelMetadata();

builder.Services.AddSingleton<IServiceBehavior,
    UseRequestHeadersForMetadataAddressBehavior>();

builder.WebHost.ConfigureKestrel(options =>
{
    options.AllowSynchronousIO = true;
});

var app = builder.Build();

// 6. Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AngularFrontend");
app.UseAuthorization();
app.MapControllers();

// 7. Endpoint SOAP (WCF)
app.UseServiceModel(serviceBuilder =>
{
    serviceBuilder
        .AddService<ClinicaService>()
        .AddServiceEndpoint<ClinicaService, IClinicaService>(
            new BasicHttpBinding(),
            "/ClinicaService.svc"
        );
});

var metadataBehavior = app.Services.GetRequiredService<ServiceMetadataBehavior>();
metadataBehavior.HttpGetEnabled = true;
app.Run();