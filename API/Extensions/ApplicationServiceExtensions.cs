using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Interfaces;
using API.Services;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
       public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config) {

            services.AddScoped<ITokenService , TokenService>(); // in realta l'intefaccia e' in piu, ma serve per testing
            // start: int the constructor as dep inj
            //end : when the request in finished
            services.AddDbContext<DataContext>(x =>
            {
                x.UseSqlite(config.GetConnectionString("DefaultConnection"));
            });

            return services;
       }
    }
}