import { execSync } from "child_process";
import { TermletConfiguration } from "../../config";
import { executeCommand, logger } from "../../utils";
import chalk from "chalk";
import { writeFileSync } from "fs";
import path from "path";

const baseFile = `<?xml version="1.1" encoding="UTF-8"?>

<TermletProject renderer="termlet-base" version="2.0.0">

  <Header>
    <Meta key="terminal.title" value="Attracted to this" />
    <Meta key="language.warnings" value="ignore" />
    <Meta key="terminal.log" value="false" />
  </Header>

  <Content>

    <Text id="test">
      Hello World 
    </Text>

    <Boxed>Hello from this script</Boxed>
    <Boxed title="I love Termlet" color="green">Wow this includes a color and a title</Boxed>

    <ColoredText color="yellowBright" warning="false">This is colored!</ColoredText>

    <Input type="text" title_alignment="center" id="message">Write a message here</Input>

  </Content>

</TermletProject>`

export function createCMD(name: string) {

  logger.info(`Creating a brand new Termlet project called: \`${name}\``);

  TermletConfiguration.newProject(name);

  logger.point(`main.tml`);

  writeFileSync(path.join(process.cwd(), 'main.tml'), baseFile);

  logger.point(`npm init -y`);

  executeCommand("npm init -y");

  logger.point(`npm install termlet.js@latest`);

  executeCommand("npm install -D termlet.js@latest");

  logger.info(`Created Termlet project successfully at ${process.cwd()}`);

}