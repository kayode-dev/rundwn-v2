import { useMutation, useQuery } from "@tanstack/react-query";
import {
  checkTokenValidity,
  getAccessToken,
  redirectToAuthCodeFlow,
} from "../actions/auth";
import { storage } from "./storage";
import { useRouter } from "next/navigation";

export const useCheckAuth = () => {
  const { mutate } = useMutation({
    mutationKey: ["CHECK_AUTH"],
    mutationFn: redirectToAuthCodeFlow,
  });
  checkTokenValidity();
  const accessToken = storage.getItem("accessToken");
  const refreshToken = storage.getItem("refreshToken");
  if (!accessToken || !refreshToken) {
    mutate();
  }
};

export const useGetAccessToken = (code: string) => {
  const router = useRouter();
  const { isSuccess } = useQuery({
    queryKey: ["GET_ACCESS_TOKEN"],
    queryFn: () => getAccessToken(code),
  });
  if (isSuccess) router.replace("/app");
};
