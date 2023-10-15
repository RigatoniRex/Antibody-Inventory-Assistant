export default class CookieHelper {
    public static getCookie(name: string) {
        const regex = RegExp('(?:^|;\\s*)' + name + '=([^;]*)');
        const match = regex.exec(document.cookie);
        return match ? match[1] : null;
    }
    public static deleteCookie(name: string) {
        document.cookie =
            name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
}
