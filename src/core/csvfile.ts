import { type Options, parse } from "csv-parse/browser/esm/sync";
import { Dictionary } from "@/core/dictionary";
import type { Entry } from "@/core/core";
import _ from "lodash";
class HeaderComparison {
  public readonly unexpected: string[];
  public readonly missing: string[];

  constructor(given: string[], expected: string[]) {
    this.unexpected = _.difference(given, expected);
    this.missing = _.difference(expected, given);
  }

  public hasMismatch(): boolean {
    return this.unexpected.length !== 0 || this.missing.length !== 0;
  }
}

export default class CSVFile {
  public errors: string[] = [];

  private clearErrors(): void {
    this.errors = [];
  }

  public parse(content: string): Entry[] {
    this.clearErrors();
    const options: Options = {
      columns: this.columns,
      trim: true,
    };
    let entries: Entry[] = [];
    try {
      entries = parse(content, options) as Entry[];
    } catch (error: any) {
      this.gatherErrors(error);
    }
    return entries;
  }
  private gatherErrors(error: Error | HeaderComparison): void {
    if (error instanceof HeaderComparison) {
      _.forEach(error.unexpected, (header) => {
        this.errors.push(`Columna de mas en el archivo CSV: "${header}"`);
      });
      _.forEach(error.missing, (header) => {
        this.errors.push(`Columna que faltan en el archivo CSV: "${header}"`);
      });
    } else {
      this.errors.push(error.message);
    }
  }
  protected columns(titles: string[]): string[] {
    const comparison = new HeaderComparison(titles, Dictionary.inputWords);

    if (comparison.hasMismatch()) {
      throw comparison;
    }

    return _.map(titles, Dictionary.translate);
  }
}
