import React, { useState } from "react";
import { useParams,useSearchParams } from "react-router-dom";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useMutation } from "react-query";
import { createStripePaymentIntentApi } from "../../apis/stripePayment/stripePayment";
import StatusMessage from "../Alert/StatusMessage";
const url = 'https://aicg-fr.onrender.com';
const local = "http://localhost:3000";
const CheckoutForm = () => {
  // get the payloads (we can use params and useParams)
  const params = useParams();
  const [searchParams] = useSearchParams();
  const plan = params.plan;
  const amount = searchParams.get('amount');
  const mutation = useMutation({
    mutationFn:createStripePaymentIntentApi
  })


  // StripeConfiguration
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage , setErrorMessage ] = useState(null);

  const handleSubmit = async (e) =>{
    e.preventDefault();
    if(elements === null){
      return
    }
    const {error:submitError} = await elements.submit(); // renaming error as submitError in the destructuring
    if(submitError){
      return
    }
    //prepare data for payment
    try {
      const data = {
        plan,amount
      };
      //make http request
      const  res = await mutation.mutateAsync(data,{
        onSuccess:async(res) => {
          console.log(res);
          const {error} = await stripe.confirmPayment({
            elements,
            clientSecret:res?.clientSecret,
            confirmParams:{
              return_url:url+'/success' //!frontend url
            },
          });
          if(error){
            setErrorMessage(error?.message)
          }
        }, 
        onError:(error) => {
          setErrorMessage(error?.message);
        },
      });
    } catch (error) {
      setErrorMessage(error?.message)
    }
  }
  return (
    <div className="bg-gray-900 h-screen -mt-4 flex justify-center items-center">
      <form onSubmit={handleSubmit} className="w-96 mx-auto my-4 p-6 bg-white rounded-lg shadow-md ">
        <div className="mb-4">
          <PaymentElement/>
        </div>
        {/* Display Loading */}
        {mutation?.isPending && <StatusMessage type='loading' message='Processing please wait...' />}

         {/* Display success */}
         {console.log("after",mutation.isSuccess)}
         {mutation?.isSuccess && <StatusMessage type='success' message='Payment Successful' />}

          {/* Display error */}
        {mutation?.isError && <StatusMessage type='error' message= {mutation?.error?.response?.data?.error} />}
        <button className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Pay
        </button>
        {errorMessage && <div className="text-red-500 mt-4" >
          Error: {errorMessage}</div>}
      </form>
    </div>
  );
};

export default CheckoutForm;
