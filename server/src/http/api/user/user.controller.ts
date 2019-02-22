import { getConnection } from 'typeorm'
import User from "../../../models/user";

export function fetchAllUsers() {
  return getConnection().manager.find(User);
}