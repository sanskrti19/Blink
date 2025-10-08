// src/components/Features.jsx
import React from "react";

export default function Features() {
  const features = [
    {
      title: "Clean, Hierarchical Organization",
      description: "Ditch the chaotic browser folders. Organize links with infinite nested pages, just like in Notion.",
      icon: "🗂️", // Folder Icon
    },
    {
      title: "Powerful Tagging & Search",
      description: "Instantly find any link with custom tags and a lightning-fast, full-text search engine.",
      icon: "🔍", // Search Icon
    },
    {
      title: "One-Click Capture",
      description: "Quickly save any webpage with our Chrome extension, capturing titles and thumbnails automatically.",
      icon: "🔗", // Link/Capture Icon
    },
  ];

  return (
    // Updated background for better separation from the Hero section
    <section id="features" className="py-24 px-6 bg-white border-t border-gray-100 text-center">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
          The Bookmark Manager You Deserve
        </h2>
        <p className="text-xl text-gray-500 mb-16">
          BLINKS takes your links out of the browser and into a beautiful workspace.
        </p>

        <div className="grid md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              // Card style updated for a cleaner, modern look
              className="bg-gray-50 rounded-xl border border-gray-100 p-8 text-left transition transform hover:shadow-lg hover:border-indigo-200"
            >
              {/* Icon Placeholder */}
              <div className="text-4xl mb-4">
                {feature.icon}
              </div>
              
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}