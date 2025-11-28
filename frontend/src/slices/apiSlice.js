import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({ baseUrl: '' });

export const apiSlice = createApi({
    baseQuery,
    //has to do with caching
    tagTypes: ['User'],
    // eslint-disable-next-line no-unused-vars
    endpoints: (builder) => ({})
})