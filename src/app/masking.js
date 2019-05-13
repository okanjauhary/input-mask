const Masking = (() => {
    const is_number = inp => /\d/.test(inp)

    class MaskingClass {
        constructor(data){
            this.selector = data.el
            this.rules = data.rules
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
    
        initChildInput(){
            return new Promise(resolve => {
                for(let i=0; i < this.rules.length; i++){
                    let child = document.createElement('input')
                    child.setAttribute('class', `msj-input-mask__content input-mask-${i+1}--${this.rules[i]}`)
                    if(i > 0) child.setAttribute('disabled', true)
                    this.el.appendChild(child)
                }
                resolve(true)
            })
        }
    
        listenEvent(){
            let input = this.el.querySelectorAll('.msj-input-mask__content')
            for(let i=0; i < input.length; i++){
                input[i].addEventListener('keyup', e => {
                    let val = e.target.value
                    if(is_number(val.slice(-1))){
                        if(/* checking length of value */ val.length > this.rules[i]){
                            e.target.value = val.slice(0, -1)
                            if(/* checking not last input */ i < input.length-1){
                                input[i+1].removeAttribute('disabled')
                                input[i+1].focus()
                                if(input[i+1].value.length < this.rules[i+1]){
                                    input[i+1].value += val.slice(-1)
                                }
                            }
                        }
                    }else e.target.value = val.slice(0, -1)
                })
            }
        }   
    }

    return MaskingClass

})()

export default Masking