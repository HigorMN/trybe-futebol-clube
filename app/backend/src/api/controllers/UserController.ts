import { Request, Response } from 'express';
import UserService from '../services/UserService';

class UserController {
  private _service: UserService;

  constructor() {
    this._service = new UserService();
  }

  public login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const { type, message, token } = await this._service.login(email, password);

    if (type) return res.status(type).json({ message });

    return res.status(200).json({ token });
  };
}

export default UserController;
