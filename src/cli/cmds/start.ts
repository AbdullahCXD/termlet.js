import { TermletConfiguration } from "../../config";
import { Termlet } from "../../termlet";

export async function startCMD(entry?: string) {

  const termlet = new Termlet();

  if (entry) {

    await termlet.termlet(entry);

  } else {

    const projectConfig = new TermletConfiguration();
    const entry = projectConfig.getString("project.entry");

    if (!entry)
      throw new Error(`The entry in the termlet configuration is invalid!`)

    await termlet.termlet(entry);

  }

}