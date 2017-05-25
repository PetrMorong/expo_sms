class Translator
{
    cacheKey = "translator";

    missingTranslates = []; //Missing translates must be stored and requested from server

    translates;

    constructor(translates = {})
    {
        this.translates = translates;
    }

    setTranslates(translates = {})
    {
        this.translates = translates;
    }

    // ('count_of_sms', 'Count of Sms')
    translate(key, defaultLabel = undefined)
    {
        let translate = this.translates[key];

        if (!translate && !defaultLabel){
            let key2 = Translator.createDefaultLabel(key);
            translate = this.translates[key2];
            if (!translate){
                this.missingTranslates.push(key2);
                return key;
            }
            return translate;
        }

        return translate;
    }

    /**
     * @param key string
     * */
    static createDefaultLabel(key)
    {
        return key.replace(/([A-Z])|(\s+)/g, (m, m1, m2) => {
            if (m1){
                return m1.toLowerCase();
            }
            return "_";
        });
    }
}

export default Translator;