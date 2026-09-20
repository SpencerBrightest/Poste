"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadMedia, deleteMedia } from "@/lib/actions/media";

export function useUploadMedia() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await uploadMedia(formData);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.media;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useDeleteMedia() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (mediaId: string) => {
      const result = await deleteMedia(mediaId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
