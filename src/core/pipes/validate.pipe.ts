import {
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  ValidationPipe,
  UnprocessableEntityException,
} from '@nestjs/common';

@Injectable()
export class ValidateInputPipe extends ValidationPipe {
  public async transform(value, metadata: ArgumentMetadata) {
    try {
      return await super.transform(value, metadata);
    } catch (e) {
      if (e instanceof BadRequestException) {
        throw new UnprocessableEntityException(
          this.handleError(e.getResponse()),
        );
      }
    }
  }

  private handleError(errors) {
    if (errors && errors.message && errors.message.length > 0) {
      return errors.message; // Eğer hatanın mesajı varsa, doğrudan geri dön
    }
    if (errors && errors.message && errors.message.message) {
      return errors.message.message; // Eğer hatanın içinde başka bir 'message' varsa, onu geri dön
    }
    return errors;
  }
}
