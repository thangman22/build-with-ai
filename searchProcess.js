const axios = require('axios');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const extractJson = require('extract-json-from-string');
const apiKey = ''
const geminiKey = ''

const askGemini = async (prompt) => {
    const genAI = new GoogleGenerativeAI(geminiKey);
    const model =  genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
    const result = await model.generateContent(prompt);
    const geminiResponse = await result.response;
    return geminiResponse.text();
};

module.exports.searchProcess = async (query) => {
    // const { extract } = await import("@extractus/article-extractor");

    // TODO: create query by gemini

    // TODO: call serpapi https://serpapi.com/search.json?engine=google&q=${extractJson(searchQuery)[0].query}&gl=th&hl=th&api_key=${apiKey}&num=20

    // TODO: Create array of snipet for

    // TODO: Summary based on snipet

    // TODO: Summary based on snipet generate question

    return {
        searchReference: searchResult.data.organic_results.map(r => {
            return {
                tilte: r.title,
                link: r.link,
                favicon: r.favicon,
                source: r.source
            }
        }),
        generativeResult: geminiResult,
        relatedQuestions: extractJson(relatedQuestions)[0]
    }

}




