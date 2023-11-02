import {
    ArgumentMetadata,
    BadRequestException,
    PipeTransform,
} from '@nestjs/common';

export class ParamExistValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): any {
        if (!value) {
            throw new BadRequestException(
                `${metadata.data} parameter is mandatory`,
            );
        }
        return value;
    }
}
