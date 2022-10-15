import axios from "axios";

export default {
    async getCurrentUserInfo (payload) {
        let url = `/api/userinfo/create`;
        await axios.post(url, payload);
  
        // get user entry from database (Either the brand new one or one thats already created)
        url = `/api/userInfo/${payload.userid}`;
        let response = await axios.get(url);
        let currentUserInfo = response.data[0];
        return currentUserInfo
      },
}