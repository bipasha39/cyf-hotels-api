const repository = require("../repositories");

function getHotels(req, res) {
  repository
    .getHotels()
    .then((result) => res.json(result.rows))
    .catch((e) => res.status(500).send(e.message));
}

function postHotel(req, res) {
  const newHotelName = req.body.name;
  const newHotelRooms = req.body.rooms;
  const newHotelPostcode = req.body.postcode;

  if (!Number.isInteger(newHotelRooms) || newHotelRooms <= 0) {
    return res
      .status(400)
      .send("The number of rooms should be a positive integer.");
  }

  repository.getHotel(newHotelName).then((result) => {
    if (result.rows.length > 0) {
      return res.status(400).send("A hotel with the same name already exists!");
    }

    repository
      .createHotel(newHotelName, newHotelRooms, newHotelPostcode)
      .then(() => res.send("Hotel created!"))
      .catch((e) => res.status(500).send(e.message));
  });
}

module.exports = {
  getHotels: getHotels,
  postHotel: postHotel,
};
