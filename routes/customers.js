const express = require("express");
const { Customer, validateCustomer } = require("../database/models/customer");
const asyncMiddleware = require("../middleware/async");

const router = express.Router();

// Give the customers sorted with their names to the request.
router.get(
    "/",
    // "asyncMiddleware" is for handling error
    asyncMiddleware(async (req, res) => {
        const customers = await Customer.find().sort("name");
        res.send(customers);
    })
);

// If the request use post method, register the user and save to database
router.post(
    "/",
    asyncMiddleware(async (req, res) => {
        // Check if the input data is fine
        const { error } = validateCustomer(req.body);
        // If the data is not valid, send status 400 and error message
        if (error) return res.status(400).send(error.details[0].message);

        let customer = new Customer({
            name: req.body.name,
            isGold: req.body.isGold,
            phone: req.body.phone,
        });
        customer = await customer.save();

        res.send(customer);
    })
);

// If the method is "put", get the customer object from the database and update it.
router.put(
    "/:id",
    asyncMiddleware(async (req, res) => {
        // Check if the request give the valid data
        const { error } = validateCustomer(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        // If the request is fine, get the customer specified by the request.
        const customer = await Customer.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                isGold: req.body.isGold,
                phone: req.body.phone,
            },
            { new: true } // what does this mean?
        );

        if (!customer)
            return res
                .status(404)
                .send("The customer with the given ID was not found.");

        res.send(customer);
    })
);

// If the request method is "delete", remove the customer in the database
router.delete(
    "/:id",
    asyncMiddleware(async (req, res) => {
        const customer = await Customer.findByIdAndRemove(req.params.id);

        if (!customer)
            return res
                .status(404)
                .send("The customer with the given ID was not found.");

        res.send(customer);
    })
);

// If the request method is "get", and the params of the request has id, get the information of the customer in the database and response to the request.
router.get(
    "/:id",
    asyncMiddleware(async (req, res) => {
        const customer = await Customer.findById(req.params.id);

        if (!customer)
            return res
                .status(404)
                .send("The customer with the given ID was not found");

        res.send(customer);
    })
);

module.exports = router;
