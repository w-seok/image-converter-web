const sharp = require('sharp');

class ImageService {

    /**
     * 이미지를 지정된 형식으로 변환
     * @method
     * @param {string} filepath - 이미지 파일의 경로
     * @param {string} format - 변환할 대상 형식
     * @returns {Promise<{buffer: Buffer, info: sharp.OutputInfo}>} 변환된 이미지 버퍼와 메타데이터
     */
    async convertImage(filepath, format) {
        const image = sharp(filepath);
        const metadata = await image.metadata();
        const buffer = await image
            .flatten({background: {r: 255, g: 255, b: 255}})
            .toFormat(format)
            .toBuffer({resolveWithObject: true});

        return {
            buffer: buffer.data,
            info: {
                format: buffer.info.format,
                width: buffer.info.width,
                height: buffer.info.height,
                size: buffer.info.size
            }
        };
    }

    /**
     * 이미지 메타데이터 추출
     * @method
     * @param {string} filepath - 이미지 파일의 경로
     * @returns {Promise<sharp.Metadata>} 이미지 메타데이터
     */
    getImageMetadata(filepath) {
        return sharp(filepath).metadata();
    }
}

module.exports = ImageService;