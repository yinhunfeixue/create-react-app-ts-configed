/**
 * Model
 */
class Model {
  private static _token: string | null = '';

  public static get token() {
    return Model._token;
  }

  public static set token(value: string | null) {
    Model._token = value;
    if (value) {
      localStorage.setItem('token', value);
    } else {
      localStorage.removeItem('token');
    }
  }

  public static init() {
    Model.token = localStorage.getItem('token');
  }
}
export default Model;
