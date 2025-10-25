// src/components/Tags.jsx
import React, { useState } from "react";
import { Plus, X } from "lucide-react";

const COLORS = [
  "#6366F1", // indigo
  "#10B981", // green
  "#F59E0B", // amber
  "#EC4899", // pink
  "#3B82F6", // blue
  "#8B5CF6", // violet
  "#F43F5E", // rose
];

function Tags({ initialTags = [], onChange }) {
  const [tags, setTags] = useState(initialTags);
  const [newTag, setNewTag] = useState("");

  const handleAddTag = () => {
    const trimmed = newTag.trim();
    if (!trimmed) return;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const updated = [...tags, { name: trimmed, color }];
    setTags(updated);
    onChange(updated);
    setNewTag("");
  };

  const handleRemoveTag = (tagName) => {
    const updated = tags.filter((t) => t.name !== tagName);
    setTags(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      {/* Existing Tags */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="flex items-center px-3 py-1 text-sm font-medium rounded-full shadow-sm"
            style={{ backgroundColor: `${tag.color}22`, color: tag.color }}
          >
            {tag.name}
            <button
              type="button"
              onClick={() => handleRemoveTag(tag.name)}
              className="ml-2 focus:outline-none"
            >
              <X className="w-3 h-3 opacity-70 hover:opacity-100" />
            </button>
          </span>
        ))}
      </div>

      {/* Add Tag Input */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Add a tag (e.g. Education)"
          className="flex-1 px-3 py-2 border rounded-lg text-sm dark:bg-purple-900 dark:border-purple-700"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
        />
        <button
          type="button"
          onClick={handleAddTag}
          className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default Tags;
