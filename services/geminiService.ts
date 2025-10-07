import { GoogleGenAI, Modality } from "@google/genai";
import { FormState, PromptFormState, Quality, CameraAngle, VideoFormState, LogoPosition } from '../types';

if (!process.env.API_KEY) {
    // In a real app, you'd want to handle this more gracefully.
    // For this environment, we assume it's set.
    console.warn("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

// Helper to convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};

// Helper to detect if text is likely Vietnamese
const isVietnamese = (text: string) => {
    const vietnameseRegex = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
    return vietnameseRegex.test(text);
};

// Helper to translate text to English using Gemini
const translateToEnglish = async (text: string): Promise<string> => {
    if (!isVietnamese(text)) return text;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Translate the following text to English, keeping the core meaning and tone. Only return the translated text, with no extra formatting or explanations:\n\n"${text}"`
        });
        return response.text.trim();
    } catch (error) {
        console.error("Translation failed, using original text.", error);
        return text; // Fallback to original text on error
    }
};

const getQualityPrompt = (quality: Quality): string => {
    switch (quality) {
        case Quality.Standard:
            return "standard quality";
        case Quality.High:
            return "high quality (2K-4K resolution)";
        case Quality.Ultra:
            return "ultra-high quality, photorealistic (8K resolution)";
        default:
            return "high quality";
    }
};

const getCameraAnglePrompt = (angle: CameraAngle): string => {
    switch (angle) {
        case CameraAngle.WideShot:
            return "The image should be a wide shot, capturing the full character within their environment.";
        case CameraAngle.FullBody:
            return "The image should be a full-body shot of the character.";
        case CameraAngle.EyeLevel:
            return "The image should be an eye-level shot, as if viewed from a neutral, human perspective.";
        case CameraAngle.OverTheShoulder:
            return "The image should be an over-the-shoulder shot, framed from behind another person.";
        case CameraAngle.Portrait:
            return "The image should be a close-up portrait, focusing on the character's face and upper body.";
        case CameraAngle.CloseUp:
            return "The image should be a tight close-up shot, focusing solely on the character's face to emphasize emotion.";
        case CameraAngle.LowAngle:
            return "The image should be taken from a low angle, looking up at the character.";
        case CameraAngle.HighAngle:
            return "The image should be taken from a high angle, looking down at the character.";
        case CameraAngle.DutchAngle:
            return "The image should use a Dutch angle, where the camera is tilted to create a sense of disorientation or tension.";
        default:
            return "";
    }
};

const getSignaturePositionPrompt = (position: LogoPosition): string => {
    switch (position) {
        case 'top-left':
            return 'ở góc trên cùng bên trái';
        case 'top-right':
            return 'ở góc trên cùng bên phải';
        case 'bottom-left':
            return 'ở góc dưới cùng bên trái';
        case 'bottom-right':
            return 'ở góc dưới cùng bên phải';
        default:
            return 'ở một vị trí kín đáo';
    }
};

export const generateCharacterImages = async (
    formState: FormState,
    onImageGenerated: (imageUrl: string) => void,
    onProgressUpdate: (current: number, total: number) => void
): Promise<void> => {

    const imagePartsPromises = formState.images.map(async (file) => {
        const base64Data = await fileToBase64(file);
        return {
            inlineData: {
                data: base64Data,
                mimeType: file.type,
            },
        };
    });
    const imageParts = await Promise.all(imagePartsPromises);
    
    const allImageParts = [...imageParts];

    if (formState.productImage) {
        const base64Data = await fileToBase64(formState.productImage);
        allImageParts.push({
            inlineData: {
                data: base64Data,
                mimeType: formState.productImage.type,
            },
        });
    }

    if (formState.outfitImages.length > 0) {
        const outfitImagePartsPromises = formState.outfitImages.map(async (file) => {
            const base64Data = await fileToBase64(file);
            return {
                inlineData: {
                    data: base64Data,
                    mimeType: file.type,
                },
            };
        });
        const outfitImageParts = await Promise.all(outfitImagePartsPromises);
        allImageParts.push(...outfitImageParts);
    }

    if (formState.celebrityImage) {
        const base64Data = await fileToBase64(formState.celebrityImage);
        allImageParts.push({
            inlineData: {
                data: base64Data,
                mimeType: formState.celebrityImage.type,
            },
        });
    }
    
    const characterDesc = formState.characterDesc.join(' and ');
    const actionDesc = formState.actionDesc.join(', ');
    const styleDesc = formState.styleDesc.join(', ');
    const characterNotes = formState.characterNotes ? await translateToEnglish(formState.characterNotes) : '';
    const sceneDesc = await translateToEnglish(formState.sceneDesc.join(', '));
    const sceneNotes = formState.sceneNotes ? await translateToEnglish(formState.sceneNotes) : '';
    const actionNotes = formState.actionNotes ? await translateToEnglish(formState.actionNotes) : '';
    const outfitNotes = formState.outfitNotes ? await translateToEnglish(formState.outfitNotes) : '';

    let prompt = `${characterDesc}`;
    if (characterNotes) {
        prompt += ` (${characterNotes})`;
    }
    prompt += ` ${actionDesc}. ${sceneDesc}.`;

    if (sceneNotes) {
        prompt += ` ${sceneNotes}.`;
    }

    if (actionNotes) {
        prompt += ` ${actionNotes}.`;
    }

    if (styleDesc) {
        prompt += ` The style of the image should be: ${styleDesc}.`;
    }

    if (formState.cameraAngle) {
        prompt += ` ${getCameraAnglePrompt(formState.cameraAngle)}.`;
    }

    if (formState.productImage) {
        prompt += ` The character must be holding, using, or presented with the product shown in the provided product image.`;
    }
    
    if (formState.outfitImages.length > 0) {
        prompt += ` The character should wear an outfit inspired by the separate outfit image(s) provided.`;
        if (outfitNotes) {
            prompt += ` The outfit is described as: ${outfitNotes}.`;
        }
    }

    if (formState.celebrityImage) {
        prompt += ` The character must be standing next to the famous person shown in the provided separate image. They should be interacting naturally.`;
    }

    prompt += " The generated image should be a photorealistic version of the character in the reference images, maintaining all key features.";

    if (formState.lockFace) {
        prompt += ` Critical instruction: Preserve the following details from the reference images with 100% accuracy. The model's face, including all features, expression, and identity, must be an exact replica. Additionally, any text, logos, or images visible on the product or clothing must be perfectly and accurately reproduced. Do not alter these elements in any way.`;
    }
    
    if (formState.removeBackground) {
        prompt += ` The character should be isolated on a transparent or simple studio background.`
    }

    if (formState.useSignature) {
        const positionText = getSignaturePositionPrompt(formState.signaturePosition);
        prompt += ` Ghi chú: Trong mỗi khung hình, đặt một logo chữ ký nhỏ, thanh lịch ${positionText} của ảnh. Chữ ký theo phông chữ ${formState.signatureFont}, được viết bằng màu trắng với viền đen mỏng, có dòng chữ "Nhânie's SHOP", với đường cong máy ảnh cách điệu phía trên chữ. Giữ cho logo tối giản và sang trọng.`;
    }

    prompt += ` The final image should be highly detailed, photorealistic, with natural daylight, HDR cinematic quality, a shallow depth of field, and a ${formState.aspectRatio} aspect ratio.`;
    
    let imagesGeneratedCount = 0;
    for (let i = 0; i < formState.numberOfImages; i++) {
        onProgressUpdate(i + 1, formState.numberOfImages);
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: {
                    parts: [
                        ...allImageParts,
                        { text: prompt },
                    ],
                },
                config: {
                    responseModalities: [Modality.IMAGE, Modality.TEXT],
                },
            });

            const parts = response?.candidates?.[0]?.content?.parts;
            if (parts) {
                for (const part of parts) {
                    if (part.inlineData) {
                        const base64Bytes = part.inlineData.data;
                        const mimeType = part.inlineData.mimeType;
                        const imageUrl = `data:${mimeType};base64,${base64Bytes}`;
                        onImageGenerated(imageUrl);
                        imagesGeneratedCount++;
                        break; // Take the first image part from each response
                    }
                }
            }
        } catch (error) {
            console.error(`Lỗi khi tạo ảnh ${i + 1}:`, error);
            // Continue to next image even if one fails
        }
    }


    if (imagesGeneratedCount === 0) {
        throw new Error("AI không thể tạo bất kỳ ảnh nào. Vui lòng thử sửa đổi mô tả của bạn.");
    }
};

