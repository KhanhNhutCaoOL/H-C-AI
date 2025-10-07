// FIX: Import React to resolve 'Cannot find namespace 'React'' error.
import React from 'react';
// FIX: Import types used in constants, including RestorationStyle for the new options.
import { Quality, CameraAngle, FormState, RestorationStyle, VideoFormState, LogoPosition } from './types';
import { PositionBottomLeftIcon } from './components/icons/PositionBottomLeftIcon';
import { PositionBottomRightIcon } from './components/icons/PositionBottomRightIcon';
import { PositionTopLeftIcon } from './components/icons/PositionTopLeftIcon';
import { PositionTopRightIcon } from './components/icons/PositionTopRightIcon';


export const QUALITY_OPTIONS = [
  { id: Quality.Standard, label: 'Tiêu chuẩn', caption: 'Chất lượng tốt' },
  { id: Quality.High, label: '2K - 4K (Cao)', caption: 'Chi tiết sắc nét hơn' },
  { id: Quality.Ultra, label: '8K (Siêu nét)', caption: 'Chân thực như ảnh chụp' },
];

export const ASPECT_RATIO_OPTIONS = [
  { id: '1:1', label: 'Vuông' },
  { id: '3:4', label: 'Dọc' },
  { id: '4:3', label: 'Ngang' },
  { id: '9:16', label: 'Story' },
  { id: '16:9', label: 'Rộng' },
];

export const SCENE_OPTIONS = [
    { id: 'In a luxurious coffee shop', label: 'Quán cafe sang trọng' },
    { id: 'On a street in Paris', label: 'Đường phố Paris' },
    { id: 'In a clothing store', label: 'Cửa hàng quần áo' },
    { id: 'In a supermarket aisle', label: 'Trong siêu thị' },
    { id: 'In a cosmetics store', label: 'Cửa hàng mỹ phẩm' },
    { id: 'At a countryside market', label: 'Khu chợ quê' },
    { id: 'On a beautiful beach', label: 'Bãi biển' },
    { id: 'In a modern kitchen', label: 'Căn phòng bếp' },
    { id: 'Lantern Street at night', label: 'Phố đèn lồng' },
    { id: 'The Moon Lady (Chang e) and the White Rabbit under a full moon', label: 'Chị Hằng & Thỏ trắng' },
    { id: 'A vibrant Lion Dance Festival', label: 'Lễ hội múa lân' },
    { id: 'Under a glowing moon halo', label: 'Hào quang trăng' },
    { id: 'A full moon reflecting over a calm lake', label: 'Trăng rằm bên hồ' },
    { id: 'At a bustling night market', label: 'Chợ đêm' },
    { id: 'In an autumn forest', label: 'Khu rừng mùa thu' },
    { id: 'In a cinematic studio', label: 'Studio điện ảnh' },
    { id: 'In a fashion studio', label: 'Studio thời trang' },
    { id: 'In a dreamy flower field', label: 'Cánh đồng hoa mộng mơ' },
    { id: 'In a European castle', label: 'Lâu đài Châu Âu' },
];

export const CHARACTER_DESC_OPTIONS = [
  { id: 'A young man', label: 'Chàng trai' },
  { id: 'A young woman', label: 'Cô gái' },
  { id: 'A little boy', label: 'Bé trai' },
  { id: 'A little girl', label: 'Bé gái' },
  { id: 'A dog', label: 'Chú chó' },
  { id: 'A cat', label: 'Chú mèo' },
  { id: 'A tiger', label: 'Chú hổ' },
  { id: 'A rabbit', label: 'Con thỏ' },
];

export const ACTION_DESC_OPTIONS = [
    { id: 'posing fashionably', label: 'Đang tạo dáng kiểu thời trang' },
    { id: 'holding a product in one hand', label: 'Đang cầm sản phẩm trên tay' },
    { id: 'sitting', label: 'Đang ngồi' },
    { id: 'standing', label: 'Đang đứng' },
    { id: 'one hand on chin, looking thoughtful', label: 'Một tay chống cằm suy tư' },
    { id: 'looking at the camera', label: 'Mắt hướng về camera' },
    { id: 'looking down thoughtfully', label: 'Cúi mặt suy tư' },
    { id: 'waving with one hand', label: 'Một tay vẫy chào' },
    { id: 'holding a product with two hands', label: 'Hai tay cầm sản phẩm' },
    { id: 'with a joyful expression', label: 'Nét mặt tươi vui' },
];

