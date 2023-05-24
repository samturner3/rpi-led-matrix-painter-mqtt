import { CustomCanvasSectionSettings } from "../interfaces/signSettings";
import {
  canvasSectionsWithReplacedValues,
  ReplaceMap,
  substituteWords,
} from "./replaceValues";

type Subset<K> = {
  [attr in keyof K]?: K[attr] extends object
    ? Subset<K[attr]>
    : K[attr] extends object | null
    ? Subset<K[attr]> | null
    : K[attr] extends object | null | undefined
    ? Subset<K[attr]> | null | undefined
    : K[attr];
};

describe("replaceValues", () => {
  describe("canvasSectionsWithReplacedValues", () => {
    it("Should do nothing with no text", () => {
      const exampleStartCanvasSection: Subset<CustomCanvasSectionSettings>[] = [
        {
          representation: [
            {
              id: "no text",
            },
          ],
        },
      ];
      const result = canvasSectionsWithReplacedValues(
        exampleStartCanvasSection as CustomCanvasSectionSettings[]
      );

      expect(result).toEqual([
        {
          ...exampleStartCanvasSection[0],
          representation: [
            {
              id: "no text",
              text: undefined,
            },
          ],
        },
      ]);
    });

    it("Should replace whole static text", () => {
      const testReplaceMap: ReplaceMap[] = [
        {
          key: "$customValue",
          value: "hello world",
        },
      ];

      const exampleStartCanvasSection: Subset<CustomCanvasSectionSettings>[] = [
        {
          representation: [
            {
              id: "Replace static text",
              text: { value: "$customValue" },
            },
          ],
        },
      ];
      const result = canvasSectionsWithReplacedValues(
        exampleStartCanvasSection as CustomCanvasSectionSettings[],
        testReplaceMap
      );

      expect(result).toEqual([
        {
          ...exampleStartCanvasSection[0],
          representation: [
            {
              id: "Replace static text",
              text: "hello world",
            },
          ],
        },
      ]);
    });

    it("Should replace partial static text", () => {
      const testReplaceMap: ReplaceMap[] = [
        {
          key: "$customValue",
          value: "hello world",
        },
      ];

      const exampleStartCanvasSection: Subset<CustomCanvasSectionSettings>[] = [
        {
          representation: [
            {
              id: "Replace partial static text",
              text: { value: "$customValue it is a nice day" },
            },
          ],
        },
      ];
      const result = canvasSectionsWithReplacedValues(
        exampleStartCanvasSection as CustomCanvasSectionSettings[],
        testReplaceMap
      );

      expect(result).toEqual([
        {
          ...exampleStartCanvasSection[0],
          representation: [
            {
              id: "Replace partial static text",
              text: "hello world it is a nice day",
            },
          ],
        },
      ]);
    });

    it("Should only replace subbed words", () => {
      const testReplaceMap: ReplaceMap[] = [
        {
          key: "fox",
          value: "cat",
        },
        {
          key: "$slow",
          value: "quick",
        },
      ];

      const exampleStartCanvasSection: Subset<CustomCanvasSectionSettings>[] = [
        {
          representation: [
            {
              id: "Replace subbed partial static text",
              text: { value: "The $slow brown fox jumps over the lazy dog" },
            },
          ],
        },
      ];
      const result = canvasSectionsWithReplacedValues(
        exampleStartCanvasSection as CustomCanvasSectionSettings[],
        testReplaceMap
      );

      expect(result).toEqual([
        {
          ...exampleStartCanvasSection[0],
          representation: [
            {
              id: "Replace subbed partial static text",
              text: "The quick brown cat jumps over the lazy dog",
            },
          ],
        },
      ]);
    });

    it("Should not change anything with static text", () => {
      const exampleStartCanvasSection: Subset<CustomCanvasSectionSettings>[] = [
        {
          representation: [
            {
              id: "static text",
              text: { value: "Hi there" },
            },
          ],
        },
      ];
      const result = canvasSectionsWithReplacedValues(
        exampleStartCanvasSection as CustomCanvasSectionSettings[]
      );

      expect(result).toEqual([
        {
          ...exampleStartCanvasSection[0],
          representation: [
            {
              id: "static text",
              text: "Hi there",
            },
          ],
        },
      ]);
    });

    it("Should work to replace the time", () => {
      const exampleStartCanvasSection: Subset<CustomCanvasSectionSettings>[] = [
        {
          representation: [
            {
              id: "time",
              text: { value: "HH:mm:ss:SSS", replaceWithDateTime: true },
            },
          ],
        },
      ];
      const result = canvasSectionsWithReplacedValues(
        exampleStartCanvasSection as CustomCanvasSectionSettings[],
        undefined,
        new Date(1684920770265)
      );

      expect(result).toEqual([
        {
          ...exampleStartCanvasSection[0],
          representation: [
            {
              id: "time",
              text: "19:32:50:265",
            },
          ],
        },
      ]);
    });

    it("Should replace partial time", () => {
      const exampleStartCanvasSection: Subset<CustomCanvasSectionSettings>[] = [
        {
          representation: [
            {
              id: "time",
              text: { value: "h 'o''clock'", replaceWithDateTime: true },
            },
          ],
        },
      ];
      const result = canvasSectionsWithReplacedValues(
        exampleStartCanvasSection as CustomCanvasSectionSettings[],
        undefined,
        new Date(1684920770265)
      );

      expect(result).toEqual([
        {
          ...exampleStartCanvasSection[0],
          representation: [
            {
              id: "time",
              text: "7 o'clock",
            },
          ],
        },
      ]);
    });

    // it("Should handle malformed time format", () => {
    //   const exampleStartCanvasSection: Subset<CustomCanvasSectionSettings>[] = [
    //     {
    //       representation: [
    //         {
    //           id: "time",
    //           text: { value: "hour", replaceWithDateTime: true },
    //         },
    //       ],
    //     },
    //   ];
    //   const result = canvasSectionsWithReplacedValues(
    //     exampleStartCanvasSection as CustomCanvasSectionSettings[],
    //     undefined,
    //     new Date(1684920770265)
    //   );

    //   expect(result).toEqual([
    //     {
    //       ...exampleStartCanvasSection[0],
    //       representation: [
    //         {
    //           id: "time",
    //           text: "7 o'clock",
    //         },
    //       ],
    //     },
    //   ]);
    // });

    it("Should work to replace the date", () => {
      const exampleStartCanvasSection: Subset<CustomCanvasSectionSettings>[] = [
        {
          representation: [
            {
              id: "date",
              text: { value: "yyyy-MM-dd", replaceWithDateTime: true },
            },
          ],
        },
      ];
      const result = canvasSectionsWithReplacedValues(
        exampleStartCanvasSection as CustomCanvasSectionSettings[],
        undefined,
        new Date(1684920770265)
      );

      expect(result).toEqual([
        {
          ...exampleStartCanvasSection[0],
          representation: [
            {
              id: "date",
              text: "2023-05-24",
            },
          ],
        },
      ]);
    });

    it("Should not change if replaceWithDateTime is set to false", () => {
      const exampleStartCanvasSection: Subset<CustomCanvasSectionSettings>[] = [
        {
          representation: [
            {
              id: "date",
              text: { value: "yyyy-MM-dd", replaceWithDateTime: false },
            },
          ],
        },
      ];
      const result = canvasSectionsWithReplacedValues(
        exampleStartCanvasSection as CustomCanvasSectionSettings[],
        undefined,
        new Date(1684920770265)
      );

      expect(result).toEqual([
        {
          ...exampleStartCanvasSection[0],
          representation: [
            {
              id: "date",
              text: "yyyy-MM-dd",
            },
          ],
        },
      ]);
    });
  });
  describe("substituteWords", () => {
    it("Should only replace subbed words", () => {
      const testReplaceMap: ReplaceMap[] = [
        {
          key: "fox",
          value: "cat",
        },
        {
          key: "$slow",
          value: "quick",
        },
      ];

      const startSentence = "The $slow brown fox jumps over the lazy dog";

      const result = substituteWords(startSentence, testReplaceMap);

      expect(result).toEqual("The quick brown cat jumps over the lazy dog");
    });
  });
});
