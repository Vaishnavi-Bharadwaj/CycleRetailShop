using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CycleRetailShop.API.Data;
using System.Globalization;

namespace CycleRetailShop.API.Controllers
{
    [Route("api/charts")]
    [ApiController]
    public class ChartsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ChartsController(ApplicationDbContext context)
        {
            _context = context;
        }

        //Monthly Sales
        [HttpGet("admin-dashboard/monthly-sales")]
        public IActionResult GetMonthlySales()
        {
            var salesData = _context.Orders
                .Where(o => o.OrderDate != null )
                .Include(o => o.Cycle)
                .AsEnumerable()
                .GroupBy(o => new { o.OrderDate.Year, o.OrderDate.Month })
                .Select(g => new
                {
                    Month = CultureInfo.CurrentCulture.DateTimeFormat.GetAbbreviatedMonthName(g.Key.Month) + " " + g.Key.Year,
                    TotalSales = g.Sum(o => o.Quantity * o.Cycle.Price)
                })
                .OrderBy(g => g.Month)
                .ToList();

            return Ok(salesData);
        }

        //Top Selling Cycles
        [HttpGet("admin-dashboard/top-selling-cycles")]
        public IActionResult GetTopSellingCycles()
        {
            var topCycles = _context.Orders
                .GroupBy(o => o.CycleId)
                .Select(g => new
                {
                    CycleId = g.Key,
                    QuantitySold = g.Sum(o => o.Quantity),
                    CycleName = _context.Cycles
                        .Where(c => c.Id == g.Key)
                        .Select(c => c.ModelName)
                        .FirstOrDefault()
                })
                .OrderByDescending(g => g.QuantitySold)
                .Take(5)
                .ToList();

            return Ok(topCycles);
        }

        //Inventory Summary
        [HttpGet("admin-dashboard/inventory-summary")]
        public IActionResult GetInventorySummary()
        {
            var inventory = _context.Cycles
                .Select(c => new
                {
                    c.ModelName,
                    c.Stock,
                    c.Price
                })
                .OrderByDescending(c => c.Stock)
                .ToList();

            return Ok(inventory);
        }

        //Yearly Revenue
        [HttpGet("admin-dashboard/yearly-revenue")]
        public IActionResult GetYearlyRevenue()
        {
            var yearlyData = _context.Orders
                .Where(o => o.Status == "Completed")
                .Include(o => o.Cycle)
                .AsEnumerable()
                .GroupBy(o => o.OrderDate.Year)
                .Select(g => new
                {
                    Year = g.Key,
                    Revenue = g.Sum(o => o.Quantity * o.Cycle.Price)
                })
                .OrderBy(g => g.Year)
                .ToList();

            return Ok(yearlyData);
        }
    }
}
