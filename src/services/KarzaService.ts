/**
 * KarzaService.ts
 * 
 * Provides an interface for interacting with Karza's professional verification
 * endpoints for Bar Council of India (BCI) lawyer authentication.
 * 
 * NOTE: For development, this service utilizes mock functions. Once production
 * API credentials are provisioned, these will be replaced with actual Axios/fetch
 * calls to the server-side proxy route.
 */

export interface LawyerVerificationRequest {
  barCouncilEnrollmentNumber: string;
  stateCode: string;
  yearOfEnrollment: string;
}

export interface LawyerVerificationResponse {
  success: boolean;
  isVerified: boolean;
  name?: string;
  enrollmentNumber?: string;
  state?: string;
  error?: string;
}

/**
 * Verifies a lawyer's credentials using the Karza BCI verification API.
 * Currently returns a mock response for UI development testing.
 */
export const verifyLawyer = async (
  request: LawyerVerificationRequest
): Promise<LawyerVerificationResponse> => {
  console.log('Initiating Karza BCI verification for:', request);

  // Mock delay to simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Mock logic: Treat enrollment numbers starting with 'MOCK' as valid
  if (request.barCouncilEnrollmentNumber.startsWith('MOCK')) {
    return {
      success: true,
      isVerified: true,
      name: 'Advocate John Doe',
      enrollmentNumber: request.barCouncilEnrollmentNumber,
      state: 'Delhi',
    };
  }

  // Otherwise, return failure for testing
  return {
    success: true,
    isVerified: false,
    error: 'Lawyer not found in Bar Council database.',
  };
};
