const Masking = (() => {
    const clear = inp => inp.replace(/[a-z]|\W/gi, "")
    const generateMaskPlaceholder = (lg, pattern="#") => new Array(lg).fill(pattern).join("")
    const widthPercentage = (rule, rules) => {
        let total = rules.reduce((acc, cur) => {
            return acc + cur
        },0)
        return (rule/total*100) + '%' 
    }
    const countTotalRules = (rules) => {
        return rules.reduce((__a, __c) => {
            return Number(__a) + Number(__c)
        },0)
    }
    const checkingRuleTypes = rules => {
        if(typeof rules == 'string'){
            if(/* checking pattern (num+x+num) */ /^([1-9]+(x)[1-9]+)$/g.test(rules)){
                let splitted = rules.toLowerCase().split('x')
                const inputTotal = Number(splitted[0])
                const maxLength = Number(splitted[1])
                return new Array(inputTotal).fill(maxLength)
            }else{
                throw "Format Rules must number + 'x' + number and greater than 0"
            }
        }else if(Array.isArray(rules)){
            return rules
        }else{
            throw "Format Rules must Array or String"
        }
    }
    const enableElement = el => {
        el.removeAttribute('disabled')
        el.classList.add('input-mask--is-active')
        el.classList.remove('input-mask--is-disabled')
    }
    const disabledElement = el => {
        el.setAttribute('disabled', true)
        el.classList.add('input-mask--is-disabled')
        el.classList.remove('input-mask--is-active')
    }

    class MaskingClass {
        constructor(data){
            this.selector = data.el
            this.rules = checkingRuleTypes(data.rules)
            this.value = ""
            this.options = data.options || {}
            this.maxValue = countTotalRules(this.rules)
            this.init(data)
        }

        async init(data){
            await Promise.all([
                this.initElement(),
                this.initChildElement()
            ])
            this.initOptions()
            this.keyup = data.keyup
        }
    
        initElement(){
            return new Promise(resolve => {
                this.el = document.querySelector(this.selector)
                this.el.classList.add("msj-input-mask")
                resolve(true)
            })
        }
    
        async initChildElement(){
            await this.initChildInput()
            this.listenEvent()
        }

        initChildInput(){
            return new Promise(resolve => {
                for(let i=0; i < this.rules.length; i++){
                    let child = document.createElement('input')
                    child.setAttribute("class", "msj-input-mask__item")
                    child.style.width = widthPercentage(this.rules[i], this.rules)
                    child.setAttribute('placeholder', generateMaskPlaceholder(this.rules[i]))
                    if(i > 0) disabledElement(child)
                    else enableElement(child)
                    this.el.appendChild(child)
                }
                resolve(true)
            })
        }
    
        listenEvent(){
            let input = this.el.querySelectorAll('.msj-input-mask__item')
            for(let i=0; i < input.length; i++){
                this.whenKeyup(input, i)
                this.whenFocus(input, i)
                this.whenBlur(input, i)
            }
        }

        initOptions(){
            // option classes
            if(this.options.classes){
                if(typeof this.options.classes === 'string'){
                    this.el.classList.add(this.options.classes)
                }else{
                    const inputs = this.el.querySelectorAll('input')
                    const { parent, child } = this.options.classes
                    if (parent) this.el.classList.add(parent)
                    for(let input of inputs){
                        if (child) input.classList.add(child)
                    }
                }
            }

            // option autofocus
            if(this.options.autofocus){
                this.el.querySelector('input').focus()
            }

            // option align
            const align = this.options.align || "left"
            if(align.constructor == String){
                if(['left', 'center', 'right'].indexOf(align.toLowerCase()) !== -1){
                    this.el.classList.add(`im-${align}`)
                }else{ 
                    throw "value of align is left, center or right"    
                }
            }else{
                throw "Type of 'align' option must be a string"
            }
        }

        whenKeyup(input, i){
            input[i].addEventListener('keyup', e => {
                let val = clear(e.target.value)
                if(/* backspace */e.keyCode == 8 ){
                    this.whenDelete(input, val, i)
                }else{
                    if(/* checking length of value */ val.length > this.rules[i]){
                        input[i].value = val.slice(0, this.rules[i])
                        if(/* checking not last input */ i < input.length-1){
                            enableElement(input[i+1])
                            input[i+1].focus()
                            if(input[i+1].value.length < this.rules[i+1]){
                                input[i+1].value += val.slice(-1)
                            }
                        }
                    }else input[i].value = val
                }

                /* check input keyup is trigger
                 * if key is number and less than max value
                 * if key is backspace and value is not null */
                if((/^(\d)$/.test(e.key) && this.value.length < this.maxValue) || (e.keyCode == 8 && this.value)){
                    this.setValue()
                }
            })
        }

        whenFocus(input, i){
            input[i].addEventListener('focus', e => {
                input[i].classList.add('input-mask--is-focused')
            })
        }

        whenBlur(input, i){
            input[i].addEventListener('blur', e => {
                input[i].classList.remove('input-mask--is-focused')
            })
        }

        whenDelete(input, val, index){
            if(/* checking loping not first */index != 0){
                if(/* checking length is empty */ !val.length){
                    input[index-1].focus()
                    disabledElement(input[index])
                }
            }
        }

        setValue(){
            let datavalue = ""
            for(let inp of this.el.querySelectorAll('.msj-input-mask__item')){
                datavalue += inp.value
            }
            this.value = datavalue
            setTimeout(() => {
                this.keyup(this.value)
            }, 0)
        }
    }

    return MaskingClass

})()

export default Masking
