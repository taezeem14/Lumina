import { ToolId, ToolConfig } from './types';
import { Wand2, Eraser, User, Maximize, Palette, Zap, Clock, Image as ImageIcon, ScanFace } from 'lucide-react';

export const TOOLS: ToolConfig[] = [
  {
    id: ToolId.BG_REMOVE,
    label: 'Remove Background',
    icon: 'Eraser',
    description: 'Instantly isolate the subject from the background.',
    promptTemplate: 'Remove the background from this image. The subject should be on a transparent or solid white background. High precision masking.'
  },
  {
    id: ToolId.OBJECT_REMOVE,
    label: 'Magic Eraser',
    icon: 'Wand2',
    description: 'Remove unwanted objects or defects.',
    promptTemplate: 'Remove the [USER_INPUT] from the image. Inpaint the missing area to match the surrounding background seamlessly.',
    requiresInput: true
  },
  {
    id: ToolId.FACE_ENHANCE,
    label: 'Face Enhance',
    icon: 'ScanFace',
    description: 'Retouch skin and improve facial details.',
    promptTemplate: 'Enhance the faces in this image. Smooth skin texture, sharpen eyes, and improve lighting while maintaining a realistic and natural look.'
  },
  {
    id: ToolId.UPSCALE,
    label: 'Upscale 4K',
    icon: 'Maximize',
    description: 'Increase resolution and clarity.',
    promptTemplate: 'Upscale this image to 4K resolution. Enhance details, sharpness, and clarity significantly without introducing artifacts.'
  },
  {
    id: ToolId.CARTOONIFY,
    label: 'Anime Style',
    icon: 'Palette',
    description: 'Convert photo to high-quality anime art.',
    promptTemplate: 'Transform this image into a high-quality anime style illustration. Keep the composition but change the art style to vibrant anime.'
  },
  {
    id: ToolId.COLOR_CORRECT,
    label: 'Auto Color',
    icon: 'Zap',
    description: 'Balance exposure, contrast, and saturation.',
    promptTemplate: 'Color correct this image. Optimize exposure, white balance, contrast, and saturation for a professional photography look.'
  },
  {
    id: ToolId.RESTORE_OLD,
    label: 'Restore Photo',
    icon: 'Clock',
    description: 'Repair scratches and restore faded colors.',
    promptTemplate: 'Restore this old photo. Remove scratches, dust, and tears. Fix faded colors and sharpen details to make it look like a new photograph.'
  },
  {
    id: ToolId.STYLE_TRANSFER,
    label: 'Cyberpunk',
    icon: 'ImageIcon',
    description: 'Apply a futuristic neon aesthetic.',
    promptTemplate: 'Apply a futuristic Cyberpunk 2077 aesthetic to this image. Add neon lights, high contrast, and a sci-fi atmosphere.'
  }
];

export const MAX_HISTORY = 10;
export const PLACEHOLDER_IMG = "https://picsum.photos/800/600";