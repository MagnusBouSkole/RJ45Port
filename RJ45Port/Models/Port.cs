namespace RJ45Port
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Port")]
    public partial class Port
    {
        public int Id { get; set; }

        [Required]
        public string SerialCode { get; set; }

        public bool IsActive { get; set; }

        public bool IsConnected { get; set; }

        public int AssociatedRoom { get; set; }

        public string Description { get; set; }

        public virtual Room Room { get; set; }
    }
}
