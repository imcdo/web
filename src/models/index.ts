import { firestore } from 'firebase'
import { GPA, Average, StandardDeviation, MaxMinRange } from './statistics'

export interface Course {
    GPA: GPA
    catalogNumber: string
    department: string
    description: string
    sectionCount: number
    instructors: firestore.DocumentReference[]
    sections: firestore.DocumentReference[]
}

export interface Section {
    A: number
    B: number
    C: number
    D: number
    F: number
    Q: number
    course: firestore.DocumentReference
    courseName: string
    sectionNumber: number
    semesterGPA: number
    term: number
    termString: string
    instructorNames: ShallowInstructor[]
    instructors: firestore.DocumentReference[]
}

export interface Instructor {
    GPA: GPA
    departments: Departments
    firstName: string
    lastName: string
    fullName: string
    keywords: string[]
    courses: firestore.DocumentReference[]
    courses_count: number
    sections: firestore.DocumentReference[]
    sections_count: number
}

export type Departments = { [key: string]: number }

export interface ShallowInstructor {
    firstName: string
    lastName: string
}


export { GPA, Average, StandardDeviation, MaxMinRange }