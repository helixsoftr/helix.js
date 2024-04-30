# DOM Service Framework

A lightweight framework for managing DOM operations efficiently.

## Overview

DOM Service Framework is designed to simplify DOM manipulation and enhance performance in web applications. It provides a set of utilities and abstractions to streamline common tasks related to interacting with the Document Object Model (DOM).

## Features

- **Efficient DOM Manipulation**: Optimized methods for handling DOM elements efficiently.
- **Event Handling**: Simplified event binding and handling.
- **Component Architecture**: Supports a modular component-based architecture for building complex UIs.
- **Customizable**: Easily extendable and customizable to fit various project requirements.

## Getting Started

To start using the DOM Service Framework in your project, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/username/dom-service-framework.git

Include the `{pageName}.js` file in your HTML:
```html
<script src="path/{pageName}.js"></script>

Include the {pageName}.js file
```js
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

This README provides an overview of the project, its features, how to get started, where to find documentation, how to contribute, and information about the project's license. Adjust it according to your project's specifics.
