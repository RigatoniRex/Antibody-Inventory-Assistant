import axios from 'axios';

export default class SessionHelper {
    private setAuthorized: (value: boolean) => void;
    private setLab: (value: string) => void;
    constructor(
        setAuthorized: (value: boolean) => void,
        setLab: (value: string) => void
    ) {
        this.setAuthorized = setAuthorized;
        this.setLab = setLab;
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
    public login(lab: string) {
        this.setAuthorized(true);
        this.setLab(lab);
    }
    public logout() {
        axios.post('/logout', {});
        this.setAuthorized(false);
    }
}
