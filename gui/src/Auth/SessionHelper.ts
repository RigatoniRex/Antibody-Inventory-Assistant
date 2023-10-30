import axios from "axios";

export default class SessionHelper {
    private setAuthorized: (value: boolean) => void;
    constructor(setAuthorized: (value: boolean) => void) {
        this.setAuthorized = setAuthorized;
    }
    public static getCookie(name: string) {
        const regex = RegExp('(?:^|;\\s*)' + name + '=([^;]*)');
        const match = regex.exec(document.cookie);
        return match ? match[1] : null;
    }
    public static deleteCookie(name: string) {
        if (SessionHelper.getCookie(name)) {
            document.cookie = `${name}=; Max-Age=-99999999;`;
        }
    }
    public login() {
        this.setAuthorized(true);
    }
    public logout() {
        axios.post(
            '/logout',
            {},
        );
        this.setAuthorized(false);
    }
}
