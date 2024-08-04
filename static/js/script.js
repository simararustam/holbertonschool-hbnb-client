document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
  
    if (loginForm) {
      loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
  
        try {
          const response = await loginUser(email, password);
          if (response.ok) {
            const data = await response.json();
            setCookie('token', data.access_token, 1); // Store the token for 1 day
            window.location.href = '/';
          } else {
            throw new Error('Login failed: ' + response.statusText);
          }
        } catch (error) {
          errorMessage.style.display = 'block';
          errorMessage.textContent = error.message;
        }
      });
    }
  });
  
  async function loginUser(email, password) {
    return fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
  }
  
  function setCookie(name, value, days) {
    let expires = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + (value || '') + expires + '; path=/';
  }