import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import Home from "./pages/Home/Home";
import Auth from "./pages/Auth/Auth";
import Profile from "./pages/Profile/Profile";
import Settings from "./pages/Settings/Settings";
import CourseService from "./services/CourseService";
// import CourseCard from "./components/CourseCard/CourseCard";
import JSONCourseDisplay from "./pages/CourseDisplay/JSONCourseDisplay";
import FirebaseCourseDisplay from "./pages/CourseDisplay/FirebaseCourseDisplay";

import { auth } from "./services/firebase";
import { useAppDispatch } from "./hooks/storeHook";
import { login } from "./features/authSlice";
import AuthRoutes from "./components/HOC/AuthRoutes";

const App = () => {
  const dispatch = useAppDispatch();

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
    <Routes>
      <Route element={<AuthRoutes />}>
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="/" element={<Home />} />
      <Route path="auth" element={<Auth />} />
      <Route path="settings" element={<Settings />} />
      <Route path="firebase-courses" element={<FirebaseCourseDisplay />} />
      <Route path="JSON-courses" element={<JSONCourseDisplay />} />
      <Route path="course-service" element={<CourseService />} />
    </Routes>
  );
};

export default App;
