import "babel-polyfill"
import '../style/app.scss'
import Masking from './masking'

new Masking({
    el: "#mask",
    rules: [3, 4, 2, 2],
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