export const generateImagesFromPrompt = async (
    formState: PromptFormState,
    onImageGenerated: (imageUrl: string) => void,
    onProgressUpdate: (current: number, total: number) => void
): Promise<void> => {

    const imagePartsPromises = formState.images.map(async (file) => {
        const base64Data = await fileToBase64(file);
        return {
            inlineData: {
                data: base64Data,
                mimeType: file.type,
            },
        };
    });
    const imageParts = await Promise.all(imagePartsPromises);

    const translatedPrompt = await translateToEnglish(formState.prompt);

    const prompt = `${translatedPrompt}. The final image should be highly detailed and photorealistic.`;
    
    let imagesGeneratedCount = 0;
    for (let i = 0; i < formState.numberOfImages; i++) {
        onProgressUpdate(i + 1, formState.numberOfImages);
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: {
                    parts: [
                        ...imageParts,
                        { text: prompt },
                    ],
                },
                config: {
                    responseModalities: [Modality.IMAGE, Modality.TEXT],
                },
            });

            const parts = response?.candidates?.[0]?.content?.parts;
            if (parts) {
                for (const part of parts) {
                    if (part.inlineData) {
                        const base64Bytes = part.inlineData.data;
                        const mimeType = part.inlineData.mimeType;
                        const imageUrl = `data:${mimeType};base64,${base64Bytes}`;
                        onImageGenerated(imageUrl);
                        imagesGeneratedCount++;
                        break; // Take the first image part from each response
                    }
                }
            }
        } catch (error) {
            console.error(`Lỗi khi tạo ảnh ${i + 1}:`, error);
             // Continue to next image even if one fails
        }
    }

    if (imagesGeneratedCount === 0) {
        throw new Error("AI không thể tạo bất kỳ ảnh nào. Vui lòng thử sửa đổi prompt của bạn.");
    }
};

