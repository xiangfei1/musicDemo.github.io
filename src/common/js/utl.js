// 得到随机数
function getRandomInt(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min)
}
// 打乱歌单
export function shuffle(arr) {
    let _arr = arr
    for(let i=0;i<arr.length;i++) {
        let j = getRandomInt(0,i)
        let t = _arr[i]
        _arr[i] = _arr[j]
        _arr[j] = t
    }
    return _arr
}
// 防抖函数
export function debounce(func,wait){
    let timer
    return function(){
        let args = arguments
        let that = this
        if(timer) clearTimeout(timer)
        timer = setTimeout(()=>{
            func.apply(that,args)
        },wait)
    }

}