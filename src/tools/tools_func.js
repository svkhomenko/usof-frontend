import { Buffer } from "buffer";

function getSrc(profilePicture) {
    let src = "/src/images/avatar.png";

    if (profilePicture) {
        src = 'data:image/png;base64,' + Buffer.from(profilePicture, "binary").toString("base64");
    }
    return src;
}

function getDateString(dateStr) {
    let date = new Date(dateStr);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

export {
    getSrc,
    getDateString
};

