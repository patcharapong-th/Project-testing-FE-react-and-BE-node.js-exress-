const express = require("express");
const { getOrders } = require("../controllers/orderController");
const router = express.Router();

router.route("/").get(getOrders);

module.exports = router;
