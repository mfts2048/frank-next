import chalk from 'chalk';

export function wssListenConsole(message: string) {
    // console.log(`${yellowBright('[wss:]')} ${bgBlueBright(message)}`);
    console.log(
        chalk`
CPU: {red ${message}%}
RAM: {green ${message}%}
DISK: {rgb(255,131,0) ${message}%}
`
    );
}
