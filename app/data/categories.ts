export async function fetchAllCategories(): Promise<unknown[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_COINGECKO_CATEGORIES_API as string}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!response.ok) {
      throw new Error("Failed to fetch categories data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    // Return fallback data when API fails
    return [
      { name: "DeFi" },
      { name: "NFT" },
      { name: "Metaverse" }
    ];
  }
}
