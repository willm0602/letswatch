import { get } from './Utils'
import { getAccessToken } from '../LocalStorageInterface'

export async function userMetadata() {
    const accessToken = getAccessToken()

    if (accessToken == null) return {}
    const metadata = await get(`/account/info`, { accessToken })
    return metadata
}