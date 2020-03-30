
import firebase from './firebase'
import { Course, Instructor, Section } from "../models";

export interface CourseComputed extends Course {
    _lastTaught?: number
    _profGPA?: number
}

export interface SectionComputed extends Section {
    _course?: string
    _department?: string
    _catalogNumber?: string
    _sectionCount?: number
    '_GPA.average'?: number
    _profGPA?: number
}

export interface IndividualData {
    instructor: Instructor
    courses: CourseComputed[]
    sections: SectionComputed[]
}

export async function getIndividualData(fullName: string): Promise<IndividualData> {
    if (fullName === 'None') throw new Error('Instructor not found')

    console.time(`Fetch data ${fullName}`);

    const db = firebase.firestore();
    let querySnapshot = await db.collection('instructors').where('fullName', '==', fullName).get()
    if (querySnapshot.docs.length > 0) {
        let doc: Instructor = querySnapshot.docs[0].data() as Instructor;

        let crs: CourseComputed[] = [];
        let sctn: SectionComputed[] = [];

        // wait for all Promises to complete simultaneously
        crs = (await Promise.all(doc.courses.map(ref => ref.get())))
            // extract data from firestore snapshot
            .map(item => item.data()) as CourseComputed[]

        let psums: { [key: string]: number } = {};
        let pnums: { [key: string]: number } = {};

        // wait for all Promises to complete simultaneously
        sctn = (await Promise.all(doc.sections.map(ref => ref.get())))
            // extract data from firestore snapshot
            .map(item => item.data()) as SectionComputed[]

        // forEach so that modifications can be made
        sctn.forEach((d, i) => {
            d['_course'] = d.course.id
            d['_department'] = d['_course'].split(' ')[0]
            d['_catalogNumber'] = d['_course'].split(' ')[1]

            // Prof GPA calculation
            if (psums[d['_course']] === undefined) psums[d['_course']] = 0;
            if (pnums[d['_course']] === undefined) pnums[d['_course']] = 0;
            // sum semesterGPA for all of a course
            psums[d['_course']] += d.semesterGPA
            // keep count of how many sections of a course
            pnums[d['_course']] += 1;

            // retrieve sectionCount and UH GPA from `crs` (this.state.courses) 
            for (let j of crs) {
                if (j.department === d['_department'] && j.catalogNumber === d['_catalogNumber']) {
                    d['_sectionCount'] = j.sectionCount;
                    d['_GPA.average'] = j.GPA.average;
                    break;
                }
            }
            // Save new changes
            sctn[i] = d;
        })

        // Use computed psums and pnums for Prof GPA calculation
        for (let i = 0; i < sctn.length; i++) {
            // prevent division by 0
            if (pnums[sctn[i]['_course'] || -1] > 0) {
                // mean formula: sum / n
                sctn[i]['_profGPA'] = psums[sctn[i]['_course'] || -1] / pnums[sctn[i]['_course'] || -1];
                // populate `crs` with profGPA (this.state.courses)
                for (let j = 0; j < crs.length; j++) {
                    if (crs[j].department === sctn[i]['_department'] && crs[j].catalogNumber === sctn[i]['_catalogNumber'] && typeof crs[j].GPA.average === 'number') {
                        crs[j]['_profGPA'] = sctn[i]['_profGPA'];
                    }
                }
            }
        }
        for (let i = 0; i < crs.length; i++) {
            let t = 0;
            for (let j = 0; j < sctn.length; j++) {
                if (crs[i].department === sctn[j]['_department'] && crs[i].catalogNumber === sctn[j]['_catalogNumber']) {
                    t = Math.max(t, sctn[j].term);
                }
            }
            crs[i]['_lastTaught'] = t;
        }

        sctn = sctn.sort((a, b) => {
            // descending a - b
            // ascending b - a
            // TODO: sort by course then date
            return b.term - a.term
        })
        console.timeEnd(`Fetch data ${fullName}`);
        return {
            instructor: doc,
            courses: [...crs],
            sections: [...sctn]
        } as IndividualData
    }
    else {
        throw new Error('Instructor not found!')
    }
}
