-- CreateTable
CREATE TABLE "Policy" (
    "id" TEXT NOT NULL,
    "policyNumber" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "policyOwner" TEXT NOT NULL,
    "insured" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3),
    "policyType" TEXT,
    "policyName" TEXT,
    "policyCurrency" TEXT,
    "faceAmount" DECIMAL(18,2),
    "premiumMode" TEXT,
    "premiumAmount" DECIMAL(18,2),
    "excessPremium" DECIMAL(18,2),
    "totalPremium" DECIMAL(18,2),
    "premiumDueDate" TIMESTAMP(3),
    "lastPaymentAmount" DECIMAL(18,2),
    "lastPaymentDate" TIMESTAMP(3),
    "vulTotalPaymentsMade" DECIMAL(18,2),
    "policyStatus" TEXT,
    "lapseCeaseDate" TIMESTAMP(3),
    "policyAdvanceBalance" DECIMAL(18,2),
    "prepaidAmount" DECIMAL(18,2),
    "fundCashValue" DECIMAL(18,2),
    "fundCashValueAsOfDate" TIMESTAMP(3),
    "contactNumber" TEXT,
    "email" TEXT,
    "billingAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Policy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Policy_policyNumber_key" ON "Policy"("policyNumber");

-- CreateIndex
CREATE INDEX "Policy_clientId_idx" ON "Policy"("clientId");

-- CreateIndex
CREATE INDEX "Policy_policyStatus_idx" ON "Policy"("policyStatus");

-- CreateIndex
CREATE INDEX "Policy_premiumDueDate_idx" ON "Policy"("premiumDueDate");

-- AddForeignKey
ALTER TABLE "Policy" ADD CONSTRAINT "Policy_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
