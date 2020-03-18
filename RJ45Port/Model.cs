namespace RJ45Port
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class Model : DbContext
    {
        public Model()
            : base("name=ModelConnection")
        {
        }

        public virtual DbSet<Port> Ports { get; set; }
        public virtual DbSet<Room> Rooms { get; set; }
        public virtual DbSet<Section> Sections { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Room>()
                .HasMany(e => e.Ports)
                .WithRequired(e => e.Room)
                .HasForeignKey(e => e.AssociatedRoom)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<Section>()
                .HasMany(e => e.Rooms)
                .WithRequired(e => e.Section1)
                .HasForeignKey(e => e.Section)
                .WillCascadeOnDelete(false);
        }
    }
}
