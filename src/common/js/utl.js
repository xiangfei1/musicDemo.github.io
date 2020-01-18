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