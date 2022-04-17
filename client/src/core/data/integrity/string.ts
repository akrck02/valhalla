export class StringUtils {

    static DEFAULT_TOLERANCE = 2;

    /**
     * The Levenshtein distance between two strings
     * @param str1 The first string
     * @param str2 The second string
     * @returns The Levenshtein distance between the two strings
     */
    static levenshteinDistance(str1 = '', str2 = '') {
        const track = Array(str2.length + 1).fill(null).map(() =>
            Array(str1.length + 1).fill(null));
        for (let i = 0; i <= str1.length; i += 1) {
            track[0][i] = i;
        }
        for (let j = 0; j <= str2.length; j += 1) {
            track[j][0] = j;
        }
        for (let j = 1; j <= str2.length; j += 1) {
            for (let i = 1; i <= str1.length; i += 1) {
                const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
                track[j][i] = Math.min(
                    track[j][i - 1] + 1, // deletion
                    track[j - 1][i] + 1, // insertion
                    track[j - 1][i - 1] + indicator, // substitution
                );
            }
        }
        return track[str2.length][str1.length];
    };

    static orderByLevenshteinDistance(text: string, words: string[]): string[] {
        const ordered = [];
        words.sort((a, b) => {
            const distA = this.levenshteinDistance(text, a);
            const distB = this.levenshteinDistance(text, b);
            return distA - distB;
        });
        return words;
    }



    /**
     * Get if the text contains the searcher with typo tolerance
     * @param text The text to search in
     * @param searcher The text to search for
     * @returns True if the text contains the searcher
     */
    static containsMatching(text: string, searcher: string): boolean {
        return StringUtils.containsMatchingWithTolerance(text, searcher, StringUtils.DEFAULT_TOLERANCE);
    }

    /**
     * Get if the text contains the searcher with typo tolerance
     * @param text The text to search in 
     * @param searcher The text to search for
     * @param tolerance The tolerance to use
     * @returns True if the text contains the searcher
     */
    static containsMatchingWithTolerance(text: string, searcher: string, tolerance: number): boolean {

        text = StringUtils.normalized(text.toUpperCase());
        searcher = StringUtils.normalized(searcher.toUpperCase());

        let matching = false;
        const words = text.split(/\s/);
        words.forEach(word => {
            const currentDistance = StringUtils.levenshteinDistance(searcher, word);
            const realTolerance = tolerance;

            if (word.indexOf(searcher) != -1 || currentDistance < realTolerance) {
                matching = true;
                return;
            }

        });
        ;
        return matching;
    }

    /**
	 * Returns a word matching with typo tolerance
	 * @param text The text to search in
	 * @param searcher The word to search for
	 * @param tolerance The tolerance to use 
	 * @return
	 */
    public static getMatching(text : string, searcher : string) : string {
        return StringUtils.getMatchingWithTolerance(text, searcher, StringUtils.DEFAULT_TOLERANCE);
    }

	/**
	 * Returns a word matching with typo tolerance
	 * @param text The text to search in
	 * @param searcher The word to search for
	 * @param tolerance The tolerance to use 
	 * @return
	 */
     public static getMatchingWithTolerance(text : string, searcher : string, tolerance : number) : string {

		const words = text.split(/\s/);
        let matchingWord = '';
        words.forEach(word => {
	
            const currentDistance = StringUtils.levenshteinDistance(StringUtils.normalized(searcher).toUpperCase(), StringUtils.normalized(word).toUpperCase());
            const realTolerance = tolerance;			
            
            if(StringUtils.normalized(word).toUpperCase().indexOf(searcher.toUpperCase()) != -1 || currentDistance < realTolerance) {
                matchingWord = word;
                return;
            }
		
        });
		
		return matchingWord;
	}


    /**
    * Get normalized text (no accents)
    * @param text
    * @return the text without accents
    */
    static normalized(text: string): string {

        const sensible = [
            "\u00C1",
            "\u00C9",
            "\u00CD",
            "\u00D3",
            "\u00DA",
            "\u00D1",

            "\u00E1",
            "\u00E9",
            "\u00ED",
            "\u00F3",
            "\u00FA",
            "\u00F1",

        ];
        const normalized = ["A", "E", "I", "O", "U", "N", "a", "e", "i", "o", "u", "n"];

        for (let i = 0; i < normalized.length; i++) {
            text = text.replaceAll(sensible[i], normalized[i]);
        }

        return text;
    }


}
