import { options } from "./hl-Options.js"
import { message } from "./hf-Basics.js"

class Mount {
    constructor(data, income) {
        //? Node Selectors
        this.wrapperSelector = income.wrapper || message('error', 'you have to define wrapper element')
        this.elSelector = income.el || message('error', 'you have to define repeat element')
        this.mountSelectors = income.mount.map(x => x.hook) || message('error', 'you have to define mount')

        //? Nodes
        this.wrapperNode = null
        this.elNode = null
        this.elTemplate = null

        //? Workflow Params
        this.valid = true

        //? Functions and Script
        this.afterInıt = income.afterInıt || function () { message('warning', "couldn't found any after init function") }
        this.pageScript = income.pageScript || message('error', 'you have to define page script')

        //? Data and Mount Parameters
        this.data = data
        this.mountParams = income.mount || message('error', 'you have to define mount params')
        this.repeat = income.repeat || false
        this.took = income.took || 0


        //? Validations
        this.checkSelectors()
        this.checkNodes()
        this.checkParams()

        //? Manupilation
        this.mountData()

        //? Leaving With Default Scripts
        this.initPageScirpt()
        this.afterInıt()
    }

    //? Validate all selectors
    isValidSelector(selector) {
        if (selector.split('')[0] == '.' || selector.split('')[0] == '#' || (selector.split('')[0] == '[' && selector.split('')[selector.split('').length - 1] == ']') || !(options.allowedSelectors.filter(x => x == selector).length == 0)) {
            return true
        } else {
            message('warning', `${selector} is not a valid selector`)
            this.valid = false
            return false
        }
    }

    //? Validate all nodes
    isValidNode(selector) {
        if (typeof selector == 'object') {
            selector.forEach(s => {
                if (document.querySelector(s)) {
                    return true
                } else {
                    message('warning', `${s} couldn't be found`)
                    this.valid = false
                    return false
                }
            });
        } else {
            if (document.querySelector(selector)) {
                return true
            } else {
                message('warning', `${selector} couldn't be found`)
            }
        }
    }

    //? Validate Hierarchy
    isValidHierarchy(parentSelector, childSelector) {
        let parentNodes = document.querySelector(parentSelector)

        if (parentNodes.querySelectorAll(childSelector).length > 0) {
            return true
        } else {
            message('warning', `${childSelector} is not inside of an ${parentSelector}`)
            this.valid = false
            return false
        }
    }

    //? Check Which Is There A Not Allowed Paramater
    isParamsValid(params) {
        params.map(x => x.param).forEach(cp => {
            if (options.accesParams.filter(x => x == cp).length == 0) {
                message('warning', `${cp} Is Not Allowed Parameter`)
                this.valid = false
                return false
            } else {
                return true
            }
        })
    }

    //? Check Keys Are Synchronized
    isDataValid(data, params) {
        params.map(x => x.value).forEach(cp => {
            if (Object.keys(data[0]).filter(x => x == cp).length == 0) {
                message('warning', `${cp} Dont Have Any Representing Data`)
                this.valid = false
                return false
            } else {
                return true
            }
        })
    }

    //? Check which selectors are valid
    checkSelectors() {
        this.isValidSelector(this.wrapperSelector)
        this.isValidSelector(this.elSelector)
        for (let ms of this.mountSelectors) {
            this.isValidSelector(ms)
        }

        if (this.valid) {
            message('stable', `All Selectors Are Valid`)
        } else {
            message('error', `Couldn't Set The Selectors`)
        }
    }

    //? Check which nodes are valid
    checkNodes() {
        if (this.valid) {
            this.isValidNode(this.wrapperSelector)
            this.isValidNode(this.elSelector)
            this.isValidNode(this.mountSelectors)

            if (this.valid) {
                message('stable', 'All Nodes Are Found')
            } else {
                message('error', "One Or More Node Couldn't Found")
                return
            }

            this.isValidHierarchy(this.wrapperSelector, this.elSelector)
            this.isValidHierarchy(this.elSelector, this.mountSelectors)

            if (this.valid) {
                message('stable', 'Hierarchy Is Correct')
            } else {
                message('error', "Hierarchy Is Not Correct")
                return
            }

            this.wrapperNode = document.querySelector(this.wrapperSelector)
            this.elNode = document.querySelector(this.elSelector)
        }
    }

    //? Check Params Are Valid
    checkParams() {
        if (this.valid) {
            this.isParamsValid(this.mountParams)
            if (this.valid) {
                message('stable', 'Parameters Are Allowed')
            } else {
                message('error', 'One Or More Paramater Is Not Allowed To Mount')
                return
            }
            this.isDataValid(this.data, this.mountParams)

            if (this.valid) {
                message('stable', 'Values Are Sync With The Data')
            } else {
                message('error', 'One Or More Paramater Is Dont Have Represention')
                return
            }
        }
    }

    //? Remove Original Node
    removeOriginal(selector) {
        document.querySelectorAll(selector).forEach(r => {
            r.remove()
        });
    }

    //? Map Data
    map(data, map) {
        if (typeof map != 'undefined') {
            return map(data)
        } else {
            return data
        }
    }

    //? Change the data before mount
    changeNode(param, element, data) {
        switch (param) {
            case 'href':
                element.setAttribute('href', data)
                break;
            case 'src':
                element.setAttribute('src', data)
                break;
            case 'innerText':
                element.innerText = data
                break;
            case 'alt':
                element.alt = data
                break;
            default:
                message('warning', 'Didint Change Anything From Template')
                break;
        }
    }

    //? Mount Data
    mountData() {
        if (this.valid) {
            this.removeOriginal(this.elSelector)

            if (this.repeat) {
                this.data.forEach(d => {
                    let dummyNode = this.elNode.cloneNode(true)
                    this.mountParams.forEach(mp => {
                        this.changeNode(mp.param, dummyNode.querySelector(mp.hook), this.map(d[mp.value], mp.map))
                        this.wrapperNode.appendChild(dummyNode)
                    });
                });
            } else {
                this.mountParams.forEach(mp => {
                    let dummyNode = this.elNode.cloneNode(true)
                    this.changeNode(mp.param, dummyNode.querySelector(mp.hook), this.map(this.data[mp.value], mp.map))
                    this.wrapperNode.appendChild(dummyNode)
                });
            }
        }
    }

    //? Add Page Script
    initPageScirpt() {
        if (document.querySelector(`[src="${this.pageScript}"]`)) {
            document.querySelector(`[src="${this.pageScript}"]`).remove()
        }
        let script = document.createElement('script')
        script.setAttribute('src', this.pageScript)
        document.body.appendChild(script)
    }

    //? Run Custom Script
    runAfterInıt() {
        if (this.valid) {
            this.afterInıt()
        }
    }
}

export { Mount } 