
import React, { useState } from 'react'
import { BrowserRouter, Link, Switch, Route } from 'react-router-dom'
import { Navbar, Nav } from 'react-bootstrap'
import { Lock } from '@material-ui/icons'

import 'bootstrap/dist/css/bootstrap.css'
import './root.scss'

import { Blurb } from './blurb'
import { Brand } from './brand'
import { Home } from '../home/home'
//import Instructors from '../instructors/instructors'


export const Root: React.FC = () => {
    const [colorScheme, setColorScheme] = useState<'light' | 'dark'>((window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light')

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
        setColorScheme((window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light')
    })

    return (
        <BrowserRouter>
            <Navbar bg={colorScheme} variant={colorScheme} expand="lg" className="cg-navbar">
                <Navbar.Brand>
                    <Brand />
                </Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse>
                    <Nav className="mr-auto navbar-nav">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/courses">Courses</Nav.Link>
                        <Nav.Link as={Link} to="/instructors">Instructors</Nav.Link>
                        <Nav.Link as={Link} to="/groups" disabled={true}><Lock />Groups</Nav.Link>
                    </Nav>
                    <Nav className="navbar-nav justify-content-end">
                        <Nav.Link href="https://github.com/cougargrades/web/wiki/Feedback">Feedback</Nav.Link>
                        <Nav.Link href="https://cougargrades.github.io/blog/">Updates</Nav.Link>
                        <Nav.Link as={Link} to="/about">About</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <Switch>
                <Route path="/" exact>
                    <Home />
                </Route>
                <Route path="/courses">
                    {/* <Courses /> */}
                </Route>
                <Route path="/c/:name">
                    {/* <IndividualCourse course={'none'} /> */}
                </Route>
                <Route path="/instructors">
                    {/* <Instructors /> */}
                </Route>
                <Route path="/i/:name">
                    {/* <IndividualInstructor /> */}
                </Route>
                <Route path="/api" exact>
                    <Blurb>
                        <p>Did you mean to go to <code><a href="/api/">/api/</a></code> (with the trailing slash)?</p>
                    </Blurb>
                </Route>
                <Route>
                    <Blurb http404 />
                </Route>
            </Switch>
        </BrowserRouter>
    );
}