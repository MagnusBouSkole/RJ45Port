namespace RJ45Port
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Room")]
    public partial class Room
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Room()
        {
            Ports = new HashSet<Port>();
        }

        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public int AssociatedSection { get; set; }

        public string Icon { get; set; }

        public string Cover { get; set; }

        public string Logo { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Port> Ports { get; set; }

        public virtual Section Section { get; set; }
    }
}
