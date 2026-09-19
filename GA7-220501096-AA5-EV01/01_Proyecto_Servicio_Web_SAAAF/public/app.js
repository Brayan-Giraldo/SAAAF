async function sendForm(form, endpoint, outputId) {
  const output = document.getElementById(outputId);
  const data = Object.fromEntries(new FormData(form).entries());
  output.textContent = 'Procesando...';
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await response.json();
    output.textContent = `HTTP ${response.status}\n${JSON.stringify(json, null, 2)}`;
  } catch (error) {
    output.textContent = `Error de conexion: ${error.message}`;
  }
}

document.getElementById('registerForm').addEventListener('submit', (event) => {
  event.preventDefault();
  sendForm(event.currentTarget, '/api/auth/register', 'registerResult');
});

document.getElementById('loginForm').addEventListener('submit', (event) => {
  event.preventDefault();
  sendForm(event.currentTarget, '/api/auth/login', 'loginResult');
});
