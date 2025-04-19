"use client";

import { useParams } from "next/navigation";

export default function CityPage() {
  const params = useParams();
  const cityName = params.cityName as string;

  // Fetch city data here (from API, DB, etc.) based on cityName

  return (
    <div>
      <h1>City: {cityName}</h1>
      {/* Render city-specific content here */}
    </div>
  );
}