import { format } from 'date-fns';
import { CanvasSectionSettings } from 'rpi-led-matrix-painter/dist/canvassectionsettings';
import { dateTimeMatchRegexIncludeMatchers, stringWildcardMatchRegexIncludeMatchers } from '../constants';
import { WildCardMatches } from '../interfaces/common';
import { SignSettings } from '../interfaces/signSettings';
export interface ReplaceMap {
  key: string;
  value: string;
}
// /**
//  * Assuming passed canvasSections has already been validated via preValidateDateTime()
//  *
//  * @param {CustomCanvasSectionSettings[]}
//  * @param {replaceMap} [o]
//  * @param {date} [o]
//  * @return {CanvasSectionSettings[]}
//  *
//  */
export const canvasSectionsWithReplacedValues = (
  canvasSections: CanvasSectionSettings[],
  replaceMap?: ReplaceMap[],
  date?: Date,
): CanvasSectionSettings[] =>
  canvasSections.map((section) => {
    const representations = section.representation.map((representation) => {
      const defaultReturn = {
        ...representation,
        text: representation.text,
      };
      if (!representation.text) return defaultReturn;

      const foundWildcards = extractWildcards(representation.text);

      const dateTimeReplacer = (substring: string) => {
        const match = substring.split('@@')[1]; // remove leading and trailing @@
        if (match) return format(date || new Date(), match);
        return '';
      };

      const stringReplacer = (substring: string) => {
        if (replaceMap !== undefined) {
          const match = substring.split('&&')[1]; // remove leading and trailing &&
          if (match) return substituteWords(match, replaceMap);
        }
        return substring;
      };

      if (foundWildcards.dateTimeMatches.length > 0 || foundWildcards.stringMatches.length > 0) {
        let returnString = representation.text;
        if (foundWildcards.dateTimeMatches.length > 0) {
          returnString = returnString.replace(dateTimeMatchRegexIncludeMatchers, dateTimeReplacer);
        }
        if (foundWildcards.stringMatches.length > 0) {
          returnString = returnString.replace(stringWildcardMatchRegexIncludeMatchers, stringReplacer);
        }
        return {
          ...representation,
          text: returnString,
        };
      }
      return defaultReturn;
    });
    return {
      ...section,
      representation: representations,
    };
  });

export const substituteWords = (sentence: string, replaceMap: ReplaceMap[]): string => {
  const splitSentence = sentence.split(' ');
  splitSentence.forEach((word, index) => {
    splitSentence[index] = replaceMap.find((element) => element.key === word)?.value || splitSentence[index];
  });
  return splitSentence.join(' ');
};

// /**
//  * Scan for date time format wildcards and string wildcards
//  */
export const extractWildcards = (stringToCheck: string): WildCardMatches => {
  const dateTimeMatches: WildCardMatches['dateTimeMatches'] = [];
  const stringMatches: WildCardMatches['stringMatches'] = [];
  const matchesDateTimeArray = stringToCheck.match(dateTimeMatchRegexIncludeMatchers);
  if (matchesDateTimeArray?.length) dateTimeMatches.push(...matchesDateTimeArray);
  const matchesStringArray = stringToCheck.match(stringWildcardMatchRegexIncludeMatchers);
  if (matchesStringArray?.length) stringMatches.push(...matchesStringArray);
  return { dateTimeMatches, stringMatches };
};
// /**
//  * Scan SignSettings, and make sure all text date/time stamps are valid for use in 'date-fns' format()
//  */
export const preValidateDateTime = async (signSettings: SignSettings): Promise<boolean> => {
  const extractedWildcards: WildCardMatches[] = [];
  signSettings.canvasSections.forEach((section) => {
    section.representation.forEach((representation) => {
      if (representation.text) extractedWildcards.push(extractWildcards(representation.text));
    });
  });
  try {
    extractedWildcards.forEach((extractedWildcardInstance) => {
      extractedWildcardInstance.dateTimeMatches.forEach((substring) => {
        const match = substring.split('@@')[1]; // remove leading and trailing @@
        if (match) return format(new Date(), match);
      });
    });
    return true;
  } catch (err) {
    console.warn('Failed to validate DateTime matcher', err);
    return false;
  }
};
