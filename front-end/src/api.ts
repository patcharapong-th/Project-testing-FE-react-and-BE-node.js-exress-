import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

// generic fetch function
async function fetchPaginated<T>(
  endpoint: string,
  page = 1,
  limit = 10,
  search = "",
  sortBy = "",
  sortDir: "asc" | "desc" = "asc",
): Promise<PaginatedResponse<T>> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) params.append("search", search);
  if (sortBy) params.append("sortBy", sortBy);
  if (sortDir) params.append("sortDir", sortDir);

  const res = await axios.get(`${API_BASE}/${endpoint}?${params.toString()}`);
  return res.data;
}

export const fetchUsers = (
  page = 1,
  limit = 10,
  search = "",
  sortBy = "",
  sortDir: "asc" | "desc" = "asc",
) => fetchPaginated<User>("user", page, limit, search, sortBy, sortDir);

export const fetchProducts = (
  page = 1,
  limit = 10,
  search = "",
  sortBy = "",
  sortDir: "asc" | "desc" = "asc",
) => fetchPaginated<Product>("product", page, limit, search, sortBy, sortDir);

export const fetchOrders = (
  page = 1,
  limit = 10,
  search = "",
  sortBy = "",
  sortDir: "asc" | "desc" = "asc",
) => fetchPaginated<Order>("order", page, limit, search, sortBy, sortDir);

// ---------- Interfaces ----------
export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
}

export interface Order {
  id: number;
  amount: number;
  createdAt: string;
  userName: string;
  userEmail: string;
  productName: string;
  productPrice: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  totalPages: number;
  totalItems: number;
}
