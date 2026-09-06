import translations from "./index.json" with { type: "json" }

const translate = (id, lang, defaulT) => {
    return translations[lang][id] ? translations[lang][id] : defaulT ? defaulT : "No translated"
}

export {
    translations,
    translate
}