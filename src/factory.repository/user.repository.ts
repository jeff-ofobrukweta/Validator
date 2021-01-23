export class UserFactory {

  static getDeveloperInfo = (
    message = null,
    status = null,
    data = null,
    rule = null
  ) => {
    let respons = {
      message,
      status,
      data
    }
    return respons;
  }

}