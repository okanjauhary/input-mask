import "babel-polyfill"
import '../style/app.scss'
import Masking from './masking'
new Masking({
    el: "#mask",
    rules: [3, 4, 2, 2]
})
