import axios from 'axios'
// stripe Payment
//!backend url
const url = "https://aicg.onrender.com";
const local = "http://localhost:8090";
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

    console.log("calling verify payment api");
    const response = await axios.post(url+`/api/v1/stripe/verify-payment/${paymentId}`,
    {
        
    },
    {
        withCredentials: true, //* as soon as we register this will set the cookies inside the browser
    }
    );
    console.log("from verify payment",response);
    return response?.data;
}