import { format } from "date-fns";
import {
  CustomCanvasSectionSettings,
  CustomPaintingInstruction,
} from "../interfaces/signSettings";
import { CanvasSectionSettings } from "rpi-led-matrix-painter/dist/canvassectionsettings";

export interface ReplaceMap {
  key: string;
  value: string;
}
// /**
//  *
//  * @param {CustomCanvasSectionSettings[]}
//  * @param {replaceMap} [o]
//  * @param {date} [o]
//  * @return {CanvasSectionSettings[]}
//  *
//  */
export const canvasSectionsWithReplacedValues = (
  canvasSections: CustomCanvasSectionSettings[],
  replaceMap?: ReplaceMap[],
  date?: Date
): CanvasSectionSettings[] =>
  canvasSections.map((section) => {
    const representations = section.representation.map((representation) => {
      const defaultReturn = {
        ...representation,
        text: representation.text?.value,
      };
      if (!representation.text) return defaultReturn;
      if (representation.text.replaceWithDateTime)
        return {
          ...representation,
          text: formatDateTime(representation.text.value, date),
          // text: format(date || new Date(), representation.text.value),
        };
      if (replaceMap) {
        return {
          ...representation,
          text: substituteWords(representation.text?.value, replaceMap),
        };
      }
      return defaultReturn;
    });
    return {
      ...section,
      representation: representations,
    };
  });

// const formatDateTimeCatch = async ( formatString: string, date?: Date ): Promise<string> => {
//   try{
//     return format(date || new Date(), formatString);
//   } catch {
//     return formatString;
//   }
// }

export const formatDateTime = (formatString: string, date?: Date): string => {
  return format(date || new Date(), formatString);
};

export const substituteWords = (
  sentence: string,
  replaceMap: ReplaceMap[]
): string => {
  const splitSentence = sentence.split(" ");
  splitSentence.forEach((word, index) => {
    splitSentence[index] =
      replaceMap.find((element) => element.key === word)?.value ||
      splitSentence[index];
  });
  return splitSentence.join(" ");
};
