import { options } from "./hl-Options.js"
import { message } from "./hf-Basics.js"

function checkGeneralError(valid, accept, error) {
    if (valid) {
        message('stable', accept)
    } else {
        message('error', error)
        return
    }
}

function isValidSelector(selector) {
    if (selector.split('')[0] == '.' || selector.split('')[0] == '#' || (selector.split('')[0] == '[' && selector.split('')[selector.split('').length - 1] == ']') || !(options.allowedSelectors.filter(x => x == selector).length == 0)) {
        return true
    } else {
        message('warning', `${selector} is not a valid selector`)
        return false
    }
}

function isValidNode(selector) {
    if (typeof selector == 'object') {
        for (const s of selector) {
            if (!document.querySelector(s)) {
                message('warning', `${s} couldn't be found`);
                return false;
            }
        }
        return true;
    } else {
        if (!document.querySelector(selector)) {
            message('warning', `${selector} couldn't be found`);
            return false;
        }
        return true;
    }
}

function isValidHierarchy(parentSelector, childSelector) {
    let parentNodes = document.querySelector(parentSelector)
    if (parentNodes.querySelectorAll(childSelector).length > 0) {
        return true
    } else {
        message('warning', `${childSelector} is not inside of an ${parentSelector}`)
        return false
    }
}

function isParamsValid(params) {
    return params.map(x => x.param).every(cp => {
        if (options.accesParams.filter(x => x == cp).length == 0) {
            message('warning', `${cp} Is Not Allowed Parameter`);
            return false;
        } else {
            return true;
        }
    });
}

function isDataValid(data, params) {
    return params.map(x => x.value).every(cp => {
        if (Object.keys(data[0]).filter(x => x == cp).length == 0) {
            message('warning', `${cp} Dont Have Any Representing Data`);
            return false;
        } else {
            return true;
        }
    });
}

class Mount {
    constructor(data, income) {
        this.wrapperSelector = income.wrapper || message('error', 'you have to define wrapper element')
        this.elSelector = income.el || message('error', 'you have to define repeat element')
        this.mountSelectors = income.mount.map(x => x.hook) || message('error', 'you have to define mount')

        this.wrapperNode = null
        this.elNode = null
        this.elTemplate = null

        this.valid = true

        this.afterInıt = income.afterInıt || function () { message('warning', "couldn't found any after init function") }
        this.pageScript = income.pageScript || message('error', 'you have to define page script')

        this.data = data
        this.mountParams = income.mount || message('error', 'you have to define mount params')
        this.repeat = income.repeat || false
        this.took = income.took || 0

        this.checkSelectors()
        this.checkNodes()
        this.checkParams()

        this.mountData()

        this.initPageScirpt()
        this.afterInıt()
    }

    checkSelectors() {
        this.valid = isValidSelector(this.wrapperSelector)
        this.valid = isValidSelector(this.elSelector)

        for (let ms of this.mountSelectors) {
            this.valid = isValidSelector(ms)
        }

        checkGeneralError(this.valid, 'All Selectors Are Valid', "Couldn't Set The Selectors")
    }

    checkNodes() {
        if (this.valid) {
            this.valid = isValidNode(this.wrapperSelector)
            this.valid = isValidNode(this.elSelector)
            this.valid = isValidNode(this.mountSelectors)

            checkGeneralError(this.valid, 'All Nodes Are Found', "One Or More Node Couldn't Found")

            this.valid = isValidHierarchy(this.wrapperSelector, this.elSelector)
            this.valid = isValidHierarchy(this.elSelector, this.mountSelectors)

            checkGeneralError(this.valid, 'Hierarchy Is Correct', 'Hierarchy Is Not Correct')

            this.wrapperNode = document.querySelector(this.wrapperSelector)
            this.elNode = document.querySelector(this.elSelector)
        }
    }

    checkParams() {
        if (this.valid) {
            this.valid = isParamsValid(this.mountParams)
            checkGeneralError(this.valid, 'Parameters Are Allowed', 'One Or More Paramater Is Not Allowed To Mount')

            this.valid = isDataValid(this.data, this.mountParams)
            checkGeneralError(this.valid, 'Values Are Sync With The Data', 'One Or More Paramater Is Dont Have Represention')
        }
    }

    removeOriginal(selector) {
        document.querySelectorAll(selector).forEach(r => {
            r.remove()
        });
    }

    async map(data, map) {
        let fin
        await new Promise((resolve) => {
            if (typeof map != 'undefined') {
                map(data).then((result) => {
                    fin = result
                    resolve()
                })
            } else {
                fin = data
                resolve()
            }
        })
        return fin
    }

    changeNode(param, element, data) {
        data.then(result => {
            switch (param) {
                case 'href':
                    element.setAttribute('href', result)
                    break;
                case 'src':
                    element.setAttribute('src', result)
                    break;
                case 'innerText':
                    element.innerText = result
                    break;
                case 'alt':
                    element.alt = result
                    break;
                default:
                    message('warning', 'Didint Change Anything From Template')
                    break;
            }
        })
    }

    mountData() {
        if (this.valid) {
            this.removeOriginal(this.elSelector)

            if (this.repeat) {
                this.data.forEach(d => {
                    let dummyNode = this.elNode.cloneNode(true)
                    this.mountParams.forEach(mp => {
                        this.changeNode(
                            mp.param,
                            dummyNode.querySelector(mp.hook),
                            this.map(d[mp.value], mp.map)
                        )
                        this.wrapperNode.appendChild(dummyNode)
                    });
                });
            } else {
                this.data = this.data[this.took]
                this.mountParams.forEach(mp => {
                    let dummyNode = this.elNode.cloneNode(true)
                    this.changeNode(
                        mp.param,
                        dummyNode.querySelector(mp.hook),
                        this.map(this.data[mp.value], mp.map)
                    )
                    this.wrapperNode.appendChild(dummyNode)
                });
            }
        }
    }

    initPageScirpt() {
        if (document.querySelector(`[src="${this.pageScript}"]`)) {
            document.querySelector(`[src="${this.pageScript}"]`).remove()
        }
        let script = document.createElement('script')
        script.setAttribute('src', this.pageScript)
        document.body.appendChild(script)
    }

    runAfterInıt() {
        if (this.valid) {
            this.afterInıt()
        }
    }
}

export { Mount } 