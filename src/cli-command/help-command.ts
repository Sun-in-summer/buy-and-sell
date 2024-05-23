import { CliCommandInterface } from './cli-command.interface.js';

export default class HelpCommand implements CliCommandInterface {
  public readonly name = '--help';

  public async  execute(): Promise<void> {
    console.log(
      `Программа для подготовки данных для REST API сервера.
      пример

      main.js --<command>[--arguments]

      Команды
      --version
      --help
      --import
      --generator <n> <path> <url>
      `
    );

  }
}
