
import firebase from './firebase'

type Meta = {
    catalog: {
        latestTerm: number
    },
    __lastUpdated: Date
}

export async function getLocalMeta(): Promise<Meta> {
    const db = firebase.firestore()
    const defaultValue: Meta = {
        catalog: {
            latestTerm: 0
        },
        __lastUpdated: new Date(0)
    }

    // initialize to default value
    let local: Meta = Object.assign({}, defaultValue)
    // load local data if present
    if (localStorage.getItem('meta') !== null) {
        local = JSON.parse(localStorage.getItem('meta') || JSON.stringify(defaultValue))
    }
    // if lastUpdated is older than 5 days, get a new copy
    if ((new Date().valueOf() - new Date(local.__lastUpdated).valueOf()) > (1000 * 60 * 60 * 24 * 5)) {
        let docSnap = await db.collection('meta').doc('meta').get()
        if (docSnap.exists) {
            local = docSnap.data() as Meta || Object.assign({}, defaultValue)
        }
    }

    return local;
}

export async function getLatestTerm(): Promise<number> {
    return (await getLocalMeta()).catalog.latestTerm
}