import { ValueSetRule } from '../../src/fshtypes/rules';
import { importSingleText } from '../testhelpers/importSingleText';
import { importMultipleText } from '../testhelpers/importMultipleText';

// Aliases are tested as part of the other entity tests where aliases are allowed
// but these tests ensure that aliases work generally and can be in any order

describe('FSHImporter', () => {
  describe('Alias', () => {
    it('should collect and return aliases in result', () => {
      const input = `
      Alias: LOINC = http://loinc.org
      Alias: SCT = http://snomed.info/sct

      Profile: ObservationProfile
      Parent: Observation

      Alias: RXNORM = http://www.nlm.nih.gov/research/umls/rxnorm

      Profile: AnotherObservationProfile
      Parent: Observation

      Alias: UCUM = http://unitsofmeasure.org
      `;

      const result = importSingleText(input);
      expect(result.aliases.size).toBe(4);
      expect(result.aliases.get('LOINC')).toBe('http://loinc.org');
      expect(result.aliases.get('SCT')).toBe('http://snomed.info/sct');
      expect(result.aliases.get('RXNORM')).toBe('http://www.nlm.nih.gov/research/umls/rxnorm');
      expect(result.aliases.get('UCUM')).toBe('http://unitsofmeasure.org');
    });

    it('should translate an alias when the alias is defined before its use', () => {
      const input = `
      Alias: LOINC = http://loinc.org

      Profile: ObservationProfile
      Parent: Observation
      * code from LOINC
      `;

      const result = importSingleText(input);
      const rule = result.profiles.get('ObservationProfile').rules[0] as ValueSetRule;
      expect(rule.valueSet).toBe('http://loinc.org');
    });

    it('should translate an alias when the alias is defined after its use', () => {
      const input = `
      Profile: ObservationProfile
      Parent: Observation
      * code from LOINC

      Alias: LOINC = http://loinc.org
      `;

      const result = importSingleText(input);
      const rule = result.profiles.get('ObservationProfile').rules[0] as ValueSetRule;
      expect(rule.valueSet).toBe('http://loinc.org');
    });

    it('should not translate an alias when the alias does not match', () => {
      const input = `
      Alias: LOINC = http://loinc.org

      Profile: ObservationProfile
      Parent: Observation
      * code from LAINC
      `;

      const result = importSingleText(input);
      const rule = result.profiles.get('ObservationProfile').rules[0] as ValueSetRule;
      expect(rule.valueSet).toBe('LAINC');
    });

    it('should translate an alias from any input file', () => {
      const input = `
      Profile: ObservationProfile
      Parent: Observation
      * code from LOINC
      `;
      const input2 = `
      Alias: LOINC = http://loinc.org
      `;

      const results = importMultipleText([input, input2]);
      expect(results.length).toBe(2);
      const rule = results[0].profiles.get('ObservationProfile').rules[0] as ValueSetRule;
      expect(rule.valueSet).toBe('http://loinc.org');
    });
  });
});
