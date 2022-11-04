using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext : DbContext
    {
        //dichiaro le mie tabelle
        public DbSet<AppUser> AppUsers { get; set; }
        //costruttore di default
        public DataContext(DbContextOptions options) : base(options)
        {
        }
    }
}