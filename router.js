const router = require("express").Router();
const controllers = require("./controllers");

router
  .get("/hotels", controllers.getHotels)
  .post("/hotels", controllers.postHotel)
  .put("/customers/:customerId", controllers.updateCustomer)
  .delete("/customers/:customerId", controllers.deleteCustomer);

module.exports = router;
