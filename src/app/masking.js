const Masking = (() => {
    const clear = inp => inp.replace(/[a-z]|\W/gi, "")

    class MaskingClass {
        constructor(data){
            this.selector = data.el
            this.rules = data.rules
            this.value = ""
            this.initElement()
            this.initChildElement()
        }
    
        initElement(){
            this.el = document.querySelector(this.selector)
            this.el.classList.add("msj-input-mask")
        }
    
        async initChildElement(){
            await this.initChildInput()
            this.listenEvent()
        }

        disabledElement(el){
            el.setAttribute('disabled', true)
            el.classList.add('input-mask--is-disabled')
            el.classList.remove('input-mask--is-active')
        }

        enableElement(el){
            el.removeAttribute('disabled')
            el.classList.add('input-mask--is-active')
            el.classList.remove('input-mask--is-disabled')
        }
    
        initChildInput(){
            return new Promise(resolve => {
                for(let i=0; i < this.rules.length; i++){
                    let child = document.createElement('input')
                    child.setAttribute('class', `msj-input-mask__item input-mask-${i+1}--${this.rules[i]}`)
                    if(i > 0) this.disabledElement(child)
                    else this.enableElement(child)
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

        whenKeyup(input, i){
            input[i].addEventListener('keyup', e => {
                let val = clear(e.target.value)
                if(/* backspace */e.keyCode == 8 ){
                    this.whenDelete(input, val, i)
                }else{
                    if(/* checking length of value */ val.length > this.rules[i]){
                        e.target.value = val.slice(0, this.rules[i])
                        if(/* checking not last input */ i < input.length-1){
                            this.enableElement(input[i+1])
                            input[i+1].focus()
                            if(input[i+1].value.length < this.rules[i+1]){
                                input[i+1].value += val.slice(-1)
                            }
                        }
                    }else e.target.value = val
                }
                this.setValue()
            })
        }

        whenFocus(input, i){
            input[i].addEventListener('focus', e => {
                e.target.classList.add('input-mask--is-focused')
            })
        }

        whenBlur(input, i){
            input[i].addEventListener('blur', e => {
                e.target.classList.remove('input-mask--is-focused')
            })
        }

        whenDelete(input, val, index){
            if(/* checking loping not first */index != 0){
                if(/* checking length is empty */ !val.length){
                    input[index-1].focus()
                    this.disabledElement(input[index])
                }
            }
        }

        setValue(){
            let datavalue = ""
            for(let input of this.el.querySelectorAll('.j-input-mask__item')){
                datavalue += input.value
            }
            this.value = datavalue
        }
    }

    return MaskingClass

})()

export default Masking
