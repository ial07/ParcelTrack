"use client";

import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import { LoginFormData, User } from "@/types/auth";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("auth_user");
    const token = localStorage.getItem("auth_token");
    if (stored && token) {
      setUser(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormData) => authService.login(data),
    onSuccess: (response) => {
      const { user, token } = response.data;
      localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_user", JSON.stringify(user));
      setUser(user);
      router.push("/admin/dashboard");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      setUser(null);
      router.push("/admin/login");
    },
  });

  const isAuthenticated = useCallback(() => {
    return !!localStorage.getItem("auth_token");
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated,
    login: loginMutation,
    logout: logoutMutation,
  };
}
