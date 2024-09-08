const http = require('http');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const ImageService = require('./imageService');

class App {

    /**
     * 앱 인스턴스 생성
     * @constructor
     */
    constructor() {
        this.port = process.env.PORT || 4000;
        this.imageService = new ImageService();
    }

    /**
     * 서버 시작
     * @method
     */
    start() {
        const server = http.createServer((req, res) => {
            if (req.url === '/' || req.url === '/index.html') {
                this.serveFile(res, 'index.html', 'text/html');
            } else if (req.url === '/styles.css') {
                this.serveFile(res, 'styles.css', 'text/css');
            } else if (req.url === '/script.js') {
                this.serveFile(res, 'script.js', 'application/javascript');
            } else if (req.url === '/convert' && req.method.toLowerCase() === 'post') {
                this.handleImageConversion(req, res);
            } else {
                res.writeHead(404);
                res.end('Page not found');
            }
        });

        server.listen(this.port, '0.0.0.0', () => {
            console.log(`Server running at http://0.0.0.0:${this.port}/`);
        });
    }

    /**
     * 파일 서빙
     * @method
     * @param {http.ServerResponse} res
     * @param {string} filename - 서비스할 파일 이름
     * @param {string} contentType - 파일 contentType
     */
    serveFile(res, filename, contentType) {
        fs.readFile(path.join(__dirname, filename), (err, content) => {
            if (err) {
                res.writeHead(500);
                res.end(`Error loading ${filename}`);
            } else {
                res.writeHead(200, {'Content-Type': contentType});
                res.end(content);
            }
        });
    }

    /**
     * 이미지 변환 요청 처리
     * @method
     * @param {http.IncomingMessage} req
     * @param {http.ServerResponse} res
     */
    handleImageConversion(req, res) {
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            if (err) {
                res.writeHead(500, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: 'Error parsing form data'}));
                return;
            }

            const file = files.image[0];
            const format = fields.format[0];

            try {
                const originalMetadata = await this.imageService.getImageMetadata(file.filepath);
                const {buffer, info} = await this.imageService.convertImage(file.filepath, format);

                const response = {
                    original: {
                        name: file.originalFilename,
                        format: path.extname(file.originalFilename).slice(1),
                        size: file.size,
                        width: originalMetadata.width,
                        height: originalMetadata.height
                    },
                    converted: {
                        name: `converted.${format}`,
                        format: info.format,
                        size: info.size,
                        width: info.width,
                        height: info.height
                    }
                };

                res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Content-Disposition': `attachment; filename="converted.${format}"`
                });
                res.end(JSON.stringify({...response, buffer: buffer.toString('base64')}));
            } catch (error) {
                res.writeHead(500, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: 'Error converting image'}));
            }
        });
    }
}

const app = new App();
app.start();