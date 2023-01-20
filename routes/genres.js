const { Genre, validateGenre } = require("../database/models/genre");
const express = require("express");
const router = express.Router();

// If the request method is "get" without given id, return all the genres.
router.get("/", (req, res) => {
    res.send(genres);
});

// If the request method is "post", add the new genre give by the request.
router.post("/", (req, res) => {
    // Validate the input data before storing to the database.
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = {
        id: genres.length + 1,
        name: req.body.name,
    };
    genres.push(genre);
    res.send(genre);
});

// If the request method is "put", check if the specified genre is in the database and update it.
router.put("/:id", (req, res) => {
    const genre = genres.find((c) => c.id === parseInt(req.params.id));
    if (!genre)
        return res
            .status(404)
            .send("The genre with the given ID was not found.");

    // Check if the given input data is valid.
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    genre.name = req.body.name;
    res.send(genre);
});

// If the request method is "delete", delete the specified genre.
router.delete("/:id", (req, res) => {
    // Search if the genre is exist.
    const genre = genres.find((c) => c.id === parseInt(req.params.id));
    if (!genre)
        return res
            .status(404)
            .send("The genre with the given ID was not found.");

    // sort the genres get by the id
    const index = genres.indexOf(genre);
    // delete the first one
    genres.splice(index, 1);

    // send the genre information we deleted.
    res.send(genre);
});

// If the request method is "get" with a specified id, get that genre and response to the request.
router.get("/:id", (req, res) => {
    const genre = genres.find((c) => c.id === parseInt(req.params.id));
    if (!genre)
        return res
            .status(404)
            .send("The genre with the given ID was not found.");
    res.send(genre);
});

module.exports = router;
