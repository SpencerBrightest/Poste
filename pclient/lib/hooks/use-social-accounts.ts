"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSocialAccounts, connectSocialAccount, disconnectSocialAccount } from "@/lib/actions/social-accounts";

export function useSocialAccounts() {
  return useQuery({
    queryKey: ["social-accounts"],
    queryFn: async () => {
      const result = await getSocialAccounts();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.accounts;
    },
  });
}

export function useConnectSocialAccount() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await connectSocialAccount(formData);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-accounts"] });
    },
  });
}

export function useDisconnectSocialAccount() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await disconnectSocialAccount(formData);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-accounts"] });
    },
  });
}
