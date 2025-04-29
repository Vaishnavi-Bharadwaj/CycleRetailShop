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
                return Unauthorized(new{ message= "Username claim missing in token."});
            var user = _context.Users.FirstOrDefault(u => u.Username == username);
 
            if (user == null)
                return Unauthorized(new{ message= "User not found."});
 
            var allOrders = _context.Orders.ToList();
            return Ok(allOrders);
        }

        [HttpPost("create/{cycleId}/{quantity}/{customerId}")]
        [Authorize(Roles = "Admin,Employee")]
        public IActionResult CreateOrder(int cycleId, int quantity, int customerId)
        {
            var username = User.Identity?.Name;
            
            if (string.IsNullOrEmpty(username))
                return Unauthorized(new{ message= "Username claim missing in token."});

            var employee = _context.Users.FirstOrDefault(u => u.Username == username && u.Role == "Employee");
            var admin = _context.Users.FirstOrDefault(u => u.Username == username && u.Role == "Admin");

 
            if (employee == null && admin == null)
                return BadRequest(new{ message= "Invalid user."});
 
            var cycle = _context.Cycles.FirstOrDefault(c => c.Id == cycleId);
            
            if (cycle == null)
                return NotFound(new{ message= "Cycle not found."});
 
            if (cycle.Stock < quantity)
                return BadRequest(new{ message= "Not enough stock available."});

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
                PaymentMethod = null, 
                
            };
 
            cycle.Stock -= quantity;
            _context.Orders.Add(order);
            _context.SaveChanges();
 
            return Ok(new{ message= "Order placed successfully."});
        }

        // Admins can update order status 
        [HttpPut("update/{cycleId}/{status}")]
        [Authorize(Roles = "Admin")]
        public IActionResult UpdateOrder(int cycleId, string status)
        {
            var order = _context.Orders.Find(cycleId);
            if (order == null) 
                return NotFound(new{ message= "Order not found."});

            order.Status = status;
            _context.SaveChanges();
            return Ok(new{ message= "Order status updated"});
        }

        // Admin can delete the order
        [HttpDelete("delete/{orderId}")]
        [Authorize(Roles = "Admin,Employee")]
        public IActionResult DeleteOrder(int orderId, [FromQuery] int cycleId, [FromQuery] int quantity)
        {
            var username = User.Identity.Name;
            if (string.IsNullOrEmpty(username))
                return Unauthorized(new{ message= "Username claim missing in token."});

            var user = _context.Users.FirstOrDefault(u => u.Username == username);
 
            if (user == null)
                return Unauthorized(new{ message= "User not found."});
 
            var order = _context.Orders.FirstOrDefault(o => o.Id == orderId);
 
            if (order == null)
                return NotFound(new{ message= "Order not found."});

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
        public IActionResult CompletePayment(int orderId, [FromBody] PaymentRequest request)
        {
            // if (!ModelState.IsValid)
            //     return BadRequest(ModelState);

            if (!ModelState.IsValid)
            {
                var error = ModelState.Values.SelectMany(v => v.Errors)
                                            .Select(e => e.ErrorMessage)
                                            .FirstOrDefault();

                return BadRequest(new { message = error ?? "Invalid input" });
            }

            var order = _context.Orders.FirstOrDefault(o => o.Id == orderId);
            
            if (order == null)
                return NotFound(new{ message= "Order not found."});

            if (order.Status == "Approved" || order.Status == "Shipped" || order.Status == "Delivered")
                return BadRequest(new{ message= "This order has already been paid."});

            Cycle? cycle = null;
            if (order.CycleId > 0)
            {
                cycle = _context.Cycles.FirstOrDefault(c => c.Id == order.CycleId);
            }
            
            Console.WriteLine($"Order TotalAmount: {order.TotalAmount}");
            if (order.TotalAmount <= 0)
            {
                return BadRequest(new{ message= "Total amount is invalid."});
            }

            // Update the payment details
            order.IsPaid = true;
            order.PaymentMethod = request.PaymentMethod;
            order.PaymentDate = DateTime.UtcNow;
            
             var payment = new PaymentDetails
            {
                OrderId = order.Id,
                PaymentMethod = request.PaymentMethod,
                Amount = order.TotalAmount,
                PaymentDate = order.PaymentDate ?? DateTime.UtcNow,
                CycleName = cycle?.ModelName ?? "N/A"
            };
            
            order.Status = "Approved";
            _context.PaymentDetails.Add(payment);
            _context.SaveChanges();

            
            return Ok(new
            {
                message = "Payment completed successfully.",
                orderId = order.Id,
                amount = order.TotalAmount,
                paymentMethod = order.PaymentMethod,
                paymentDate = order.PaymentDate,
                cycleName= cycle.ModelName
            });
        }
        
    }
}
