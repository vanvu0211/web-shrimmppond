
const URLDomain = {
    baseURL: "https://shrimppond.runasp.net" + "/api",
    headers: {
        "Content-Type": "application/json",
    },
    validateStatus: (status) => status < 400,
}

export {
    URLDomain,
}
