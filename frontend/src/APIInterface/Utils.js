import AxiosSetup from './AxiosSetup'

const axios = AxiosSetup()

/**
 * Way to call get methods on api routes
 *
 * Parameters
 * --------------
 * route:string
 *      the api route being called
 *
 * extraData: object
 *      any additional data being passed into the api route
 *
 * callback: function
 *      function called after the data has been retreived
 *
 * error: function
 *      function called after the data hasn't succesfully been retreived
 */

export async function get(
    route,
    extraData = {},
    callback = undefined,
    error = undefined
) {
    console.log(route, extraData)
    return axios
        .get(route, {
            params: extraData,
        })
        .then(
            (res) => {
                callback && callback(res.data)
                return res.data
            },
            (rej) => {
                error && error(rej)
            }
        )
}

/**
 * Way to call post methods on api routes
 *
 * Parameters
 * --------------
 * route:string
 *      the api route being called
 *
 * extraData: object
 *      any additional data being passed into the api route
 *
 * callback: function
 *      function called after the data has been retreived
 *
 * error: function
 *      function called after the data hasn't succesfully been retreived
 */
export async function post(
    route,
    extraData = {},
    callback = undefined,
    error = undefined
) {
    return axios
        .post(route, undefined, {
            params: extraData,
        })
        .then(
            (res) => {
                callback && callback(res.data)
                return res.data
            },
            (rej) => {
                error && error(rej)
            }
        )
}
