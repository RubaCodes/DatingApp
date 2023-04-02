using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDto
    {
        //validazione sul dto , non sulla entity vera e propria
        [Required]
        public string Username { get; set; }
        [Required]
        public string KnownAs { get; set; }
        [Required]
        public string Gender { get; set; }
        [Required]
        public DateOnly? DateOfBirth { get; set; } //optional to make birth date work
        [Required]
        public string Country { get; set; }
        [Required]
        public string City { get; set; }
        [Required]
        [StringLength(8, MinimumLength = 4)]
        public string Password { get; set; }
    }
}