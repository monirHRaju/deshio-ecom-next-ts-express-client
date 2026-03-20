"use client";

import api from "@/lib/axios";
import { Sparkles, Tag, Wand2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface Props {
  title: string;
  category: string;
  brand?: string;
  specs?: string[];
  onDescriptionGenerated: (description: string) => void;
  onTagsGenerated?: (tags: string[]) => void;
}

export default function AIDescriptionGenerator({
  title,
  category,
  brand,
  specs,
  onDescriptionGenerated,
  onTagsGenerated,
}: Props) {
  const [loadingDesc, setLoadingDesc] = useState(false);
  const [loadingTags, setLoadingTags] = useState(false);

  const canGenerate = title.trim().length > 2 && category.trim().length > 0;

  async function handleGenerateDescription() {
    if (!canGenerate) {
      toast.error("Enter a product title and category first");
      return;
    }
    setLoadingDesc(true);
    try {
      const res = await api.post<{
        success: boolean;
        data: { description: string };
      }>("/ai/generate-description", {
        title,
        category,
        brand: brand || undefined,
        specs: specs?.length ? specs : undefined,
      });
      onDescriptionGenerated(res.data.data.description);
      toast.success("Description generated!");
    } catch {
      toast.error("Failed to generate description");
    } finally {
      setLoadingDesc(false);
    }
  }

  async function handleGenerateTags() {
    if (!canGenerate) {
      toast.error("Enter a product title and category first");
      return;
    }
    if (!onTagsGenerated) return;
    setLoadingTags(true);
    try {
      const res = await api.post<{
        success: boolean;
        data: { tags: string[] };
      }>("/ai/generate-tags", { title, category });
      onTagsGenerated(res.data.data.tags);
      toast.success("Tags generated!");
    } catch {
      toast.error("Failed to generate tags");
    } finally {
      setLoadingTags(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={handleGenerateDescription}
        disabled={loadingDesc || !canGenerate}
        className="btn btn-sm btn-outline btn-primary gap-2"
      >
        {loadingDesc ? (
          <span className="loading loading-spinner loading-xs" />
        ) : (
          <Wand2 className="w-3.5 h-3.5" />
        )}
        AI Description
      </button>

      {onTagsGenerated && (
        <button
          type="button"
          onClick={handleGenerateTags}
          disabled={loadingTags || !canGenerate}
          className="btn btn-sm btn-outline btn-secondary gap-2"
        >
          {loadingTags ? (
            <span className="loading loading-spinner loading-xs" />
          ) : (
            <Tag className="w-3.5 h-3.5" />
          )}
          AI Tags
        </button>
      )}

      {!canGenerate && (
        <span className="flex items-center gap-1 text-xs text-base-content/40 self-center">
          <Sparkles className="w-3 h-3" />
          Fill title &amp; category to enable
        </span>
      )}
    </div>
  );
}
