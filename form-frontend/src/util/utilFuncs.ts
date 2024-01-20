
function getProtocol(){
    if(process.env.NODE_ENV == "production"){
        return "https"
    }
    else return "http"
}

export const protocol = getProtocol();