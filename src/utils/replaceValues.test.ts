import { CanvasSectionSettings } from 'rpi-led-matrix-painter/dist/canvassectionsettings';
import { canvasSectionsWithReplacedValues, ReplaceMap, preValidateDateTime } from './replaceValues';
import { SignSettings } from '../interfaces/signSettings';

type Subset<K> = {
  [attr in keyof K]?: K[attr] extends object
    ? Subset<K[attr]>
    : K[attr] extends object | null
    ? Subset<K[attr]> | null
    : K[attr] extends object | null | undefined
    ? Subset<K[attr]> | null | undefined
    : K[attr];
};

describe('replaceValues', () => {
  describe('canvasSectionsWithReplacedValues', () => {
    it('Should do nothing with no text', () => {
      const exampleStartCanvasSection: Subset<CanvasSectionSettings>[] = [
        {
          representation: [
            {
              id: 'no text',
            },
          ],
        },
      ];
      const result = canvasSectionsWithReplacedValues(exampleStartCanvasSection as CanvasSectionSettings[]);

      expect(result).toEqual([
        {
          ...exampleStartCanvasSection[0],
          representation: [
            {
              id: 'no text',
              text: undefined,
            },
          ],
        },
      ]);
    });

    it('Should replace whole static text', () => {
      const testReplaceMap: ReplaceMap[] = [
        {
          key: 'customValue',
          value: 'hello world',
        },
      ];

      const exampleStartCanvasSection: Subset<CanvasSectionSettings>[] = [
        {
          representation: [
            {
              id: 'Replace static text',
              text: '&&customValue&&',
            },
          ],
        },
      ];
      const result = canvasSectionsWithReplacedValues(
        exampleStartCanvasSection as CanvasSectionSettings[],
        testReplaceMap,
      );

      expect(result).toEqual([
        {
          ...exampleStartCanvasSection[0],
          representation: [
            {
              id: 'Replace static text',
              text: 'hello world',
            },
          ],
        },
      ]);
    });

    it('Should replace partial static text', () => {
      const testReplaceMap: ReplaceMap[] = [
        {
          key: 'customValue',
          value: 'hello world',
        },
      ];

      const exampleStartCanvasSection: Subset<CanvasSectionSettings>[] = [
        {
          representation: [
            {
              id: 'Replace partial static text',
              text: '&&customValue it is a nice day&&',
            },
          ],
        },
      ];
      const result = canvasSectionsWithReplacedValues(
        exampleStartCanvasSection as CanvasSectionSettings[],
        testReplaceMap,
      );

      expect(result).toEqual([
        {
          ...exampleStartCanvasSection[0],
          representation: [
            {
              id: 'Replace partial static text',
              text: 'hello world it is a nice day',
            },
          ],
        },
      ]);
    });

    it('Should replace multiple partial static texts', () => {
      const testReplaceMap: ReplaceMap[] = [
        {
          key: 'customValue',
          value: 'hello world',
        },
        {
          key: 'customValue2',
          value: 'hello there',
        },
      ];

      const exampleStartCanvasSection: Subset<CanvasSectionSettings>[] = [
        {
          representation: [
            {
              id: 'Replace partial static text',
              text: '&&customValue it is a nice day&& also, &&customValue2 it is a nice night&& too',
            },
          ],
        },
      ];
      const result = canvasSectionsWithReplacedValues(
        exampleStartCanvasSection as CanvasSectionSettings[],
        testReplaceMap,
      );

      expect(result).toEqual([
        {
          ...exampleStartCanvasSection[0],
          representation: [
            {
              id: 'Replace partial static text',
              text: 'hello world it is a nice day also, hello there it is a nice night too',
            },
          ],
        },
      ]);
    });

    it('Should replace multiple partial static texts and multiple dateTimes', () => {
      const testReplaceMap: ReplaceMap[] = [
        {
          key: 'customValue',
          value: 'hello world',
        },
        {
          key: 'customValue2',
          value: 'hello there',
        },
      ];

      const exampleStartCanvasSection: Subset<CanvasSectionSettings>[] = [
        {
          representation: [
            {
              id: 'Replace partial static text',
              text: "&&customValue it is a nice day&& since the time is @@HH:mm:ss@@ also, &&customValue2 it is a nice night&& too or you could say it is near @@h 'o''clock'@@",
            },
          ],
        },
      ];
      const result = canvasSectionsWithReplacedValues(
        exampleStartCanvasSection as CanvasSectionSettings[],
        testReplaceMap,
        new Date(1684920770265),
      );

      expect(result).toEqual([
        {
          ...exampleStartCanvasSection[0],
          representation: [
            {
              id: 'Replace partial static text',
              text: "hello world it is a nice day since the time is 19:32:50 also, hello there it is a nice night too or you could say it is near 7 o'clock",
            },
          ],
        },
      ]);
    });

    it('Should only replace subbed words', () => {
      const testReplaceMap: ReplaceMap[] = [
        {
          key: 'fox',
          value: 'cat',
        },
        {
          key: 'slow',
          value: 'quick',
        },
      ];

      const exampleStartCanvasSection: Subset<CanvasSectionSettings>[] = [
        {
          representation: [
            {
              id: 'Replace subbed partial static text',
              text: '&&The slow brown fox jumps over the lazy dog&&',
            },
          ],
        },
      ];
      const result = canvasSectionsWithReplacedValues(
        exampleStartCanvasSection as CanvasSectionSettings[],
        testReplaceMap,
      );

      expect(result).toEqual([
        {
          ...exampleStartCanvasSection[0],
          representation: [
            {
              id: 'Replace subbed partial static text',
              text: 'The quick brown cat jumps over the lazy dog',
            },
          ],
        },
      ]);
    });

    it('Should not change anything with static text', () => {
      const exampleStartCanvasSection: Subset<CanvasSectionSettings>[] = [
        {
          representation: [
            {
              id: 'static text',
              text: 'Hi there',
            },
          ],
        },
      ];
      const result = canvasSectionsWithReplacedValues(exampleStartCanvasSection as CanvasSectionSettings[]);

      expect(result).toEqual([
        {
          ...exampleStartCanvasSection[0],
          representation: [
            {
              id: 'static text',
              text: 'Hi there',
            },
          ],
        },
      ]);
    });

    it('Should work to replace the time', () => {
      const exampleStartCanvasSection: Subset<CanvasSectionSettings>[] = [
        {
          representation: [
            {
              id: 'time',
              text: '@@HH:mm:ss:SSS@@',
            },
          ],
        },
      ];
      const result = canvasSectionsWithReplacedValues(
        exampleStartCanvasSection as CanvasSectionSettings[],
        undefined,
        new Date(1684920770265),
      );

      expect(result).toEqual([
        {
          ...exampleStartCanvasSection[0],
          representation: [
            {
              id: 'time',
              text: '19:32:50:265',
            },
          ],
        },
      ]);
    });

    it('Should work to replace multiple times', () => {
      const exampleStartCanvasSection: Subset<CanvasSectionSettings>[] = [
        {
          representation: [
            {
              id: 'time',
              text: '@@HH:mm:ss:SSS@@ and then @@HH:mm:ss@@',
            },
          ],
        },
      ];
      const result = canvasSectionsWithReplacedValues(
        exampleStartCanvasSection as CanvasSectionSettings[],
        undefined,
        new Date(1684920770265),
      );

      expect(result).toEqual([
        {
          ...exampleStartCanvasSection[0],
          representation: [
            {
              id: 'time',
              text: '19:32:50:265 and then 19:32:50',
            },
          ],
        },
      ]);
    });

    it('Should replace partial time', () => {
      const exampleStartCanvasSection: Subset<CanvasSectionSettings>[] = [
        {
          representation: [
            {
              id: 'time',
              text: "the time is @@h 'o''clock'@@ thanks.",
            },
          ],
        },
      ];
      const result = canvasSectionsWithReplacedValues(
        exampleStartCanvasSection as CanvasSectionSettings[],
        undefined,
        new Date(1684920770265),
      );

      expect(result).toEqual([
        {
          ...exampleStartCanvasSection[0],
          representation: [
            {
              id: 'time',
              text: "the time is 7 o'clock thanks.",
            },
          ],
        },
      ]);
    });

    it('Should work to replace the date', () => {
      const exampleStartCanvasSection: Subset<CanvasSectionSettings>[] = [
        {
          representation: [
            {
              id: 'date',
              text: '@@yyyy-MM-dd@@',
            },
          ],
        },
      ];
      const result = canvasSectionsWithReplacedValues(
        exampleStartCanvasSection as CanvasSectionSettings[],
        undefined,
        new Date(1684920770265),
      );

      expect(result).toEqual([
        {
          ...exampleStartCanvasSection[0],
          representation: [
            {
              id: 'date',
              text: '2023-05-24',
            },
          ],
        },
      ]);
    });

    it('Should work to replace the time and words in same string', () => {
      const testReplaceMap: ReplaceMap[] = [
        {
          key: 'date',
          value: 'DATE',
        },
      ];
      const exampleStartCanvasSection: Subset<CanvasSectionSettings>[] = [
        {
          representation: [
            {
              id: 'date',
              text: 'The &&date&& today is @@yyyy-MM-dd@@',
            },
          ],
        },
      ];
      const result = canvasSectionsWithReplacedValues(
        exampleStartCanvasSection as CanvasSectionSettings[],
        testReplaceMap,
        new Date(1684920770265),
      );

      expect(result).toEqual([
        {
          ...exampleStartCanvasSection[0],
          representation: [
            {
              id: 'date',
              text: 'The DATE today is 2023-05-24',
            },
          ],
        },
      ]);
    });
  });
  describe('preValidateDateTime', () => {
    beforeEach(() => {
      jest.spyOn(console, 'warn').mockImplementation();
    });
    it('Should pass on correctly formatted date/time', async () => {
      const exampleSignSettings: Subset<SignSettings> = {
        canvasSections: [
          {
            representation: [
              {
                id: 'date',
                text: 'The &&date&& today is @@yyyy-MM-dd@@',
              },
            ],
          },
        ],
      };
      const data = await preValidateDateTime(exampleSignSettings as SignSettings);
      expect(data).toEqual(true);
    });
    it('Should fail on incorrectly formatted date/time', async () => {
      const exampleSignSettings: Subset<SignSettings> = {
        canvasSections: [
          {
            representation: [
              {
                id: 'date',
                text: 'The &&date&& today is @@foobar@@',
              },
            ],
          },
        ],
      };
      const data = await preValidateDateTime(exampleSignSettings as SignSettings);
      expect(data).toEqual(false);
    });
  });
});
