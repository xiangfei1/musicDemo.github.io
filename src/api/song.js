import axios from 'axios'
import {HOST} from 'common/js/config'

export function getLyric(id) {
    let url = HOST + `/lyric?id=${id}`
    return axios.get(url)
}

export function getSong(id) {
    let url = HOST + `/song/url?id=${id}`
    return axios.get(url)
}