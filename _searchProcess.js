const axios = require('axios')
const { GoogleGenerativeAI } = require("@google/generative-ai")
const extractJson = require('extract-json-from-string')

const apiKey = 'c5873209cb507a64d7ab6cc50dd532097c9b72b1efabf36afd341a352883fad6'
const geminiKey = 'AIzaSyDWm6FHiiI05g_Z2lFFVdBRfqooTueQGQQ'

const askGemini = async (prompt) => {
    const genAI = new GoogleGenerativeAI(geminiKey);
    const model =  genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
    const result = await model.generateContent(prompt);
    const geminiResponse = await result.response;
    return geminiResponse.text();
};

module.exports.searchProcess = async (query) => {
    const { extract } = await import("@extractus/article-extractor");
    // TODO: create query by gemini

    const searchQuery = await askGemini(`please modify this sentence "${query}" to the google search query to get the best result in json format "{query: ""}"`)

    // TODO: call serpapi https://serpapi.com/search.json?engine=google&q=${extractJson(searchQuery)[0].query}&gl=th&hl=th&api_key=${apiKey}&num=20

    const searchResult = await axios.get(`https://serpapi.com/search.json?engine=google&q=${extractJson(searchQuery)[0].query}&gl=th&hl=th&api_key=${apiKey}&num=20`)

    // TODO: Create array of snipet for
    const extractSnippets = []

    for(r of searchResult.data.organic_results) {
        try {
            const article = await extract(r.link)
            extractSnippets.push(article.content.replace(/(<([^>]+)>)/ig, '')) 
        } catch (error) {
            // console.error(error)
            extractSnippets.push(r.snippet)
        }

    }

    // TODO: Summary based on snipet

    console.log(`${extractSnippets.join('\n---\n')} ${'\n---\n'} Based on this contents please summary for the query "${query}" in markdown format`)
    
    const geminiResult = await askGemini(`${extractSnippets.join('\n---\n')} ${'\n---\n'} Based on this contents please summary for the query "${query}" in markdown format`)

    // TODO: Summary based on snipet generate question
    const relatedQuestions = await askGemini(`${extractSnippets.join('\n---\n')} ${'\n---\n'} Based on this contents please suggest 3 related question. in json format "{questions: []}"`)

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









