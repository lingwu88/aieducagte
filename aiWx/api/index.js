// import api from './api'
// const install = Vue =>{
//   if(install.installed)
//     return
//   install.installed = true
//   Object.defineProperties(Vue.prototype,{
//     $api:{
//       get(){
//         return api
//       }
//     }
//   })
// }

// export default install
import * as personal from "./personal"
import * as square from "./square"
import * as learnResource from './learnResource'
export default{
  personal,
  square,
  learnResource
}