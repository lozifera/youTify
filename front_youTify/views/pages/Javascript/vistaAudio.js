function previewAudio(event) {
    const audioPreview = document.getElementById('audioPreview');
    const file = event.target.files[0];
    if (file) {
        const audioURL = URL.createObjectURL(file);
        audioPreview.src = audioURL;
        audioPreview.classList.remove('d-none');
    }
}