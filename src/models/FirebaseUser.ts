export type FirebaseUser = {
    email: string,
    schedules: {
        [name: string]: {
            likedCoursed: number[],
            selectedCourses: number[],
            selectedSections: number[]
        }
    },
    signInMethod: string,
    darkTheme: boolean,
    selectedSchedule: string
}