import axios from 'axios'
// stripe Payment
//!backend url
const url = "https://ai-content-generator-drab.vercel.app/";
// const local = "http://localhost:8090";
export const handleFreeSubscriptionApi = async() =>{
    const response = await axios.post(url+'/api/v1/stripe/free-plan',
    {},
    {
        withCredentials: true, //* as soon as we register this will set the cookies inside the browser
    }
    );
    return response?.data;
}

// stripe Payment intent

export const createStripePaymentIntentApi = async(payment) =>{
    console.log(payment);
    const response = await axios.post(url+'/api/v1/stripe/checkout',
    {
        amount:Number(payment?.amount),
        subscriptionPlan:payment?.plan,
    },
    {
        withCredentials: true, //* as soon as we register this will set the cookies inside the browser
    }
    );
    console.log(response);
    return response?.data;
}

export const verifyPaymentApi = async(paymentId) =>{
    
    const response = await axios.post(url+`/api/v1/stripe/verify-payment/${paymentId}`,
    {
        
    },
    {
        withCredentials: true, //* as soon as we register this will set the cookies inside the browser
    }
    );
    return response?.data;
}