import { signup } from "../login/login.services";

//register
export const register = async (data: any) => {

    const body = JSON.stringify(data);
    console.log(body)
    
    signup(data);
    
}