const webSocket = new WebSocket('ws://[fe80:0000:0000:0000:4e11:aeff:fe8f:7db0]');

webSocket.onopen = () => {
    console.log('Connection opened!');
    webSocket.send('Hello Server!');
};

// Listen for messages
webSocket.onmessage = event => {
    console.log('Message from server ', event.data);
};

// Listen for possible errors
webSocket.onerror = error => {
    console.log('WebSocket Error ', error);
};

// Listen for connection close
webSocket.onclose = e => {
    console.log('WebSocket connection closed: ', e);
};

export {};
