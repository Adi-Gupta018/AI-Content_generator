const OpenAI = require("openai");
const asyncHandler = require("express-async-handler");
const ContentHistory = require("../models/ContentHistory");
const User = require("../models/User");

// Set your OpenAI API key
const openai = new OpenAI({ apikey: process.env.OPENAI_API_KEY });

const openAIController = asyncHandler(async (req, res) => {
  // console.log(req);
  // const { p } = req.body?.prompt;
  // const {tone} = req.body?.tone;
  // const {cat} = req.body?.category;
  // const prompt = `${p} with ${tone} tone in ${cat} category`; //!cahnge has been done , if broke remove it ;(
  //   console.log({p,tone,cat, prompt});
  // // console.log(req.user);
  const {prompt} = req.body;
  try {
    const comp = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt, 
      temperature: 1,
      max_tokens: 3000, //TODO have to change it later
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    const content = comp?.choices[0].text?.trim();
    //create history
    const newContent = await ContentHistory.create({
      user: req?.user?._id,
      content,
    });

    //push the content into user
    const userFound = await User.findById(req?.user?.id);
    userFound.contentHistory.push(newContent?._id);

    //update apicount
    userFound.apiRequestCount +=1;


    await userFound.save();
    // console.log(comp?.choices);

    res.status(200).json(content);
  } catch (error) {
    // Handle errors if needed
    console.log("error encounter\n");
    console.error(error);
  }
});

module.exports = openAIController;
// const openai = require("openai");

// const openAIController = async (req, res) => {
//   try {
//     openai.apiKey = process.env.OPENAI_API_KEY || "your-api-key-here";
//     const { prompt } = req.body;
//     const response = await openai.Completion.create({
//       engine: "text-davinci-003",
//       prompt,
//       max_tokens: 100,
//     });

//     console.log(response.data);

//     res.status(200).json({
//       response: response.data,
//     });
//   } catch (error) {
//     console.log("Error encountered:", error);
//     res.status(500).json({
//       error: error.message || "Internal Server Error",
//     });
//   }
// };

// module.exports = openAIController;
