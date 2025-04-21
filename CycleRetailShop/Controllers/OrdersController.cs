using Microsoft.AspNetCore.Mvc;
using CycleRetailShop.API.Models;
using CycleRetailShop.API.Data;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace CycleRetailShop.API.Controllers
{
    [Route("api/orders")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        //View all the orders
        [HttpGet]
        [Authorize]
        public IActionResult GetOrders()
        {
            var username = User.Identity.Name;

            if (string.IsNullOrEmpty(username))
                return Unauthorized("Username claim missing in token.");
            var user = _context.Users.FirstOrDefault(u => u.Username == username);
 
            if (user == null)
                return Unauthorized("User not found.");
 
            var allOrders = _context.Orders.ToList();
            return Ok(allOrders);
        }

        //Employees can place orders
        [HttpPost("create/{cycleId}/{quantity}/{customerId}")]
        [Authorize(Roles = "Admin,Employee")]
        public IActionResult CreateOrder(int cycleId, int quantity, int customerId)
        {
            var username = User.Identity?.Name;
            
            if (string.IsNullOrEmpty(username))
                return Unauthorized("Username claim missing in token.");

            var employee = _context.Users.FirstOrDefault(u => u.Username == username && u.Role == "Employee");
            var admin = _context.Users.FirstOrDefault(u => u.Username == username && u.Role == "Admin");

 
            if (employee == null && admin == null)
                return BadRequest("Invalid user.");
 
            var cycle = _context.Cycles.FirstOrDefault(c => c.Id == cycleId);
            
            if (cycle == null)
                return NotFound("Cycle not found.");
 
            if (cycle.Stock < quantity)
                return BadRequest("Not enough stock available.");

            var totalAmount = cycle.Price * quantity;

            var order = new Order
            {
                UserId = employee != null ? employee.Id : admin.Id,
                CycleId = cycleId,
                Quantity = quantity,
                CustomerId = customerId,
                OrderDate = DateTime.UtcNow,
                Status = "Pending",
                TotalAmount = totalAmount,
                IsPaid = false,  // Initial payment status
                PaymentMethod = null,  // Leave null for now
                TransactionId = null  // Leave null for now
            };
 
            cycle.Stock -= quantity;
            _context.Orders.Add(order);
            _context.SaveChanges();
 
            return Ok("Order placed successfully.");
        }

        // Admins can update order status 
        [HttpPut("update/{cycleId}/{status}")]
        [Authorize(Roles = "Admin")]
        public IActionResult UpdateOrder(int cycleId, string status)
        {
            var order = _context.Orders.Find(cycleId);
            if (order == null) return NotFound("Order not found.");

            order.Status = status;
            _context.SaveChanges();
            return Ok("Order status updated");
        }

        // Employees can delete the order if the status is pending, Admin can delete any order
        [HttpDelete("delete/{orderId}")]
        [Authorize(Roles = "Admin,Employee")]
        public IActionResult DeleteOrder(int orderId, [FromQuery] int cycleId, [FromQuery] int quantity)
        {
            var username = User.Identity.Name;
            if (string.IsNullOrEmpty(username))
                return Unauthorized("Username claim missing in token.");

            var user = _context.Users.FirstOrDefault(u => u.Username == username);
 
            if (user == null)
                return Unauthorized("User not found.");
 
            var order = _context.Orders.FirstOrDefault(o => o.Id == orderId);
 
            if (order == null)
                return NotFound("Order not found.");
 
            // Employees can only delete their own orders if the status is 'Pending'
            if (user.Role == "Employee")
            {
                if (order.UserId != user.Id)
                    return BadRequest("You can only delete your own orders.");
 
                if (order.Status != "Pending")
                    return BadRequest("Only orders with 'Pending' status can be deleted.");
            }

            // Admins can delete any order
            _context.Orders.Remove(order); 
            var cycle = _context.Cycles.FirstOrDefault(c => c.Id == cycleId);
            if (cycle != null)
            {
                cycle.Stock += quantity;
            }  
            _context.SaveChanges();
            return Ok(new { message = "Order deleted successfully" });
        }

        [HttpPost("complete-payment/{orderId}")]
        [Authorize(Roles = "Admin,Employee")]
        public IActionResult CompletePayment(int orderId, string paymentMethod, string transactionId)
        {
            var order = _context.Orders.FirstOrDefault(o => o.Id == orderId);

            if (order == null)
                return NotFound("Order not found.");

            if (order.Status == "Paid")
                return BadRequest("This order has already been paid.");

            // Update the payment details directly on the existing order
            order.IsPaid = true;
            order.PaymentMethod = paymentMethod;
            order.TransactionId = transactionId;
            order.PaymentDate = DateTime.UtcNow;
            order.Status = "Paid";  // Update order status to Paid

            _context.SaveChanges();

            return Ok(new
            {
                message = "Payment completed successfully.",
                orderId = order.Id,
                amount = order.TotalAmount,
                paymentMethod = order.PaymentMethod,
                transactionId = order.TransactionId
            });
        }


        // Admin dashboard - Get Monthly Sales Summary
        [HttpGet("monthly-sales")]
        [Authorize(Roles = "Admin, Employee")]
        public IActionResult GetMonthlySales()
        {
            var salesData = _context.Orders
                .Where(o => o.Status == "Delivered")
                .GroupBy(o => new { o.OrderDate.Year, o.OrderDate.Month })
                .Select(g => new
                {
                    Month = g.Key.Month,
                    Year = g.Key.Year,
                    TotalRevenue = g.Sum(o => o.TotalAmount),
                    TotalOrders = g.Count()
                })
                .OrderBy(x => x.Year).ThenBy(x => x.Month)
                .ToList();

            return Ok(salesData);
        }
        
    }
}
