import {HOST} from 'common/js/config'
import axios from 'axios'

export function getSingers(){
    let url = HOST + '/top/artists'
    return axios.get(url)
}