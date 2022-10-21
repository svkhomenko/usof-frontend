import { Buffer } from "buffer";
import avatar from "../images/avatar.png";

function getSrc(profilePicture) {
    let src = avatar;
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

