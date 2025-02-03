import { createApi } from "@reduxjs/toolkit/query/react";
import { publicBaseQuery, UserResponse } from "./api";

export const apiAuth = createApi({
  reducerPath: "apiAuth",
  baseQuery: publicBaseQuery,
  endpoints: (builder) => ({
    // Auth APIs
    signUp: builder.mutation<UserResponse, { name: string, email: string; password: string, role: string }>({
      query: (data) => ({
        url: 'users/',
        method: 'POST',
        body: data,
      }),
    }),
    login: builder.mutation<UserResponse, { email: string; password: string }>({
      query: (data) => ({
        url: 'users/login',
        method: 'POST',
        body: data,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: 'users/forgot-password',
        method: 'POST',
        body: data,
      })
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: 'users/reset-password',
        method: 'POST',
        body: data
      })
    }),
  }),
});

export const { 
  // Auth
  useSignUpMutation, useLoginMutation, useForgotPasswordMutation, useResetPasswordMutation,
 } = apiAuth;
