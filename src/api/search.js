import axios from 'axios'
import { HOST } from 'common/js/config'

export function getSongDetail(id) {
  const url = HOST + `/song/detail?ids=${id}`
  return axios.get(url)
}
