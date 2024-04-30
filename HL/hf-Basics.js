import { options } from "./hl-Options.js";

function message(status, message) {
    let symboll
    switch (status) {
        case 'stable':
            symboll = '✓'
            break;
        case 'warning':
            symboll = '?'
            break;
        case 'error':
            symboll = '!'
            break;

        default:
            symboll = ''
            break;
    }

    if (options.showMessages) {
        console.log(`%c${symboll} ${message}`, options.console[status]);
    }
}

export { message }