const socket = io('http://localhost:3000', {
    reconnectionDelayMax: 10000
});

socket.on('connect', () => {
    console.log("Conectado com sucesso");
});

socket.on('lista-online', data => {
    const divOnline = document.getElementById('lista-online');

    divOnline.innerHTML = '';
    for(id in data) {
        if(data[id].nome !== undefined) {
            divOnline.innerHTML += `<a href="#" class="list-group-item list-group-item-action">${data[id].nome}</a>`;
        }
    }
});

socket.on('historico-mensagem', data => {
    console.log(`Chegou o historico de mensagem... ${data}`);
    const divMsg= document.getElementById('msgs');

    for(id in data) {
        divMsg.innerHTML += `<p class="text-left"><b>${data[id].nome}:</b> ${data[id].mensagem}</p>`;
    }
});

socket.on('nova-mensagem', data => {
    console.log(`Chegou mensagem... ${data}`);
    const divMsg= document.getElementById('msgs');

    divMsg.innerHTML += `<p class="text-left"><b>${data.nome}:</b> ${data.mensagem}</p>`;
});

const form = document.getElementById('form-msg');
form.addEventListener('submit', event => {
    event.preventDefault();

    socket.emit(
        'mensagem',
        {
            nome: form.nome.value,
            mensagem: form.mensagem.value
        }
    );

    form.mensagem.value = '';
});