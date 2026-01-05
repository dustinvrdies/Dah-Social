import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

interface DummyJsonProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

interface DummyJsonResponse {
  products: DummyJsonProduct[];
  total: number;
  skip: number;
  limit: number;
}

let productsCache: DummyJsonProduct[] | null = null;
let cacheTime = 0;
const CACHE_TTL = 1000 * 60 * 30;

async function fetchProducts(): Promise<DummyJsonProduct[]> {
  const now = Date.now();
  if (productsCache && now - cacheTime < CACHE_TTL) {
    return productsCache;
  }

  const response = await fetch("https://dummyjson.com/products?limit=100");
  if (!response.ok) {
    throw new Error("Failed to fetch products from DummyJSON");
  }
  const data: DummyJsonResponse = await response.json();
  productsCache = data.products;
  cacheTime = now;
  return productsCache;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/dropship/products", async (req, res) => {
    try {
      const products = await fetchProducts();
      const category = req.query.category as string | undefined;
      const search = req.query.search as string | undefined;
      const limit = parseInt(req.query.limit as string) || 50;
      const skip = parseInt(req.query.skip as string) || 0;

      let filtered = products;

      if (category) {
        filtered = filtered.filter(p => 
          p.category.toLowerCase().replace(/[^a-z0-9]/g, "-") === category.toLowerCase()
        );
      }

      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(p =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
        );
      }

      const paginated = filtered.slice(skip, skip + limit);

      res.json({
        products: paginated,
        total: filtered.length,
        skip,
        limit
      });
    } catch (error) {
      console.error("Error fetching dropship products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/dropship/categories", async (_req, res) => {
    try {
      const products = await fetchProducts();
      const categories = Array.from(new Set(products.map(p => p.category)));
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get("/api/dropship/products/:id", async (req, res) => {
    try {
      const products = await fetchProducts();
      const id = parseInt(req.params.id);
      const product = products.find(p => p.id === id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  return httpServer;
}
