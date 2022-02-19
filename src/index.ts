import {WebSocket, WebSocketServer} from 'ws';
import {randomUUID} from 'crypto';

const ws = new WebSocketServer({
  port: parseInt(process.env.PORT as string) || 8080,
});

let clientsArray: Array<{connection: WebSocket; id: string}> = [];

ws.on('listening', () => {
  console.log('Server started listening in port 9090');
});

ws.on('connection', connection => {
  const id = randomUUID();
  clientsArray.push({connection, id});

  connection.on('open', () => {
    console.log('User connected', id);
  });

  connection.on('error', error => {
    console.error('An Error has occured', error);
  });

  connection.on('message', message => {
    clientsArray
      .filter(client => client.id !== id)
      .forEach(client =>
        client.connection.send(
          JSON.stringify({client: id, text: JSON.parse(message.toString())})
        )
      );
    console.log('Message from', id);
  });

  connection.on('close', () => {
    clientsArray = clientsArray.filter(client => client.id !== id);
    clientsArray.forEach(client =>
      client.connection.send(
        JSON.stringify({client: id, text: 'I disconnected'})
      )
    );
    console.log('User disconnected', id);
  });
});
