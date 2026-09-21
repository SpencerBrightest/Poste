"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPosts, createPost, updatePost, deletePost, schedulePost, publishPostImmediately } from "@/lib/actions/posts";

export function usePosts() {
  return useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const result = await getPosts();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.posts;
    },
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await createPost(formData);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.post;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await updatePost(formData);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.post;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (postId: string) => {
      const result = await deletePost(postId);
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

export function useSchedulePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await schedulePost(formData);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.scheduledPost;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function usePublishPostImmediately() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await publishPostImmediately(formData);
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
