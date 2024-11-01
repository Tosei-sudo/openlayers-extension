
const offset_max = 1000;
const base = 84780;

for (let offset = 0; offset < offset_max; offset++) {

    let name = "PIC" + (base + offset).toString().padStart(7, "0") + ".jpg";

    const res = await fetch("http://www.kcna.kp/siteFiles/photo/202410/" + name);

    if (res.status === 200) {
        // log mime type
        console.log(res.headers.get("content-type"));
    }
}