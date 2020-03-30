
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Container, Jumbotron, Button } from 'react-bootstrap'
import TimeAgo from 'timeago-react'

import { util, meta } from '../../providers'

import './home.scss'

type BlogEntry = {
    id: string,
    title: string,
    link: string,
    updated: Date,
    content: string
}

type State = {
    latestTerm: string,
    blog: BlogEntry[],
    colorScheme: 'light' | 'dark'
}

export const Home: React.FC = () => {
    const [latestTerm, setLatestTerm] = useState<State['latestTerm']>('...')
    const [blog, setBlog] = useState<State['blog']>([])

    async function updateBlogData() {
        let res = await fetch('https://cougargrades.github.io/blog/atom.xml')
        let data = await res.text()
        let parser = new DOMParser()
        let xml = parser.parseFromString(data, 'text/xml')
        let entries = []
        for (const entry of xml.querySelectorAll('entry')) {
            entries.push({
                id: entry.querySelector('id')?.textContent || '',
                title: entry.querySelector('title')?.textContent || '',
                link: entry.querySelector('link')?.getAttribute('href') || '',
                updated: new Date(entry.querySelector('updated')?.textContent || ''),
                content: entry.querySelector('content')?.innerHTML || ''
            })
        }
        entries.sort((a, b) => {
            return b.updated.valueOf() - a.updated.valueOf()
        })
        setBlog([...entries])
    }

    async function updateLatestTerm() {
        let x = util.termString(await meta.getLatestTerm())
        setLatestTerm(x === '0' ? 'N/A' : x)
    }

    // get blog post data
    useEffect(() => {
        updateBlogData()
    }, [])

    // update latestTerm
    useEffect(() => {
        updateLatestTerm()
    }, [])

    return (
        <Container>
            <Jumbotron className="hero">
                <h1 className="cg-hero">CougarGrades.io</h1>
                <p className="lead">Analyze grade distribution data for any past University of Houston course</p>
                <hr className="my-4" />
                <p><em>Not affiliated with the University of Houston. Data is sourced directly from the University of Houston.</em></p>
                <p><em>Latest semester available: <span id="latestTerm">{latestTerm}</span></em></p>
                <Button variant="primary" className="btn-cg" as={Link} to="/courses">Search Courses</Button>
                <Button variant="primary" className="btn-cg" as={Link} to="/instructors">Search Instructors</Button>
                <Button href="https://github.com/search?utf8=%E2%9C%93&q=FOIA-IR+user%3Acougargrades&type=Repositories&ref=advsearch&l=&l=" variant="primary" className="btn-cg">Spreadsheets</Button>
            </Jumbotron>
            <Jumbotron>
                <div className="updates">
                    <h5>Developer updates</h5>
                    <ul>
                        {blog.map(entry => {
                            return (
                                <li key={entry.id}><a href={entry.link}>{entry.title}</a>, <span title={entry.updated.toLocaleString()}><TimeAgo datetime={entry.updated} locale={'en'} live={false} /></span></li>
                            )
                        })}
                    </ul>
                </div>
            </Jumbotron>
        </Container>
    )
}
