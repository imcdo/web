import React, { useState } from 'react';

import Container from 'react-bootstrap/Container';

import './courses.scss';

import CGSearchForm from './form/CGSearchForm';
import CGCourseResults from './results/CGCourseResults';


const Courses = ({location}) => {
    let initState = []
    if (location 
        && location.state 
        && location.state.selection 
        && location.state.selection.length > 0)
        initState = location.state.selection;
    
    const [selection, setSelection] = useState(initState);
    
    const handleQuery = (selection) => {
        //console.log('query handled: ',selection)
        setSelection(selection.slice());
    };

    return(
        <Container>
            <div>
                <h2>Course search</h2>
                <p>
                    Type in the name of the course you're interested in and press <em>Add to selection</em>.
                    This will generate a graph of the average GPA of past classes over time, identified by the instructor.
                    An interactive table will also be generated that shows more detailed information, such as the section number of the class, the number of As, Bs, Cs, and withdraws.
                </p>
            </div>
            <CGSearchForm selection={selection} onQuery={handleQuery}/>
            <CGCourseResults selection={selection} />
        </Container>
    );
};

export default Courses;
