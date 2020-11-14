var changeObj;
async function fetchJSON(uri) {
    return fetch(uri).then(res => res.json());
}

async function main() {
    changeObj = await fetchJSON("http://localhost:80/change-points.json");
    console.log(changeObj);
}
main();