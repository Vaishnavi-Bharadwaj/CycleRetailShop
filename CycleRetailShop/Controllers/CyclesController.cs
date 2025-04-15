using Microsoft.AspNetCore.Mvc;
using CycleRetailShop.API.Models;
using CycleRetailShop.API.Data;
using Microsoft.AspNetCore.Authorization;

namespace CycleRetailShop.API.Controllers
{
    [Route("api/cycles")]
    [ApiController]
    public class CyclesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CyclesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Customers, Admins and Employees can view all the cycle details
        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetCycles()
        {
            return Ok(_context.Cycles.ToList());
        }

        // Admin can add cycles
        [HttpPost("add/{modelName}/{brand}/{type}/{price}/{stock}")]
        [Authorize(Roles = "Admin")]
        public IActionResult AddCycle(string modelName, string brand, string type, decimal price, int stock)
        {
           var cycle = new Cycle
            {
                ModelName = modelName,
                Brand = brand,
                Type = type,
                Price = price,
                Stock = stock
            };
 
            _context.Cycles.Add(cycle);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetCycles), new { id = cycle.Id }, cycle);
        }

        // Admin can update the cycles details
        [HttpPut("update/{id}/{modelName}/{brand}/{type}/{price}/{stock}")]
        [Authorize(Roles = "Admin")]
        public IActionResult UpdateCycle(int id, string modelName, string brand, string type, decimal price, int stock)
        {
            var cycle = _context.Cycles.Find(id);
            if (cycle == null) return NotFound();

            cycle.ModelName = modelName;
            cycle.Brand = brand;
            cycle.Type = type;
            cycle.Price = price;
            cycle.Stock = stock;

            _context.SaveChanges();
            return Ok(cycle);
        }

        // Admin can delete the cycles details
        [HttpDelete("delete/{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult DeleteCycle(int id)
        {
            var cycle = _context.Cycles.Find(id);
            if (cycle == null) return NotFound();

            _context.Cycles.Remove(cycle);
            _context.SaveChanges();
            return Ok("Cycle deleted successfully.");
        }
    }
}
