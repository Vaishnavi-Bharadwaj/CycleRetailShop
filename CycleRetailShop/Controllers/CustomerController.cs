using Microsoft.AspNetCore.Mvc;
using CycleRetailShop.API.Models;
using CycleRetailShop.API.Data;
using Microsoft.AspNetCore.Authorization;
using System.Linq;

namespace CycleRetailShop.API.Controllers
{
    [Route("api/customers")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CustomerController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("create/{customerName}/{customerEmail}/{customerPhone}")]
        [Authorize(Roles = "Admin")]
        public IActionResult CreateCustomer(string customerName, string customerEmail, string customerPhone)
        {
            var customer = new Customer 
            {
                Name=customerName,
                Email=customerEmail,
                Phone=customerPhone
            };

            _context.Customers.Add(customer);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetCustomers), new { id = customer.Id }, customer);
        }


        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetCustomers()
        {
            
            return Ok(_context.Customers.ToList());
        }


        [HttpPut("update/{id}/{customerName}/{customerEmail}/{customerPhone}")]
        [Authorize(Roles = "Admin")]
        public IActionResult UpdateCustomer(int id, string customerName, string customerEmail, string customerPhone )
        {
            var customer = _context.Customers.Find(id);
            if (customer == null) return NotFound();

            customer.Name = customerName;
            customer.Email = customerEmail;
            customer.Phone = customerPhone;

            _context.SaveChanges();
            
            return Ok(customer);
        }

        
    }
}
