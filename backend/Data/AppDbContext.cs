using Microsoft.EntityFrameworkCore;
using CardManagementSystem.Api.Models;

namespace CardManagementSystem.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Role> Roles => Set<Role>();
        public DbSet<User> Users => Set<User>();
        public DbSet<CardRequest> CardRequests => Set<CardRequest>();
        public DbSet<RequestAttachment> RequestAttachments => Set<RequestAttachment>();
        public DbSet<RequestApproval> RequestApprovals => Set<RequestApproval>();
        public DbSet<CardDesign> CardDesigns => Set<CardDesign>();
        public DbSet<OtpVerification> OtpVerifications => Set<OtpVerification>();
        public DbSet<CardDelivery> CardDeliveries => Set<CardDelivery>();
        public DbSet<CustodyReturn> CustodyReturns => Set<CustodyReturn>();
        public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // تحديد المفاتيح الأساسية صراحة (أسماؤها لا تطابق اصطلاح EF التلقائي)
            modelBuilder.Entity<CardRequest>().HasKey(r => r.RequestId);
            modelBuilder.Entity<RequestAttachment>().HasKey(a => a.AttachmentId);
            modelBuilder.Entity<RequestApproval>().HasKey(a => a.ApprovalId);
            modelBuilder.Entity<OtpVerification>().HasKey(o => o.OtpId);
            modelBuilder.Entity<CardDelivery>().HasKey(d => d.DeliveryId);

            // منع مسارات الحذف المتسلسل المتعددة (Cascade cycles) بين المستخدمين والمدير المباشر
            modelBuilder.Entity<User>()
                .HasOne(u => u.Manager)
                .WithMany()
                .HasForeignKey(u => u.ManagerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<RequestApproval>()
                .HasOne(a => a.Approver)
                .WithMany()
                .HasForeignKey(a => a.ApproverId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<CardDelivery>()
                .HasOne(d => d.DeliveredBy)
                .WithMany()
                .HasForeignKey(d => d.DeliveredById)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<CustodyReturn>()
                .HasOne(c => c.User)
                .WithMany()
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<CustodyReturn>()
                .HasOne(c => c.ReceivedBy)
                .WithMany()
                .HasForeignKey(c => c.ReceivedById)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}