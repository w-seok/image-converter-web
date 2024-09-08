document.addEventListener('DOMContentLoaded', () => {
    const dropArea = document.getElementById('dropArea');
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('fileList');
    const convertedInfo = document.getElementById('convertedInfo');

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        dropArea.classList.add('drag-over');
    }

    function unhighlight() {
        dropArea.classList.remove('drag-over');
    }

    dropArea.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    fileInput.addEventListener('change', function() {
        handleFiles(this.files);
    });

    function handleFiles(files) {
        ([...files]).forEach(uploadFile);
    }

    function uploadFile(file) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <div class="file-info">
                <strong>${file.name}</strong> (${formatBytes(file.size)})
            </div>
            <div class="file-actions">
                <select>
                    <option value="jpg">JPG</option>
                    <option value="png">PNG</option>
                    <option value="gif">GIF</option>
                    <option value="webp">WebP</option>
                    <option value="tiff">TIFF</option>
                    <option value="avif">AVIF</option>
                </select>
                <button class="button convert-btn">Convert</button>
                <a class="button download-btn" style="display: none;">Download</a>
            </div>
        `;
        fileList.appendChild(fileItem);

        const convertBtn = fileItem.querySelector('.convert-btn');
        convertBtn.addEventListener('click', () => convertImage(file, fileItem));
    }

    async function convertImage(file, fileItem) {
        const format = fileItem.querySelector('select').value;
        const formData = new FormData();
        formData.append('image', file);
        formData.append('format', format);

        try {
            const response = await fetch('/convert', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            displayConvertedInfo(result);

            // Update download link
            const downloadLink = fileItem.querySelector('.download-btn');
            downloadLink.href = `data:image/${format};base64,${result.buffer}`;
            downloadLink.download = `converted.${format}`;
            downloadLink.style.display = 'inline-block';

        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during conversion');
        }
    }

    function displayConvertedInfo(result) {
        convertedInfo.innerHTML = `
            <h3>Conversion Result</h3>
            <p>Original: ${result.original.name} (${formatBytes(result.original.size)})</p>
            <p>Converted: ${result.converted.name} (${formatBytes(result.converted.size)})</p>
            <p>Dimensions: ${result.converted.width}x${result.converted.height}</p>
        `;
    }

    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
});