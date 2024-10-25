import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  Suspense,
  lazy,
} from "react";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../../services/firebase";

import { Course } from "../../components/CourseDisplay/CourseUI/CourseTypes";

import { coursePrefixSet } from "../../services/CourseService";

// Access the coursePrefixSet variable here
console.log(coursePrefixSet);

const CourseCard = lazy(
  () => import("../../components/CourseDisplay/CourseUI/CourseCard")
);

const oneUFCourseDisplay: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const debounceRef = useRef<NodeJS.Timeout>(); // Store the timeout reference
  const [courses, setCourses] = useState<Course[]>([]);
  const [isSubmitClicked, setIsSubmitClicked] = useState(false);

  useEffect(() => {
    if (isSubmitClicked) {
      fetchData(searchTerm);
    }
  }, [isSubmitClicked]);

  const fetchData = async (searchTerm: string) => {
    try {
      const universityDocRef = doc(
        collection(firestore, "courses"),
        "UniversityOfFlorida"
      );
      const nestedCollectionRef = collection(universityDocRef, "2023-Summer");

      const searchTermUpperCase = searchTerm.toUpperCase();
      const searchTermLowerCase = searchTerm.toLowerCase();

      const querySnapshot = await getDocs(
        query(
          nestedCollectionRef,
          where("code", "array-contains-any", [
            searchTermUpperCase,
            searchTermLowerCase,
          ])
        )
      );

      const fetchedCourses: Course[] = [];
      querySnapshot.forEach((doc) => {
        console.log(doc.data());
        fetchedCourses.push(doc.data() as Course);
      });

      setCourses(fetchedCourses);
    } catch (error) {
      console.error("Error fetching data from Firestore: ", error);
    }

    setIsSubmitClicked(false);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    // Debounce search input
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setDebouncedSearchTerm(value);
    }, 300); // 300ms delay
  };

  const handleFormSubmit = () => {
    setIsSubmitClicked(true);
  };

  const filteredCourses = useMemo(() => {
    const formattedSearchTerm = debouncedSearchTerm.toUpperCase();
    return courses.filter((course: Course) => {
      const { code } = course;
      return (
        code[0].toUpperCase().includes(formattedSearchTerm) ||
        code[1].toUpperCase().includes(formattedSearchTerm)
      );
    });
  }, [debouncedSearchTerm, courses]);

  return (
    <>
      <div className="flex flex-col items-start content-start h-[100vh] ml-[4.75rem] p-4">
        <input
          type="text"
          placeholder="Search by course code..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button onClick={handleFormSubmit}>Submit</button>
        <Suspense fallback={<div>Loading...</div>}>
          {filteredCourses.map((course: Course, index: number) => (
            <CourseCard key={index} course={course} />
          ))}
        </Suspense>
      </div>
    </>
  );
};

export default oneUFCourseDisplay;
