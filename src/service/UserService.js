import authorizeAxiosInstance from "@/hooks/axios";
require('dotenv').config();
let URL_ROOT = process.env.NEXT_PUBLIC_URL_ROOT;


const UserService = {

    getUserInfo : async ()=> {
        try {
            let res = await authorizeAxiosInstance.get(`${URL_ROOT}/private/user/get-user-login`);
            return { user : res.data };

        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export default UserService;
