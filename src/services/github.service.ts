import axios from "axios";

const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_ROUTE}`

class GithubService {
    static async getUserRepos(): Promise<any[] | null> {
        try {
            const response = await axios({
                url: `${baseUrl}/github/repos`,
                withCredentials: true,
                method: "GET",
            });
            const data = response.data
            return data.data
        } catch (err) {
            return null
        }
    }
    static async commit(repo: any, code: string) {
        const body = { repo, code }
        try {
            const response = await axios({
                url: `${baseUrl}/github/commit`,
                data: body,
                withCredentials: true,
                method: "POST",
            });
            const data = response.data
            return data.data
        } catch (err) {
            return null
        }
    }
}

export default GithubService