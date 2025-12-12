const BASE_URL = "http://localhost:3000";

export const getImageUrl = (path) => {
    if (!path) return "/default-avatar.png";
    if (path.startsWith("http") || path.startsWith("blob:")) {
        return path;
    }
    return `${BASE_URL}${path}`;
};