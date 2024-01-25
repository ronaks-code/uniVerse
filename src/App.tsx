import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import Home from "./pages/Home/Home";
import Auth from "./pages/Auth/Auth";
import Profile from "./pages/Profile/Profile";
import Settings from "./pages/Settings/Settings";
import CourseService from "./services/CourseService";
// import CourseCard from "./components/CourseCard/CourseCard";
import JSONCourseDisplay from "./pages/CourseDisplay/JSONCourseDisplay";
import FirebaseCourseDisplay from "./pages/CourseDisplay/FirebaseCourseDisplay";
import ScheduleShare from "./pages/CourseDisplay/ScheduleShare";

import { auth } from "./services/firebase";
import { useAppDispatch } from "./hooks/storeHook";
import { login } from "./features/authSlice";
import AuthRoutes from "./components/HOC/AuthRoutes";
import SideBar from "./components/SideBar/Sidebar";
import TopNavigation from "./components/TopNavigation/TopNav";

// Import the StateProvider component
import { StateProvider } from "./context/globalState";

// Import the darkMode context
import { DarkModeProvider } from "./hooks/darkModeContext";

const App = () => {
  const dispatch = useAppDispatch();
  const [selected, setSelected] = useState<string>(
    localStorage.getItem("selectedSchedule") || "Primary"
  );

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user && user.email)
        dispatch(
          login({
            email: user.email,
            id: user.uid,
            photoUrl: user?.photoURL || null,
          })
        );
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <StateProvider>
      <DarkModeProvider>
        <TopNavigation selected={selected} setSelected={setSelected} />
        {/* <SideBar /> */}
        <Routes>
          <Route element={<AuthRoutes />}>
            <Route path="profile" element={<Profile />} />
          </Route>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="auth" element={<Auth />} />
          <Route path="settings" element={<Settings />} />
          {/* <Route path="firebase-courses" element={<FirebaseCourseDisplay />} /> */}
          <Route
            path="firebase-courses"
            element={<ScheduleShare selectedSchedule={selected} />}
          />
          {/* <Route path="JSON-courses" element={<JSONCourseDisplay />} /> */}
          <Route
            path="/"
            element={<JSONCourseDisplay selectedSchedule={selected} />}
          />
          <Route path="course-service" element={<CourseService />} />
        </Routes>
      </DarkModeProvider>
    </StateProvider>
  );
};

export default App;
