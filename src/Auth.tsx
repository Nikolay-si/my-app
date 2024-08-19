const clientId: string = "05c3ea21976e455d9ff8c17b2e77c6c1";
const redirectUri: string = "http://localhost:3000/callback";
const scopes: string = "playlist-modify-public";


interface TokenData {
    accessToken: string | null;
    expiresIn: number | null;
}

export const spotifyAuth = {
    getAccessToken(): string | void {
        const token: string | null = localStorage.getItem("accessToken")
        const tokenExpiresAt: string | null = localStorage.getItem("tokenExpiresAt")

        if (token && Date.now() < Number(tokenExpiresAt)) {
            return token;
        }


        const tokenData: TokenData = this.extractTokenFromUrl();
        if (tokenData.accessToken) {
            return tokenData.accessToken;
        } else {
            // Перенаправляем пользователя на авторизацию Spotify
            window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=${scopes}`;
        }
    },

    extractTokenFromUrl(): TokenData {
        const hash: string = window.location.hash.substring(1);
        const params: URLSearchParams = new URLSearchParams(hash);
        const accessToken: string | null = params.get("access_token");
        const expiresIn: string | null = params.get("expires_in");

        if (accessToken && expiresIn) {
            const expiresInNumber: number = parseInt(expiresIn, 10); // Указан radix 10 для явного преобразования
            const tokenExpiresAt: number = Date.now() + expiresInNumber * 1000;
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("tokenExpiresAt", tokenExpiresAt.toString());
            window.history.pushState("", document.title, window.location.pathname);

            return {accessToken, expiresIn: expiresInNumber} ;
        }
        return {accessToken: null, expiresIn: null };
     }
}