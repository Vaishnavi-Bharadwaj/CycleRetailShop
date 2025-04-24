using Microsoft.AspNetCore.Mvc;
using CycleRetailShop.API.Models;
using CycleRetailShop.API.Data;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace CycleRetailShop.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PaymentsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("details/{orderId}")]
        [Authorize(Roles = "Admin,Employee")]
        public IActionResult GetPaymentDetailsByOrderId(int orderId)
        {
            var payment = _context.PaymentDetails.FirstOrDefault(p => p.OrderId == orderId);
            
            if (payment == null)
            {
                return NotFound("Payment details not found for the given order ID.");
            }

            return Ok(payment);
        }
    }

}