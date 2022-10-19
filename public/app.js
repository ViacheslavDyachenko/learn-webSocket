(function () {
    const messages = document.querySelector('#messages');
    const input = document.querySelector('#input')
    const wsButton = document.querySelector('#wsButton');
    const wsSendButton = document.querySelector('#wsSendButton');
    const logout = document.querySelector('#logout');
    const login = document.querySelector('#login');
  
    function showMessage(message, text) {
      messages.textContent += `\n${text ? text : message}`;
      messages.scrollTop = messages.scrollHeight;
    }
  
    function handleResponse(response) {
      return response.ok
        ? response.json().then((data) => JSON.stringify(data, null, 2))
        : Promise.reject(new Error('Unexpected response'));
    }
  
    login.onclick = function () {
      fetch('/login', { method: 'POST', credentials: 'same-origin' })
        .then(handleResponse)
        .then(showMessage)
        .catch(function (err) {
          showMessage(err.message);
        });
    };
  
    logout.onclick = function () {
      fetch('/logout', { method: 'DELETE', credentials: 'same-origin' })
        .then(handleResponse)
        .then(showMessage)
        .catch(function (err) {
          showMessage(err.message);
        });
    };
  
    let ws;
  
    wsButton.onclick = function () {
      if (ws) {
        ws.onerror = ws.onopen = ws.onclose = null;
        ws.close();
      }
  
      ws = new WebSocket(`ws://${location.host}`);
      ws.onerror = function () {
        showMessage('WebSocket error');
      };
      ws.onopen = function () {
        showMessage('WebSocket connection established');
      };
      ws.onclose = function () {
        showMessage('WebSocket connection closed');
        ws = null;
      };
    };
  
    wsSendButton.onclick = function () {
      if (!ws) {
        showMessage('No WebSocket connection');
        return;
      }
      if (input.value) {
        ws.send(input.value)
        showMessage(input.value)
        input.style.borderColor = ''
      } else {
        input.style.borderColor = 'red'
      }
    };
  })();