import authorizeAxiosInstance from '@/hooks/axios';
require('dotenv').config();
let URL_ROOT = process.env.NEXT_PUBLIC_URL_ROOT;

const AuthService =  {

    singIn  : async(email, password)=>{
        try {
            const res = await authorizeAxiosInstance.post(`${URL_ROOT}/public/login`,{email,password})
            return {
                accessToken : res.data.accessToken,
                user : res.data.userDTO
            }
        } catch (error) {
            throw error;
        }
    }
}

export default AuthService;