export const generateVideoFromPrompt = async (
    formState: VideoFormState,
    onVideoGenerated: (videoUrl: string) => void,
    onProgressUpdate: (message: string) => void
): Promise<void> => {
    if (!formState.image) {
        throw new Error("Vui lòng tải lên một ảnh tham chiếu.");
    }
    if (!formState.prompt.trim()) {
        throw new Error("Vui lòng nhập prompt để tạo video.");
    }

    try {
        onProgressUpdate('Đang chuẩn bị ảnh...');
        const base64Data = await fileToBase64(formState.image);
        const translatedPrompt = await translateToEnglish(formState.prompt);

        const imagePart = {
            imageBytes: base64Data,
            mimeType: formState.image.type,
        };

        onProgressUpdate('Đang bắt đầu tạo video...');
        let operation = await ai.models.generateVideos({
            model: 'veo-2.0-generate-001',
            prompt: translatedPrompt,
            image: imagePart,
            config: {
                numberOfVideos: 1,
            }
        });
        
        onProgressUpdate('Đang xử lý, có thể mất vài phút...');
        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 10000));
            operation = await ai.operations.getVideosOperation({ operation: operation });
            if (operation.error) {
                if (operation.error.message.includes('person/face generation')) {
                    throw new Error("Lỗi an toàn: Hình ảnh của bạn đã bị chặn do chính sách về tạo video có khuôn mặt người. Vui lòng thử với một hình ảnh khác.");
                }
                throw new Error(`Lỗi tạo video: ${operation.error.message}`);
            }
        }

        onProgressUpdate('Đang hoàn tất video...');
        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

        if (!downloadLink) {
            throw new Error('Không thể lấy được link tải video. Vui lòng thử lại.');
        }
        
        onProgressUpdate('Đang tải video xuống...');
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);

        if (!response.ok) {
            throw new Error(`Không thể tải video từ link. Status: ${response.status}`);
        }

        const blob = await response.blob();
        const videoUrl = URL.createObjectURL(blob);
        onVideoGenerated(videoUrl);
    } catch (error) {
        if (error instanceof Error) {
            // Lỗi an toàn khi prompt chứa từ ngữ nhạy cảm
            if (error.message.includes('sensitive words')) {
                 throw new Error("Lỗi an toàn: Mô tả của bạn chứa từ ngữ bị chặn bởi chính sách AI của Google. Vui lòng diễn đạt lại mô tả của bạn một cách khác.");
            }
            // Ném lại các lỗi khác (bao gồm cả lỗi an toàn về hình ảnh từ vòng lặp while)
            throw error;
        }
        // Fallback cho các đối tượng không phải là Error
        throw new Error("Đã xảy ra lỗi không xác định trong quá trình tạo video.");
    }
};