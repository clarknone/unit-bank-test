import {
  Application,
  ApplicationDocument,
  ApplicationListParams,
  Applications,
  BeneficialOwner,
  CreateApplicationRequest,
  Include,
  IndividualApplication,
  UnitResponse,
} from '@unit-finance/unit-node-sdk';

export class ApplicationMock extends Applications {

  async create(
    request: CreateApplicationRequest,
  ): Promise<
    UnitResponse<Application> &
      Include<ApplicationDocument[] | BeneficialOwner[]>
  > {
    const application: IndividualApplication = {
      type: 'individualApplication',
      attributes: {
        status: 'Approved',
        createdAt: 'yesterdatt',
        message: 'no message',
        ssn: '721074426',
        fullName: { first: 'Peter', last: 'Parker' },
        dateOfBirth: '2001-08-10',
        address: {
          street: '20 Ingram St',
          city: 'Forest Hills',
          state: 'NY',
          postalCode: '11375',
          country: 'US',
        },
        email: 'peter@oscorp.com',
        phone: { countryCode: '1', number: '5555555555' },
        ip: '127.0.0.2',
        occupation: 'ArchitectOrEngineer',
        annualIncome: 'Between50kAnd100k',
        sourceOfIncome: 'EmploymentOrPayrollIncome',
        tags: { userId: '106a75e9-de77-4e25-9561-faffe59d7814' },
        idempotencyKey: '3a1a33be-4e12-4603-9ed0-820922389fb8',
      },
      relationships: undefined,
      id: '',
    };
    return { data: application };
  }
}
