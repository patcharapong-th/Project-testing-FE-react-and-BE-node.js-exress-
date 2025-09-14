const asyncHandler = require("express-async-handler");
const { client } = require("../config/databasepg");

// @desc Get all Orders
// @route GET /api/orders
// @access public
const getOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const offset = (page - 1) * limit;

  const search = req.query.search || "";
  const sortBy = req.query.sortBy || "createdAt";
  const sortDir = req.query.sortDir === "desc" ? "DESC" : "ASC";

  // whitelist mapping
  const sortColumns = {
    userName: "u.name",
    userEmail: "u.email",
    productName: "p.name",
    productPrice: "p.price",
    amount: "o.amount",
    createdAt: 'o."createdAt"',
  };

  const orderBy = sortColumns[sortBy] || 'o."createdAt"';

  const { rows } = await client.query(
    `
    SELECT o.id, o.amount, o."createdAt",
           u.name AS "userName", u.email AS "userEmail",
           p.name AS "productName", p.price AS "productPrice"
    FROM "Order" o
    JOIN "User" u ON o."userId" = u.id
    JOIN "Product" p ON o."productId" = p.id
    WHERE u.name ILIKE $1 OR u.email ILIKE $1 OR p.name ILIKE $1
    ORDER BY ${orderBy} ${sortDir}
    LIMIT $2 OFFSET $3
    `,
    [`%${search}%`, limit, offset]
  );

  const { rows: totalRows } = await client.query(
    `
    SELECT COUNT(*) 
    FROM "Order" o
    JOIN "User" u ON o."userId" = u.id
    JOIN "Product" p ON o."productId" = p.id
    WHERE u.name ILIKE $1 OR u.email ILIKE $1 OR p.name ILIKE $1
    `,
    [`%${search}%`]
  );

  res.json({
    data: rows,
    page,
    totalPages: Math.ceil(totalRows[0].count / limit),
    totalItems: parseInt(totalRows[0].count),
  });
});

module.exports = {
  getOrders,
};
