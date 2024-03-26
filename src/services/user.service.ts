import { Layout_API } from "@/types/element.types";
import { UserInfo } from "@/zustand/store";
import axios from "axios";

const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_ROUTE}`

class UserService {
    static async getUserLayouts(): Promise<Layout_API[] | null> {
        try {
            const response = await axios({
                url: `${baseUrl}/user/layouts`,
                withCredentials: true,
                method: "GET",
            });
            const data = response.data
            const layouts = data.data as Layout_API[]
            return layouts
        } catch (err) {
            return null
        }
    }
    static async login(username: string, password: string): Promise<boolean> {
        try {
            const response = await axios({
                url: `${baseUrl}/auth/login`,
                method: "POST",
                data: {
                    username,
                    password,
                },
                withCredentials: true,
            });
            return true
        } catch (err) {
            return false
        }
    }
    static async authenticate(): Promise<UserInfo | null> {
        try {
            const response = await axios({
                url: `${baseUrl}/auth/authenticate`,
                withCredentials: true,
                method: "GET",
            });
            const data = response.data as UserInfo
            return data
        } catch (err) {
            return null
        }
    }
}

export default UserService