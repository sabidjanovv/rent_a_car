import { IsPhoneNumber } from "class-validator";

export class VerifyOtpDto{
    verification_key: string;
    otp: string;
    // @IsPhoneNumber("UZ")
    // phone_number: string;
    email:string
}