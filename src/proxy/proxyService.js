module.exports = {
    redirect(data) {
        userData = {
            "path": data.path,
            "ip": data.ip,
            "mergeIpPath": data.mergeIpPath
        }
        console.log(userData);

        return userData
    }
}