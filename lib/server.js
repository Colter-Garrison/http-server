import chalk from 'chalk';
import net from 'net';

const serverLog = (...args) => console.log(chalk.magenta('[server]'), ...args);

export const serve = (host, port) => {
  const server = net.createServer((socket) => {
    serverLog('A peer connected!')
    socket.on('data', (data) => {
      const dataStr = data.toString();
      serverLog('Data received: ', dataStr);
      const lines = dataStr.split('\n')
      const startLine = lines[0];
      const [ method, path, ] = startLine.split(' ');
      if(method == 'GET' && path == '/') {
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

${body}`)
      } else if (method == 'GET' && path == '/posts') {
        const jsonObj = {"name":"Jessica", "age":30, "metal head":true};
        socket.write(`HTTP/1.1 200 Ok
Content-Length: ${JSON.stringify(jsonObj).length} 
Content-Type: application/json

${JSON.stringify(jsonObj)}`)
      } else if (method == 'POST' && path == '/mail') {
        socket.write(`HTTP/1.1 204 No Content
Content-Length: 0
Content-Type: application/json

`);
      } else {
        socket.write(`HTTP/1.1 404 GET OUT O' HEEERE
Content-Length: 0
Accept: application/json, text/html

`);
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