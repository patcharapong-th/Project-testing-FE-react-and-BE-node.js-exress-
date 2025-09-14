const asyncHandler = require("express-async-handler");
const { client } = require("../config/databasepg");

// @desc Get all Products
// @route GET /api/product
// @access public
const getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const offset = (page - 1) * limit;

  const search = req.query.search || "";
  const sortBy = req.query.sortBy || "id";
  const sortDir = req.query.sortDir === "desc" ? "DESC" : "ASC";

  const validSortFields = ["id", "name", "createdAt"];
  const sortField = validSortFields.includes(sortBy) ? sortBy : "id";

  const { rows } = await client.query(
    `
    SELECT * FROM "Product"
    WHERE name ILIKE $1
    ORDER BY "${sortField}" ${sortDir}
    LIMIT $2 OFFSET $3
    `,
    [`%${search}%`, limit, offset]
  );

  const { rows: totalRows } = await client.query(
    `SELECT COUNT(*) FROM "Product" WHERE name ILIKE $1`,
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
  getProducts,
};
