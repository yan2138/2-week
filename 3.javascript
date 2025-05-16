document.getElementById('image-upload').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = function(event) {
                document.getElementById('original-img').src = event.target.result;
                document.getElementById('result-img').src = event.target.result;
            };
            reader.readAsDataURL(file);
        });

    
        document.querySelectorAll('.filter-option').forEach(option => {
            option.addEventListener('click', function() {
                const filterType = this.getAttribute('data-filter');
                const originalImg = document.getElementById('original-img');
                
                if (!originalImg.src || originalImg.src === '#') {
                    alert('Please upload the picture first.');
                    return;
                }
                
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const img = new Image();
                
                img.onload = function() {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const data = imageData.data;
                    
                    
                    for (let i = 0; i < data.length; i += 4) {
                        const r = data[i], g = data[i+1], b = data[i+2];
                        
                        switch(filterType) {
                            case 'grayscale':
                                const avg = (r + g + b) / 3;
                                data[i] = data[i+1] = data[i+2] = avg;
                                break;
                            case 'sepia':
                                data[i] = Math.min(255, r*0.393 + g*0.769 + b*0.189);
                                data[i+1] = Math.min(255, r*0.349 + g*0.686 + b*0.168);
                                data[i+2] = Math.min(255, r*0.272 + g*0.534 + b*0.131);
                                break;
                            case 'invert':
                                data[i] = 255 - r;
                                data[i+1] = 255 - g;
                                data[i+2] = 255 - b;
                                break;
                            case 'redboost':
                                data[i] = Math.min(255, r*1.5);
                                data[i+1] = g*0.7;
                                data[i+2] = b*0.7;
                                break;
                        }
                    }
                    
                    ctx.putImageData(imageData, 0, 0);
                    document.getElementById('result-img').src = canvas.toDataURL();
                    document.getElementById('download-btn').href = canvas.toDataURL();
                };
                
                img.src = originalImg.src;
            });
        });