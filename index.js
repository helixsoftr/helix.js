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
        repeat: true,
        wrapper: '[data-wrapper]',
        el: '[data-list]',
        mount: [
            {
                hook: '[data-link]',
                param: 'innerText',
                value: 'name',
            },
            {
                hook: '[data-real]',
                param: 'innerText',
                value: 'url',
            },
            {
                hook: '[data-image]',
                param: 'innerText',
                value: 'url',
                map: async (slug) => {
                    getEach(slug);
                    let modified;
                    await new Promise((resolve) => {
                        DandDMonsters.get((value) => {
                            modified = value.xp;
                            resolve();
                        });
                    });
                    return modified;
                }
            }
        ],
        pageScript: './main.js',
    })
})