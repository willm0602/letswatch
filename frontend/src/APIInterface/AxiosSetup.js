import axios from 'axios'
import FrontendConfig from '../FrontendConfig'

const APIPort = FrontendConfig.APIPort

export default function () {
    axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

    // Set the baseURL for all requests to the API domain instead of the current domain
    axios.defaults.baseURL = `http://localhost:${APIPort}`

    // Allow the browser to send cookies to the API domain (which include auth_token)
    axios.defaults.withCredentials = true

    return axios
}
