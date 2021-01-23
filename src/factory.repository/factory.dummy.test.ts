import { UserFactory } from './user.repository';
import { dummy } from './data.factory';

describe("UserFactory methods validation", () => {
  test("Correct Validation of  UserFactory.getDeveloperInfo method", () => {
    const testAgainst = {
      message: "My Rule-Validation API",
      status: "success",
      data: {
        name: "Ofobrukweta Oghenerukevwe",
        github: "@jeff-ofobrukweta",
        email: "oghenerukevwejeff@gmail.com",
        mobile: "09096958396",
        twitter: "@jeff-ofobrukweta"
      }
    }

    const { message, status, data } = dummy;
    const validResponse = UserFactory.getDeveloperInfo(message, status, data)
    expect(testAgainst).toEqual(validResponse);
  });
})