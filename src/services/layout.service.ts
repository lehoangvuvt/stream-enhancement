import { Layout_API } from "@/types/element.types";
import { UserInfo } from "@/zustand/store";
import axios from "axios";

const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_ROUTE}`

class LayoutService {
    static async searchLayouts(searchParams: Record<string, string>): Promise<Layout_API[] | null> {
        try {
            let params: Record<string, string> = {
                page: '0',
                sortBy: 'pop',
                ...searchParams
            }
            let query = ''
            Object.keys(params).forEach(key => {
                const value = params[key];
                query += `${key}=${value}&`
            });
            query = query.substring(0, query.length - 1)
            const response = await axios({
                url: `${baseUrl}/layout/layouts/${query}`,
                method: "GET",
            });
            const data = response.data;
            const items = data.data.items as Layout_API[];
            return items
        } catch (err) {
            return null
        }
    }
}

export default LayoutService