export const CAMERA_ANGLE_OPTIONS = [
  { id: CameraAngle.WideShot, label: 'Toàn cảnh rộng' },
  { id: CameraAngle.FullBody, label: 'Toàn thân' },
  { id: CameraAngle.EyeLevel, label: 'Ngang tầm mắt' },
  { id: CameraAngle.OverTheShoulder, label: 'Qua vai' },
  { id: CameraAngle.Portrait, label: 'Chân dung' },
  { id: CameraAngle.CloseUp, label: 'Cận cảnh' },
  { id: CameraAngle.LowAngle, label: 'Từ dưới lên' },
  { id: CameraAngle.HighAngle, label: 'Từ trên cao xuống' },
  { id: CameraAngle.DutchAngle, label: 'Góc nghiêng' },
];

export const STYLE_DESC_OPTIONS = [
  { id: 'Cinematic', label: 'Điện ảnh' },
  { id: 'Vintage Film', label: 'Film xưa' },
  { id: 'Anime', label: 'Anime' },
  { id: 'Oil Painting', label: 'Tranh sơn dầu' },
  { id: 'Watercolor', label: 'Màu nước' },
  { id: 'Cyberpunk', label: 'Cyberpunk' },
  { id: 'Fantasy Art', label: 'Ảo mộng' },
  { id: '3D Render', label: '3D Render' },
  { id: 'Minimalist', label: 'Tối giản' },
  { id: 'Comic Book', label: 'Truyện tranh' },
  { id: 'Pencil Sketch', label: 'Phác thảo bút chì' },
  { id: 'Woodcut', label: 'Tranh khắc gỗ' },
  { id: 'Surrealism', label: 'Surrealism (Siêu thực)' },
  { id: 'Photorealistic', label: 'Photorealistic' },
  { id: 'Cartoon/Comic', label: 'Cartoon/Comic' },
  { id: 'Pixel Art', label: 'Pixel Art' },
  { id: 'Concept Art', label: 'Concept Art' },
  { id: 'Game Art', label: 'Game Art' },
  { id: 'NFT Art', label: 'NFT Art' },
];

// FIX: Add RESTORATION_STYLE_OPTIONS to provide options for the photo restoration panel.
export const RESTORATION_STYLE_OPTIONS = [
  { id: RestorationStyle.Colorize, label: 'Tô màu', caption: 'Thêm màu cho ảnh đen trắng' },
  { id: RestorationStyle.Enhance, label: 'Nâng cao chi tiết', caption: 'Làm rõ nét, giảm nhiễu' },
  { id: RestorationStyle.FixDamage, label: 'Sửa chữa hư hỏng', caption: 'Xóa vết xước, nếp gấp' },
];

export const SIGNATURE_FONT_OPTIONS = [
  { id: 'Pacifico', label: 'Pacifico', className: 'font-pacifico' },
  { id: 'Playfair Display', label: 'Playfair', className: 'font-playfair-display' },
  { id: 'Oswald', label: 'Oswald', className: 'font-oswald' },
  { id: 'Dancing Script', label: 'Dancing Script', className: 'font-dancing-script' },
  { id: 'Lobster', label: 'Lobster', className: 'font-lobster' },
  { id: 'Pattaya', label: 'Pattaya', className: 'font-pattaya' },
  { id: 'Srisakdi', label: 'Srisakdi', className: 'font-srisakdi' },
  { id: 'Be Vietnam Pro', label: 'Be Vietnam', className: 'font-be-vietnam-pro' },
];

export const LOGO_POSITION_OPTIONS: { id: LogoPosition; label: string; icon: React.FC<{className?: string}> }[] = [
    { id: 'top-left', label: 'Trên Trái', icon: PositionTopLeftIcon },
    { id: 'top-right', label: 'Trên Phải', icon: PositionTopRightIcon },
    { id: 'bottom-left', label: 'Dưới Trái', icon: PositionBottomLeftIcon },
    { id: 'bottom-right', label: 'Dưới Phải', icon: PositionBottomRightIcon },
];

export const NUMBER_OF_IMAGES_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8];

export const INITIAL_FORM_STATE: FormState = {
  images: [],
  productImage: null,
  removeBackground: false,
  lockFace: false,
  characterDesc: [],
  characterNotes: '',
  sceneDesc: [],
  sceneNotes: '',
  actionDesc: [],
  actionNotes: '',
  cameraAngle: CameraAngle.FullBody,
  styleDesc: [],
  outfitImages: [],
  outfitNotes: '',
  celebrityImage: null,
  quality: Quality.High,
  aspectRatio: '3:4',
  numberOfImages: 3,
  logoImage: null,
  logoPosition: 'bottom-right',
  useSignature: false,
  signatureFont: 'Pacifico',
  signaturePosition: 'bottom-right',
};

export const INITIAL_PROMPT_FORM_STATE = {
  images: [],
  prompt: '',
  numberOfImages: 3,
};

export const INITIAL_VIDEO_FORM_STATE: VideoFormState = {
  image: null,
  prompt: '',
  aspectRatio: '16:9',
};