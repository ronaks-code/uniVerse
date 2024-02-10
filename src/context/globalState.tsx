import React, { createContext, useReducer, useContext } from "react";

// Define the shape of the global state
type GlobalState = {
  debouncedSearchTerm: string;
  darkMode: boolean;
  courseHandlerVisible: boolean;
  calendarVisible: boolean;
  LLMChatVisible: boolean;
  isWideScreen: boolean;
  user?: any;
  selected?: string;
};

// Define actions to modify the state
type Action = 
  | { type: "SET_DEBOUNCED_SEARCH_TERM"; payload: string }
  | { type: "SET_COURSE_HANDLER_VISIBLE"; payload: boolean }
  | { type: "SET_CALENDAR_VISIBLE"; payload: boolean }
  | { type: "SET_LLM_CHAT_VISIBLE"; payload: boolean }
  | { type: "SET_WIDE_SCREEN"; payload: boolean };

const initialState: GlobalState = {
  debouncedSearchTerm: "",
  darkMode: true,
  courseHandlerVisible: true,
  calendarVisible: true,
  LLMChatVisible: false,
  isWideScreen: false,
  user: null,
  selected: "Primary",
};

const StateContext = createContext<[GlobalState, React.Dispatch<Action>]>([initialState, () => {}]);

const reducer = (state: GlobalState, action: Action): GlobalState => {
  switch (action.type) {
    case "SET_DEBOUNCED_SEARCH_TERM":
      return { ...state, debouncedSearchTerm: action.payload };
    default:
      return state;
  }
};

interface StateProviderProps {
  children: React.ReactNode;
}

export const StateProvider: React.FC<StateProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={[state, dispatch]}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateValue = () => useContext(StateContext);
