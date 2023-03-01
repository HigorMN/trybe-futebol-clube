import { Request, Response } from 'express';
import UserService from '../services/UserService';

class UserController {
  private _service: UserService;

  constructor() {
    this._service = new UserService();
  }

  public login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const loginUser = await this._service.login(email, password);

    if (loginUser.type) return res.status(loginUser.type).json({ message: loginUser.message });

    return res.status(200).json({ token: loginUser.token });
  };
}

export default UserController;
