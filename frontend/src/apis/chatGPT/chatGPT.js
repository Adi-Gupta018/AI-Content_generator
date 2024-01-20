import axios from 'axios'

// registration
const url = "https://aicg.onrender.com"; //!backend url
// const local = "http://localhost:8090";
export const generateContentApi = async(userPrompt) =>{
    const response = await axios.post(url+'/api/v1/openai/generate-content',{
        prompt:userPrompt, // here I am passing the whole prompt that is mutation.mutate(values) so I will modify 'values' a bit , see contentgeneration.js
    },
    {
        withCredentials: true, //* as soon as we register this will set the cookies inside the browser
    }
    );
    return response?.data;
}