using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CardManagementSystem.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddCardDesignFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsLocked",
                table: "CardDesigns",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "JobTitle",
                table: "CardDesigns",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "LastEditedAt",
                table: "CardDesigns",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "LastEditedByUserId",
                table: "CardDesigns",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NameAr",
                table: "CardDesigns",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "NameEn",
                table: "CardDesigns",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsLocked",
                table: "CardDesigns");

            migrationBuilder.DropColumn(
                name: "JobTitle",
                table: "CardDesigns");

            migrationBuilder.DropColumn(
                name: "LastEditedAt",
                table: "CardDesigns");

            migrationBuilder.DropColumn(
                name: "LastEditedByUserId",
                table: "CardDesigns");

            migrationBuilder.DropColumn(
                name: "NameAr",
                table: "CardDesigns");

            migrationBuilder.DropColumn(
                name: "NameEn",
                table: "CardDesigns");
        }
    }
}
