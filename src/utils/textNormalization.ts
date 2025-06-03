export interface TextNormalizationOptions {
	normalizeSpecialChars: boolean;
	normalizeAccents: boolean;
	skipSpecialChars: boolean;
	useLowercaseOnly: boolean;
}

export class TextNormalizer {
	private options: TextNormalizationOptions;

	constructor(options: TextNormalizationOptions) {
		this.options = options;
	}

	normalizeText(text: string): string {
		let normalizedText = text;

		if (this.options.normalizeSpecialChars) {
			normalizedText = this.normalizeSpecialCharacters(normalizedText);
		}

		if (this.options.normalizeAccents) {
			normalizedText = this.normalizeAccentedCharacters(normalizedText);
		}

		if (this.options.skipSpecialChars) {
			normalizedText = this.removeSpecialCharacters(normalizedText);
		}

		if (this.options.useLowercaseOnly) {
			normalizedText = normalizedText.toLowerCase();
		}

		normalizedText = this.removeLeadingWhitespace(normalizedText);

		normalizedText = normalizedText.replace(/[\r\n]/g, ' ').replace(/\s+/g, ' ').trim();

		return normalizedText.trim();
	}

	private normalizeSpecialCharacters(text: string): string {
		return text
			// Smart quotes to regular quotes
			.replace(/[\u2018\u2019]/g, "'")
			.replace(/[\u201C\u201D]/g, '"')
			// En/em dashes to regular hyphens
			.replace(/[–—]/g, '--')
			// Ellipsis to three dots
			.replace(/…/g, '...')
			// Other common special characters
			.replace(/©/g, '(c)')
			.replace(/®/g, '(r)')
			.replace(/™/g, '(tm)')
			.replace(/§/g, 'section')
			.replace(/¶/g, 'paragraph');
	}

	private normalizeAccentedCharacters(text: string): string {
		// Use Unicode normalization to decompose accented characters
		const decomposed = text.normalize('NFD');
		// Remove combining diacritical marks (accents)
		return decomposed.replace(/[\u0300-\u036f]/g, '');
	}

	private removeSpecialCharacters(text: string): string {
		// Remove symbols and special characters, keeping letters (including accented), numbers, and spaces
		return text.replace(/[^\p{L}\p{N}\s]/gu, '');
	}

	

	private removeLeadingWhitespace(text: string): string {
		return text.replace(/^[ \t]+/gm, '').trim();
	}

	// Utility method to check if a character should be skipped during typing
	shouldSkipCharacter(char: string): boolean {
		if (!this.options.skipSpecialChars) {
			return false;
		}
		// Skip symbols and special characters, keep letters (including accented), numbers, and spaces
		return !/[\p{L}\p{N}\s]/u.test(char);
	}

	// Method to detect line breaks in original text (before normalization)
	static detectLineBreaks(text: string): number[] {
		const positions: number[] = [];
		for (let i = 0; i < text.length; i++) {
			if (text[i] === '\n' || (text[i] === '\r' && text[i + 1] !== '\n')) {
				positions.push(i);
			}
		}
		return positions;
	}

	static addBlockElementLineBreaks(text: string, element: HTMLElement): string {
		const blockElements = ['div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'br'];
		const tagName = element.tagName.toLowerCase();
		
		if (blockElements.includes(tagName)) {
			const parent = element.parentElement;
			if (parent && element.nextElementSibling) {
				return text + '\n';
			}
		}
		
		return text;
	}
}