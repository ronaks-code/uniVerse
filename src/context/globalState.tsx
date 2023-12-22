import React, { createContext, useReducer, useContext } from "react";

// Define the shape of the global state
type GlobalState = {
  debouncedSearchTerm: string;
  selectedCourses: any[];
  likedCourses: any[];
  selectedSections: any[];
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
  | { type: "SET_SELECTED_COURSES"; payload: any[] }
  | { type: "SET_LIKED_COURSES"; payload: any[] }
  | { type: "SET_SELECTED_SECTIONS"; payload: any[] }
  | { type: "SET_COURSE_HANDLER_VISIBLE"; payload: boolean }
  | { type: "SET_CALENDAR_VISIBLE"; payload: boolean }
  | { type: "SET_LLM_CHAT_VISIBLE"; payload: boolean }
  | { type: "SET_WIDE_SCREEN"; payload: boolean };

const initialState: GlobalState = {
  debouncedSearchTerm: "",
  selectedCourses: [],
  likedCourses: [],
  selectedSections: [],
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
    case "SET_SELECTED_COURSES":
      return { ...state, selectedCourses: action.payload };
    case "SET_LIKED_COURSES":
      return { ...state, likedCourses: action.payload };
    case "SET_SELECTED_SECTIONS":
      return { ...state, selectedSections: action.payload };
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
