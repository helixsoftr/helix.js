import { HTTPClient } from "./HL/hf-HTTPClient.js"
import { Mount } from './HL/hf-Mount.js'

const DandD = new HTTPClient({
    url: 'https://www.dnd5eapi.co',
    slug: '/api/monsters',
    options: {
        method: "GET",
        accept: "application/json",
        redirect: 'follow'
    }
})


DandD.get((value) => {
    // * for example = value.data

    let testMount = new Mount(value.results, {
        repeat: false,
        wrapper: '[data-wrapper]',
        el: '[data-list]',
        mount: [
            {
                hook: '[data-link]',
                param: 'innerText',
                value: 'name',
            },
            {
                hook: '[data-image]',
                param: 'innerText',
                value: 'url',
            }
        ],
        pageScript: './main.js',
    })
})