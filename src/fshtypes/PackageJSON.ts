/**
 * PackageJSON follows the package.json format defined for FSH
 *
 * @see {@link https://build.fhir.org/ig/FHIR/ig-guidance/index.html}
 * @see {@link https://confluence.hl7.org/display/FHIR/NPM+Package+Specification}
 */
export type PackageJSON = {
  name: string;
  version: string;
  canonical: string;
  url?: string;
  title?: string;
  description?: string;
  fhirVersions?: string[];
  dependencies?: {
    [key: string]: string;
  };
  author?: string;
  maintainers?: {
    name: string;
    url?: string;
    email?: string;
  }[];
  license?: string;
};
