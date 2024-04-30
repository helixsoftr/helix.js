import { HTTPClient } from "./HL/hf-HTTPClient.js"
import { Mount } from './HL/hf-Mount.js'

var DandDMonsters = new HTTPClient({
    url: 'https://www.dnd5eapi.co',
    slug: '/api/monsters',
    options: {
        method: "GET",
        accept: "application/json",
        redirect: 'follow'
    }
})

function getEach(slug) {
    DandDMonsters = new HTTPClient({
        url: 'https://www.dnd5eapi.co',
        slug: slug,
        options: {
            method: "GET",
            accept: "application/json",
            redirect: 'follow'
        }
    })
}

DandDMonsters.get((value) => {
    let testMount = new Mount(value.results, {
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
                map: (x) => {
                    getEach(x)
                    DandDMonsters.get((value) => {
                        return value.xp
                    })
                }
            }
        ],
        pageScript: './main.js',
    })
})