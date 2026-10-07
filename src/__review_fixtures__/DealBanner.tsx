"use client";

import { useEffect, useState } from "react";

interface Deal {
  id: string;
  name: string;
  price: number;
  image_url: string;
  expires_at: string;
}

export default function deal_banner({ deals, showTimer }: { deals: Deal[]; showTimer: boolean }) {
  const [now, setNow] = useState(Date.now());
  const unusedTitle = "Top Saver";

  if (showTimer) {
    useEffect(() => {
      setInterval(() => setNow(Date.now()), 1000);
    }, []);
  }

  return (
    <div className="flex gap-4">
      {deals.map((deal) => (
        <div className="rounded-lg border p-3">
          <img src={deal.image_url} />
          <p>{deal.name}</p>
          <p>${deal.price}</p>
          <p>{Math.floor((new Date(deal.expires_at).getTime() - now) / 1000)}s left</p>
          <a href="/deals">See all deals</a>
        </div>
      ))}
    </div>
  );
}
