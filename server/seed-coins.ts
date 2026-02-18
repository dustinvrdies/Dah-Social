// Seed script: creates DAH Coin packages as Stripe products
// Run: npx tsx server/seed-coins.ts
import { getUncachableStripeClient } from './stripeClient';

const COIN_PACKAGES = [
  { name: "100 DAH Coins", coins: 100, priceCents: 99, description: "Starter pack" },
  { name: "500 DAH Coins", coins: 500, priceCents: 399, description: "Popular choice" },
  { name: "1,200 DAH Coins", coins: 1200, priceCents: 799, description: "Best value" },
  { name: "5,000 DAH Coins", coins: 5000, priceCents: 2499, description: "Mega pack" },
];

async function seed() {
  const stripe = await getUncachableStripeClient();

  for (const pkg of COIN_PACKAGES) {
    const existing = await stripe.products.search({ query: `name:'${pkg.name}'` });
    if (existing.data.length > 0) {
      console.log(`Skipping "${pkg.name}" — already exists (${existing.data[0].id})`);
      continue;
    }

    const product = await stripe.products.create({
      name: pkg.name,
      description: pkg.description,
      metadata: {
        type: "dah_coins",
        coins: String(pkg.coins),
      },
    });

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: pkg.priceCents,
      currency: "usd",
    });

    console.log(`Created: ${pkg.name} => product ${product.id}, price ${price.id}`);
  }

  console.log("Done seeding DAH Coin packages.");
}

seed().catch(console.error);
