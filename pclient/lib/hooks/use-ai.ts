"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generateAIContent, transformContent, scoreContent } from "@/lib/actions/ai";

export function useGenerateAIContent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await generateAIContent(formData);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.content;
    },
  });
}

export function useTransformContent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await transformContent(formData);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.content;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useScoreContent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await scoreContent(formData);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.score;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
