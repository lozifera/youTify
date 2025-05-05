function previewImage(event) {
    const preview = document.getElementById('preview');
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        preview.src = e.target.result;
        preview.classList.remove('d-none');
      };
      reader.readAsDataURL(file);
    }
  }

