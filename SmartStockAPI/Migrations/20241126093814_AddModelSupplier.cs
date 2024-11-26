using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartStockAPI.Migrations
{
    public partial class AddModelSupplier : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Country",
                table: "Storage",
                newName: "Location");

            migrationBuilder.AddColumn<int>(
                name: "SupplierId",
                table: "Storage",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "SupplierPrice",
                table: "Storage",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "UserPrice",
                table: "Storage",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.CreateTable(
                name: "Suppliers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ContactEmail = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Suppliers", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Storage_SupplierId",
                table: "Storage",
                column: "SupplierId");

            migrationBuilder.AddForeignKey(
                name: "FK_Storage_Suppliers_SupplierId",
                table: "Storage",
                column: "SupplierId",
                principalTable: "Suppliers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Storage_Suppliers_SupplierId",
                table: "Storage");

            migrationBuilder.DropTable(
                name: "Suppliers");

            migrationBuilder.DropIndex(
                name: "IX_Storage_SupplierId",
                table: "Storage");

            migrationBuilder.DropColumn(
                name: "SupplierId",
                table: "Storage");

            migrationBuilder.DropColumn(
                name: "SupplierPrice",
                table: "Storage");

            migrationBuilder.DropColumn(
                name: "UserPrice",
                table: "Storage");

            migrationBuilder.RenameColumn(
                name: "Location",
                table: "Storage",
                newName: "Country");
        }
    }
}
