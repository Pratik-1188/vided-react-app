export const getdomain = () => {
    if(window.location.host.includes("127.0.0.1") || window.location.host.includes("localhost"))
        return "http://localhost:8080"
    else
        return ""
}