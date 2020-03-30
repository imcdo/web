
import * as subjectData from './subjects.json';

const Subjects: { [key: string]: string } = subjectData;
export { Subjects }

/**
 * @param {number} termCode Term code
 * @returns {string} Term string
 */
export function termString(termCode: number): string {
    let year = String(termCode).substring(0, 4)
    switch (parseInt(String(termCode).substring(4, 6))) {
        case 1: {
            return `Spring ${year}`
        }
        case 2: {
            return `Summer ${year}`
        }
        case 3: {
            return `Fall ${year}`
        }
        default: {
            return `${termCode}`
        }
    }
}

/**
 * Use like: `await sleep(1000)`
 * From: https://stackoverflow.com/a/39914235
 * @param {number} ms - milliseconds to sleep
 */
export async function sleep(ms: number): Promise<void> {
    return await new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generates string such as: "Mathematics, Biology"
 * for when describing an instructor
 */
export function subject_str(dict: object): string {
    let depts = Object.keys(dict)
    let str = ''
    for (let i = 0; i < depts.length; i++) {
        if (i > 0) str += ', ';

        // cast 
        str += Subjects[depts[i]];
    }
    return str ? str : 'Instructor';
}

/**
 * Generates string such as: "Robert Buzzanco has taught 7 History courses."
 * for when describing an instructor
 */
export function taughtSentence(fullName: string, departments: { [key: string]: number }): string {
    let depts = Object.keys(departments);
    let str = '';
    let taught = [];
    // generate list of department titles and the number of sections taught
    for (let i = 0; i < depts.length; i++) {
        taught.push({
            title: Subjects[depts[i]],
            num: departments[depts[i]]
        })
    }
    // sort the list
    taught.sort((a, b) => {
        // ascending
        return b.num - a.num;
    })
    for (let i = 0; i < taught.length; i++) {
        // write intro
        if (i === 0) {
            str += `${fullName} has taught `;
        }

        // if not first and list has 3 or more items
        if (i > 0 && taught.length > 2) {
            str += ', '
        }

        // edge case for 2 items: if end of list AND list is one item
        if (i === (taught.length - 1) && i === 1) {
            str += ' and '
        }
        else if (i === (taught.length - 1) && taught.length > 2) {
            str += 'and '
        }

        // always add thing
        str += `${taught[i].num} ${taught[i].title} course`
        // plural
        if (taught[i].num > 1) str += 's'

        // if end of list AND list is one item
        if (i === (taught.length - 1)) {
            str += '.'
        }
    }
    return str;
}
