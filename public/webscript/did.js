async function getDepartmentDetails(url, uniqueId) {
  try {
    let response = await fetch(
      `${url}/api/v1/contact-script/get-details/${uniqueId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      },
    );
    return await response.json();
  } catch (e) {
    console.log(e);
  }
}

async function sendMessage(formData, url) {
  try {
    const payload = {
      did: formData.get('department'),
      number: formData.get('phone'),
      message: formData.get('message'),
      name: formData.get('name'),
    };
    const messageApiUrl = `${url}/api/v1/conversation/contact-us`;
    let response = await fetch(messageApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return await response.json();
  } catch (e) {
    console.log(e);
  }
}

document.addEventListener('DOMContentLoaded', async function () {
  const scriptTag = document.getElementById('auxScript');
  const id = scriptTag.getAttribute('data-id');
  const url = scriptTag.getAttribute('data-url');
  const details = await getDepartmentDetails(url, id);
  const {
    color,
    bubble_icon,
    termsandconditions_url,
    website_url,
    website_name,
    did,
  } = details;
  const image_url =
    bubble_icon === '1'
      ? 'https://cdn.iconscout.com/icon/premium/png-256-thumb/quote-end-double-important-syntax-1-58233.png'
      : bubble_icon === '2'
      ? 'https://cdn-icons-png.flaticon.com/512/1310/1310190.png'
      : 'https://static.vecteezy.com/system/resources/previews/011/911/176/original/smartphone-icon-with-transparent-background-free-png.png';

  const styles = `
  #open-chat, #close-chat {
      position: fixed !important;
      bottom: 20px !important;
      right: 20px !important;
      background: ${color};
      color: white !important;
      border: none !important ;
      padding: 10px !important;
      cursor: pointer !important;
      border-radius: 30px !important;
      width: 60px !important;
      height: 60px !important;
      z-index: 9999 !important;
  }
  #open-chat img {
      width: 30px !important;
      height: 30px !important;
      margin: 0px !important;
  }
  #chat-widget {
      position: fixed !important;
      bottom: 90px !important;
      right: 20px !important;
      background: white !important;
      border-radius: 10px !important;
      width: 300px !important;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1) !important;
      display: flex;
      flex-direction: column !important;
      justify-content: space-between !important;
      color: black !important;
      z-index: 9999 !important;
  }
  #chat-header {
      background: ${color} !important;
      color: white !important;
      padding: 10px !important;
      border-top-left-radius: 10px !important;
      border-top-right-radius: 10px !important;
      font-size: 16px !important;
  }
  #chat-body {
      padding: 10px !important;
      flex: 1 !important;
      overflow-y: auto !important;
  }
  input[type=number]::-webkit-outer-spin-button,
  input[type=number]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type=number] {
    -moz-appearance: textfield;
  }
  #chat-form input, #chat-form textarea, #chat-form select {
      width: 100% !important;
      border: none !important;
      border-bottom: 1px solid #ccc !important;
      outline: none !important;
      background-color: transparent !important;
      padding: 10px !important;
      box-sizing: border-box !important;
      font-family: sans-serif;
      border-radius: 0 !important;
  }
  #chat-agree {
      display: flex !important;
      font-size: 12px !important;
      align-items: center !important;
      margin: 5px 0px !important;
  }
  #chat-agree input {
      width: auto !important;
      margin-right: 10px !important;
  }
  #chat-send-button {
      margin-top: 10px;
      width: 100%;
      outline: 0;
      border: 0;
      color: white;
      background: ${color};
      padding: 5px 0px;
  }
  #chat-send-button:disabled {
      opacity: 0.3;
  }
  #chat-alert {
      padding: 5px !important;
      background: #f8ffd6 !important;
      font-size: 12px  !important;
      flex: 1 !important;
  }
  #chat-alert-success {
      padding: 5px !important;
      background: #6bdb95 !important;
      font-size: 12px  !important;
      flex: 1 !important;
  }
  #chat-footer {
      padding: 10px !important;
      border-top: 1px solid #ccc !important;
  }
  `;

  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);

  let openChatButton;
  let closeChatButton;
  let chatWidget;
  let formComponent;

  function createChatElements() {
    // Create open chat button
    const img = document.createElement('img');
    img.src = image_url;
    img.alt = 'Chat Image';
    openChatButton = document.createElement('button');
    openChatButton.id = 'open-chat';
    openChatButton.appendChild(img);
    document.body.appendChild(openChatButton);

    // Create close chat button
    closeChatButton = document.createElement('button');
    closeChatButton.id = 'close-chat';
    closeChatButton.textContent = 'X';
    closeChatButton.style.display = 'none';
    closeChatButton.style.transition = 'background-color 0.3s ease';
    document.body.appendChild(closeChatButton);
  }

  function createChatWidget() {
    // Create chat widget
    chatWidget = document.createElement('div');
    chatWidget.id = 'chat-widget';

    const chatHeader = document.createElement('div');
    chatHeader.id = 'chat-header';
    chatHeader.textContent = 'Chat with us';

    const chatBody = document.createElement('div');
    chatBody.id = 'chat-body';

    // Create form
    formComponent = document.createElement('form');
    formComponent.id = 'chat-form';

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.autocomplete = 'off';
    nameInput.name = 'name';
    nameInput.placeholder = 'Enter your name';
    nameInput.required = true;

    const phoneInput = document.createElement('input');
    phoneInput.type = 'number';
    phoneInput.autocomplete = 'off';
    phoneInput.name = 'phone';
    phoneInput.placeholder = 'Enter your mobile number';
    phoneInput.required = true;
    did;

    const selectInput = document.createElement('input');
    selectInput.type = 'text';
    selectInput.name = 'department';
    selectInput.value = did;
    selectInput.hidden = true;

    const messageInput = document.createElement('textarea');
    messageInput.autocomplete = 'off';
    messageInput.name = 'message';
    messageInput.placeholder = 'Enter your message';
    messageInput.required = true;

    const agreeLabel = document.createElement('label');
    agreeLabel.id = 'chat-agree';
    const agreeInput = document.createElement('input');
    agreeInput.type = 'checkbox';
    agreeInput.name = 'agree';
    agreeInput.required = true;
    agreeLabel.appendChild(agreeInput);
    agreeLabel.appendChild(
      document.createTextNode(' I agree to the terms and conditions.'),
    );

    const alert = document.createElement('div');
    alert.id = 'chat-alert';
    alert.innerHTML = `By submitting, you authorize ${website_name} to send text messages with offers & other information, possibly using automated technology, to the number you provided.`;

    const sendButton = document.createElement('button');
    sendButton.id = 'chat-send-button';
    sendButton.type = 'submit';
    sendButton.textContent = 'Send';

    formComponent.appendChild(nameInput);
    formComponent.appendChild(phoneInput);
    formComponent.appendChild(selectInput);
    formComponent.appendChild(messageInput);
    formComponent.appendChild(alert);
    formComponent.appendChild(agreeLabel);
    formComponent.appendChild(sendButton);
    chatBody.appendChild(formComponent);

    const chatFooter = document.createElement('div');
    chatFooter.id = 'chat-footer';
    const footerText = document.createElement('p');
    footerText.style.fontSize = '12px';
    footerText.innerHTML = `© 2024 ${website_name}. All Rights Reserved. <br><a href="${website_url}">Visit our Website</a> | <a href="${termsandconditions_url}">Terms of Use</a> `;
    chatFooter.appendChild(footerText);

    chatWidget.appendChild(chatHeader);
    chatWidget.appendChild(chatBody);
    chatWidget.appendChild(chatFooter);

    document.body.appendChild(chatWidget);

    formComponent.addEventListener('submit', async function () {
      event.preventDefault();
      sendButton.disabled = true;
      const formData = new FormData(formComponent);
      const response = await sendMessage(formData, url);
      if (response) {
        const success = document.createElement('div');
        success.id = 'chat-alert-success';
        success.innerHTML = 'Thanks. We will contact you soon!';
        formComponent.remove();
        chatBody.appendChild(success);
        setTimeout(() => {
          chatWidget.remove();
          openChatButton.style.display = 'block';
          closeChatButton.style.display = 'none';
        }, 2000);
      }
    });
  }

  createChatElements();

  openChatButton.addEventListener('click', function () {
    openChatButton.style.display = 'none';
    closeChatButton.style.display = 'block';
    createChatWidget();
  });

  closeChatButton.addEventListener('click', function () {
    openChatButton.style.display = 'block';
    closeChatButton.style.display = 'none';
    chatWidget.remove();
  });
});
