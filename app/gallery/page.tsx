"use client";

import { Loader } from "@/components/ui/loader";
import { usePrivy } from "@privy-io/react-auth";
import React, { useEffect, useState } from "react";

interface IGalleryItem {
  type: "image" | "video";
  url: string;
  error?: string;
}

const GalleryPage: React.FC = () => {
  const { user } = usePrivy();
  const [items, setItems] = useState<IGalleryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      setLoading(true);
      fetch(`/api/gallery/${user.id}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("data", data);
          if (data.message) {
            console.log("data.message", data.message);
            // Handle the case where there are no visuals
            setItems([]); // or set a state to show a specific message
          } else {
            setItems(data);
          }
        })
        .catch((error) => console.error("Error fetching data:", error))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (!user) {
    return <div>Please log in to view your gallery.</div>;
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Loader />
        Loading assets...
      </div>
    );
  }

  //@ts-ignore
  if (items.length === 0 || items.error) {
    return <div>Your gallery is empty. Go create some content!</div>;
  }

  return (
    <div>
      <h2 className="mb-6 text-center text-2xl font-bold">Images</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {items
          .filter((item) => item.type === "image")
          .map((item, index) => (
            <img
              key={index}
              className="rounded-lg"
              width={400}
              height={400}
              src={item.url}
              alt={`Gallery item ${index}`}
            />
          ))}
      </div>

      <div className="mb-12"></div>

      <h2 className="mb-6 text-center text-2xl font-bold">Videos</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {items
          .filter((item) => item.type === "video")
          .map((item, index) => (
            <video
              key={index}
              width={400}
              controls
              src={item.url}
              className="rounded-lg"
            >
              Your browser does not support the video tag.
            </video>
          ))}
      </div>
    </div>
  );
};

export default GalleryPage;
