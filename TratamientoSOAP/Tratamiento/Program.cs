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

// 2. Registrar servicio SOAP en Inyección de Dependencias
builder.Services.AddScoped<ClinicaService>();
builder.Services.AddScoped<IClinicaService, ClinicaService>();

// 3. CORS para clientes web / frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// 4. Configurar CoreWCF / SOAP
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

app.UseCors("AngularFrontend");

// 5. Endpoint SOAP (WCF)
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