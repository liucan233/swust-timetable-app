import { BACKEND_PREFIX } from "@/config";
import { Network } from "@/lib/network";

export const network=new Network({
    url: BACKEND_PREFIX,
    timeout: 10,
});

network.onErr=(err)=>{
    let msg='网络错误，请检查网络'
    if(err instanceof Error && err.message){
        msg+="。错误：“"+err.message+"”。"
    }
    uni.showToast({
        title: msg,
        duration: 1500
    });
}

network.onRes=(res)=>{
    const {statusCode}=res
    if(statusCode<300&&statusCode>199||statusCode===304){
        return res.data
    }
    throw new Error('状态码不正确');
}
