const form = document.getElementById('feedbackForm');
const errorMessage = document.getElementById('errorMessage');
const spinner = document.getElementById('spinner');
const submitBtn = document.getElementById('submitBtn');

form.addEventListener('submit', function(e){
  e.preventDefault();
  errorMessage.textContent = '';

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if(!name || !email || !message){
    errorMessage.textContent = 'Lütfen tüm alanları doldurun.';
    return;
  }

  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
    errorMessage.textContent = 'Geçerli bir email adresi girin.';
    return;
  }

  // Gönderme sırasında butonu devre dışı bırak ve spinner göster
  submitBtn.disabled = true;
  spinner.style.display = 'inline-block';

  fetch('feedback.php', {
    method:'POST',
    body: new FormData(form)
  })
  .then(res => res.json())
  .then(data => {
    // Her durumda butonu aktif yap ve spinner gizle
    submitBtn.disabled = false;
    spinner.style.display = 'none';

    if(data.status === 'success'){
      form.style.display = 'none';
      const successMsg = document.getElementById('successMessage');
      document.getElementById('sentName').textContent = data.name;
      document.getElementById('sentEmail').textContent = data.email;
      document.getElementById('sentMessage').textContent = data.message;
      successMsg.classList.add('show');
    } else {
      errorMessage.textContent = data.message || 'Bir hata oluştu.';
    }
  })
  .catch(err => {
    submitBtn.disabled = false;
    spinner.style.display = 'none';
    console.error(err);
    errorMessage.textContent = 'Sunucuya bağlanılamadı.';
  });
});

function resetForm(){
  form.reset();
  form.style.display = 'block';
  document.getElementById('successMessage').classList.remove('show');
  submitBtn.disabled = false;   // reset sonrası buton aktif
  spinner.style.display = 'none';
  document.getElementById('name').focus();
}

document.getElementById('message').addEventListener('input', function(){
  this.style.height = 'auto';
  this.style.height = this.scrollHeight + 'px';
});
