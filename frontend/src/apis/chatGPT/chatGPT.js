import axios from 'axios'

// registration

export const generateContentApi = async(userPrompt) =>{
    const response = await axios.post('http://localhost:8090/api/v1/openai/generate-content',{
        prompt:userPrompt, // here I am passing the whole prompt that is mutation.mutate(values) so I will modify 'values' a bit , see contentgeneration.js
    },
    {
        withCredentials: true, //* as soon as we register this will set the cookies inside the browser
    }
    );
    return response?.data;
}