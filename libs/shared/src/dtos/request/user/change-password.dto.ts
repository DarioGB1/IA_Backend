import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ description: 'Current password of the user' })
  oldPassword: string;

  @ApiProperty({ description: 'New password to set' })
  newPassword: string;

  @ApiProperty({ description: 'Confirmation of the new password' })
  confirmNewPassword: string;

  constructor(
    oldPassword: string,
    newPassword: string,
    confirmNewPassword: string,
  ) {
    this.oldPassword = oldPassword;
    this.newPassword = newPassword;
    this.confirmNewPassword = confirmNewPassword;
  }
}
