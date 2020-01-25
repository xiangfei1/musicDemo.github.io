export default class Song {
  constructor({id, singer, name, album, image, aliaName}) {
    this.id = id
    this.singer = singer
    this.name = name
    this.album = album
    this.image = image
    this.aliaName = aliaName
  }
}

function singerName(arr) {
  let name = []
  name = arr.map((item) => {
    return item.name
  })
  return name.join('/')
}

export function createRecommendSong(music) {
  return new Song({
    id: music.id,
    singer: singerName(music.song.artists),
    name: music.name,
    album: music.song.album.name,
    image: music.picUrl
  })
}
export function createRecommendListSong(music) {
  return new Song({
    id: music.id,
    singer: singerName(music.ar),
    name: music.name,
    album: music.al.album,
    image: music.al.picUrl
  })
}
export function createSong(music) {
  return new Song({
    id: music.id,
    singer: singerName(music.ar),
    name: music.name,
    album: music.al.name,
    image: music.al.picUrl
  })
}
