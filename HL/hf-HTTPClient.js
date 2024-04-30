import { message } from "./hf-Basics.js"

class HTTPClient {
    constructor(income) {
        //? API URL & Options
        this.url = income.url || null
        this.options = income.options || null
        this.slug = income.slug || ''

        //? Data Placeholder
        this.data = null

        //? Action
        this.action = income.action || 'return'

        //? Time
        this.throwTime = Date.now()
        this.responseTime = null

        //? Controller
        this.controller = new AbortController()

        //? Timeout
        this.timeOut = income.timeOut || 5000

        //? Messages 
        this.showMessages = income.showMessages || false

        this.duration()
    }

    //? Main Loader
    load() {
        setTimeout(() => this.controller.abort(), this.timeOut);
        const signal = this.controller.signal
        return new Promise((resolve, reject) => {
            fetch(this.url + this.slug, this.options, { signal })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
                    }
                    this.responseTime = Date.now() - this.throwTime
                    return response.json()
                })
                .then(value => {
                    resolve(value)
                })
                .catch((error) => {
                    if (error.name === 'AbortError') {
                        reject('Request timed out');
                    } else {
                        reject(`Error: ${error.message}`);
                    }
                })
        })
    }

    //* GET
    get(action) {
        this.load().then((value) => {
            message('stable', 'Data Fetched')
            action(value)
        }).catch((error) => {
            message('error', error.stack)
        })
    }

    //? Log the data
    log() {
        this.get((value) => {
            console.log(value);
        })
    }

    //? Log the data as a table
    table() {
        this.get((value) => {
            console.table(value);
        })
    }

    //? Log response time
    duration() {
        this.get(() => {
            message('warning', `Response Time Is : ${this.responseTime} ms`)
        })
    }
}

export { HTTPClient }