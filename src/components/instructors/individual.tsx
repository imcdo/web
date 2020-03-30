
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button, Container, Spinner, Tabs, Tab, Table } from 'react-bootstrap';
import { ArrowBack } from '@material-ui/icons';

import { util, InstructorProvider } from '../../providers'
import { Instructor } from '../../models';

import './individual.scss'

export const IndividualInstructor: React.FC = () => {
    const [instructor, setInstructor] = useState<Instructor | null>(null)
    const [courses, setCourses] = useState<InstructorProvider.CourseComputed[]>([])
    const [sections, setSections] = useState<InstructorProvider.SectionComputed[]>([])
    const [loading, setLoading] = useState(true)

    const { fullName } = useParams()

    async function updateIndividual() {
        try {
            let data = await InstructorProvider.getIndividualData(fullName || 'None')
            console.log(data)
            setInstructor(data.instructor)
            setCourses(data.courses)
            setSections(data.sections)
            setLoading(false)
        }
        catch (err) {
            setLoading(false)
        }
    }

    // instructor data
    useEffect(() => {
        updateIndividual()
    }, [])

    return (
        <Container>
            <div className="individual-instructor">
                <p className="back-to-search">
                    <Button as={Link} to="/instructors"><ArrowBack /><span>Go Back</span></Button>
                </p>
                <h3>{fullName}</h3>
                {instructor ?
                    <div>
                        <h5>{util.subject_str(instructor.departments)}</h5>

                        {loading ? <Spinner animation="border" role="status"><span className="sr-only">Loading...</span></Spinner> : <></>}

                        <Tabs id="tabs" defaultActiveKey="stats">
                            <Tab className="tab-stats" eventKey="stats" title="Statistics">
                                <ul className="list-unstyled">
                                    <li>First name: <code>{instructor.firstName}</code></li>
                                    <li>Last name: <code>{instructor.lastName}</code></li>
                                    <li>Number of unique courses taught: <code>{instructor.courses_count}</code></li>
                                    <li>Number of unique sections taught: <code>{instructor.sections_count}</code></li>
                                    <li>{util.taughtSentence(instructor.fullName, instructor.departments)}</li>
                                    <hr />
                                    <li>GPA minimum: <code>{instructor.GPA.minimum}</code></li>
                                    <li>GPA average: <code>{instructor.GPA.average}</code></li>
                                    <li>GPA maximum: <code>{instructor.GPA.maximum}</code></li>
                                    <li>GPA median: <code>{instructor.GPA.median}</code></li>
                                    <li>GPA range: <code>{instructor.GPA.range}</code></li>
                                    <li>GPA standard deviation: <code>{instructor.GPA.standardDeviation}</code></li>
                                </ul>
                            </Tab>
                            <Tab className="tab-courses" eventKey="courses" title="Courses" disabled={courses.length === 0}>
                                <p>This table represents all the unique courses that {instructor.fullName} has taught within our dataset. The <em>All Professors' Avg (GPA)</em> column represents the GPA for that course across the entire university. The <em>Dr.{instructor.lastName}'s Avg (GPA)</em> column represents the GPA of {instructor.fullName}'s grade history for this specific course across only the sections they've taught of it.</p>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Course</th>
                                            <th>Description</th>
                                            <th>Total sections</th>
                                            <th>Dr.{instructor.lastName}'s Avg (GPA)</th>
                                            <th>All Professors' Avg (GPA)</th>
                                            <th>Last taught</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {courses.map(item => {
                                            return (
                                                <tr>
                                                    <td>{`${item.department} ${item.catalogNumber}`}</td>
                                                    <td>{item.description}</td>
                                                    <td>{item.sectionCount}</td>
                                                    <td>{item['_profGPA'] ? item['_profGPA'].toFixed(3) : undefined}</td>
                                                    <td>{item.GPA.average ? item.GPA.average.toFixed(3) : undefined}</td>
                                                    <td>{item['_lastTaught'] ? util.termString(item['_lastTaught']) : <small>Loading...</small>}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </Table>
                            </Tab>
                            <Tab className="tab-sections" eventKey="sections" title="Sections" disabled={sections.length === 0}>
                                <p>This table represents all the unique sections that {instructor.fullName} has taught within our dataset. The <em>UH GPA</em> column represents the GPA for that course across the entire university. The <em>Prof GPA</em> column represents the GPA of {instructor.fullName}'s grade history for this specific course across only the sections they've taught of it. The <em>Semester GPA</em> column refers to the GPA of only the students registered for that specific section number for that semester.</p>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Course</th>
                                            <th>Term</th>
                                            <th>Section number</th>
                                            <th>Total sections</th>
                                            <th>Section Avg (GPA)</th>
                                            <th>Dr.{instructor.lastName}'s Avg (GPA)</th>
                                            <th>All Professors' Avg (GPA)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sections.map(item => {
                                            return (
                                                <tr>
                                                    <td>{item['_course']}</td>
                                                    <td>{item.termString}</td>
                                                    <td>{item.sectionNumber}</td>
                                                    <td>{item['_sectionCount']}</td>
                                                    <td>{item.semesterGPA}</td>
                                                    <td>{item['_profGPA'] ? item['_profGPA'].toFixed(3) : undefined}</td>
                                                    <td>{item['_GPA.average'] ? item['_GPA.average'].toFixed(3) : undefined}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </Table>
                            </Tab>
                        </Tabs>

                    </div> : <></>}
            </div>
        </Container>
    )
}