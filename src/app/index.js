import "babel-polyfill"
import '../style/app.scss'
import Masking from './masking'

const mask = new Masking({
    el: "#mask",
    rules: "5x3",
    options: {
        classes: {
            parent: "custom-class",
            child: "custom-class-item"
        }
    },
    keyup(value){
        console.log(value, "ini value")
    }
})

