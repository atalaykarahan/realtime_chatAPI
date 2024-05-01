export class UserDto {
    readonly user_id: string;
    readonly user_name: string;
    readonly user_password: string;
    readonly user_email: string;
    readonly user_authority_id: string;
    readonly user_email_verified: boolean;
    readonly user_google_id: string;
    readonly user_visibility: boolean;
    readonly user_library_visibility: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}