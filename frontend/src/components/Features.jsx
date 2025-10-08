// src/components/Features.jsx
import React from "react"; // <-- needed for JSX

export default function Features() {
  const features = [
    {
      title: "Real-Time Music Sharing",
      description: "Play and share music with friends in the same room simultaneously.",
    },
    {
      title: "Custom Rooms",
      description: "Create private or public rooms for you and your friends to enjoy music together.",
    },
    {
      title: "Cross-Platform",
      description: "Join rooms from any device, anywhere, without any hassle.",
    },
  ];

  return (
    <section className="py-20 px-6 bg-[#f0f0f0] text-center">
      <h2 className="text-3xl font-bold mb-12">Features</h2>
      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg p-6 hover:scale-105 transition transform"
          >
            <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
