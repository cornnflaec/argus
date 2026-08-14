import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreatePolicyDto {
  @IsString()
  @MaxLength(100)
  policyNumber!: string;

  @IsString()
  @MaxLength(150)
  policyOwner!: string;

  @IsString()
  @MaxLength(150)
  insured!: string;

  @IsOptional()
  issueDate?: string;

  @IsOptional()
  @IsString()
  policyType?: string;

  @IsOptional()
  @IsString()
  policyName?: string;

  @IsOptional()
  @IsString()
  policyCurrency?: string;

  @IsOptional()
  faceAmount?: string;

  @IsOptional()
  @IsString()
  premiumMode?: string;

  @IsOptional()
  premiumAmount?: string;

  @IsOptional()
  excessPremium?: string;

  @IsOptional()
  totalPremium?: string;

  @IsOptional()
  premiumDueDate?: string;

  @IsOptional()
  lastPaymentAmount?: string;

  @IsOptional()
  lastPaymentDate?: string;

  @IsOptional()
  vulTotalPaymentsMade?: string;

  @IsOptional()
  @IsString()
  policyStatus?: string;

  @IsOptional()
  lapseCeaseDate?: string;

  @IsOptional()
  policyAdvanceBalance?: string;

  @IsOptional()
  prepaidAmount?: string;

  @IsOptional()
  fundCashValue?: string;

  @IsOptional()
  fundCashValueAsOfDate?: string;

  @IsOptional()
  @IsString()
  contactNumber?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  billingAddress?: string;
}