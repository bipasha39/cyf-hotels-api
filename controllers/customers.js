const repository = require("../repositories");

function updateCustomer(req, res) {
  const customerId = req.params.customerId;
  const newEmail = req.body.email;

  repository
    .updateCustomer(customerId, newEmail)
    .then(() => res.send(`Customer ${customerId} updated!`))
    .catch((e) => res.status(500).send(e.message));
}

function deleteCustomer(req, res) {
  const customerId = req.params.customerId;

  repository
    .deleteCustomer(customerId)
    .then(() => res.send(`Customer ${customerId} deleted!`))
    .catch((e) => res.status(500).send(e.message));
}

module.exports = {
  updateCustomer: updateCustomer,
  deleteCustomer: deleteCustomer,
};
