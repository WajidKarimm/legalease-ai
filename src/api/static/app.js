const btn = document.getElementById('predict');
const inputEl = document.getElementById('input');
const outEl = document.getElementById('output');
const statusEl = document.getElementById('status');

btn.addEventListener('click', async () => {
  btn.disabled = true;
  statusEl.textContent = 'Sending...';
  outEl.textContent = '';
  try {
    const raw = inputEl.value;
    const json = JSON.parse(raw);
    const payload = { data: json };
    const res = await fetch('/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const text = await res.text();
      outEl.textContent = `Error ${res.status}: ${text}`;
    } else {
      const data = await res.json();
      outEl.textContent = JSON.stringify(data, null, 2);
    }
  } catch (err) {
    outEl.textContent = 'Client error: ' + err.toString();
  } finally {
    btn.disabled = false;
    statusEl.textContent = '';
  }
});