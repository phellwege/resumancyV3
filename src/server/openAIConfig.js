import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
    organization: "org-Bke0QnnfoHEVHjPmyVSOMF0J",
    apiKey: process.env.REACT_APP_GPT_API_KEY,
});
const openai = new OpenAIApi(configuration);
const response = await openai.listEngines();