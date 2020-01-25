import {HOST} from 'common/js/config'
import axios from 'axios'

export function getSingers(){
    let url = HOST + '/top/artists'
    return axios.get(url)
}
export function getSingerDetail(singerId){
    let url = HOST + `/artists?id=${singerId}`
    return axios.get(url)
}