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
import * as classManagement from './classManagement'
import * as selfStudy from './selfStudy'
import * as progressFeedBack from './progressFeedBack'
export default{
  personal,
  square,
  learnResource,
  classManagement,
  selfStudy,
  progressFeedBack
}