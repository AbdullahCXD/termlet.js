import { Termlet } from "../termlet";

export class MoudleResolution {

  static load(file: string) {
    return new MoudleResolution(file);
  }

  constructor(public file: string) {

  }

  async execute() {

    const termlet = new Termlet();

    await termlet.termlet(this.file);

  }

}