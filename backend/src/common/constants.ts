import { SetMetadata } from '@nestjs/common';

const IS_PUBLIC_KEY = 'isPublic';
const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

const MAX_AVATAR_SIZE_IN_BYTES = 2 * 1024 * 1024;
const VALID_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

export {
    IS_PUBLIC_KEY,
    Public,
    MAX_AVATAR_SIZE_IN_BYTES,
    VALID_IMAGE_MIME_TYPES,
};
