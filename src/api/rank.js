import { HOST } from 'common/js/config'
import axios from 'axios'

export function getTop(id) {
  let url = HOST + `/top/list?idx=${id}`
  return axios.get(url)
}
