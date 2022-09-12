import chalk from 'chalk';
import net from 'net';

const serverLog = (...args) => console.log(chalk.magenta('[server]'), ...args);

export const serve = (host, port) => {
  const server = net.createServer((socket) => {
    console.log('A peer connected!')
    socket.on('data', (data) => {
      const dataStr = data.toString();
      serverLog('Data received: ', dataStr);
      const lines = dataStr.split('\n')
      const startLine = lines[0];
      const [ method, path, ] = startLine.split(' ');
      if(method == 'GET') {
        const body = `<html>
        <main>
        <h1>BEER AND METAL</h1>
        <h2>That's so MeTaL</h2>
        <p>WE GOT BEER....</p>
        <p>....AND WE GOT METAL!</p>
        </main>
        </html>`;
        socket.write(`HTTP/1.1 200 Ok
        Content-Length: ${body.length}

        ${body}`
                )
      } else {
        socket.write(dataStr.toUpperCase());
      }
    });
    socket.on('end', () => {
      serverLog('Client disconnected!');
    });
    socket.on('error', (err) => {
      serverLog('Got error!', err);
    });
  });
  server.listen(port, host, () => {
    console.log('My server is up!');
  });
  console.log('Attempting to start server');
  return server;
}