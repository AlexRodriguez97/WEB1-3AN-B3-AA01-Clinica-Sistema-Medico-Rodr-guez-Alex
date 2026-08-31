using ClinicaDBContext.Data;
using CoreWCF;
using CoreWCF.Configuration;
using CoreWCF.Description;
using Microsoft.EntityFrameworkCore;
using Tratamiento.Services;


var builder = WebApplication.CreateBuilder(args);

// 1. Conectar tu nueva base de datos (PacienteDBContext)
builder.Services.AddDbContext<PacienteDBContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("ClinicaConnection") 
    )
);


builder.Services.AddScoped<ClinicaService>(); 


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