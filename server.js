const { setInterval } = require('timers');

const io = require('socket.io')();

let lista_online = {};
let cache_mensagens = [];

io.on('connection', client => {
    lista_online[client.id] = {
        id: client.id
    };

    console.log(`Connected ${client.id}`);

    if(lista_online.length) {
        client.emit('lista-online', lista_online);
    }

    if(cache_mensagens.length) {
        client.emit('historico-mensagem', cache_mensagens);
    }

    client.on('mensagem', data => {
        console.log(`Mensagem recebida - ${data.nome}: ${data.mensagem}`);

        lista_online[client.id].nome = data.nome;
        cache_mensagens.push(data)

        for(online in lista_online) {
            io.to(lista_online[online].id).emit('nova-mensagem', data);
        }
    });

    client.on('disconnect', reason => {
        console.log(`Disconnect ${client.id} - ${reason}`);
        delete lista_online[client.id];
    });

    setInterval(() => {
        client.emit('lista-online', lista_online);
    }, 1000);
});

io.listen(3000);