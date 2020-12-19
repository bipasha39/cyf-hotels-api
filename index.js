const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());


const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cyf_hotels',
    password: 'migracode',
    port: 5432
});

//:::::::::::::GET:::::::::::::::://

app.get("/hotels", function(req, res) {
    pool.query('SELECT * FROM hotels', (error, result) => {
        res.json(result.rows);
    });
});

//Exercise 2//

app.get("/hotels/:hotelId", function (req, res) {
  const hotelId = req.params.hotelId;

  pool
    .query("SELECT * FROM hotels WHERE id=$1", [hotelId])
    .then((result) => res.json(result.rows))
    .catch((e) => console.error(e));
});


app.get("/customers", function (req, res) {
  pool.query("SELECT * FROM customers;", (error, result) => {
    res.json(result.rows);
  });
});
app.get("/customers/:customerId", function (req, res) {
  const customerId = req.params.customerId;
  pool
    .query("SELECT * FROM customers WHERE id=$1;", [customerId])
    .then((result) => res.json(result.rows))
    .catch((e) => res.status(500).send("Something went wrong"));
});

app.get("/customers/:customerId/bookings", function (req, res) {
  const customerId = req.params.customerId;
  pool
    .query(
      `
      SELECT checkin_date, nights, hotels.name AS hotel_name, hotels.postcode AS hotel_postcode
      FROM bookings
      JOIN hotels ON bookings.hotel_id = hotels.id
      WHERE customer_id=$1;
    `,
      [customerId]
    )
    .then((result) => res.json(result.rows))
    .catch((e) => res.status(500).send("Something went wrong"));
});


//..............POST;;;;;;;//

app.post("/hotels", function (req, res) {
  const newHotelName = req.body.name;
  const newHotelRooms = req.body.rooms;
  const newHotelPostcode = req.body.postcode;
  if (!Number.isInteger(newHotelRooms) || newHotelRooms <= 0) {
    return res
      .status(400)
      .send("The number of rooms should be a positive integer.");
  }
  pool
    .query("SELECT * FROM hotels WHERE name=$1;", [newHotelName])
    .then((result) => {
      if (result.rows.length > 0) {
        return res
          .status(400)
          .send("A hotel with the same name already exists!");
      }
      pool
        .query(
          "INSERT INTO hotels (name, rooms, postcode) VALUES ($1, $2, $3);",
          [newHotelName, newHotelRooms, newHotelPostcode]
        )
        .then(() => res.send("Hotel created!"))
        .catch((e) => res.status(500).send("Something went wrong"));
    });
});

///////////////POST CUSTOMERS Exercie 1///////////

app.post("/customers", function (req, res) {
  const newCustomerName = req.body.name;
  const newCustomerEmail = req.body.email;
  const newCustomerAddress= req.body.address;
  const newCustomerCity = req.body.city;
  const newCustomerPostcode = req.body.postcode;
  const newCustomerCountry = req.body.country;
  
  pool
    .query("SELECT * FROM customers WHERE name=$1;", [newCustomerName])
    .then((result) => {
      if (result.rows.length > 0) {
        return res
          .status(400)
          .send("A customer with the same name already exists!");
      }
      pool
        .query(
          "INSERT INTO customers (name, email, address,city, postcode,country) VALUES ($1, $2, $3, $4, $5, $6);",
          [newCustomerName, newCustomerEmail, newCustomerAddress,newCustomerCity, newCustomerPostcode, newCustomerCountry]
        )
        .then(() => res.send("Customer created!"))
        .catch((e) => res.status(500).send("Something went wrong"));
    });
});

//EXERCISE 3 (PUT)//

app.put("/customers/:customerId", function (req, res) {
  const customerId = req.params.customerId;
  const newEmail = req.body.email;
 
  if (newEmail==="") {
    return res
      .status(400)
      .send("please provide email");
  }
  pool
    .query("UPDATE customers SET email=$1 where id=$2",[newEmail, customerId])
    .then(() => res.send(`Customer ${customerId} updated!`))
    .catch(e => {
      console.error(e.stack);
      res.status(500).send("something went wrong");
      } );
});

app.patch("/customers/:customerId", function (req, res) {
  const customerId = req.params.customerId;
  const newEmail = req.body.email;
  const newAddress = req.body.address;
  const newCity = req.body.city;
  const newPostcode = req.body.postcode;
  const newCountry = req.body.country;
  pool
    .query("SELECT * FROM customers WHERE id=$1;", [customerId])
    .then((result) => {
      const customers = result.rows;
      const customer = customers[0];
      if (newEmail !== "" && newEmail !== undefined) {
        customer.email = newEmail;
      }
      if (newAddress !== "" && newAddress !== undefined) {
        customer.address = newAddress;
      }
      if (newCity !== "" && newCity !== undefined) {
        customer.city = newCity;
      }
      if (newPostcode !== "" && newPostcode !== undefined) {
        customer.postcode = newPostcode;
      }
      if (newCountry !== "" && newCountry !== undefined) {
        customer.country = newCountry;
      }
      pool
        .query(
          `
          UPDATE customers
          SET email=$1, address=$2, city=$3, postcode=$4, country=$5
          WHERE id=$6;
          `,
          [
            customer.email,
            customer.address,
            customer.city,
            customer.postcode,
            customer.country,
            customer.id,
          ]
        )
        .then(() => res.send(`Customer ${customerId} updated!`))
        .catch((e) => {
          console.error(e.stack);
          res.status(500).send("Internal Server Error");
        });
    });
});





//Exercise 4 (delete)//

app.delete("/customers/:customerId", function (req, res) {
  const customerId = req.params.customerId;
  pool
    .query("DELETE FROM bookings WHERE customer_id=$1;", [customerId])
    .then(() => {
      pool
        .query("DELETE FROM customers WHERE id=$1;", [customerId])
        .then(() => res.send(`Customer ${customerId} and their bookings deleted!`))
        .catch((e) => console.error(e));
    })
    .catch((e) => console.error(e));
});

app.delete("/hotels/:hotelId", function (req, res) {
  const hotelId = req.params.hotelId;

  pool
    .query(“Delete * FROM bookings WHERE hotel_id=$1;“, [hotelId])
    .then((result) => {
      if(result.rows.length > 0){
        return res.status(400).send(“This hotel still has bookings”)
      }
      pool
        .query(“DELETE FROM hotels WHERE id=$1;“, [hotelId])
        .then(() => res.send(`Hotel ${hotelId} deleted!`))
        .catch((e) => console.error(e));
    })
    .catch((e) => console.error(e));
});

app.listen(3000, function() {
  console.log("Server is listening on port 3000. Ready to accept requests!");
});

////... for creating new git repository  first thing is git init, git add.,git commit,url print,git push master not main/////