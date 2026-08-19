namespace CardManagementSystem.Api.Models
{
    public class Role
    {
        public int RoleId { get; set; }
        public string RoleName { get; set; } = string.Empty; // Employee, DirectManager, CommStaff, CommManager, Admin

        public ICollection<User> Users { get; set; } = new List<User>();
    }
}