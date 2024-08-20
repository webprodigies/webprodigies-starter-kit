//this is our redux store
"use client"
import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { TypedUseSelectorHook, useSelector } from "react-redux"

const rootReducer = combineReducers({
    //add all your reducers here
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

//we export these type definitions
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

//this useAppSelector has type definitions added
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
