import { useState, createContext } from "react";
import { FirebaseUser } from "../models/FirebaseUser";


// default value is null, should panic if this is broken
// maybe switch to local storage instead?
export const FirebaseContext = createContext<{user: FirebaseUser | null, setUser: any} | null>(null)
// hahahah